-- Update Free plan to have 2 numbers and instances
UPDATE plans 
SET 
  numbers_limit = 2,
  instances_limit = 2
WHERE name = 'Free';
