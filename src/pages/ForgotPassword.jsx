import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2, ArrowLeft, Mail, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState({ type: '', text: '' })

    const { resetPassword } = useAuth()
    const { t } = useTranslation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const { error } = await resetPassword(email)
            if (error) throw error

            setMessage({
                type: 'success',
                text: t('auth.forgot_password.success_message')
            })
        } catch (error) {
            console.error('Reset password error:', error)
            setMessage({
                type: 'error',
                text: error.message || t('auth.forgot_password.error_message')
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: 'url("/1bgImage.jpg")',
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <Card className="w-full max-w-md shadow-2xl relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20">
                <CardHeader className="space-y-4 pb-2">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/fernslogo.png"
                            alt="Ferns Logo"
                            className="h-24 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        {t('auth.forgot_password.title')}
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        {t('auth.forgot_password.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {!message.type || message.type === 'error' ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="p-3 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-900/50 flex gap-2 items-start">
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{t('auth.browser_warning')}</span>
                            </div>

                            {message.type === 'error' && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50 animate-in fade-in slide-in-from-top-1">
                                    {message.text}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder={t('login.email')}
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="h-11 bg-white/50 dark:bg-slate-950/50 transition-colors focus:bg-white dark:focus:bg-slate-950"
                                />
                            </div>
                            <Button className="w-full h-11 text-base font-semibold shadow-md active:shadow-none transition-all hover:scale-[1.01]" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {t('auth.forgot_password.submit')}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-muted-foreground text-lg">
                                    {message.text}
                                </p>
                                <p className="font-semibold text-foreground bg-muted/50 py-2 px-4 rounded-full inline-block">
                                    {email}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                    <Link to="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline decoration-2 underline-offset-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('auth.back_to_login')}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
