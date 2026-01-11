import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CRON_SECRET = process.env.CRON_SECRET

const BATCH_SIZE = 50
const MAX_ATTEMPTS = 5
const GREEN_API_BASE = 'https://api.green-api.com'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // We don't throw here to avoid crashing the function completely on load, 
    // but we will fail in the handler.
    console.error('Missing Supabase service configuration')
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: { persistSession: false },
})

// Normalize phone number to GreenAPI chatId format (e.g., "972501234567@c.us")
function normalizePhoneToChatId(phone) {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '')

    // Remove + if present
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1)
    }

    // If starts with 0, replace with 972 (Israeli number)
    if (cleaned.startsWith('0')) {
        cleaned = '972' + cleaned.substring(1)
    }

    // If doesn't start with 972, prepend it (assume Israeli number)
    if (!cleaned.startsWith('972')) {
        cleaned = '972' + cleaned
    }

    // Return in chatId format
    return `${cleaned}@c.us`
}

// GreenAPI send text message
async function sendTextMessage(instanceId, apiToken, toPhone, message) {
    if (!instanceId || !apiToken) {
        throw new Error('Missing GreenAPI credentials (instance_id or api_token)')
    }

    const chatId = normalizePhoneToChatId(toPhone)
    const url = `${GREEN_API_BASE}/waInstance${instanceId}/sendMessage/${apiToken}`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
    })

    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`GreenAPI error: ${res.status} ${res.statusText} ${text}`.trim())
    }

    const data = await res.json().catch(() => ({}))
    return { providerMessageId: data.idMessage ?? null }
}

// GreenAPI send media via URL
async function sendMediaMessage(instanceId, apiToken, toPhone, mediaUrl, mediaFilename, caption) {
    if (!instanceId || !apiToken) {
        throw new Error('Missing GreenAPI credentials (instance_id or api_token)')
    }

    const chatId = normalizePhoneToChatId(toPhone)
    const url = `${GREEN_API_BASE}/waInstance${instanceId}/sendFileByUrl/${apiToken}`

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatId,
            urlFile: mediaUrl,
            fileName: mediaFilename || 'file',
            caption: caption || '',
        }),
    })

    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`GreenAPI media error: ${res.status} ${res.statusText} ${text}`.trim())
    }

    const data = await res.json().catch(() => ({}))
    return { providerMessageId: data.idMessage ?? null }
}

// Combined send function - handles both text and media
async function sendViaGreenApi(instanceId, apiToken, toPhone, message, mediaUrl, mediaFilename) {
    if (mediaUrl) {
        return sendMediaMessage(instanceId, apiToken, toPhone, mediaUrl, mediaFilename || 'file', message)
    }
    return sendTextMessage(instanceId, apiToken, toPhone, message)
}

// Get contact name from Green API
async function getContactName(instanceId, apiToken, chatId) {
    if (!instanceId || !apiToken || !chatId) {
        return null
    }

    try {
        const url = `${GREEN_API_BASE}/waInstance${instanceId}/getContactInfo/${apiToken}`
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId }),
        })

        if (!res.ok) {
            console.log(`[DISPATCH] getContactInfo failed for ${chatId}: ${res.status}`)
            return null
        }

        const data = await res.json().catch(() => ({}))
        // Green API returns: { name, contactName, pushname, etc. }
        // Try various fields that might contain the name
        return data.name || data.contactName || data.pushname || data.chatName || null
    } catch (error) {
        console.error(`[DISPATCH] Error fetching contact name for ${chatId}:`, error.message)
        return null
    }
}

// Process message template - replace {name} and other placeholders
function processMessageTemplate(template, recipientPhone, contactName) {
    if (!template) return template

    // Replace {name} with contact name or fallback to phone
    let processed = template.replace(/\{name\}/gi, contactName || recipientPhone || '')

    // Replace {phone} with phone number
    processed = processed.replace(/\{phone\}/gi, recipientPhone || '')

    return processed
}

export default async function handler(req, res) {
    const startTime = Date.now()
    console.log(`[DISPATCH] ${new Date().toISOString()} - Request received:`, {
        method: req.method,
        hasAuth: !!req.headers.authorization,
        userAgent: req.headers['user-agent'],
    })

    // Early check for configuration
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('[DISPATCH] Configuration Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
        return res.status(500).json({ error: 'Server misconfiguration: Missing DB keys' })
    }

    try {
        if (req.method !== 'POST') {
            console.log(`[DISPATCH] Method not allowed: ${req.method}`)
            res.setHeader('Allow', 'POST')
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const authHeader = req.headers.authorization || req.headers.Authorization

        if (!authHeader) {
            console.log('[DISPATCH] Missing Authorization header')
            return res.status(401).json({ error: 'Missing Authorization header' })
        }

        const expected = `Bearer ${CRON_SECRET}`
        if (authHeader !== expected) {
            console.log('[DISPATCH] Invalid Authorization token', {
                received: (typeof authHeader === 'string' ? authHeader.substring(0, 20) : 'not-string') + '...',
                expectedPrefix: expected.substring(0, 20) + '...',
            })
            return res.status(403).json({ error: 'Invalid Authorization token' })
        }

        console.log('[DISPATCH] Authentication successful, claiming messages...')

        // Atomically claim due messages
        const { data: claimed, error: claimError } = await supabase.rpc(
            'claim_due_scheduled_messages',
            { max_batch: BATCH_SIZE },
        )

        if (claimError) {
            console.error('Error claiming scheduled messages:', claimError)
            return res.status(500).json({ error: 'Failed to claim messages' })
        }

        const messages = claimed || []

        console.log(`[DISPATCH] Claimed ${messages.length} messages`)

        if (messages.length === 0) {
            const duration = Date.now() - startTime
            console.log(`[DISPATCH] No messages to process (${duration}ms)`)
            return res.status(200).json({
                claimed_count: 0,
                sent_count: 0,
                failed_count: 0,
                retry_count: 0,
                results: [],
            })
        }

        let sentCount = 0
        let failedCount = 0
        let retryCount = 0

        const results = []

        for (const msg of messages) {
            const id = msg.id
            const numberId = msg.number_id
            const text = msg.message
            const mediaUrl = msg.media_url || null
            const mediaFilename = msg.media_filename || null

            // Fetch the number's credentials
            const { data: numberData, error: numberError } = await supabase
                .from('numbers')
                .select('instance_id, api_token')
                .eq('id', numberId)
                .single()

            if (numberError || !numberData) {
                const errorMessage = numberError?.message || 'Number not found'
                console.error(`Error fetching number ${numberId} for message ${id}:`, errorMessage)

                // Mark as failed
                await supabase
                    .from('scheduled_messages')
                    .update({
                        status: 'failed',
                        last_error: `Failed to fetch number credentials: ${errorMessage}`,
                        attempts: (msg.attempts || 0) + 1,
                    })
                    .eq('id', id)

                failedCount += 1
                results.push({
                    id,
                    status: 'failed',
                    error: errorMessage,
                })
                continue
            }

            if (!numberData.instance_id || !numberData.api_token) {
                const errorMessage = 'Number missing instance_id or api_token'
                console.error(`Number ${numberId} missing credentials for message ${id}`)

                await supabase
                    .from('scheduled_messages')
                    .update({
                        status: 'failed',
                        last_error: errorMessage,
                        attempts: (msg.attempts || 0) + 1,
                    })
                    .eq('id', id)

                failedCount += 1
                results.push({
                    id,
                    status: 'failed',
                    error: errorMessage,
                })
                continue
            }

            // Fetch all recipients for this message
            const { data: recipientsData } = await supabase
                .from('scheduled_message_recipients')
                .select('id, phone_number')
                .eq('scheduled_message_id', id)
                .eq('status', 'pending')

            // Fallback to old to_phone if no recipients table entries
            const recipients = recipientsData && recipientsData.length > 0
                ? recipientsData
                : (msg.to_phone ? [{ id: null, phone_number: msg.to_phone }] : [])

            if (recipients.length === 0) {
                console.error(`No recipients found for message ${id}`)
                await supabase
                    .from('scheduled_messages')
                    .update({
                        status: 'failed',
                        last_error: 'No recipients found',
                        attempts: (msg.attempts || 0) + 1,
                    })
                    .eq('id', id)
                failedCount += 1
                results.push({
                    id,
                    status: 'failed',
                    error: 'No recipients found',
                })
                continue
            }

            let recipientSuccessCount = 0
            let recipientFailCount = 0
            const now = new Date().toISOString()

            // Check if message contains placeholders that need processing
            const hasNamePlaceholder = text && text.includes('{name}')

            // Send to all recipients
            for (const recipient of recipients) {
                try {
                    // Process message template if it contains placeholders
                    let processedMessage = text
                    if (hasNamePlaceholder) {
                        // Convert phone to chatId format for API call
                        const chatId = normalizePhoneToChatId(recipient.phone_number)

                        // Fetch contact name from Green API
                        const contactName = await getContactName(
                            numberData.instance_id,
                            numberData.api_token,
                            chatId
                        )

                        console.log(`[DISPATCH] Contact name for ${recipient.phone_number}: ${contactName || '(not found)'}`)

                        // Replace placeholders in message
                        processedMessage = processMessageTemplate(text, recipient.phone_number, contactName)
                    }

                    const { providerMessageId } = await sendViaGreenApi(
                        numberData.instance_id,
                        numberData.api_token,
                        recipient.phone_number,
                        processedMessage,
                        mediaUrl,
                        mediaFilename,
                    )

                    // Update recipient status if exists in table
                    if (recipient.id) {
                        await supabase
                            .from('scheduled_message_recipients')
                            .update({
                                status: 'sent',
                                sent_at: now,
                                provider_message_id: providerMessageId,
                            })
                            .eq('id', recipient.id)
                    }

                    recipientSuccessCount++
                } catch (err) {
                    const errorMessage = err?.message || String(err)
                    console.error(`Error sending to ${recipient.phone_number} for message ${id}:`, errorMessage)
                    recipientFailCount++

                    // Update recipient status if exists in table
                    if (recipient.id) {
                        await supabase
                            .from('scheduled_message_recipients')
                            .update({
                                status: 'failed',
                                error_message: errorMessage,
                            })
                            .eq('id', recipient.id)
                    }
                }
            }

            // Update message status based on recipient results
            const allSent = recipientFailCount === 0
            const someSent = recipientSuccessCount > 0

            try {
                const updateData = {
                    sent_at: allSent ? now : null,
                    last_error: recipientFailCount > 0 ? `${recipientFailCount} recipients failed` : null,
                }

                if (allSent) {
                    updateData.status = 'sent'
                    updateData.provider_message_id = recipients[0]?.id ? null : 'multiple' // For backward compatibility
                } else if (someSent) {
                    updateData.status = 'processing' // Some sent, some failed - keep processing
                } else {
                    // All failed
                    const attempts = typeof msg.attempts === 'number' ? msg.attempts : 0
                    const nextAttempts = attempts + 1
                    updateData.status = nextAttempts < MAX_ATTEMPTS ? 'pending' : 'failed'
                    updateData.attempts = nextAttempts
                }

                const { error: updateError } = await supabase
                    .from('scheduled_messages')
                    .update(updateData)
                    .eq('id', id)

                if (updateError) {
                    throw updateError
                }

                // If recurring and all sent, reschedule for next occurrence
                if (msg.is_recurring && allSent) {
                    await supabase.rpc('reschedule_recurring_message', { p_message_id: id })
                }

                if (allSent) {
                    sentCount += 1
                    results.push({ id, status: 'sent' })
                } else if (someSent) {
                    retryCount += 1
                    results.push({ id, status: 'processing' })
                } else {
                    const attempts = typeof msg.attempts === 'number' ? msg.attempts : 0
                    const nextStatus = attempts + 1 < MAX_ATTEMPTS ? 'pending' : 'failed'
                    if (nextStatus === 'pending') {
                        retryCount += 1
                    } else {
                        failedCount += 1
                    }
                    results.push({
                        id,
                        status: nextStatus,
                        error: `All ${recipients.length} recipients failed`,
                    })
                }
            } catch (err) {
                const errorMessage = err?.message || String(err)
                console.error(`Error updating scheduled message ${id}:`, errorMessage)

                const attempts = typeof msg.attempts === 'number' ? msg.attempts : 0
                const nextAttempts = attempts + 1
                const nextStatus = nextAttempts < MAX_ATTEMPTS ? 'pending' : 'failed'

                await supabase
                    .from('scheduled_messages')
                    .update({
                        attempts: nextAttempts,
                        last_error: errorMessage,
                        status: nextStatus,
                    })
                    .eq('id', id)

                if (nextStatus === 'pending') {
                    retryCount += 1
                } else {
                    failedCount += 1
                }

                results.push({
                    id,
                    status: nextStatus,
                    error: errorMessage,
                })
            }
        }

        const duration = Date.now() - startTime
        const summary = {
            claimed_count: messages.length,
            sent_count: sentCount,
            failed_count: failedCount,
            retry_count: retryCount,
            duration_ms: duration,
            results,
        }

        console.log(`[DISPATCH] Completed in ${duration}ms:`, {
            claimed: messages.length,
            sent: sentCount,
            failed: failedCount,
            retry: retryCount,
        })

        return res.status(200).json(summary)
    } catch (err) {
        const duration = Date.now() - startTime
        console.error(`[DISPATCH] Unexpected error after ${duration}ms:`, err)
        return res.status(500).json({
            error: err?.message || 'Internal server error',
            duration_ms: duration,
        })
    }
}
