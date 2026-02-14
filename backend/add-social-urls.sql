-- Add social media URL fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS leetcode_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN users.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN users.leetcode_url IS 'LeetCode profile URL';
