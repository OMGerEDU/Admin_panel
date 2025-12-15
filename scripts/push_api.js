import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!token || token.includes('YOUR_')) {
    console.error('ERROR: SUPABASE_ACCESS_TOKEN is missing or invalid in .env');
    console.error('Get one here: https://supabase.com/dashboard/account/tokens');
    process.exit(1);
}

if (!projectId) {
    console.error('ERROR: SUPABASE_PROJECT_ID is missing in .env');
    process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/sql`;

async function pushSchema() {
    try {
        console.log(`Target Project ID: ${projectId}`);
        console.log('Reading schema file...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Sending SQL to Supabase API...');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: schemaSql
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        console.log('SUCCESS: Schema successfully deployed!');
    } catch (err) {
        console.error('DEPLOYMENT FAILED:', err.message);
        process.exit(1);
    }
}

pushSchema();
