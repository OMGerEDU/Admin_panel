import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const REMEMBER_ME_KEY = 'rememberMe'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [rememberMe, setRememberMe] = useState(() => {
        if (typeof window === 'undefined') return false
        try {
            return localStorage.getItem(REMEMBER_ME_KEY) === 'true'
        } catch {
            return false
        }
    })

    const navigate = useNavigate()
    const { signIn, user } = useAuth()
    const { t } = useTranslation()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/app/dashboard', { replace: true })
        }
    }, [user, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error: signInError } = await signIn({ email, password })

            if (signInError) {
                setError(signInError.message || 'Invalid email or password')
                return
            }

            // Persist "remember me" preference only on successful login
            try {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false')
                }
            } catch (storageError) {
                console.error('Failed to persist rememberMe preference:', storageError)
            }

            // Success - AuthContext will update and redirect
            if (data?.session) {
                navigate('/app/dashboard', { replace: true })
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('login.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                                {error}
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
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder={t('login.password')}
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>{t('login.remember_me')}</span>
                            </label>
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('login.submit')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            {t('create')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
