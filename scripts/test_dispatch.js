/**
 * Test the dispatch API manually
 * Run with: node scripts/test_dispatch.js
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const vercelDomain = process.env.VERCEL_DOMAIN || process.env.YOUR_DOMAIN?.replace('https://', '').replace('http://', '') || '';
const cronSecret = process.env.CRON_SECRET || '';

if (!vercelDomain || !cronSecret) {
  console.error('❌ Missing VERCEL_DOMAIN or CRON_SECRET!');
  process.exit(1);
}

const dispatchUrl = `https://${vercelDomain}/api/dispatch`;

async function testDispatch() {
  console.log('🧪 Testing Dispatch API\n');
  console.log('URL:', dispatchUrl);
  console.log('Secret:', cronSecret.substring(0, 10) + '...\n');

  try {
    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ API call successful!');
      if (data.claimed_count > 0) {
        console.log(`   Claimed ${data.claimed_count} messages`);
        console.log(`   Sent: ${data.sent_count}`);
        console.log(`   Failed: ${data.failed_count}`);
        console.log(`   Retry: ${data.retry_count}`);
      } else {
        console.log('   No messages claimed (might be already processed or not due)');
      }
    } else {
      console.log('\n❌ API call failed!');
      console.log('   Error:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testDispatch();

