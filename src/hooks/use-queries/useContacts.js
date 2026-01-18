import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

/**
 * Hook to fetch all contacts for an organization
 */
export function useContacts(organizationId) {
    const queryKey = ['contacts', organizationId];

    const { data: contacts, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!organizationId) return [];

            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('organization_id', organizationId)
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        },
        enabled: !!organizationId,
    });

    return {
        contacts,
        isLoading,
        error,
    };
}
