-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set Fernando as admin
UPDATE profiles 
SET is_admin = TRUE 
WHERE id IN (
    SELECT user_id 
    FROM profiles 
    WHERE username = 'fernando' 
    LIMIT 1
);
