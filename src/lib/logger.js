// Logger utility - for adding logs from anywhere in the app
import { supabase } from './supabaseClient';

/**
 * Add a log entry
 * @param {string} level - 'info' | 'warn' | 'error' | 'debug'
 * @param {string} message - Log message
 * @param {object} meta - Optional metadata
 * @param {string} numberId - Optional number_id (for instance-specific logs)
 * @param {string} organizationId - Optional organization_id
 */
export async function addLog(level, message, meta = null, numberId = null, organizationId = null) {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        level,
        message,
        meta: meta ? JSON.parse(JSON.stringify(meta)) : null,
        number_id: numberId,
        organization_id: organizationId,
      });

    if (error) {
      console.error('Failed to add log:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding log:', error);
    return { success: false, error: error.message };
  }
}

// Convenience functions
export const logger = {
  info: (message, meta, numberId, organizationId) =>
    addLog('info', message, meta, numberId, organizationId),
  warn: (message, meta, numberId, organizationId) =>
    addLog('warn', message, meta, numberId, organizationId),
  error: (message, meta, numberId, organizationId) =>
    addLog('error', message, meta, numberId, organizationId),
  debug: (message, meta, numberId, organizationId) =>
    addLog('debug', message, meta, numberId, organizationId),
};

