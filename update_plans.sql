-- Ensure necessary columns exist
ALTER TABLE plans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS invites_limit INTEGER DEFAULT 0;

-- Update plans with new pricing and limits

-- 1. Free Plan
-- Price: $0, 0 scheduled messages (blocked via UI logic but we can also set low limits here if used), 
-- but requirements say "Not available for free users". logic will be in app.
UPDATE plans 
SET 
  price_monthly = 0,
  numbers_limit = 1,
  instances_limit = 1,
  invites_limit = 0, -- No team members
  description = 'Perfect for getting started'
WHERE name = 'Free';

-- 2. Pro Plan
-- Price: $19, 5 numbers
UPDATE plans 
SET 
  price_monthly = 19,
  numbers_limit = 5,
  instances_limit = 5,
  invites_limit = 3,
  description = 'For growing businesses'
WHERE name = 'Pro';

-- 3. Handle Agency -> Organization merge
-- If we have both, delete the new one (assuming no subs yet) and rename Agency
DO $$
BEGIN
    -- Check if both exist. We prefer to keep 'Agency' (renamed to Organization) as it likely has legacy subscriptions.
    IF EXISTS (SELECT 1 FROM plans WHERE name = 'Agency') AND EXISTS (SELECT 1 FROM plans WHERE name = 'Organization') THEN
        DELETE FROM plans WHERE name = 'Organization';
    END IF;

    -- Rename Agency to Organization
    IF EXISTS (SELECT 1 FROM plans WHERE name = 'Agency') THEN
        UPDATE plans SET name = 'Organization' WHERE name = 'Agency';
    END IF;
END $$;

-- 4. Update Organization plan details
UPDATE plans 
SET 
  price_monthly = 44,
  numbers_limit = 20,
  instances_limit = 20,
  invites_limit = 10,
  description = 'For teams and organizations',
  features = '["Unlimited messages", "Team management", "Priority support", "Scheduled Messages"]'::jsonb
WHERE name = 'Organization';

-- Ensure Organization plan exists if it was missing completely
INSERT INTO plans (name, price_monthly, numbers_limit, instances_limit, invites_limit, description, features)
SELECT 'Organization', 44, 20, 20, 10, 'For teams and organizations', '["Unlimited messages", "Team management", "Priority support", "Scheduled Messages"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Organization');

-- Verify
SELECT * FROM plans;
