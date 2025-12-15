import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            let result
            if (isSignUp) {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0],
                        }
                    }
                })
            } else {
                result = await supabase.auth.signInWithPassword({ email, password })
            }

            const { error } = result

            if (error) {
                alert(error.error_description || error.message) // Could use Toast here later
            } else {
                if (isSignUp) {
                    alert('Check your email for the confirmation link!')
                } else {
                    navigate('/app/dashboard', { replace: true })
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    {isSignUp ? t('create_org') : t('login.title')}
                </CardTitle>
                <CardDescription className="text-center">
                    {t('login.subtitle')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder={t('login.email')}
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder={t('login.password')}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSignUp ? t('create') : t('login.submit')}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-muted-foreground">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
                    >
                        {isSignUp ? t('login.submit') : t('create')}
                    </button>
                </div>
            </CardFooter>
        </Card>
    )
}
