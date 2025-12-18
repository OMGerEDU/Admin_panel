import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const CRON_SECRET = process.env.CRON_SECRET as string
const GREENAPI_BASE_URL = process.env.GREENAPI_INSTANCE_URL as string
const GREENAPI_TOKEN = process.env.GREENAPI_TOKEN as string

const BATCH_SIZE = 50
const MAX_ATTEMPTS = 5

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase service configuration')
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// Minimal GreenAPI send wrapper (adjust endpoint/payload to your actual GreenAPI setup)
async function sendViaGreenApi(toPhone: string, message: string) {
  const base = (GREENAPI_BASE_URL || '').replace(/\/+$/, '')
  const url = `${base}/sendMessage`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${GREENAPI_TOKEN}`,
    },
    body: JSON.stringify({
      to: toPhone,
      message,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GreenAPI error: ${res.status} ${res.statusText} ${text}`.trim())
  }

  const data = (await res.json().catch(() => ({}))) as { idMessage?: string }
  return {
    providerMessageId: data.idMessage ?? null,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const authHeader = (req.headers.authorization ||
      (req.headers.Authorization as string | undefined)) as string | undefined

    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' })
    }

    const expected = `Bearer ${CRON_SECRET}`
    if (authHeader !== expected) {
      return res.status(403).json({ error: 'Invalid Authorization token' })
    }

    // Atomically claim due messages
    const { data: claimed, error: claimError } = await supabase.rpc(
      'claim_due_scheduled_messages',
      { max_batch: BATCH_SIZE },
    )

    if (claimError) {
      console.error('Error claiming scheduled messages:', claimError)
      return res.status(500).json({ error: 'Failed to claim messages' })
    }

    const messages: any[] = claimed || []

    if (messages.length === 0) {
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

    const results: Array<{ id: string; status: string; error?: string }> = []

    for (const msg of messages) {
      const id: string = msg.id
      const toPhone: string = msg.to_phone
      const text: string = msg.message

      try {
        const { providerMessageId } = await sendViaGreenApi(toPhone, text)

        const { error: updateError } = await supabase
          .from('scheduled_messages')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            provider_message_id: providerMessageId,
            last_error: null,
          })
          .eq('id', id)

        if (updateError) {
          throw updateError
        }

        sentCount += 1
        results.push({ id, status: 'sent' })
      } catch (err: any) {
        const errorMessage = err?.message || String(err)
        console.error(`Error sending scheduled message ${id}:`, errorMessage)

        const attempts: number = typeof msg.attempts === 'number' ? msg.attempts : 0
        const nextAttempts = attempts + 1
        const nextStatus = nextAttempts < MAX_ATTEMPTS ? 'pending' : 'failed'

        const { error: updateError } = await supabase
          .from('scheduled_messages')
          .update({
            attempts: nextAttempts,
            last_error: errorMessage,
            status: nextStatus,
          })
          .eq('id', id)

        if (updateError) {
          console.error('Error updating failed scheduled message row:', updateError)
        }

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

    return res.status(200).json({
      claimed_count: messages.length,
      sent_count: sentCount,
      failed_count: failedCount,
      retry_count: retryCount,
      results,
    })
  } catch (err: any) {
    console.error('Unexpected error in /api/dispatch:', err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}


