import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Check, Sparkles, Crown, Building2, Loader2, X } from 'lucide-react'
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
  const navigate = useNavigate()
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

  const handleSubscribe = (plan) => {
    navigate('/app/checkout', {
      state: {
        plan,
        interval: billingInterval
      }
    })
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('landing.pricing.plans.select')}</h2>
        <p className="text-muted-foreground">{t('landing.pricing.subheadline')}</p>

      </div>

      {/* Current plan & usage */}
      <Card>
        <CardHeader>
          <CardTitle>{t('landing.pricing.plans.select')}</CardTitle>
          <CardDescription>{t('landing.pricing.subheadline')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('settings_page.current_plan')}</p>
            <p className="text-lg font-semibold">
              {currentSubscription?.plans?.name || 'Free'}
            </p>
            {currentSubscription && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('landing.pricing.plans.status')}: {currentSubscription.status}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('landing.pricing.plans.numbers_instances')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {usage.numbersLimit === -1
                ? `${usage.numbersUsed} ${t('landing.pricing.plans.numbers')} (${t('landing.pricing.plans.unlimited')})`
                : `${usage.numbersUsed} / ${usage.numbersLimit} ${t('landing.pricing.plans.numbers')}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {usage.instancesLimit === -1
                ? `${usage.instancesUsed} ${t('landing.pricing.plans.instances')} (${t('landing.pricing.plans.unlimited')})`
                : `${usage.instancesUsed} / ${usage.instancesLimit} ${t('landing.pricing.plans.instances')}`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('landing.pricing.plans.team_members')}</p>
            {usage.membersUsed == null ? (
              <p className="text-xs text-muted-foreground mt-1">
                {t('settings_page.no_org_owned')}
              </p>
            ) : usage.membersLimit === -1 ? (
              <p className="text-xs text-muted-foreground mt-1">
                {usage.membersUsed} {t('landing.pricing.plans.team_members')} ({t('landing.pricing.plans.unlimited')}){' '}
                {usage.orgName ? `· ${usage.orgName}` : ''}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {usage.membersUsed} / {usage.membersLimit} {t('landing.pricing.plans.team_members')}{' '}
                {usage.orgName ? `· ${usage.orgName}` : ''}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings_page.billing_history')}</CardTitle>
          <CardDescription>
            {t('settings_page.recent_plan_changes')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('settings_page.no_billing_events')}
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
                  {t('landing.pricing.plans.select')}: <span className="font-bold">{currentSubscription.plans?.name}</span> ({currentSubscription.status})
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
            {t('landing.pricing.plans.month') || 'Monthly'}
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${billingInterval === 'year' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t('landing.pricing.plans.yearly') || 'Yearly'}
          </button>

          {/* Discount Badge */}
          <span className="absolute -top-3 -right-6 rtl:right-auto rtl:-left-6 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 animate-pulse">
            {t('landing.pricing.plans.save_25')}
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
                  <div className="text-right">
                    <div className="text-4xl font-bold flex flex-col items-end">
                      {billingInterval === 'year' && plan.price_monthly > 0 && (
                        <span className="text-lg font-normal text-muted-foreground line-through mb-[-4px]">
                          ${plan.price_monthly}
                        </span>
                      )}
                      <div>
                        ${billingInterval === 'year' ? Math.round(plan.price_yearly / 12) : plan.price_monthly}
                        <span className="text-base font-normal text-muted-foreground">/{t('landing.pricing.plans.month')}</span>
                      </div>
                    </div>
                    {billingInterval === 'year' && plan.price_monthly > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="line-through opacity-70 mr-1">${plan.price_monthly * 12}</span>
                        ${plan.price_yearly} {t('landing.pricing.plans.billed_yearly') || 'billed yearly'}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="mb-8 space-y-3 text-sm flex-grow">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.numbers_limit === -1 ? t('landing.pricing.plans.unlimited') : plan.numbers_limit} {t('landing.pricing.plans.numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.numbers_limit === -1 ? t('landing.pricing.plans.unlimited') : plan.numbers_limit} {t('landing.pricing.plans.numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.invites_limit === -1 ? t('landing.pricing.plans.unlimited') : plan.invites_limit} {t('landing.pricing.plans.team_members')}
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.name === 'Free' ? (
                      <X className="h-4 w-4 text-muted-foreground/50" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    <span className={plan.name === 'Free' ? 'text-muted-foreground' : ''}>
                      {t('landing.pricing.plans.scheduled_messages')}
                    </span>
                  </li>
                  {plan.name !== 'Free' && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>
                        {plan.name === 'Organization' || plan.name === 'Agency'
                          ? t('landing.pricing.plans.priority_support')
                          : t('landing.pricing.plans.customer_support')}
                      </span>
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
                    ? t('landing.pricing.plans.select')
                    : processingPlanId === plan.id
                      ? 'Processing...'
                      : t('landing.pricing.plans.select')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div >
  )
}
