import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hook to manage a single contact's dynamic details
 */
export function useContact(phone, organizationId) {
    const queryClient = useQueryClient();
    const queryKey = ['contact', organizationId, phone];

    // 1. Fetch Contact
    const contactQuery = useQuery({
        queryKey,
        queryFn: async () => {
            if (!phone || !organizationId) return null;

            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('organization_id', organizationId)
                .eq('phone_number', phone)
                .maybeSingle();

            if (error) throw error;
            // Return existing data or a shell for a new contact that hasn't been saved yet
            return data || {
                organization_id: organizationId,
                phone_number: phone,
                custom_fields: {},
                crm_links: {},
                isNew: true
            };
        },
        enabled: !!phone && !!organizationId,
    });

    // 2. Upsert Contact (Create or Update)
    const upsertMutation = useMutation({
        mutationFn: async (payload) => {
            // Remove isNew flag if present
            const { isNew, ...dataToSave } = payload;

            // Ensure mandatory fields
            const cleanPayload = {
                ...dataToSave,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('contacts')
                .upsert(cleanPayload, { onConflict: 'organization_id, phone_number' })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (newData) => {
            // Update cache immediately
            queryClient.setQueryData(queryKey, newData);
            queryClient.invalidateQueries(['contacts', organizationId]); // Invalidate list if we had one
        },
    });

    return {
        contact: contactQuery.data,
        isLoading: contactQuery.isLoading,
        error: contactQuery.error,
        saveContact: upsertMutation.mutateAsync,
        isSaving: upsertMutation.isPending,
    };
}
