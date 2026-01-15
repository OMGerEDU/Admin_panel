import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

import { Checkbox } from '../components/ui/checkbox' // Assuming Checkbox exists
import { Loader2, ArrowLeft, Lock, ShieldCheck } from 'lucide-react'
import { startPlanCheckout } from '../services/billing'
import { supabase } from '../lib/supabaseClient'

export default function Checkout() {
    const { t, i18n } = useTranslation()
    const { session } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const { plan, interval } = location.state || {}

    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: session?.user?.email || '',
        phone: '',
        country: '',
    })
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!plan) {
            navigate('/app/plans')
            return
        }
        fetchUserProfile()
    }, [plan, navigate, session])

    const fetchUserProfile = async () => {
        if (!session?.user?.id) return
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (data) {
                // Split full name if possible, or just use it
                const names = (data.full_name || '').split(' ')
                setFormData(prev => ({
                    ...prev,
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    email: data.email || session.user.email || '',
                    // Phone might not be in profile, check if user has it
                }))
            }
        } catch (err) {
            console.error('Error fetching profile', err)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!termsAccepted) {
            setError(t('checkout.error_terms') || 'You must agree to the terms and regulations.')
            return
        }

        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.country || !formData.email) {
            setError(t('checkout.error_fields') || 'Please fill in all required fields.')
            return
        }

        setProcessing(true)
        try {
            // Update profile with new info if needed? 
            // For now, we just proceed to billing
            // In a real app, we'd send this data to the billing provider

            const { redirectUrl } = await startPlanCheckout({
                supabase,
                userId: session.user.id,
                plan,
                interval: interval || 'month',
            })

            // Mock success
            // Refresh local data so UI reflects the new plan (this usually happens in Plans.jsx but we are redirecting)
            // We can redirect to a success page or back to Plans
            // For this task, we'll mimic the previous behavior but via this page

            // window.location.assign(redirectUrl) // In real app

            // For the mock implementation in startPlanCheckout, it updates the DB directly.
            // So we can just navigate back to stats/dashboard/plans with a success message.

            navigate('/app/plans', { state: { success: true, message: 'Plan updated successfully!' } })

        } catch (err) {
            console.error('Checkout error:', err)
            setError(err.message || 'Checkout failed')
        } finally {
            setProcessing(false)
        }
    }

    const isHebrew = i18n.language === 'he'

    if (!plan) return null

    const price = interval === 'year' ? plan.price_yearly : plan.price_monthly
    const billingPeriod = interval === 'year' ? (isHebrew ? 'לשנה' : '/year') : (isHebrew ? 'לחודש' : '/month')

    return (
        <div className="container max-w-2xl py-10">
            <Button variant="ghost" className="mb-4" onClick={() => navigate('/app/plans')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
            </Button>

            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                        <span>{t('checkout.title') || 'Secure Checkout'}</span>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>
                        {t('checkout.desc') || 'Complete your subscription details.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Plan Summary */}
                    <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                        <div>
                            <p className="font-medium">{plan.name} Plan</p>
                            <p className="text-sm text-muted-foreground capitalize">{interval}ly billing</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">${price}</p>
                            <p className="text-xs text-muted-foreground">{billingPeriod}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="firstName">
                                    {t('checkout.first_name') || 'First Name'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="lastName">
                                    {t('checkout.last_name') || 'Last Name'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                {t('checkout.email') || 'Email'} <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="phone">
                                    {t('checkout.phone') || 'Phone'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="541234567"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="country">
                                    {t('checkout.country') || 'Country'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="pt-4 pb-2">
                            <div className="flex items-start space-x-2 rtl:space-x-reverse">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {t('plans.accept_terms_prefix') || 'I agree to the'} {' '}
                                        <Link
                                            to="/terms"
                                            target="_blank"
                                            className="text-primary underline hover:underline"
                                            rel="noopener noreferrer"
                                        >
                                            {t('plans.terms_link') || 'Terms of Service'}
                                        </Link>
                                        {t('plans.accept_terms_suffix') || ' and Regulations'}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {t('checkout.terms_desc') || 'By checking this box, you confirm that you have read and agree to our Terms of Use and Privacy Policy.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" size="lg" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('common.processing') || 'Processing...'}
                                </>
                            ) : (
                                <>
                                    {t('checkout.pay_now') || 'Complete Payment'}
                                    <ShieldCheck className="ml-2 h-4 w-4 opacity-50" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t py-4">
                    <p className="text-xs text-muted-foreground text-center">
                        {t('checkout.secure_msg') || 'Payments are securely processed. We do not store credit card details.'}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
