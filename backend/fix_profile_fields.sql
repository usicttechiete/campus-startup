-- SQL Migration to fix missing profile fields (Tagline & Social Links)
-- Run this in your Supabase SQL Editor when you are ready to deploy these fields.

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS leetcode_url TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Comments for documentation
COMMENT ON COLUMN users.tagline IS 'Profile tagline/headline';
COMMENT ON COLUMN users.about IS 'User bio/description (mapped to "bio" in frontend)';
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN users.github_url IS 'GitHub profile URL';
COMMENT ON COLUMN users.leetcode_url IS 'LeetCode profile URL';
