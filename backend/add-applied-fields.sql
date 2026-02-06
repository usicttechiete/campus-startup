-- Add resume_link to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS resume_link TEXT;

-- Add rejection_reason to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
