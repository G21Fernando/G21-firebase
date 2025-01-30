-- Add is_admin column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set Fernando as admin using their profile ID
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = (SELECT id FROM profiles WHERE username ILIKE 'fernando' LIMIT 1);
