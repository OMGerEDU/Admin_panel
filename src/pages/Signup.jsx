import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Signup() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || email.split('@')[0],
                    },
                    emailRedirectTo: `${window.location.origin}/app/dashboard`,
                }
            });

            if (signUpError) {
                setError(signUpError.message || 'Failed to create account');
                return;
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                // Email confirmation required
                setSuccess(true);
                setError('');
            } else if (data.session) {
                // Auto-confirmed, redirect to dashboard
                navigate('/app/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription>
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                                Account created! Please check your email to confirm your account.
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none">
                                Full Name
                            </label>
                            <Input 
                                id="name" 
                                placeholder="John Doe" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                {t('login.email')}
                            </label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">
                                {t('login.password')}
                            </label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required 
                            />
                            <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" disabled={loading || success}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Creating account..." : success ? "Check your email" : "Create Account"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                {t('login.submit')}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
