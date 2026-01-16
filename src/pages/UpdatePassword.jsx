import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function UpdatePassword() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const { updatePassword, session } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Protected route logic handled by layout or here? 
    // Usually update password requires an active session (which the email link provides via hash fragment)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return setError(t('auth.passwords_do_not_match'))
        }

        setLoading(true)
        setError('')

        try {
            const { error } = await updatePassword(password)
            if (error) throw error

            navigate('/app/dashboard', { replace: true })
        } catch (error) {
            console.error('Update password error:', error)
            setError(error.message || t('auth.update_password.error_message'))
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
                        {t('auth.update_password.title')}
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        {t('auth.update_password.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50 animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                value={session?.user?.email || ''}
                                disabled
                                className="h-11 bg-muted/50 opacity-70 cursor-not-allowed border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('auth.new_password')}
                                value={password}
                                required
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full h-11 pr-10 bg-white/50 dark:bg-slate-950/50 transition-colors focus:bg-white dark:focus:bg-slate-950"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showPassword ? t('auth.hide_password') : t('auth.show_password')}
                                </span>
                            </Button>
                        </div>
                        <div className="space-y-2 relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('auth.confirm_password')}
                                value={confirmPassword}
                                required
                                minLength={6}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                className="w-full h-11 pr-10 bg-white/50 dark:bg-slate-950/50 transition-colors focus:bg-white dark:focus:bg-slate-950"
                            />
                            {/* We share the visibility toggle state for both fields for better UX */}
                        </div>
                        <Button className="w-full h-11 text-base font-semibold shadow-md active:shadow-none transition-all hover:scale-[1.01]" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {t('auth.update_password.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
