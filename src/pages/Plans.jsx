import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Check } from 'lucide-react'

export default function Plans() {
  const { session } = useAuth()
  const { t } = useTranslation()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
    fetchSubscription()
  }, [])

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
      .single()

    if (error && error.code !== 'PGRST116') console.error('Error fetching sub:', error)
    else setCurrentSubscription(data)
    setLoading(false)
  }

  const handleSubscribe = async (planId) => {
    const { error } = await supabase.from('subscriptions').upsert({
      user_id: session.user.id,
      plan_id: planId,
      status: 'active'
    }, { onConflict: 'user_id' })

    if (error) alert('Error subscribing: ' + error.message)
    else {
      alert('Subscribed successfully!')
      fetchSubscription()
    }
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('landing.plans.select')}</h2>
        <p className="text-muted-foreground">{t('landing.pricing')}</p>
      </div>

      {currentSubscription && (
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentSubscription?.plan_id === plan.id;

          return (
            <Card key={plan.id} className={`flex flex-col ${isCurrent ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  ${plan.price_monthly}
                  <span className="text-base font-normal text-muted-foreground">{t('landing.plans.month')}</span>
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
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent}
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                >
                  {isCurrent ? t('landing.plans.select') : t('landing.plans.select')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
