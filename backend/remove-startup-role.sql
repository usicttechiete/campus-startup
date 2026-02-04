-- Migration to remove startup role from the database
-- This script removes all startup role references and updates existing startup users to student role
-- Note: startup_idea post type is kept as it's still a valid content type

-- Update all users with startup role to student role
UPDATE users 
SET role = 'student' 
WHERE role = 'startup';

-- Keep startup_idea post type - no changes needed for posts table

-- Update the check constraint to keep startup_idea as valid post type
ALTER TABLE posts 
DROP CONSTRAINT IF EXISTS check_post_type;

ALTER TABLE posts 
ADD CONSTRAINT check_post_type 
CHECK (post_type IN ('startup_idea', 'project', 'work_update'));

-- Note: You may also want to update any role-based constraints or triggers
-- that reference the 'startup' role in your database schema