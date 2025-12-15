import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');

const dbUrl = process.env.DATABASE_URL;

async function pushSchema() {
    if (!dbUrl || dbUrl.includes('[PASSWORD]')) {
        console.error('ERROR: DATABASE_URL is invalid.');
        return fallback();
    }

    // Try to force port 6543 (Transaction Pooler) if 5432 fails or is set
    const connectionString = dbUrl.replace(':5432', ':6543');
    console.log(`Attempting connection to Port 6543 (Bypassing potential 5432 blocks)...`);

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000, 
    });

    try {
        await client.connect();
        console.log('Connected to database!');
        
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        
        console.log('\n[SUCCESS] Database updated successfully.');
    } catch (err) {
        console.error('\n[ERROR] Connection Failed:', err.message);
        if (err.code === 'ETIMEDOUT') {
             console.error('Your network is blocking the database connection.');
        }
        fallback();
    } finally {
        await client.end().catch(() => {});
    }
}

function fallback() {
    console.log('\n==================================================');
    console.log('           MANUAL FALLBACK INSTRUCTIONS');
    console.log('==================================================');
    console.log('Since automation failed, please run this SQL manually:');
    console.log('1. Go to https://supabase.com/dashboard/project/_/sql');
    console.log('2. Paste the SQL below and run it:\n');
    
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log(schema);
    } catch (e) { console.log('Error reading schema file'); }
    
    console.log('\n==================================================');
    process.exit(1);
}

pushSchema();
