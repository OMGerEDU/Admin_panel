
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env from parent directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env");
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

const sql = `
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  organization_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  custom_fields JSONB DEFAULT '{}'::JSONB,
  crm_links JSONB DEFAULT '{}'::JSONB,
  notes TEXT,
  UNIQUE(organization_id, phone_number)
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create Policy safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'contacts' AND policyname = 'Users can view contacts in their org'
    ) THEN
        CREATE POLICY "Users can view contacts in their org" ON contacts
        FOR ALL USING (
            organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        );
    END IF;
END
$$;

-- Create Index for performance
CREATE INDEX IF NOT EXISTS idx_contacts_org_phone ON contacts(organization_id, phone_number);
`;

async function run() {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Running migration...");
        await client.query(sql);
        console.log("Migration for 'contacts' table completed successfully.");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await client.end();
    }
}

run();
