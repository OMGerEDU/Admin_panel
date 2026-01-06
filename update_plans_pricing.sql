-- Update Free Plan
UPDATE public.plans
SET 
  price_monthly = 0,
  price_yearly = 0,
  numbers_limit = 2,
  invites_limit = 1
WHERE name = 'Free';

-- Update Pro Plan (The $9.99 tier)
UPDATE public.plans
SET 
  price_monthly = 9.99,
  price_yearly = 99.9,
  numbers_limit = 10,
  invites_limit = 5
WHERE name = 'Pro';

-- Update Agency/Business Plan (The $39 tier)
UPDATE public.plans
SET 
  price_monthly = 39,
  price_yearly = 390,
  numbers_limit = -1, -- Unlimited
  invites_limit = -1 -- Unlimited
WHERE name = 'Agency' OR name = 'Business';
