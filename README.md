# Builders Admin Panel

פאנל ניהול ב-React לניהול משתמשים וחשבונות Green API.

## התקנה

```bash
cd admin-panel
npm install
```

## הרצה

```bash
npm run dev
```

האפליקציה תיפתח ב-`http://localhost:3000`

## Build לפרודקשן

```bash
npm run build
```

הקבצים יווצרו בתיקייה `dist/`

## מבנה הפרויקט

```
admin-panel/
├── src/
│   ├── components/      # Components של React
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UsersManagement.jsx
│   │   ├── AccountsManagement.jsx
│   │   └── Settings.jsx
│   ├── services/        # API calls
│   │   └── api.js
│   ├── styles/          # CSS files
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## API Endpoints

כל ה-API calls מתחברים ל-n8n webhooks:

- `/webhook/73539861-4649-4b44-ac5b-62a60677a9b8` - אימות משתמש
- `/webhook/getUsers` - רשימת משתמשים
- `/webhook/createUser` - יצירת משתמש
- `/webhook/updateUser` - עדכון משתמש
- `/webhook/deleteUser` - מחיקת משתמש

## תכונות

- ✅ התחברות משתמשים
- ✅ ניהול משתמשים (CRUD)
- 🚧 ניהול חשבונות (בפיתוח)
- 🚧 הגדרות (בפיתוח)

