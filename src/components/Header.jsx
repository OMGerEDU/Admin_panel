import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Sun, Moon, Languages, LogOut, ChevronRight, Home, Sparkles, Crown, Building2, Menu } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { fetchCurrentSubscriptionAndPlan } from '../lib/planLimits';
import { UpdatesDropdown } from './UpdatesDropdown';

export function Header({ onMobileMenuToggle }) {
    const { theme, toggleTheme } = useTheme();
    const { toggleLang, lang } = useLanguage();
    const { user, signOut, isBetaTester } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [planName, setPlanName] = React.useState(null);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    React.useEffect(() => {
        let isMounted = true;

        const loadPlan = async () => {
            if (!user?.id) {
                if (isMounted) setPlanName(null);
                return;
            }

            try {
                const { plan, error } = await fetchCurrentSubscriptionAndPlan(
                    supabase,
                    user.id,
                );
                if (!isMounted) return;
                if (!error && plan?.name) {
                    setPlanName(plan.name);
                } else {
                    setPlanName(null);
                }
            } catch (err) {
                console.error('Error loading user plan in header:', err);
                if (isMounted) setPlanName(null);
            }
        };

        loadPlan();

        return () => {
            isMounted = false;
        };
    }, [user?.id]);

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const parts = path.split('/').filter(Boolean);

        if (parts.length === 0 || (parts.length === 1 && parts[0] === 'app')) {
            return [{ label: t('dashboard'), path: '/app/dashboard' }];
        }

        const breadcrumbs = [{ label: t('dashboard'), path: '/app/dashboard' }];

        const routeMap = {
            'dashboard': t('dashboard'),
            'chats': t('chats'),
            'numbers': t('numbers'),
            'webhooks': t('webhooks'),
            'logs': t('logs'),
            'automation': t('automation'),
            'settings': t('settings'),
            'extension': t('extension'),
            'plans': t('landing.plans.select'),
            'documentation': 'Documentation', // Add translation if needed, hardcode for now or use key
        };

        // Handle nested routes better
        if (parts[0] === 'app') {
            let currentPath = '/app';
            for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                currentPath += `/${part}`;

                // Skip if it's an ID (simple heuristic: long, alphanumeric, or specifically "new")
                // Adjust logic as needed for specific routes like chats/:id

                if (part === 'new' && parts[i - 1] === 'scheduled') {
                    breadcrumbs.push({ label: 'New Message', path: currentPath });
                    continue;
                }

                if (routeMap[part]) {
                    breadcrumbs.push({ label: routeMap[part], path: currentPath });
                } else if (i === parts.length - 1 && parts[i - 1] === 'organization') {
                    // Maybe handle org ID?
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2 font-semibold text-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2"
                    onClick={onMobileMenuToggle}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-foreground text-sm md:text-base truncate max-w-[150px] md:max-w-none">{crumb.label}</span>
                        ) : (
                            <button
                                onClick={() => navigate(crumb.path)}
                                className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                            >
                                {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {isBetaTester && (
                    <div className="hidden md:flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm" title="Beta Mode Active">
                        BETA
                    </div>
                )}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleLang} title={lang === 'en' ? 'Switch to Hebrew' : 'Switch to English'}>
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Display Language</span>
                </Button>

                <UpdatesDropdown />

                {planName && (
                    <button
                        type="button"
                        onClick={() => navigate('/app/plans')}
                        className="hidden md:flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20 transition-colors"
                        title={t('landing.plans.select')}
                    >
                        {planName.toLowerCase() === 'free' && (
                            <Sparkles className="h-3 w-3" />
                        )}
                        {planName.toLowerCase() === 'pro' && (
                            <Crown className="h-3 w-3" />
                        )}
                        {planName.toLowerCase() === 'agency' && (
                            <Building2 className="h-3 w-3" />
                        )}
                        <span>{planName}</span>
                    </button>
                )}
                <div className="flex items-center gap-2 border-l pl-4 ml-2 rtl:border-r rtl:border-l-0 rtl:pr-4 rtl:pl-0">
                    <div className="text-sm font-medium hidden md:block">
                        {user?.email}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} title={t('logout')}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
