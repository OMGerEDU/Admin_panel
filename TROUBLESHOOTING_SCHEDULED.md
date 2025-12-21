# פתרון בעיות - Scheduled Messages לא נשלחות

## בדיקות מהירות

### 1. בדוק אם יש הודעות ב-pending

הרץ ב-Supabase SQL Editor:

```sql
SELECT 
  id,
  message,
  scheduled_at,
  status,
  is_active,
  NOW() as current_utc_time,
  scheduled_at <= NOW() as is_due
FROM scheduled_messages
WHERE status = 'pending'
  AND is_active = true
ORDER BY scheduled_at ASC;
```

**אם `is_due = true` אבל ההודעה לא נשלחת:**
- ה-cron job כנראה לא רץ
- או שה-API לא נקרא

### 2. בדוק אם ה-Cron Job קיים ורץ

```sql
-- בדוק אם ה-cron job קיים
SELECT * FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';

-- בדוק את ה-execution history
SELECT 
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'dispatch_scheduled_messages')
ORDER BY start_time DESC
LIMIT 10;
```

**אם אין cron job:**
- צריך ליצור אותו (ראה `SUPABASE_CRON_SETUP.md`)

**אם יש שגיאות ב-return_message:**
- בדוק מה השגיאה
- בדוק שה-URL נכון
- בדוק שה-CRON_SECRET נכון

### 3. בדוק את ה-API ידנית

```bash
curl -X POST https://your-domain.vercel.app/api/dispatch \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**אם זה לא עובד:**
- בדוק את ה-logs ב-Vercel
- בדוק שה-CRON_SECRET נכון

### 4. בדוק את ה-TimeZone Conversion

הבעיה הנפוצה ביותר היא שהתאריך נשמר לא נכון ב-UTC.

**בדוק את ה-scheduled_at ב-DB:**

```sql
SELECT 
  id,
  scheduled_at,
  -- מה זה ב-Israel timezone
  scheduled_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jerusalem' as israel_time,
  -- מה זה עכשיו ב-UTC
  NOW() as current_utc,
  -- האם זה עבר?
  scheduled_at <= NOW() as is_due
FROM scheduled_messages
WHERE status = 'pending'
ORDER BY scheduled_at;
```

**אם ה-israel_time לא תואם למה שהזנת:**
- יש בעיה בהמרה של timezone
- צריך לתקן את הפונקציה `convertIsraelTimeToUTC`

### 5. הרץ את סקריפט ה-Debug

```bash
node scripts/debug_scheduled.js
```

זה יראה לך:
- כל ההודעות המתוזמנות
- אילו הודעות ב-pending
- אילו הודעות due
- האם ה-cron job קיים
- האם יש recipients

## בעיות נפוצות ופתרונות

### בעיה 1: Cron Job לא קיים

**תסמינים:**
- ההודעות לא נשלחות
- אין execution history

**פתרון:**
1. צור את ה-cron job (ראה `SUPABASE_CRON_SETUP.md`)
2. ודא שה-URL וה-CRON_SECRET נכונים

### בעיה 2: Timezone Conversion שגוי

**תסמינים:**
- ההודעות נשמרות אבל לא נשלחות
- ה-scheduled_at ב-DB לא תואם למה שהזנת

**פתרון:**
1. בדוק את ה-scheduled_at ב-DB
2. השווה למה שהזנת
3. אם לא תואם, יש בעיה ב-`convertIsraelTimeToUTC`
4. נסה לשמור הודעה חדשה ובדוק מה נשמר

### בעיה 3: אין Recipients

**תסמינים:**
- ההודעה ב-processing אבל לא נשלחת
- יש שגיאה "No recipients found"

**פתרון:**
1. בדוק את `scheduled_message_recipients` table
2. ודא שיש recipients לכל הודעה
3. אם לא, הוסף recipients

### בעיה 4: API לא נקרא

**תסמינים:**
- אין logs ב-Vercel
- ה-cron job רץ אבל אין תוצאות

**פתרון:**
1. בדוק את ה-cron job execution history
2. בדוק את ה-return_message
3. אם יש שגיאה, תקן אותה
4. בדוק שה-URL נכון

### בעיה 5: Authorization Failed

**תסמינים:**
- ה-cron job רץ אבל יש שגיאה 403
- ה-return_message אומר "Invalid Authorization token"

**פתרון:**
1. בדוק שה-CRON_SECRET ב-Vercel תואם ל-SQL
2. ודא שה-header נשלח נכון
3. בדוק את ה-logs ב-Vercel

## בדיקות נוספות

### בדוק את ה-Function claim_due_scheduled_messages

```sql
-- זה אמור להחזיר הודעות שצריכות להישלח
SELECT * FROM claim_due_scheduled_messages(50);
```

אם זה מחזיר רשימה ריקה אבל יש הודעות due:
- יש בעיה ב-function
- בדוק את ה-SQL

### בדוק את ה-Numbers Table

```sql
SELECT 
  n.id,
  n.phone_number,
  n.instance_id,
  n.api_token,
  sm.id as message_id,
  sm.status
FROM numbers n
INNER JOIN scheduled_messages sm ON sm.number_id = n.id
WHERE sm.status = 'pending'
  AND (n.instance_id IS NULL OR n.api_token IS NULL);
```

אם יש הודעות עם numbers חסרי credentials:
- צריך להוסיף instance_id ו-api_token

## Debug Checklist

- [ ] יש הודעות ב-pending?
- [ ] ה-scheduled_at עבר (is_due = true)?
- [ ] ה-cron job קיים?
- [ ] ה-cron job רץ (יש execution history)?
- [ ] אין שגיאות ב-return_message?
- [ ] ה-API עובד (בדיקה ידנית)?
- [ ] יש recipients לכל הודעה?
- [ ] ה-numbers table יש credentials?
- [ ] ה-timezone conversion נכון?

## אם עדיין לא עובד

1. הרץ את `scripts/debug_scheduled.js`
2. שתף את התוצאות
3. בדוק את ה-logs ב-Vercel
4. בדוק את ה-cron execution history
5. בדוק את ה-scheduled_at ב-DB

