import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('auth.forgot_password.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('auth.forgot_password.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!message.type || message.type === 'error' ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {message.type === 'error' && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
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
                                />
                            </div>
                            <Button className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('auth.forgot_password.submit')}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <p className="text-muted-foreground">
                                {message.text}
                            </p>
                            <p className="text-sm font-medium">
                                {email}
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('auth.back_to_login')}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
