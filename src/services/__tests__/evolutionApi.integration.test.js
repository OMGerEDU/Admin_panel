import { describe, it, expect, beforeAll } from 'vitest';
import { instanceController, messageController } from '../evolutionApi';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Attempt to load .env from project root
// Adjust path as needed based on where this test file is located relative to root
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

// Variables from env
const API_URL = process.env.VITE_EVOLUTION_API_URL || 'https://evolution.omger.cloud/api';
const API_TOKEN = process.env.VITE_EVOLUTION_API_TOKEN;
const INSTANCE_NAME = process.env.VITE_EVOLUTION_INSTANCE_NAME || 'Sasha';
const TEST_NUMBER = '972545661640';

// Debug Env
console.log('[IntegrationSetup] Loaded .env from:', envPath);
console.log('[IntegrationSetup] VITE_EVOLUTION_API_URL:', process.env.VITE_EVOLUTION_API_URL);
console.log('[IntegrationSetup] VITE_EVOLUTION_API_TOKEN:', process.env.VITE_EVOLUTION_API_TOKEN ? '(Present)' : '(Missing)');

// Only run if we have at least the Token (URL has default)
const runIntegration = !!API_TOKEN;

describe.runIf(runIntegration)('Evolution API Integration (Real System)', () => {

    // Check if we can reach the server
    it('should connect to the Evolution API and fetch instances', async () => {
        console.log(`\n--- Integration Test: Connecting to ${API_URL} ---`);

        // We pass the global token here. 
        // Note: fetchInstances usually takes the global apikey.
        const result = await instanceController.fetchInstances(API_TOKEN);

        if (!result.success) {
            console.error('Fetch Instances Failed:', result.error);
            console.log('Full Result:', JSON.stringify(result, null, 2)); // DEBUG RESPONSE
        } else {
            console.log('Fetch Instances Success. Data Type:', typeof result.data);
            console.log('Data Preview:', JSON.stringify(result.data, null, 2)); // DEBUG RESPONSE
        }

        expect(result.success).toBe(true);
        // API returns { success: true, data: [...] } so our wrapper makes it result.data = { success: true, data: [...] }
        // Thus the actual array is result.data.data
        const instances = result.data.data || result.data; // Flexible check or direct
        expect(Array.isArray(instances)).toBe(true);

        console.log('Instances found:', instances.length);
        if (instances.length > 0) {
            console.log('First instance:', instances[0].instance ? instances[0].instance.instanceName : instances[0].name);
        }
    });

    // Connect Probe Test: Check if we can get a QR code or connection status
    it('should fetch connection QR code/status for an instance', async () => {
        // ... (previous logic to get instances)
        const instancesResult = await instanceController.fetchInstances(API_TOKEN);
        if (!instancesResult.success || !instancesResult.data.data) {
            console.warn('Skipping Connect Probe: No instances found.');
            return;
        }
        const instances = instancesResult.data.data;
        const targetInstance = instances.find(i => i.instance.instanceName === INSTANCE_NAME) || instances[0];
        const name = targetInstance.instance.instanceName;

        console.log(`\n--- Probing Connection for: ${name} ---`);

        // 1. Try standard connect endpoint
        const connectUrl = `${API_URL}/instance/connect/${name}`;
        console.log(`[Probe Connect] Fetching: ${connectUrl}`);

        try {
            const response = await fetch(connectUrl, {
                method: 'GET',
                headers: { 'apikey': API_TOKEN }
            });
            console.log(`[Probe Connect] Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                console.log('[Probe Connect] Success! Data keys:', Object.keys(data));
                if (data.base64 || data.code) {
                    console.log('[Probe Connect] QR Code received (truncated):', (data.base64 || data.code).substring(0, 50));
                }
            } else {
                console.warn('[Probe Connect] Failed:', await response.text());
                // Try v2 style if v1 fails?
                // const v2Url = `${API_URL}/instance-controller/instance-connect/${name}`; ...
            }
        } catch (e) {
            console.error('[Probe Connect] Error:', e.message);
        }
    });

});

describe.skipIf(runIntegration)('Evolution API Integration (Skipped)', () => {
    it('skips integration tests because VITE_EVOLUTION_API_TOKEN is missing', () => {
        console.warn('\n[WARN] Skipping Integration Tests.');
        console.warn('To run them, create a .env file with:');
        console.warn('VITE_EVOLUTION_API_TOKEN=your_global_apikey');
        console.warn('VITE_EVOLUTION_API_URL=https://evolution.omger.cloud\n');
        expect(true).toBe(true);
    });
});
