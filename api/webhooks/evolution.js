/**
 * Evolution API Webhook Handler
 * 
 * This endpoint receives webhook events from Evolution API.
 * Address: https://ferns.builders-tech.com/api/webhooks/evolution
 * 
 * Events:
 * - messages.upsert: New message received
 * - connection.update: Connection status change
 * - qrcode.updated: QR code update
 * - messages.update: Message status update
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        // Log the event type
        console.log('🔔 [EVOLUTION WEBHOOK] Event received:', body.event);
        console.log('📦 [EVOLUTION WEBHOOK] Instance:', body.instance);

        // Identify the event and handle accordingly
        switch (body.event) {
            case 'messages.upsert':
                // Handle new message
                console.log('📩 [EVOLUTION] New Message:', JSON.stringify(body.data, null, 2));
                // TODO: Process incoming message, save to DB, trigger automations
                break;

            case 'connection.update':
                // Handle connection status change (open, close, connecting)
                console.log('🔌 [EVOLUTION] Connection Status:', body.data?.state || body.data?.status);
                // TODO: Update instance status in database
                break;

            case 'qrcode.updated':
                // Handle QR code updates
                console.log('📱 [EVOLUTION] QR Code Updated');
                // TODO: Send QR to frontend via websocket/realtime
                break;

            case 'messages.update':
                // Handle message status updates (sent, delivered, read)
                console.log('✅ [EVOLUTION] Message Status Update:', body.data);
                // TODO: Update message status in database
                break;

            case 'send.message':
                // Handle sent message confirmation
                console.log('📤 [EVOLUTION] Message Sent:', body.data);
                break;

            case 'contacts.update':
                // Handle contact updates
                console.log('👤 [EVOLUTION] Contact Update:', body.data);
                break;

            case 'groups.update':
                // Handle group updates
                console.log('👥 [EVOLUTION] Group Update:', body.data);
                break;

            default:
                console.log('❓ [EVOLUTION] Unhandled event:', body.event, body.data);
        }

        // Always return 200 OK to Evolution, otherwise it retries
        return res.status(200).json({
            received: true,
            event: body.event,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ [EVOLUTION WEBHOOK] Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
