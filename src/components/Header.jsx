import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Sun, Moon, Languages, LogOut, ChevronRight, Home } from 'lucide-react';

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { toggleLang, lang } = useLanguage();
    const { user, signOut } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

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
        };

        if (parts[0] === 'app' && parts[1]) {
            const page = parts[1];
            if (routeMap[page]) {
                breadcrumbs.push({ label: routeMap[page], path: `/app/${page}` });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="flex h-16 items-center border-b bg-background px-6 justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2 font-semibold text-lg">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-foreground">{crumb.label}</span>
                        ) : (
                            <button
                                onClick={() => navigate(crumb.path)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleLang} title={lang === 'en' ? 'Switch to Hebrew' : 'Switch to English'}>
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Display Language</span>
                </Button>

                <div className="flex items-center gap-2 border-l pl-4 ml-2 rtl:border-r rtl:border-l-0 rtl:pr-4 rtl:pl-0">
                    <div className="text-sm font-medium hidden sm:block">
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
