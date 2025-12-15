import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Sun, Moon, Languages, LogOut, User } from 'lucide-react';

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { toggleLang, lang } = useLanguage();
    const { user, signOut } = useAuth();
    const { t } = useTranslation();

    return (
        <header className="flex h-16 items-center border-b bg-background px-6 justify-between sticky top-0 z-10">
            <div className="font-semibold text-lg">{/* Breadcrumb placeholder */}</div>

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
                    <Button variant="ghost" size="icon" onClick={signOut} title={t('logout')}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
