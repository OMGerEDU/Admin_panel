import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
const outputPath = path.join(__dirname, '..', 'generated_supabase_schema.txt');

try {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Write to a .txt file so it can be sent or uploaded easily
    fs.writeFileSync(outputPath, schema, 'utf8');

    console.log('\n--- SUPABASE SCHEMA DEPLOYMENT ---\n');
    console.log('A text file with the full SQL has been generated.\n');
    console.log(`File path: ${outputPath}\n`);
    console.log('You can attach or upload this file, or open it and paste the contents into Supabase Dashboard -> SQL Editor.\n');
} catch (err) {
    console.error('Error reading schema file:', err);
}
