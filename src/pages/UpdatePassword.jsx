import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Loader2 } from 'lucide-react'

export default function UpdatePassword() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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
                                type="password"
                                placeholder={t('auth.new_password')}
                                value={password}
                                required
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder={t('auth.confirm_password')}
                                value={confirmPassword}
                                required
                                minLength={6}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
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
