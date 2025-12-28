import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Check, Sparkles, Crown, Building2, Loader2 } from 'lucide-react'
import { getNumbersUsage, getInstancesUsage, getOrgMembersUsage } from '../lib/planLimits'
import { startPlanCheckout } from '../services/billing'

const getPlanIcon = (name) => {
  const key = (name || '').toLowerCase()
  if (key === 'free') {
    return <Sparkles className="h-5 w-5 text-primary" />
  }
  if (key === 'pro') {
    return <Crown className="h-5 w-5 text-yellow-500" />
  }
  if (key === 'agency') {
    return <Building2 className="h-5 w-5 text-purple-500" />
  }
  return null
}

export default function Plans() {
  const { session } = useAuth()
  const { t } = useTranslation()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState({
    numbersUsed: 0,
    numbersLimit: -1,
    instancesUsed: 0,
    instancesLimit: -1,
    membersUsed: null,
    membersLimit: null,
    orgName: null,
  })
  const [billingEvents, setBillingEvents] = useState([])
  const [processingPlanId, setProcessingPlanId] = useState(null)
  const [billingInterval, setBillingInterval] = useState('month') // 'month' | 'year'

  useEffect(() => {
    fetchPlans()
    fetchSubscription()
    fetchUsage()
    fetchBillingEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*').order('price_monthly')
    if (error) console.error('Error fetching plans:', error)
    else setPlans(data || [])
  }

  const fetchSubscription = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', session.user.id)
      .limit(1)
      .maybeSingle()

    if (error) console.error('Error fetching sub:', error)
    else setCurrentSubscription(data)
    setLoading(false)
  }


  const fetchUsage = async () => {
    if (!session?.user?.id) return

    try {
      const userId = session.user.id

      const { used: numbersUsed, limit: numbersLimit } = await getNumbersUsage(
        supabase,
        userId,
      )
      const { used: instancesUsed, limit: instancesLimit } =
        await getInstancesUsage(supabase, userId)

      // Try to find an organization the user owns to compute member usage
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, owner_id')
        .eq('owner_id', userId)
        .limit(1)
        .single()

      let membersUsed = null
      let membersLimit = null
      let orgName = null

      if (!orgError && org) {
        const { used, limit } = await getOrgMembersUsage(supabase, org.id)
        membersUsed = used
        membersLimit = limit
        orgName = org.name
      }

      setUsage({
        numbersUsed: numbersUsed || 0,
        numbersLimit: typeof numbersLimit === 'number' ? numbersLimit : -1,
        instancesUsed: instancesUsed || 0,
        instancesLimit:
          typeof instancesLimit === 'number' ? instancesLimit : -1,
        membersUsed,
        membersLimit,
        orgName,
      })
    } catch (err) {
      console.error('Error fetching plan usage:', err)
    }
  }

  const fetchBillingEvents = async () => {
    if (!session?.user?.id) return

    try {
      const { data, error } = await supabase
        .from('billing_events')
        .select('id, plan_id, amount, currency, status, description, created_at, plans(name)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        // If table doesn't exist yet, fail silently for now
        if (error.code !== '42P01') {
          console.error('Error fetching billing events:', error)
        }
        setBillingEvents([])
      } else {
        setBillingEvents(data || [])
      }
    } catch (err) {
      console.error('Error fetching billing events:', err)
      setBillingEvents([])
    }
  }

  const handleSubscribe = async (plan) => {
    if (!session?.user?.id) return
    setProcessingPlanId(plan.id)
    try {
      const { redirectUrl } = await startPlanCheckout({
        supabase,
        userId: session.user.id,
        plan,
        interval: billingInterval,
      })

      // In production, you would redirect the user to the billing provider:
      // window.location.assign(redirectUrl)
      console.log('Billing redirect URL (placeholder):', redirectUrl)

      // Refresh local data so UI reflects the new plan
      await Promise.all([
        fetchSubscription(),
        fetchUsage(),
        fetchBillingEvents(),
      ])
      // Optional: minimal UX feedback for test environment
      // eslint-disable-next-line no-alert
      alert('Plan updated (test environment, no real payment processed).')
    } catch (error) {
      console.error('Error starting plan checkout:', error)
      // eslint-disable-next-line no-alert
      alert('Error updating plan: ' + (error.message || 'Unknown error'))
    } finally {
      setProcessingPlanId(null)
    }
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('landing.plans.select')}</h2>
        <p className="text-muted-foreground">{t('landing.pricing')}</p>

      </div>

      {/* Current plan & usage */}
      <Card>
        <CardHeader>
          <CardTitle>{t('landing.plans.select')}</CardTitle>
          <CardDescription>{t('landing.pricing')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current plan</p>
            <p className="text-lg font-semibold">
              {currentSubscription?.plans?.name || 'Free'}
            </p>
            {currentSubscription && (
              <p className="text-xs text-muted-foreground mt-1">
                Status: {currentSubscription.status}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Numbers & instances</p>
            <p className="text-xs text-muted-foreground mt-1">
              {usage.numbersLimit === -1
                ? `${usage.numbersUsed} numbers (unlimited)`
                : `${usage.numbersUsed} / ${usage.numbersLimit} numbers`}
            </p>
            <p className="text-xs text-muted-foreground">
              {usage.instancesLimit === -1
                ? `${usage.instancesUsed} instances (unlimited)`
                : `${usage.instancesUsed} / ${usage.instancesLimit} instances`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Team members</p>
            {usage.membersUsed == null ? (
              <p className="text-xs text-muted-foreground mt-1">
                No organization owned yet.
              </p>
            ) : usage.membersLimit === -1 ? (
              <p className="text-xs text-muted-foreground mt-1">
                {usage.membersUsed} members (unlimited){' '}
                {usage.orgName ? `· ${usage.orgName}` : ''}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {usage.membersUsed} / {usage.membersLimit} members{' '}
                {usage.orgName ? `· ${usage.orgName}` : ''}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Billing history</CardTitle>
          <CardDescription>
            Recent plan changes and payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No billing events found yet.
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              {billingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between border-b last:border-b-0 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {ev.plans?.name || 'Plan change'} · {ev.status}
                    </p>
                    {ev.description && (
                      <p className="text-xs text-muted-foreground">
                        {ev.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {ev.amount != null && (
                      <p className="font-semibold">
                        {ev.currency || 'USD'} {ev.amount}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(ev.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {
        currentSubscription && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-primary">
                <span className="text-xl">💎</span>
                <span>
                  {t('landing.plans.select')}: <span className="font-bold">{currentSubscription.plans?.name}</span> ({currentSubscription.status})
                </span>
              </div>
            </CardContent>
          </Card>
        )
      }

      <div className="flex justify-center mb-6">
        <div className="relative bg-muted p-1 rounded-lg inline-flex items-center">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${billingInterval === 'month' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t('landing.plans.monthly') || 'Monthly'}
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${billingInterval === 'year' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t('landing.plans.yearly') || 'Yearly'}
          </button>

          {/* Discount Badge */}
          <span className="absolute -top-3 -right-6 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 animate-pulse">
            SAVE 25%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentSubscription?.plan_id === plan.id;
          const icon = getPlanIcon(plan.name);

          return (
            <Card key={plan.id} className={`flex flex-col ${isCurrent ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <div className="text-4xl font-bold">
                    ${billingInterval === 'year' ? Math.round(plan.price_yearly / 12) : plan.price_monthly}
                    <span className="text-base font-normal text-muted-foreground">/{t('landing.plans.month')}</span>
                  </div>
                  {billingInterval === 'year' && plan.price_monthly > 0 && (
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      ${plan.price_yearly} {t('landing.plans.billed_yearly') || 'billed yearly'}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="mb-8 space-y-3 text-sm flex-grow">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.numbers_limit === -1 ? t('landing.plans.unlimited') : plan.numbers_limit} {t('landing.plans.numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.instances_limit === -1 ? t('landing.plans.unlimited') : plan.instances_limit} {t('numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.invites_limit === -1 ? t('landing.plans.unlimited') : plan.invites_limit} {t('landing.plans.team_members')}
                  </li>
                  {plan.name !== 'Free' && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-primary">Scheduled Messages</span>
                    </li>
                  )}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrent || processingPlanId === plan.id}
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                >
                  {processingPlanId === plan.id && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isCurrent
                    ? t('landing.plans.select')
                    : processingPlanId === plan.id
                      ? 'Processing...'
                      : t('landing.plans.select')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div >
  )
}
