import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const REMEMBER_ME_KEY = 'rememberMe'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
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
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        {t('login.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/50 animate-in fade-in slide-in-from-top-1">
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
                                className="h-11 bg-white/50 dark:bg-slate-950/50 transition-colors focus:bg-white dark:focus:bg-slate-950"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('login.password')}
                                    value={password}
                                    required
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
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline decoration-2 underline-offset-2"
                                >
                                    {t('login.forgot_password')}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                    />
                                </div>
                                <span className="group-hover:text-foreground transition-colors">{t('login.remember_me')}</span>
                            </label>
                        </div>
                        <Button className="w-full h-11 text-base font-semibold shadow-md active:shadow-none transition-all hover:scale-[1.01]" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {t('login.submit')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-semibold decoration-2 underline-offset-2 transition-colors">
                            {t('create')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
