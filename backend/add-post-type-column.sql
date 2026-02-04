-- Add post_type column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'startup_idea';

-- Add check constraint to ensure valid post types
ALTER TABLE posts 
ADD CONSTRAINT check_post_type 
CHECK (post_type IN ('startup_idea', 'project', 'work_update'));

-- Update existing posts to have startup_idea type (since that was the original behavior)
UPDATE posts 
SET post_type = 'startup_idea' 
WHERE post_type IS NULL;

-- Make post_type NOT NULL after setting default values
ALTER TABLE posts 
ALTER COLUMN post_type SET NOT NULL;

-- Create index for better performance when filtering by post type
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);

-- Optional: Make stage nullable since work_updates don't need stages
ALTER TABLE posts 
ALTER COLUMN stage DROP NOT NULL;