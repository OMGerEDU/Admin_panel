
export default function handler(req, res) {
    res.status(200).json({
        message: 'API is working!',
        time: new Date().toISOString(),
        env_check: {
            has_url: !!process.env.SUPABASE_URL,
            has_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            has_secret: !!process.env.CRON_SECRET
        }
    });
}
