import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
        // Sync i18next language with our context
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    // Proxy to i18next so everything uses a single translation source
    const t = (key, options) => i18n.t(key, options);

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'he' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
