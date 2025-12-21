# פתרון מהיר - Scheduled Messages לא נשלחות

## הבעיה
ה-cron job רץ ומחזיר "1 row", אבל ההודעה עדיין ב-pending ולא נשלחת.

## בדיקה מהירה

הרץ את זה ב-Supabase SQL Editor:

```sql
-- 1. בדוק recipients
SELECT 
  sm.id,
  sm.to_phone,
  COUNT(smr.id) as recipient_count,
  STRING_AGG(smr.phone_number, ', ') as recipients
FROM scheduled_messages sm
LEFT JOIN scheduled_message_recipients smr ON smr.scheduled_message_id = sm.id
WHERE sm.status = 'pending'
GROUP BY sm.id, sm.to_phone;

-- 2. בדוק number credentials
SELECT 
  sm.id,
  n.instance_id,
  n.api_token,
  CASE 
    WHEN n.instance_id IS NULL THEN '❌ Missing instance_id'
    WHEN n.api_token IS NULL THEN '❌ Missing api_token'
    ELSE '✅ OK'
  END as status
FROM scheduled_messages sm
INNER JOIN numbers n ON n.id = sm.number_id
WHERE sm.status = 'pending';

-- 3. בדוק את ה-claim function
SELECT * FROM claim_due_scheduled_messages(50);
```

## פתרונות לפי הבעיה

### אם אין recipients (recipient_count = 0)

**הבעיה:** ההודעה נשמרה אבל לא נשמרו recipients.

**פתרון:**
```sql
-- הוסף recipient מהשדה to_phone
INSERT INTO scheduled_message_recipients (scheduled_message_id, phone_number, status)
SELECT id, to_phone, 'pending'
FROM scheduled_messages
WHERE id = '9826edd9-0410-4854-86c7-f37120dd3ec4'
  AND to_phone IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM scheduled_message_recipients 
    WHERE scheduled_message_id = scheduled_messages.id
  );
```

### אם אין number credentials

**הבעיה:** ה-number לא מוגדר נכון.

**פתרון:**
- לך ל-Numbers page
- עדכן את ה-number עם instance_id ו-api_token

### אם ה-claim function מחזיר רשימה ריקה

**הבעיה:** ה-function לא מוצא הודעות.

**פתרון:**
```sql
-- בדוק למה ה-function לא מוצא
SELECT 
  id,
  status,
  is_active,
  scheduled_at,
  NOW() as current_time,
  scheduled_at <= NOW() as is_due,
  status = 'pending' as is_pending,
  is_active = true as is_active_check
FROM scheduled_messages
WHERE id = '9826edd9-0410-4854-86c7-f37120dd3ec4';
```

אם `is_due = true` אבל ה-function לא מוצא:
- אולי ה-status כבר לא 'pending' (אולי 'processing'?)
- בדוק: `SELECT status FROM scheduled_messages WHERE id = '...';`

## בדיקת ה-API

אם הכל נראה תקין, בדוק את ה-API:

1. לך ל-Vercel Dashboard
2. Deployments > בחר deployment אחרון
3. Functions > `/api/dispatch` > Logs
4. חפש הודעות עם `[DISPATCH]`

**מה לחפש:**
- `[DISPATCH] Claimed X messages` - כמה הודעות נטענו
- `Error fetching number` - בעיה ב-credentials
- `No recipients found` - אין recipients
- `Error sending` - בעיה בשליחת ההודעה

## פתרון מהיר - Force Send

אם אתה רוצה לשלוח את ההודעה עכשיו:

```sql
-- שנה status ל-processing כדי שה-API יטען אותה
UPDATE scheduled_messages
SET status = 'processing'
WHERE id = '9826edd9-0410-4854-86c7-f37120dd3ec4';

-- או תזמן מחדש לעוד דקה
UPDATE scheduled_messages
SET scheduled_at = NOW() + INTERVAL '1 minute',
    status = 'pending'
WHERE id = '9826edd9-0410-4854-86c7-f37120dd3ec4';
```

ואז קרא ל-API ידנית:
```bash
curl -X POST https://admin-panel-788h.vercel.app/api/dispatch \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

## בדיקה מקיפה

הרץ את זה כדי לראות הכל:

```sql
SELECT 
  'Message Status' as check_type,
  status as value
FROM scheduled_messages
WHERE id = '9826edd9-0410-4854-86c7-f37120dd3ec4'
UNION ALL
SELECT 
  'Recipients Count',
  COUNT(*)::text
FROM scheduled_message_recipients
WHERE scheduled_message_id = '9826edd9-0410-4854-86c7-f37120dd3ec4'
UNION ALL
SELECT 
  'Number Credentials',
  CASE 
    WHEN n.instance_id IS NULL OR n.api_token IS NULL THEN 'Missing'
    ELSE 'OK'
  END
FROM scheduled_messages sm
INNER JOIN numbers n ON n.id = sm.number_id
WHERE sm.id = '9826edd9-0410-4854-86c7-f37120dd3ec4';
```

