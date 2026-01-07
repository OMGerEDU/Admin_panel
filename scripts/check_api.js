// Polling script to check API status
import fs from 'node:fs';
import path from 'node:path';

let test_key = process.env.test_key;

// Manual .env parsing for local compatibility
try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^test_key=(.*)$/m);
        if (match) test_key = match[1].trim();
    }
} catch (e) { }

const API_KEY = test_key || process.env.VITE_API_KEY;
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
