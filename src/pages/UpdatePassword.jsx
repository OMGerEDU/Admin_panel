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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('auth.update_password.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('auth.update_password.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                value={session?.user?.email || ''}
                                disabled
                                className="bg-muted opacity-50 cursor-not-allowed"
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
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
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
                                className="pr-10"
                            />
                            {/* We share the visibility toggle state for both fields for better UX, 
                                but if we wanted independent toggles we'd need separate state. 
                                Usually one toggle controls both for password reset/creation. */}
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('auth.update_password.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
