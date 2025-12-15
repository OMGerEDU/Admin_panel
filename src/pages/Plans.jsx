import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Plans() {
  const { session } = useAuth()
  const { t } = useLanguage()
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

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">{t('choose_plan')}</h1>

      {currentSubscription && (
        <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)] p-4 rounded-lg mb-8 flex items-center gap-2 text-[var(--accent-primary)]">
          <span className="text-xl">💎</span>
          <span>{t('current_plan')}: <span className="font-bold">{currentSubscription.plans?.name}</span> ({currentSubscription.status})</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentSubscription?.plan_id === plan.id;

          return (
            <div key={plan.id} className={`card flex flex-col ${isCurrent ? 'border-[var(--accent-primary)] shadow-[var(--accent-glow)]' : ''}`}>
              <h2 className="text-2xl font-bold mb-2 text-[var(--accent-secondary)]">{plan.name}</h2>
              <div className="text-4xl font-bold mb-6">
                ${plan.price_monthly}<span className="text-base font-normal text-[var(--text-secondary)]">/mo</span>
              </div>

              <ul className="mb-8 flex-grow space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--status-success)]">✓</span>
                  {plan.numbers_limit === -1 ? 'Unlimited' : plan.numbers_limit} Phone Numbers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--status-success)]">✓</span>
                  {plan.instances_limit === -1 ? 'Unlimited' : plan.instances_limit} Instances
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--status-success)]">✓</span>
                  {plan.invites_limit === -1 ? 'Unlimited' : plan.invites_limit} Invites
                </li>
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-lg font-bold transition-all ${isCurrent
                    ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)] cursor-default'
                    : 'btn-primary'
                  }`}
              >
                {isCurrent ? 'Active Plan' : 'Subscribe Now'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
