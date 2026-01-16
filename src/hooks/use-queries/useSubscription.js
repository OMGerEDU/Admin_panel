import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { getNumbersUsage, getInstancesUsage, getOrgMembersUsage } from '../../lib/planLimits';

/**
 * Fetch available plans.
 */
export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const { data, error } = await supabase.from('plans').select('*').order('price_monthly');
            if (error) throw error;
            return data || [];
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

/**
 * Fetch current user subscription.
 */
export function useSubscription(userId) {
    return useQuery({
        queryKey: ['subscription', userId],
        queryFn: async () => {
            if (!userId) return null;
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*, plans(*)')
                .eq('user_id', userId)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
}

/**
 * Fetch usage stats (numbers, instances, members).
 */
export function useUsage(userId) {
    return useQuery({
        queryKey: ['usage', userId],
        queryFn: async () => {
            if (!userId) return null;

            // Parallel fetch for individual limits
            const [numbersUsage, instancesUsage, orgResult] = await Promise.all([
                getNumbersUsage(supabase, userId).catch(e => ({ used: 0, limit: -1 })),
                getInstancesUsage(supabase, userId).catch(e => ({ used: 0, limit: -1 })),
                // Find organization owned by user to check member limits
                supabase
                    .from('organizations')
                    .select('id, name')
                    .eq('owner_id', userId)
                    .limit(1)
                    .single()
                    .catch(() => ({ data: null }))
            ]);

            let membersUsage = { used: null, limit: null, orgName: null };

            if (orgResult.data) {
                const org = orgResult.data;
                const mUsage = await getOrgMembersUsage(supabase, org.id).catch(() => ({ used: 0, limit: 0 }));
                membersUsage = {
                    used: mUsage.used,
                    limit: mUsage.limit,
                    orgName: org.name
                };
            }

            return {
                numbers: { used: numbersUsage.used, limit: numbersUsage.limit },
                instances: { used: instancesUsage.used, limit: instancesUsage.limit },
                members: membersUsage
            };
        },
        enabled: !!userId,
    });
}

/**
 * Fetch billing history.
 */
export function useBillingHistory(userId) {
    return useQuery({
        queryKey: ['billing_events', userId],
        queryFn: async () => {
            if (!userId) return [];
            try {
                const { data, error } = await supabase
                    .from('billing_events')
                    .select('id, plan_id, amount, currency, status, description, created_at, plans(name)')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) {
                    if (error.code === '42P01') return []; // Table doesn't exist
                    throw error;
                }
                return data || [];
            } catch (err) {
                console.error('Error fetching billing events:', err);
                return [];
            }
        },
        enabled: !!userId,
    });
}

/**
 * Helper to check feature access.
 */
export function useFeatureAccess(userId) {
    const { data: subscription, isLoading } = useSubscription(userId);

    // Example logic - adjust based on actual plan names/features
    if (isLoading || !subscription) return {
        canAccessApi: false,
        canRemoveBranding: false,
        planName: 'Free'
    };

    const planName = subscription.plans?.name || 'Free';
    const isPaid = planName !== 'Free' && subscription.status === 'active';

    return {
        canAccessApi: isPaid, // Example: only paid plans access API
        canRemoveBranding: ['Agency', 'Pro'].includes(planName), // Example
        planName
    };
}
