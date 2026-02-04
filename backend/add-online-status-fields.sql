-- Migration script to add online status and availability fields to the users table
-- Run this in your Supabase SQL editor

-- Add online status fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;

-- Add availability field
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS available_to_work BOOLEAN DEFAULT FALSE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);
CREATE INDEX IF NOT EXISTS idx_users_available_to_work ON users(available_to_work);

-- Add a comment to document the new fields
COMMENT ON COLUMN users.is_online IS 'Tracks whether the user is currently online (true) or offline (false)';
COMMENT ON COLUMN users.last_seen IS 'Timestamp of when the user was last active';
COMMENT ON COLUMN users.available_to_work IS 'Indicates if the user is available for work/internships';
