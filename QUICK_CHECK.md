# בדיקה מהירה - למה ההודעות לא נשלחות?

## שלב 1: בדוק ב-Supabase SQL Editor

הרץ את זה:

```sql
-- 1. בדוק אם יש הודעות pending
SELECT 
  id,
  LEFT(message, 50) as message_preview,
  scheduled_at,
  status,
  is_active,
  NOW() as current_utc,
  scheduled_at <= NOW() as is_due,
  -- מה זה ב-Israel timezone
  scheduled_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jerusalem' as israel_time
FROM scheduled_messages
WHERE status = 'pending'
  AND is_active = true
ORDER BY scheduled_at;
```

**אם `is_due = false`:**
- ההודעה עדיין לא הגיעה לשעה המתוזמנת
- בדוק את ה-`israel_time` - האם זה תואם למה שהזנת?

**אם `is_due = true` אבל ההודעה לא נשלחת:**
- המשך לשלב 2

## שלב 2: בדוק את ה-Cron Job

```sql
-- בדוק אם ה-cron job קיים
SELECT * FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';

-- בדוק את ה-execution history (10 הרצות אחרונות)
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
- ❌ **זו הבעיה!** צריך ליצור את ה-cron job
- ראה `SUPABASE_CRON_SETUP.md` לפרטים

**אם יש cron job אבל `status = 'failed'`:**
- בדוק את ה-`return_message` - מה השגיאה?
- אם זה "Invalid Authorization token" - ה-CRON_SECRET לא נכון
- אם זה "Connection refused" - ה-URL לא נכון

**אם `status = 'succeeded'` אבל אין הודעות:**
- המשך לשלב 3

## שלב 3: בדוק את ה-API ידנית

```bash
curl -X POST https://your-domain.vercel.app/api/dispatch \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**אם זה מחזיר שגיאה:**
- בדוק את ה-logs ב-Vercel
- בדוק שה-CRON_SECRET נכון

**אם זה מחזיר `claimed_count: 0`:**
- בדוק את שלב 1 שוב - האם יש הודעות due?

## שלב 4: בדוק את ה-Function

```sql
-- זה אמור להחזיר הודעות שצריכות להישלח
SELECT * FROM claim_due_scheduled_messages(50);
```

**אם זה מחזיר רשימה ריקה:**
- אבל יש הודעות עם `is_due = true`?
- יש בעיה ב-function - בדוק את ה-SQL

## שלב 5: בדוק Recipients

```sql
SELECT 
  sm.id,
  sm.message,
  COUNT(smr.id) as recipient_count
FROM scheduled_messages sm
LEFT JOIN scheduled_message_recipients smr ON smr.scheduled_message_id = sm.id
WHERE sm.status = 'pending'
  AND sm.is_active = true
GROUP BY sm.id, sm.message;
```

**אם `recipient_count = 0`:**
- ❌ **זו הבעיה!** אין recipients
- צריך להוסיף recipients ל-`scheduled_message_recipients` table

## סיכום - מה לבדוק

1. ✅ יש הודעות ב-pending?
2. ✅ ה-scheduled_at עבר (is_due = true)?
3. ✅ ה-cron job קיים?
4. ✅ ה-cron job רץ (יש execution history)?
5. ✅ אין שגיאות ב-return_message?
6. ✅ יש recipients?

## אם הכל נראה תקין אבל עדיין לא עובד

1. הרץ את `node scripts/debug_scheduled.js`
2. שתף את התוצאות
3. בדוק את ה-logs ב-Vercel: Deployments > Functions > /api/dispatch > Logs

