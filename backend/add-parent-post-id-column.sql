-- Add parent_post_id to posts table (links updates to their parent project post)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS parent_post_id UUID;

-- Foreign key to posts(id)
DO $$
BEGIN
  ALTER TABLE posts
  ADD CONSTRAINT fk_posts_parent_post_id
  FOREIGN KEY (parent_post_id) REFERENCES posts(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Index for fast lookup of updates by parent
CREATE INDEX IF NOT EXISTS idx_posts_parent_post_id ON posts(parent_post_id);
