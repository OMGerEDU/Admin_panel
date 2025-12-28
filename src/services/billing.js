import { supabase as defaultSupabase } from '../lib/supabaseClient'

const BILLING_PROVIDER_BASE_URL =
  import.meta.env.VITE_BILLING_PROVIDER_URL || 'https://billing-placeholder.local'

/**
 * Start a plan change / checkout flow.
 *
 * In production this should call your billing provider (Stripe/Paddle/etc)
 * to create a checkout session and return its redirect URL.
 *
 * Currently this function:
 *  - Immediately updates the user's subscription in Supabase
 *  - Inserts a placeholder billing_events record (if table exists)
 *  - Returns a deterministic placeholder redirect URL
 */
export async function startPlanCheckout({
  supabase = defaultSupabase,
  userId,
  plan,
  interval = 'month', // 'month' or 'year'
}) {
  if (!userId || !plan?.id) {
    throw new Error('Missing userId or plan information')
  }

  // Determine actual price based on interval
  const amount = interval === 'year' && plan.price_yearly != null
    ? plan.price_yearly
    : plan.price_monthly;

  // Placeholder checkout URL – in the future, replace with real provider URL
  const redirectUrl = `${BILLING_PROVIDER_BASE_URL}/checkout?plan=${encodeURIComponent(
    plan.id,
  )}&interval=${interval}`

  // Update subscription immediately (test environment – no real payment)
  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: plan.id,
      status: 'active',
      // In a real app we might store interval here too
    },
    { onConflict: 'user_id' },
  )

  if (error) {
    throw error
  }

  // Best-effort: log a billing event if the table exists
  try {
    await supabase.from('billing_events').insert({
      user_id: userId,
      plan_id: plan.id,
      amount: amount,
      currency: 'USD',
      status: 'paid',
      description: `Test env direct plan change to ${plan.name} (${interval})`,
    })
  } catch (eventError) {
    // Ignore missing table / RLS issues in dev, just log for debugging
    console.warn('Failed to insert billing event (placeholder):', eventError)
  }

  return { redirectUrl }
}


