/**
 * Script to setup Supabase Cron Job for scheduled messages
 * Run with: node scripts/setup_cron.js
 * 
 * This script will:
 * 1. Check if the cron job exists
 * 2. Create it if it doesn't exist
 * 3. Verify it's working
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const vercelDomain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || '';
const cronSecret = process.env.CRON_SECRET || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!vercelDomain && !process.env.VERCEL_DOMAIN) {
  console.error('❌ Missing Vercel domain!');
  console.error('Please set VERCEL_DOMAIN environment variable or provide it as argument');
  console.error('Usage: node scripts/setup_cron.js <your-vercel-domain>');
  process.exit(1);
}

if (!cronSecret) {
  console.error('❌ Missing CRON_SECRET!');
  console.error('Please set CRON_SECRET environment variable');
  process.exit(1);
}

const domain = process.env.VERCEL_DOMAIN || process.argv[2] || vercelDomain;
const dispatchUrl = `https://${domain}/api/dispatch`;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function checkCronJob() {
  console.log('🔍 Checking for existing cron job...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT jobid, schedule, command FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';"
    });

    // Alternative: direct query
    const { data: jobs, error: jobsError } = await supabase
      .from('cron.job')
      .select('*')
      .eq('jobname', 'dispatch_scheduled_messages');

    if (jobsError && !jobsError.message.includes('relation "cron.job" does not exist')) {
      // Try using SQL directly
      const { data: sqlResult, error: sqlError } = await supabase
        .rpc('exec_sql', {
          query: "SELECT * FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';"
        });

      if (sqlError) {
        console.log('⚠️  Could not check cron jobs directly. Will try to create anyway.\n');
        return null;
      }
    }

    if (jobs && jobs.length > 0) {
      console.log('✅ Cron job already exists!');
      console.log('   Job ID:', jobs[0].jobid);
      console.log('   Schedule:', jobs[0].schedule);
      return jobs[0];
    }

    console.log('❌ Cron job not found. Need to create it.\n');
    return null;
  } catch (error) {
    console.log('⚠️  Could not check cron jobs:', error.message);
    console.log('   Will try to create anyway.\n');
    return null;
  }
}

async function createCronJob() {
  console.log('📝 Creating cron job...\n');
  console.log('   URL:', dispatchUrl);
  console.log('   Schedule: * * * * * (every minute)\n');

  const sql = `
    SELECT cron.schedule(
      'dispatch_scheduled_messages',
      '* * * * *',
      $$
        SELECT net.http_post(
          url := '${dispatchUrl}',
          headers := jsonb_build_object(
            'authorization', 'Bearer ${cronSecret}',
            'content-type', 'application/json'
          ),
          body := '{}'::jsonb
        );
      $$
    );
  `;

  try {
    // Try to execute via SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      // If exec_sql doesn't work, provide manual instructions
      console.log('⚠️  Could not create cron job automatically.');
      console.log('   You need to run this SQL manually in Supabase SQL Editor:\n');
      console.log('─'.repeat(80));
      console.log(sql);
      console.log('─'.repeat(80));
      return false;
    }

    console.log('✅ Cron job created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating cron job:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('─'.repeat(80));
    console.log(sql);
    console.log('─'.repeat(80));
    return false;
  }
}

async function checkCronHistory() {
  console.log('\n📊 Checking cron job execution history...\n');

  try {
    const { data, error } = await supabase
      .from('cron.job_run_details')
      .select('*')
      .eq('jobid', (await checkCronJob())?.jobid || 0)
      .order('start_time', { ascending: false })
      .limit(10);

    if (error) {
      console.log('⚠️  Could not fetch execution history:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('Recent executions:');
      data.forEach((run, i) => {
        const status = run.status === 'succeeded' ? '✅' : '❌';
        console.log(`   ${i + 1}. ${status} ${new Date(run.start_time).toLocaleString()}`);
        if (run.status === 'failed') {
          console.log(`      Error: ${run.return_message || 'Unknown'}`);
        }
      });
    } else {
      console.log('   No execution history yet. Wait a minute and check again.');
    }
  } catch (error) {
    console.log('⚠️  Could not check execution history:', error.message);
  }
}

async function testDispatchEndpoint() {
  console.log('\n🧪 Testing dispatch endpoint...\n');

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

    if (response.ok) {
      console.log('✅ Dispatch endpoint is working!');
      console.log('   Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('❌ Dispatch endpoint returned error:');
      console.error('   Status:', response.status);
      console.error('   Response:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to test dispatch endpoint:');
    console.error('   Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Cron Job Setup\n');
  console.log('='.repeat(80));
  console.log('Configuration:');
  console.log('   Supabase URL:', supabaseUrl);
  console.log('   Dispatch URL:', dispatchUrl);
  console.log('   Cron Secret:', cronSecret ? '***' + cronSecret.slice(-4) : 'NOT SET');
  console.log('='.repeat(80));
  console.log();

  // Check if cron job exists
  const existingJob = await checkCronJob();

  if (!existingJob) {
    // Create cron job
    const created = await createCronJob();
    if (!created) {
      console.log('\n⚠️  Please create the cron job manually using the SQL above.');
      process.exit(1);
    }
  }

  // Test the endpoint
  await testDispatchEndpoint();

  // Check execution history
  await checkCronHistory();

  console.log('\n✅ Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Wait 1-2 minutes');
  console.log('   2. Check cron execution history in Supabase:');
  console.log('      SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;');
  console.log('   3. Create a test scheduled message');
  console.log('   4. Verify it gets sent at the scheduled time');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

