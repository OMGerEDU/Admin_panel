# GreenBuilders Bucket Verification Guide

## What Was Added

1. **File Upload Functionality** in `ScheduledMessageEdit.jsx`
   - Users can now upload files directly to the GreenBuilders bucket
   - Files are automatically organized by user ID: `{user_id}/{timestamp}_{random}.{ext}`
   - Media type is auto-detected from file type
   - Public URL is automatically generated and set in the form

2. **Storage Policies** in `supabase_schema.sql`
   - Users can upload files to their own folder
   - Users can read their own files (and public files if bucket is public)
   - Users can delete their own files
   - Users can update their own files

## How to Verify

### Step 1: Create the Bucket (if not already created)

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Click **Create Bucket**
4. Name: `GreenBuilders`
5. Public: **Yes** (recommended for public URLs)
6. Click **Create**

### Step 2: Apply Storage Policies

Run the SQL from `supabase_schema.sql` (the storage policies section at the end) in Supabase SQL Editor, or they will be applied when you run the full schema.

### Step 3: Test in the App

1. Navigate to **Scheduled Messages** > **Create New**
2. Scroll to the **Media** section
3. Click the upload area or drag and drop a file
4. The file should upload and show:
   - File name and size
   - Auto-detected media type
   - Public URL in the URL field

### Step 4: Verify in Browser Console

Open browser console and check for:
- `File uploaded successfully:` log with file details
- No error messages

### Step 5: Check Supabase Storage

1. Go to Supabase Dashboard > Storage > GreenBuilders
2. You should see files organized by user ID folders
3. Click on a file to see its public URL

## Troubleshooting

### Error: "new row violates row-level security"
- **Solution**: Make sure storage policies are applied. Run the SQL from `supabase_schema.sql`

### Error: "Bucket not found"
- **Solution**: Create the bucket in Supabase Dashboard (see Step 1)

### Error: "Failed to get public URL"
- **Solution**: Make sure the bucket is set to **Public** in Supabase Dashboard

### Files not uploading
- Check browser console for errors
- Verify Supabase environment variables are set correctly
- Check network tab for failed requests

## Testing Checklist

- [ ] Bucket exists in Supabase Dashboard
- [ ] Storage policies are applied
- [ ] Can upload image file
- [ ] Can upload video file
- [ ] Can upload audio file
- [ ] Can upload document file
- [ ] Public URL is generated correctly
- [ ] File appears in Supabase Storage
- [ ] Can delete uploaded file
- [ ] Can use uploaded file in scheduled message

