import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        dashboard: "Dashboard",
        plans: "Plans",
        numbers: "Numbers",
        settings: "Settings",
        logout: "Log Out",
        welcome: "Welcome back",
        your_orgs: "Your Organizations",
        create_org: "Create New Organization",
        org_name: "Organization Name",
        create: "Create",
        invite_member: "Invite Member",
        user_email: "User Email",
        invite: "Invite",
        choose_plan: "Choose Your Plan",
        current_plan: "Current Plan",
        managed_numbers: "Managed Numbers",
        add_number: "Add Number",
        status: "Status"
    },
    he: {
        dashboard: "לוח בקרה",
        plans: "תוכניות",
        numbers: "מספרים",
        settings: "הגדרות",
        logout: "התנתק",
        welcome: "ברוך שובך",
        your_orgs: "הארגונים שלך",
        create_org: "צור ארגון חדש",
        org_name: "שם הארגון",
        create: "צור",
        invite_member: "הזמן משתמש",
        user_email: "אימייל משתמש",
        invite: "הזמן",
        choose_plan: "בחר תוכנית",
        current_plan: "תוכנית נוכחית",
        managed_numbers: "מספרים מנוהלים",
        add_number: "הוסף מספר",
        status: "סטטוס"
    }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = (key) => translations[lang][key] || key;

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
