import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hook to fetch user's numbers.
 */
export function useNumbers(userId) {
    return useQuery({
        queryKey: ['numbers', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
    });
}

/**
 * Mutation to create a number.
 */
export function useCreateNumber() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, instanceName, webhookUrl }) => {
            // 1. Create instance via API (if needed) - logic usually involves a fetch to an external service
            // For now, mirroring current logic which likely just creates a DB entry or an API call.
            // Assuming direct DB insertion for this refactor stage based on previous code usage
            const { data, error } = await supabase
                .from('numbers')
                .insert({
                    user_id: userId,
                    instance_id: instanceName, // Using name as ID or generating one?
                    webhook_url: webhookUrl,
                    status: 'connecting'
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries(['numbers', userId]);
        }
    });
}

/**
 * Mutation to delete a number.
 */
export function useDeleteNumber() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }) => {
            const { error } = await supabase
                .from('numbers')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries(['numbers', userId]);
        }
    });
}

/**
 * Mutation to update number settings.
 */
export function useUpdateNumber() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data, error } = await supabase
                .from('numbers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data, { userId }) => {
            queryClient.invalidateQueries(['numbers', userId]);
        }
    });
}
