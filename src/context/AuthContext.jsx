import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

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
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((error) => {
            clearTimeout(timeout);
            console.error('Failed to get session:', error);
            setLoading(false);
        });

        let subscription;
        try {
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
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

    const value = {
        session,
        user,
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
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
