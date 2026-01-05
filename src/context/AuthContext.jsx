import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();
const REMEMBER_ME_KEY = 'rememberMe';

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set loading to false after a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            clearTimeout(timeout);
            if (error) {
                console.error('Error getting session:', error);
                // Don't block app if auth fails - might be 404 from missing schema
            }

            let rememberMe = false;
            try {
                if (typeof window !== 'undefined') {
                    rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
                }
            } catch (e) {
                console.error('Error reading rememberMe flag:', e);
            }

            if (rememberMe) {
                setSession(session);
                setUser(session?.user ?? null);
            } else {
                setSession(null);
                setUser(null);
            }
            setLoading(false);
        }).catch((error) => {
            clearTimeout(timeout);
            console.error('Failed to get session:', error);
            setLoading(false);
        });

        let subscription;
        try {
            const { data } = supabase.auth.onAuthStateChange((event, session) => {
                // Ignore INITIAL_SESSION here - it's handled by getSession above,
                // which also respects the "remember me" preference.
                if (event === 'INITIAL_SESSION') {
                    return;
                }

                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });
            subscription = data?.subscription;
        } catch (error) {
            console.error('Failed to set up auth listener:', error);
            setLoading(false);
        }

        return () => {
            clearTimeout(timeout);
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (credentials) => {
        return await supabase.auth.signInWithPassword(credentials);
    };

    const signUp = async (credentials) => {
        return await supabase.auth.signUp(credentials);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setSession(null);
            setUser(null);
        }
        return { error };
    };

    const resetPassword = async (email) => {
        // Redirect to the update-password route in our app
        const redirectTo = `${window.location.origin}/update-password`;
        return await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });
    };

    const updatePassword = async (newPassword) => {
        return await supabase.auth.updateUser({ password: newPassword });
    };

    const value = {
        session,
        user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
