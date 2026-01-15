
export default function handler(req, res) {
    res.status(200).json({
        status: 'ok',
        version: 'v1',
        endpoints: [
            '/whoami',
            '/numbers',
            '/chats',
            '/chats/:id/messages',
            '/messages/send',
            '/scheduled'
        ],
        timestamp: new Date().toISOString()
    });
}
