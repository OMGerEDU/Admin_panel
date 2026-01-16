import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { getOrgMembersUsage } from '../../lib/planLimits';

/**
 * Hook to fetch organization details, members, invites, and usage.
 */
export function useOrganization(orgId) {
    const queryClient = useQueryClient();

    // 1. Fetch Organization Details
    const orgQuery = useQuery({
        queryKey: ['organization', orgId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!orgId,
    });

    // 2. Fetch Members
    const membersQuery = useQuery({
        queryKey: ['organization', orgId, 'members'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('organization_members')
                .select(`
                    id,
                    role,
                    joined_at,
                    profiles:user_id (id, email, full_name, avatar_url)
                `)
                .eq('organization_id', orgId)
                .order('joined_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!orgId,
    });

    // 3. Fetch Invites
    const invitesQuery = useQuery({
        queryKey: ['organization', orgId, 'invites'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('organization_invites')
                .select('*')
                .eq('organization_id', orgId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!orgId,
    });

    // 4. Fetch Usage (Members limit)
    const usageQuery = useQuery({
        queryKey: ['organization', orgId, 'usage'],
        queryFn: async () => {
            const { used, totalMembers, limit, plan, error } = await getOrgMembersUsage(supabase, orgId);
            if (error) throw error;
            return {
                used: used || 0,
                totalMembers: totalMembers || 0,
                limit: typeof limit === 'number' ? limit : -1,
                planName: plan?.name || null,
            };
        },
        enabled: !!orgId,
    });

    return {
        org: orgQuery.data,
        isLoadingOrg: orgQuery.isLoading,
        orgError: orgQuery.error,

        members: membersQuery.data || [],
        isLoadingMembers: membersQuery.isLoading,

        invites: invitesQuery.data || [],
        isLoadingInvites: invitesQuery.isLoading,

        usage: usageQuery.data || { used: 0, totalMembers: 0, limit: -1, planName: null },
        isLoadingUsage: usageQuery.isLoading,

        refetchAll: () => {
            orgQuery.refetch();
            membersQuery.refetch();
            invitesQuery.refetch();
            usageQuery.refetch();
        }
    };
}

/**
 * Mutation to invite a member by email.
 */
export function useInviteMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orgId, email }) => {
            // 1. Get Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .single();

            if (profileError || !profileData) {
                throw new Error('User not found. Please make sure the user has signed up first.');
            }

            // 2. Check existence
            const { data: existingMember } = await supabase
                .from('organization_members')
                .select('id')
                .eq('organization_id', orgId)
                .eq('user_id', profileData.id)
                .single();

            if (existingMember) {
                throw new Error('User is already a member of this organization.');
            }

            // 3. Insert
            const { error: insertError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: orgId,
                    user_id: profileData.id,
                    role: 'member'
                });

            if (insertError) throw insertError;
            return true;
        },
        onSuccess: (_, { orgId }) => {
            queryClient.invalidateQueries(['organization', orgId, 'members']);
            queryClient.invalidateQueries(['organization', orgId, 'usage']);
        }
    });
}

/**
 * Mutation to remove a member.
 */
export function useRemoveMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ memberId }) => {
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('id', memberId);
            if (error) throw error;
        },
        onSuccess: (_, { orgId }) => { // pass orgId in variables or infer it?
            // Since we might not strictly know the orgId from just memberId easily without extra query,
            // better to pass orgId when calling mutate({ memberId, orgId })
            if (arguments[1]?.orgId) { // Check if orgId is passed in context or args
                queryClient.invalidateQueries(['organization', arguments[1].orgId, 'members']);
                queryClient.invalidateQueries(['organization', arguments[1].orgId, 'usage']);
            } else {
                // Invalidate all organization members queries if we don't know the specific org
                queryClient.invalidateQueries(['organization']);
            }
        },
    });
}

/**
 * Mutation to create an invite link.
 */
export function useCreateInviteLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orgId, userId, email, expiresInDays = 7 }) => {
            const token = (window.crypto && window.crypto.randomUUID)
                ? window.crypto.randomUUID()
                : Math.random().toString(36).slice(2) + Date.now().toString(36);

            const { data, error } = await supabase
                .from('organization_invites')
                .insert({
                    organization_id: orgId,
                    token,
                    email: email || null,
                    invited_by: userId,
                    expires_at: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, { orgId }) => {
            queryClient.invalidateQueries(['organization', orgId, 'invites']);
        }
    });
}

/**
 * Mutation to leave an organization.
 */
export function useLeaveOrganization() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orgId, userId }) => {
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('organization_id', orgId)
                .eq('user_id', userId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['organization']); // Invalidate list of user's orgs if that query exists
        }
    })
}
