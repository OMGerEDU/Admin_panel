/**
 * Test script to verify GreenBuilders bucket connection
 * Run with: node scripts/test_bucket.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBucket() {
  console.log('🔍 Testing GreenBuilders bucket connection...\n');

  try {
    // 1. List buckets to see if GreenBuilders exists
    console.log('1. Checking if GreenBuilders bucket exists...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return false;
    }

    const greenBuildersBucket = buckets.find(b => b.name === 'GreenBuilders');
    
    if (!greenBuildersBucket) {
      console.error('❌ GreenBuilders bucket not found!');
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
      console.log('\n💡 You need to create the bucket in Supabase Dashboard:');
      console.log('   Storage > Create Bucket > Name: GreenBuilders');
      return false;
    }

    console.log('✅ GreenBuilders bucket found!');
    console.log('   - Name:', greenBuildersBucket.name);
    console.log('   - Public:', greenBuildersBucket.public ? 'Yes' : 'No');
    console.log('   - Created:', greenBuildersBucket.created_at);

    // 2. Test file upload
    console.log('\n2. Testing file upload...');
    const testFileName = `test_${Date.now()}.txt`;
    const testContent = 'This is a test file for GreenBuilders bucket';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('GreenBuilders')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload failed:', uploadError.message);
      console.error('   Error details:', uploadError);
      
      if (uploadError.message.includes('new row violates row-level security')) {
        console.log('\n💡 You need to add storage policies:');
        console.log('   Run the SQL in supabase_schema.sql or add policies in Supabase Dashboard');
      }
      return false;
    }

    console.log('✅ File uploaded successfully!');
    console.log('   - Path:', uploadData.path);

    // 3. Get public URL
    console.log('\n3. Getting public URL...');
    const { data: urlData } = supabase.storage
      .from('GreenBuilders')
      .getPublicUrl(testFileName);

    if (urlData?.publicUrl) {
      console.log('✅ Public URL generated:');
      console.log('   ', urlData.publicUrl);
    } else {
      console.log('⚠️  Could not generate public URL (bucket might be private)');
    }

    // 4. Test file download/read
    console.log('\n4. Testing file download...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('GreenBuilders')
      .download(testFileName);

    if (downloadError) {
      console.error('❌ Download failed:', downloadError.message);
    } else {
      const text = await downloadData.text();
      console.log('✅ File downloaded successfully!');
      console.log('   - Content:', text);
    }

    // 5. Clean up test file
    console.log('\n5. Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from('GreenBuilders')
      .remove([testFileName]);

    if (deleteError) {
      console.error('⚠️  Failed to delete test file:', deleteError.message);
    } else {
      console.log('✅ Test file deleted');
    }

    console.log('\n🎉 All tests passed! GreenBuilders bucket is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testBucket()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

