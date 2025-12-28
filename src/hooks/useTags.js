import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useTags(organizationId, instanceId) {
    const [tags, setTags] = useState([]);
    const [chatTags, setChatTags] = useState({}); // { [chatJid]: [tagId, ...] }

    // Fetch Tags
    const fetchTags = useCallback(async () => {
        if (!organizationId) return;
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('organization_id', organizationId);

        if (!error) {
            setTags(data || []);
        } else {
            console.error('Error fetching tags:', error);
        }
    }, [organizationId]);

    // Fetch Chat Tags
    const fetchChatTags = useCallback(async () => {
        if (!instanceId) return;
        const { data, error } = await supabase
            .from('chat_tags')
            .select('*')
            .eq('instance_id', instanceId);

        if (!error && data) {
            const map = {};
            data.forEach(item => {
                if (!map[item.chat_jid]) map[item.chat_jid] = [];
                map[item.chat_jid].push(item.tag_id);
            });
            setChatTags(map);
        } else if (error) {
            console.error('Error fetching chat tags:', error);
        }
    }, [instanceId]);

    // Initial Load & Subscription
    useEffect(() => {
        fetchTags();
        fetchChatTags();

        // Subscribe to realtime changes
        const tagsSubscription = supabase
            .channel('public:tags')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, payload => {
                // We could handle this more granularly, but refetching is safer/easier for now
                fetchTags();
            })
            .subscribe();

        const chatTagsSubscription = supabase
            .channel('public:chat_tags')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_tags' }, payload => {
                fetchChatTags();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(tagsSubscription);
            supabase.removeChannel(chatTagsSubscription);
        };
    }, [fetchTags, fetchChatTags]);

    // Add Tag
    const createTag = async (name, color) => {
        if (!organizationId) return;

        // Optimistic Update
        const tempId = 'temp_' + Date.now().toString();
        const newTag = { id: tempId, name, color, organization_id: organizationId };

        setTags(prev => [...prev, newTag]);

        const { data, error } = await supabase
            .from('tags')
            .insert({ name, color, organization_id: organizationId })
            .select()
            .single();

        if (error) {
            console.error('Error creating tag:', error);
            // Revert on error
            setTags(prev => prev.filter(t => t.id !== tempId));
            throw error;
        } else {
            // Replace temp ID with real ID
            setTags(prev => prev.map(t => t.id === tempId ? data : t));
        }
        return data;
    };

    // Delete Tag
    const deleteTag = async (tagId) => {
        // Optimistic Update
        setTags(prev => prev.filter(t => t.id !== tagId));
        setChatTags(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(chatId => {
                next[chatId] = next[chatId].filter(id => id !== tagId);
            });
            return next;
        });

        const { error } = await supabase.from('tags').delete().eq('id', tagId);
        if (error) {
            console.error('Error deleting tag:', error);
            // Revert would be complex effectively, usually just silently failing or showing toast is handled by UI
            throw error;
        }
    };

    // Assign Tag to Chat
    const assignTagToChat = async (chatJid, tagId) => {
        if (!instanceId) return;

        // Optimistic
        setChatTags(prev => ({
            ...prev,
            [chatJid]: [...(prev[chatJid] || []), tagId]
        }));

        const { error } = await supabase
            .from('chat_tags')
            .insert({ tag_id: tagId, chat_jid: chatJid, instance_id: instanceId });

        if (error && error.code !== '23505') { // Ignore unique violation
            console.error('Error assigning tag:', error);
            // Revert
            setChatTags(prev => ({
                ...prev,
                [chatJid]: (prev[chatJid] || []).filter(id => id !== tagId)
            }));
            throw error;
        }
    };

    // Remove Tag from Chat
    const removeTagFromChat = async (chatJid, tagId) => {
        if (!instanceId) return;

        // Optimistic
        setChatTags(prev => ({
            ...prev,
            [chatJid]: (prev[chatJid] || []).filter(id => id !== tagId)
        }));

        const { error } = await supabase
            .from('chat_tags')
            .delete()
            .eq('chat_jid', chatJid)
            .eq('tag_id', tagId)
            .eq('instance_id', instanceId);

        if (error) {
            console.error('Error removing tag from chat:', error);
            // Revert
            setChatTags(prev => ({
                ...prev,
                [chatJid]: [...(prev[chatJid] || []), tagId]
            }));
            throw error;
        }
    };

    return { tags, chatTags, createTag, deleteTag, assignTagToChat, removeTagFromChat };
}
