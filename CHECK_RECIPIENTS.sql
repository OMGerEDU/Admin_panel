-- בדוק recipients להודעה המתוזמנת
SELECT 
  sm.id as message_id,
  sm.message,
  sm.status,
  sm.scheduled_at,
  sm.to_phone as old_to_phone,
  COUNT(smr.id) as recipient_count,
  STRING_AGG(smr.phone_number, ', ') as recipients
FROM scheduled_messages sm
LEFT JOIN scheduled_message_recipients smr ON smr.scheduled_message_id = sm.id
WHERE sm.id = '9826edd9-0410-4854-86c7-f37120dd3ec4'
GROUP BY sm.id, sm.message, sm.status, sm.scheduled_at, sm.to_phone;

-- בדוק את כל ה-recipients
SELECT * FROM scheduled_message_recipients 
WHERE scheduled_message_id = '9826edd9-0410-4854-86c7-f37120dd3ec4';

-- בדוק את ה-number credentials
SELECT 
  sm.id as message_id,
  n.id as number_id,
  n.phone_number,
  n.instance_id,
  n.api_token,
  CASE 
    WHEN n.instance_id IS NULL THEN '❌ Missing instance_id'
    WHEN n.api_token IS NULL THEN '❌ Missing api_token'
    ELSE '✅ OK'
  END as credentials_status
FROM scheduled_messages sm
INNER JOIN numbers n ON n.id = sm.number_id
WHERE sm.id = '9826edd9-0410-4854-86c7-f37120dd3ec4';

