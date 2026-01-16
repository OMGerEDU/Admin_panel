import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hook to fetch chats for a specific number.
 */
export function useChats(numberId, { limit = 20 } = {}) {
    return useQuery({
        queryKey: ['chats', numberId],
        queryFn: async () => {
            if (!numberId) return [];
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('number_id', numberId)
                .order('last_message_at', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        },
        enabled: !!numberId,
        refetchInterval: 5000, // Poll every 5s for new chats (simple solution)
    });
}

/**
 * Hook to fetch messages for a specific chat.
 * Uses infinite query for pagination.
 */
export function useChatMessages(chatId) {
    return useInfiniteQuery({
        queryKey: ['messages', chatId],
        queryFn: async ({ pageParam = null }) => {
            if (!chatId) return [];

            let query = supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('timestamp', { ascending: false })
                .limit(50); // Fetch 50 messages per page

            if (pageParam) {
                query = query.lt('timestamp', pageParam);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 50) return undefined;
            return lastPage[lastPage.length - 1].timestamp;
        },
        enabled: !!chatId,
        refetchInterval: 3000, // Poll every 3s for new messages
        select: (data) => ({
            pages: [...data.pages].reverse(), // Reverse pages to show oldest first in list if needed, usually simplified in UI
            pageParams: data.pageParams
        })
    });
}

/**
 * Mutation to send a message.
 */
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ chatId, numberId, text }) => {
            // 1. Call API to send message (or insert to DB if that triggers a function)
            // Assuming API call logic here, but for now we might just insert to 'messages' if that's how it works?
            // Usually it's an API call to Green API or similar.
            // Based on `Chats.jsx`, it calls `sendMessage` function which likely hits an API.
            // We will assume a placeholder API call or direct DB insert for audit purpose, or fetch the actual send logic.

            // Placeholder:
            // const response = await fetch('/api/send', ...);
            // For now, let's assume we just want to optimistically update or allow the UI to handle the API call.
            // BUT, hooks should contain the logic.
            // We'll create a placeholder that throws for now if we don't have the API service logic ready.

            // Actually, `Chats.jsx` uses `api.sendMessage`. 
            // We should probably rely on a Service for the actual network call.
            // Let's assume there's a `MessagingService` or similar.
            // For now, I'll document this hook as needing the `sendMessage` function passed to it, or implemented here.

            throw new Error("Implementation dependent on Messaging Service");
        },
        onSuccess: (_, { chatId }) => {
            queryClient.invalidateQueries(['messages', chatId]);
            queryClient.invalidateQueries(['chats']); // Update last message snippet
        }
    });
}
