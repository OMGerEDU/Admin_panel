import { logger } from '../lib/logger';

const BASE_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evolution.omger.cloud';
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '54yWPufPt9y2Wp9QUap';

const headers = {
    'Content-Type': 'application/json',
    'apikey': API_KEY
};

export const EvolutionApiService = {
    /**
     * Create a new instance
     * @param {string} instanceName 
     * @returns {Promise<object>} Response with instance data and QR code if requested
     */
    async createInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    instanceName,
                    qrcode: true,
                    integration: 'WHATSAPP-BAILEYS'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || errorData.message || 'Failed to create instance');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Create Instance Error:', error);
            throw error;
        }
    },

    /**
     * Fetch QR Code for an existing instance
     * @param {string} instanceName 
     * @returns {Promise<object>}
     */
    async fetchQrCode(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}/qr`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch QR code');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Fetch QR Error:', error);
            throw error;
        }
    },

    /**
     * Get instance connection state
     * @param {string} instanceName 
     * @returns {Promise<object>}
     */
    async getInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                if (response.status === 404) return null; // Not found
                throw new Error('Failed to fetch instance');
            }

            return await response.json();
        } catch (error) {
            console.error('EvolutionAPI Get Instance Error:', error);
            throw error;
        }
    },

    /**
     * Delete an instance
     * @param {string} instanceName 
     */
    async deleteInstance(instanceName) {
        try {
            const response = await fetch(`${BASE_URL}/api/instances/${instanceName}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok && response.status !== 404) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete instance');
            }

            return true;
        } catch (error) {
            console.error('EvolutionAPI Delete Instance Error:', error);
            throw error;
        }
    }
};
