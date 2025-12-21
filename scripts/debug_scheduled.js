/**
 * Debug script for scheduled messages
 * Run with: node scripts/debug_scheduled.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function debugScheduled() {
  console.log('🔍 Debugging Scheduled Messages\n');
  console.log('='.repeat(80));

  // 1. Check current time in UTC and Israel
  const now = new Date();
  const utcNow = now.toISOString();
  const israelNow = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  console.log('\n1. Current Time:');
  console.log('   UTC:', utcNow);
  console.log('   Israel:', israelNow);

  // 2. Check all scheduled messages
  console.log('\n2. All Scheduled Messages:');
  const { data: allMessages, error: allError } = await supabase
    .from('scheduled_messages')
    .select('id, message, scheduled_at, status, is_active, created_at')
    .order('scheduled_at', { ascending: true })
    .limit(20);

  if (allError) {
    console.error('   Error:', allError);
  } else {
    console.log(`   Found ${allMessages.length} messages:`);
    allMessages.forEach((msg, i) => {
      const scheduledDate = new Date(msg.scheduled_at);
      const israelScheduled = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(scheduledDate);
      
      const isDue = scheduledDate <= now;
      const status = isDue ? '✅ DUE' : '⏳ PENDING';
      
      console.log(`   ${i + 1}. ${status} | Status: ${msg.status} | Active: ${msg.is_active}`);
      console.log(`      Scheduled (UTC): ${msg.scheduled_at}`);
      console.log(`      Scheduled (Israel): ${israelScheduled}`);
      console.log(`      Message: ${msg.message.substring(0, 50)}...`);
    });
  }

  // 3. Check pending messages
  console.log('\n3. Pending Messages:');
  const { data: pendingMessages, error: pendingError } = await supabase
    .from('scheduled_messages')
    .select('id, message, scheduled_at, status, is_active')
    .eq('status', 'pending')
    .eq('is_active', true)
    .order('scheduled_at', { ascending: true })
    .limit(20);

  if (pendingError) {
    console.error('   Error:', pendingError);
  } else {
    console.log(`   Found ${pendingMessages.length} pending messages:`);
    pendingMessages.forEach((msg, i) => {
      const scheduledDate = new Date(msg.scheduled_at);
      const isDue = scheduledDate <= now;
      const israelScheduled = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(scheduledDate);
      
      console.log(`   ${i + 1}. ${isDue ? '✅ DUE NOW' : '⏳ NOT DUE'} | Scheduled: ${israelScheduled} (Israel) / ${msg.scheduled_at} (UTC)`);
      console.log(`      Message: ${msg.message.substring(0, 50)}...`);
    });
  }

  // 4. Test the claim function
  console.log('\n4. Testing claim_due_scheduled_messages function:');
  const { data: claimed, error: claimError } = await supabase.rpc(
    'claim_due_scheduled_messages',
    { max_batch: 50 }
  );

  if (claimError) {
    console.error('   Error:', claimError);
  } else {
    console.log(`   Claimed ${claimed.length} messages`);
    if (claimed.length > 0) {
      claimed.forEach((msg, i) => {
        console.log(`   ${i + 1}. ID: ${msg.id} | Message: ${msg.message.substring(0, 50)}...`);
      });
    }
  }

  // 5. Check cron job
  console.log('\n5. Checking Cron Job:');
  try {
    const { data: cronJobs, error: cronError } = await supabase
      .from('cron.job')
      .select('*')
      .eq('jobname', 'dispatch_scheduled_messages');

    if (cronError) {
      console.log('   ⚠️  Could not check cron jobs (might need to use SQL directly)');
      console.log('   Run this SQL: SELECT * FROM cron.job WHERE jobname = \'dispatch_scheduled_messages\';');
    } else if (cronJobs && cronJobs.length > 0) {
      console.log('   ✅ Cron job exists');
      console.log('   Job ID:', cronJobs[0].jobid);
      console.log('   Schedule:', cronJobs[0].schedule);
    } else {
      console.log('   ❌ Cron job NOT FOUND!');
      console.log('   You need to create it. See SUPABASE_CRON_SETUP.md');
    }
  } catch (error) {
    console.log('   ⚠️  Could not check cron jobs:', error.message);
  }

  // 6. Check recipients
  if (pendingMessages && pendingMessages.length > 0) {
    console.log('\n6. Checking Recipients:');
    for (const msg of pendingMessages.slice(0, 5)) {
      const { data: recipients, error: recError } = await supabase
        .from('scheduled_message_recipients')
        .select('*')
        .eq('scheduled_message_id', msg.id);

      if (recError) {
        console.log(`   Message ${msg.id}: Error - ${recError.message}`);
      } else {
        console.log(`   Message ${msg.id}: ${recipients.length} recipients`);
        if (recipients.length === 0) {
          console.log(`      ⚠️  No recipients! Using old to_phone: ${msg.to_phone || 'NONE'}`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Debug complete!');
  console.log('\nNext steps:');
  console.log('1. If cron job not found, create it (see SUPABASE_CRON_SETUP.md)');
  console.log('2. If messages are due but not claimed, check the claim function');
  console.log('3. If no recipients, check scheduled_message_recipients table');
  console.log('4. Check Vercel logs for /api/dispatch to see if it\'s being called');
}

debugScheduled().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

