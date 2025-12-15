import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    "en": {
        "translation": {
            "dashboard": "Dashboard",
            "numbers": "Numbers",
            "settings": "Settings",
            "logout": "Log Out",
            "welcome": "Welcome back",
            "status": "Status",
            "connected": "Connected",
            "disconnected": "Disconnected",
            "add_number": "Add Number",
            "webhooks": "Webhooks",
            "logs": "Logs",
            "automation": "Automation",
            "extension": "Extension",
            "common": {
                "name": "Name",
                "actions": "Actions",
                "filter": "Filter",
                "instance_id": "Instance ID",
                "last_seen": "Last Seen",
                "type": "Type",
                "date": "Date"
            },
            "numbers_page": {
                "title": "Numbers",
                "subtitle": "Manage your Green-API instances.",
                "list_title": "Instances",
                "list_desc": "List of all connected WhatsApp instances.",
                "search_placeholder": "Filter instances..."
            },
            "login": {
                "title": "Welcome Back",
                "subtitle": "Enter your credentials to access your account",
                "email": "Email",
                "password": "Password",
                "submit": "Sign In"
            },
            "landing": {
                "hero_title": "Manage Green-API Numbers in One Place",
                "hero_subtitle": "Enterprise-grade dashboard for monitoring, logging, and automating your WhatsApp infrastructure.",
                "get_started": "Get Started",
                "features": "Features",
                "pricing": "Pricing",
                "plans": {
                    "free": "Free",
                    "pro": "Pro",
                    "agency": "Agency",
                    "features": "Features",
                    "select": "Choose Plan"
                }
            },
            "create_org": "Create Organization",
            "create": "Create"
        }
    },
    "he": {
        "translation": {
            "dashboard": "לוח בקרה",
            "numbers": "מספרים",
            "settings": "הגדרות",
            "logout": "התנתק",
            "welcome": "ברוך שובך",
            "status": "סטטוס",
            "connected": "מחובר",
            "disconnected": "מנותק",
            "add_number": "הוסף מספר",
            "webhooks": "Webhooks",
            "logs": "לוגים",
            "automation": "אוטומציה",
            "extension": "תוסף",
            "common": {
                "name": "שם",
                "actions": "פעולות",
                "filter": "סינון",
                "instance_id": "מזהה מופע",
                "last_seen": "נראה לאחרונה",
                "type": "סוג",
                "date": "תאריך"
            },
            "numbers_page": {
                "title": "מספרים",
                "subtitle": "נהל את מופעי ה-Green-API שלך.",
                "list_title": "מופעים",
                "list_desc": "רשימת כל מופעי ה-WhatsApp המחוברים.",
                "search_placeholder": "סנן מופעים..."
            },
            "login": {
                "title": "ברוכים הבאים",
                "subtitle": "הכנס את פרטי ההתחברות שלך",
                "email": "אימייל",
                "password": "סיסמה",
                "submit": "התחבר"
            },
            "landing": {
                "hero_title": "נהל מספרי Green-API במקום אחד",
                "hero_subtitle": "מערכת ארגונית לניטור, לוגים ואוטומציה של תשתיות ה-WhatsApp שלך.",
                "get_started": "התחל עכשיו",
                "features": "פיצ'רים",
                "pricing": "מחירים",
                "plans": {
                    "free": "חינם",
                    "pro": "מקצועי",
                    "agency": "סוכנות",
                    "features": "פיצ'רים כוללים",
                    "select": "בחר תוכנית"
                }
            },
            "create_org": "צור ארגון",
            "create": "צור"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
