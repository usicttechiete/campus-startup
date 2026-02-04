-- Step 1: Add the new columns first (they will be nullable initially)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS course TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Step 2: Delete any existing users with NULL values in the new columns
-- (since you mentioned you already deleted them from database)
DELETE FROM users WHERE college IS NULL OR course IS NULL OR branch IS NULL OR year IS NULL;

-- Step 3: Now add the NOT NULL constraints
ALTER TABLE users 
ALTER COLUMN college SET NOT NULL,
ALTER COLUMN course SET NOT NULL,
ALTER COLUMN branch SET NOT NULL,
ALTER COLUMN year SET NOT NULL;

-- Step 4: Add check constraint for year
ALTER TABLE users 
ADD CONSTRAINT check_year_range CHECK (year >= 1 AND year <= 5);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college);
CREATE INDEX IF NOT EXISTS idx_users_course ON users(course);
CREATE INDEX IF NOT EXISTS idx_users_year ON users(year);