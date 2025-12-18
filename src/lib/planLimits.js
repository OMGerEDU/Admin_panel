import { supabase as defaultSupabase } from './supabaseClient'

/**
 * Fetch the current user's subscription and associated plan.
 * Falls back to the \"Free\" plan if no subscription exists.
 */
export async function fetchCurrentSubscriptionAndPlan(
    supabase = defaultSupabase,
    userId,
) {
    if (!userId) {
        return { subscription: null, plan: null, error: null }
    }

    // Try to get the user's subscription joined with the plan
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
        return { subscription: null, plan: null, error }
    }

    let subscription = data || null
    let plan = data?.plans || null

    // If user has no subscription yet, fall back to the \"Free\" plan
    if (!plan) {
        const { data: freePlan, error: planError } = await supabase
            .from('plans')
            .select('*')
            .eq('name', 'Free')
            .single()

        if (planError) {
            console.error('Error fetching default Free plan:', planError)
            return { subscription, plan: null, error: planError }
        }

        plan = freePlan
    }

    return { subscription, plan, error: null }
}

/**
 * Get usage information for phone numbers for a given user.
 * Returns the number of numbers used and the allowed limit from the plan.
 */
export async function getNumbersUsage(
    supabase = defaultSupabase,
    userId,
) {
    const { plan, error } = await fetchCurrentSubscriptionAndPlan(supabase, userId)

    if (error) {
        // Soft-fail: treat as unlimited if we can't load the plan
        return { used: 0, limit: -1, plan: null, error }
    }

    const limit =
        typeof plan?.numbers_limit === 'number' ? plan.numbers_limit : -1

    const { count, error: countError } = await supabase
        .from('numbers')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (countError) {
        console.error('Error counting numbers:', countError)
        return { used: 0, limit, plan, error: countError }
    }

    return {
        used: count || 0,
        limit,
        plan,
        error: null,
    }
}

/**
 * Get usage information for distinct instances (instance_id) for a given user.
 * Returns how many unique instances are used and the allowed limit from the plan.
 */
export async function getInstancesUsage(
    supabase = defaultSupabase,
    userId,
) {
    const { plan, error } = await fetchCurrentSubscriptionAndPlan(supabase, userId)

    if (error) {
        // Soft-fail: treat as unlimited if we can't load the plan
        return { used: 0, limit: -1, plan: null, error }
    }

    const limit =
        typeof plan?.instances_limit === 'number' ? plan.instances_limit : -1

    const { data, error: listError } = await supabase
        .from('numbers')
        .select('instance_id')
        .eq('user_id', userId)

    if (listError) {
        console.error('Error fetching instances for usage:', listError)
        return { used: 0, limit, plan, error: listError }
    }

    const uniqueIds = new Set(
        (data || [])
            .map((row) => row.instance_id)
            .filter((id) => !!id),
    )

    return {
        used: uniqueIds.size,
        limit,
        plan,
        error: null,
    }
}

/**
 * Get usage information for organization members for a given organization.
 * Uses the organization owner's plan \"invites_limit\" and counts
 * NON-owner members as used invites.
 */
export async function getOrgMembersUsage(
    supabase = defaultSupabase,
    orgId,
) {
    if (!orgId) {
        return { used: 0, totalMembers: 0, limit: -1, plan: null, error: null }
    }

    // Fetch organization to get owner_id
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id, owner_id')
        .eq('id', orgId)
        .single()

    if (orgError) {
        console.error('Error fetching organization:', orgError)
        return {
            used: 0,
            totalMembers: 0,
            limit: -1,
            plan: null,
            error: orgError,
        }
    }

    const ownerId = org.owner_id

    // Get owner's plan
    const { plan, error: planError } = await fetchCurrentSubscriptionAndPlan(
        supabase,
        ownerId,
    )

    if (planError) {
        return {
            used: 0,
            totalMembers: 0,
            limit: -1,
            plan: null,
            error: planError,
        }
    }

    const limit =
        typeof plan?.invites_limit === 'number' ? plan.invites_limit : -1

    // Fetch all members for the org to compute usage
    const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select('id, user_id')
        .eq('organization_id', orgId)

    if (membersError) {
        console.error('Error fetching organization members:', membersError)
        return {
            used: 0,
            totalMembers: 0,
            limit,
            plan,
            error: membersError,
        }
    }

    const totalMembers = members?.length || 0
    const nonOwnerMembers = (members || []).filter(
        (m) => m.user_id !== ownerId,
    ).length

    return {
        used: nonOwnerMembers,
        totalMembers,
        limit,
        plan,
        error: null,
    }
}


