/**
 * Repair Script: Fix Evolution API Group Names
 * 
 * This script repairs group chat names in the database that may have been
 * incorrectly set to participant names (pushName) instead of the actual group subject.
 * 
 * Usage:
 *   - Run from browser console: import('./scripts/repairEvolutionGroupNames.js').then(m => m.repairEvolutionGroupNames())
 *   - Or add a button in admin UI to trigger it
 * 
 * What it does:
 *   1. Finds all group chats (@g.us) from Evolution API instances
 *   2. Fetches correct group subject from Evolution API
 *   3. Updates database if name is incorrect
 */

import { supabase } from '../lib/supabaseClient';
import { groupController } from '../services/evolutionApi';

// Get Evolution API key from environment (same as EvolutionApiService uses)
const getEvolutionApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_EVOLUTION_API_KEY || '54yWPufPt9y2Wp9QUap';
  }
  return process?.env?.VITE_EVOLUTION_API_KEY || '54yWPufPt9y2Wp9QUap';
};

/**
 * Check if a name looks like it might be a participant name rather than a group name
 * This is a heuristic - names that are just numbers or look like phone numbers
 * are likely incorrect for groups
 */
function looksLikeBadGroupName(name, remoteJid) {
  if (!name) return true;
  
  // If it's just the JID number part, that's a fallback (not ideal but acceptable)
  const jidNumber = remoteJid?.split('@')[0];
  if (name === jidNumber) return false; // This is acceptable fallback
  
  // If it's just digits, likely a phone number (bad for group)
  if (/^\d+$/.test(name)) return true;
  
  // If it looks like a JID format, it's bad
  if (name.includes('@s.whatsapp.net') || name.includes('@g.us') || name.includes('@c.us')) return true;
  
  // Very short names (1-2 chars) might be initials, but could also be bad
  // We'll be conservative and only flag obvious issues
  
  return false;
}

/**
 * Fetch group info from Evolution API
 * Uses the global API key (same as EvolutionApiService)
 */
async function fetchGroupInfo(instanceName, groupJid) {
  try {
    const apiKey = getEvolutionApiKey();
    const result = await groupController.findGroupInfos(instanceName, apiKey, groupJid);
    
    if (result.success && result.data) {
      // Evolution API group info typically has: subject, id, creation, owner, desc, etc.
      const groupData = result.data;
      return {
        subject: groupData.subject || groupData.groupSubject || groupData.name,
        id: groupData.id || groupJid
      };
    }
    
    return null;
  } catch (error) {
    console.error(`[REPAIR] Failed to fetch group info for ${groupJid}:`, error);
    return null;
  }
}

/**
 * Main repair function
 */
export async function repairEvolutionGroupNames(options = {}) {
  const {
    dryRun = false,           // If true, only log what would be changed
    instanceId = null,        // If provided, only repair groups for this instance
    limit = null,             // Limit number of groups to process
    verbose = true            // Log detailed progress
  } = options;

  console.log('[REPAIR] Starting Evolution group name repair...', { dryRun, instanceId, limit });

  try {
    // 1. Fetch all Evolution API instances
    let numbersQuery = supabase
      .from('numbers')
      .select('id, instance_id, api_token, provider')
      .eq('provider', 'evolution-api');
    
    if (instanceId) {
      numbersQuery = numbersQuery.eq('instance_id', instanceId);
    }

    const { data: numbers, error: numbersError } = await numbersQuery;

    if (numbersError) {
      throw new Error(`Failed to fetch numbers: ${numbersError.message}`);
    }

    if (!numbers || numbers.length === 0) {
      console.log('[REPAIR] No Evolution API instances found');
      return { success: true, processed: 0, updated: 0, skipped: 0, errors: 0 };
    }

    console.log(`[REPAIR] Found ${numbers.length} Evolution API instance(s)`);

    // 2. For each instance, find group chats
    let allGroups = [];
    
    for (const number of numbers) {
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select('id, remote_jid, name, number_id')
        .eq('number_id', number.id)
        .like('remote_jid', '%@g.us');

      if (chatsError) {
        console.error(`[REPAIR] Failed to fetch chats for instance ${number.instance_id}:`, chatsError);
        continue;
      }

      if (chats && chats.length > 0) {
        allGroups.push(...chats.map(chat => ({
          ...chat,
          instanceName: number.instance_id,
          apiToken: number.api_token
        })));
      }
    }

    if (allGroups.length === 0) {
      console.log('[REPAIR] No group chats found');
      return { success: true, processed: 0, updated: 0, skipped: 0, errors: 0 };
    }

    console.log(`[REPAIR] Found ${allGroups.length} group chat(s) to check`);

    // Apply limit if specified
    const groupsToProcess = limit ? allGroups.slice(0, limit) : allGroups;
    
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    // 3. Process each group
    for (const group of groupsToProcess) {
      processed++;
      
      if (verbose) {
        console.log(`[REPAIR] [${processed}/${groupsToProcess.length}] Processing: ${group.remote_jid} (current name: "${group.name}")`);
      }

      // Check if name looks suspicious
      const isBadName = looksLikeBadGroupName(group.name, group.remote_jid);
      
      if (!isBadName) {
        if (verbose) {
          console.log(`[REPAIR]   ✓ Name looks OK, skipping`);
        }
        skipped++;
        continue;
      }

      // Fetch correct group info from Evolution API
      const groupInfo = await fetchGroupInfo(group.instanceName, group.remote_jid);
      
      if (!groupInfo || !groupInfo.subject) {
        if (verbose) {
          console.log(`[REPAIR]   ⚠ Could not fetch group subject from API`);
        }
        skipped++;
        continue;
      }

      const correctName = groupInfo.subject.trim();
      
      // Check if update is needed
      if (correctName === group.name) {
        if (verbose) {
          console.log(`[REPAIR]   ✓ Name is already correct`);
        }
        skipped++;
        continue;
      }

      // Update the name
      if (dryRun) {
        console.log(`[REPAIR]   [DRY RUN] Would update: "${group.name}" → "${correctName}"`);
        updated++;
      } else {
        const { error: updateError } = await supabase
          .from('chats')
          .update({ name: correctName })
          .eq('id', group.id);

        if (updateError) {
          console.error(`[REPAIR]   ✗ Failed to update:`, updateError);
          errors++;
        } else {
          if (verbose) {
            console.log(`[REPAIR]   ✓ Updated: "${group.name}" → "${correctName}"`);
          }
          updated++;
        }
      }

      // Rate limiting: wait a bit between API calls to avoid overwhelming Evolution API
      if (processed < groupsToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      }
    }

    const summary = {
      success: true,
      processed,
      updated,
      skipped,
      errors,
      totalGroups: allGroups.length
    };

    console.log('[REPAIR] Repair complete!', summary);
    return summary;

  } catch (error) {
    console.error('[REPAIR] Fatal error:', error);
    return {
      success: false,
      error: error.message,
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0
    };
  }
}

/**
 * Quick repair for a specific group
 */
export async function repairSingleGroup(chatId, instanceName) {
  try {
    const { data: chat, error } = await supabase
      .from('chats')
      .select('id, remote_jid, name')
      .eq('id', chatId)
      .single();

    if (error || !chat) {
      throw new Error(`Chat not found: ${error?.message || 'Unknown'}`);
    }

    if (!chat.remote_jid.includes('@g.us')) {
      throw new Error('Not a group chat');
    }

    const groupInfo = await fetchGroupInfo(instanceName, chat.remote_jid);
    
    if (!groupInfo || !groupInfo.subject) {
      throw new Error('Could not fetch group subject');
    }

    const { error: updateError } = await supabase
      .from('chats')
      .update({ name: groupInfo.subject.trim() })
      .eq('id', chat.id);

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      oldName: chat.name,
      newName: groupInfo.subject.trim()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Export default for convenience
export default repairEvolutionGroupNames;
