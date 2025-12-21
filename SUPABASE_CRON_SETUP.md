# Supabase Cron Jobs Setup Guide

## הבעיה
ה-scheduled messages לא נשלחים אוטומטית כי ה-cron job לא מוגדר או לא עובד.

## פתרון

### שלב 1: בדוק אם ה-Cron Job קיים

הרץ ב-Supabase SQL Editor:

```sql
SELECT * FROM cron.job WHERE jobname = 'dispatch_scheduled_messages';
```

אם אין תוצאות, צריך ליצור את ה-cron job.

### שלב 2: בדוק את ה-Execution History

```sql
SELECT 
  j.jobname,
  jr.status,
  jr.return_message,
  jr.start_time,
  jr.end_time
FROM cron.job j
LEFT JOIN cron.job_run_details jr ON j.jobid = jr.jobid
WHERE j.jobname = 'dispatch_scheduled_messages'
ORDER BY jr.start_time DESC
LIMIT 10;
```

זה יראה לך:
- האם ה-cron job רץ
- האם יש שגיאות
- מה ה-return_message (תגובת ה-API)

### שלב 3: צור/עדכן את ה-Cron Job

**חשוב:** החלף את הערכים הבאים:
- `<YOUR_DOMAIN>` - הדומיין של Vercel שלך (למשל: `admin-panel-xyz.vercel.app`)
- `YOUR_CRON_SECRET` - ה-CRON_SECRET מ-Vercel environment variables

```sql
-- קודם, בטל את ה-cron job הישן (אם קיים)
SELECT cron.unschedule('dispatch_scheduled_messages');

-- עכשיו, צור את ה-cron job החדש
SELECT cron.schedule(
  'dispatch_scheduled_messages',
  '* * * * *',  -- כל דקה
  $$
    SELECT net.http_post(
      url := 'https://<YOUR_DOMAIN>/api/dispatch',
      headers := jsonb_build_object(
        'authorization', 'Bearer YOUR_CRON_SECRET',
        'content-type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);
```

### שלב 4: בדוק את ה-API ידנית

לפני שאתה מחכה ל-cron, בדוק שה-API עובד:

```bash
curl -X POST https://your-domain.vercel.app/api/dispatch \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{}'
```

אמור להחזיר:
```json
{
  "claimed_count": 0,
  "sent_count": 0,
  "failed_count": 0,
  "retry_count": 0,
  "results": []
}
```

### שלב 5: בדוק Scheduled Messages שממתינים

```sql
SELECT 
  id,
  message,
  scheduled_at,
  status,
  is_active,
  NOW() as current_time,
  scheduled_at <= NOW() as is_due
FROM scheduled_messages
WHERE status = 'pending'
  AND is_active = true
ORDER BY scheduled_at ASC;
```

אם יש הודעות עם `is_due = true`, הן אמורות להישלח.

### שלב 6: בדוק את ה-Function claim_due_scheduled_messages

```sql
SELECT * FROM claim_due_scheduled_messages(50);
```

זה יראה לך אילו הודעות יטופלו.

## פתרון בעיות

### Cron Job לא רץ

1. **בדוק שה-pg_cron extension מופעל:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
   ```

2. **בדוק שה-pg_net extension מופעל:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

3. **אם חסרים, הפעל אותם:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   CREATE EXTENSION IF NOT EXISTS pg_net;
   ```

### Cron Job רץ אבל יש שגיאות

בדוק את ה-`return_message` ב-`cron.job_run_details`:

```sql
SELECT 
  status,
  return_message,
  start_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'dispatch_scheduled_messages')
ORDER BY start_time DESC
LIMIT 5;
```

**שגיאות נפוצות:**

1. **"Invalid Authorization token"**
   - ה-CRON_SECRET לא נכון
   - בדוק ב-Vercel environment variables

2. **"Connection refused" או "Timeout"**
   - ה-URL לא נכון
   - בדוק שהדומיין נכון

3. **"Method not allowed"**
   - ה-API לא מקבל POST
   - זה לא אמור לקרות, אבל בדוק

### Messages לא נשלחות

1. **בדוק שה-messages ב-pending:**
   ```sql
   SELECT COUNT(*) FROM scheduled_messages 
   WHERE status = 'pending' AND is_active = true;
   ```

2. **בדוק שה-scheduled_at עבר:**
   ```sql
   SELECT COUNT(*) FROM scheduled_messages 
   WHERE status = 'pending' 
   AND is_active = true 
   AND scheduled_at <= NOW();
   ```

3. **בדוק שה-numbers table יש credentials:**
   ```sql
   SELECT n.id, n.phone_number, n.instance_id, n.api_token
   FROM numbers n
   INNER JOIN scheduled_messages sm ON sm.number_id = n.id
   WHERE sm.status = 'pending'
   AND sm.is_active = true
   AND (n.instance_id IS NULL OR n.api_token IS NULL);
   ```

## בדיקה מהירה

הרץ את זה כדי לבדוק הכל בבת אחת:

```sql
-- 1. בדוק cron job
SELECT 'Cron Job Status:' as check_type, 
       CASE WHEN EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'dispatch_scheduled_messages') 
            THEN '✅ Exists' 
            ELSE '❌ Missing' 
       END as status;

-- 2. בדוק pending messages
SELECT 'Pending Messages:' as check_type,
       COUNT(*)::text as status
FROM scheduled_messages
WHERE status = 'pending' AND is_active = true;

-- 3. בדוק due messages
SELECT 'Due Messages:' as check_type,
       COUNT(*)::text as status
FROM scheduled_messages
WHERE status = 'pending' 
AND is_active = true 
AND scheduled_at <= NOW();

-- 4. בדוק last cron run
SELECT 'Last Cron Run:' as check_type,
       COALESCE(
         (SELECT status || ' at ' || start_time::text 
          FROM cron.job_run_details 
          WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'dispatch_scheduled_messages')
          ORDER BY start_time DESC LIMIT 1),
         'Never'
       ) as status;
```

## קבצים שימושיים

- `scripts/check_cron.sql` - כל ה-SQL queries לבדיקה
- `scripts/setup_cron.js` - סקריפט Node.js לבדיקה (אם יש לך access)

## תמיכה

אם עדיין לא עובד:
1. בדוק את ה-logs ב-Vercel (Functions > /api/dispatch > Logs)
2. בדוק את ה-cron execution history
3. בדוק שה-messages ב-pending ו-is_due = true
4. בדוק שה-numbers table יש credentials תקינים

