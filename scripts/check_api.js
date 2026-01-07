// Polling script to check API status
const API_KEY = 'sk_live_f572b55b35af5374f97f2f83e89b2bcca3e789eca9c201629a1fd0cf515d7d77';
const ENDPOINTS = [
    'https://api.ferns.com/api/v1',
    'https://api.ferns.com/api/v1/numbers',
    'https://ferns.com/api/v1',
    'https://api.ferns.com/api/test'
];

async function check() {
    console.log(`\n--- API Check at ${new Date().toLocaleTimeString()} ---`);

    for (const url of ENDPOINTS) {
        try {
            const startTime = Date.now();
            const res = await fetch(url, {
                headers: { 'x-api-key': API_KEY }
            });
            const duration = Date.now() - startTime;
            console.log(`[${res.status}] ${url} (${duration}ms)`);
            const contentType = res.headers.get('content-type') || '';

            if (res.ok) {
                const data = await res.json();
                console.log('   ✅ Success:', JSON.stringify(data).substring(0, 100));
            } else {
                const text = await res.text();
                const isHtml = contentType.includes('html');
                console.log(`   ❌ Error (${res.status}):`, isHtml ? '[HTML Content - Likely Routing Issue]' : text.substring(0, 100));
            }
        } catch (err) {
            console.log(`[ERR] ${url}: ${err.message}`);
            if (err.message.includes('CERT') || err.message.includes('ssl') || err.message.includes('certificate')) {
                console.log('   💡 Advice: Your SSL certificate for api.ferns.com is mismatching. Check Vercel Domains.');
            }
        }
    }
}

console.log('Starting API Polling Loop (every 30 seconds)...');
check();
setInterval(check, 30000);
