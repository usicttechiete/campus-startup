-- Add new columns to the users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS course TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Add constraints to ensure data integrity
ALTER TABLE users 
ALTER COLUMN college SET NOT NULL,
ALTER COLUMN course SET NOT NULL,
ALTER COLUMN branch SET NOT NULL,
ALTER COLUMN year SET NOT NULL;

-- Add check constraint for year (typically 1-5 for most courses)
ALTER TABLE users 
ADD CONSTRAINT check_year_range CHECK (year >= 1 AND year <= 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college);
CREATE INDEX IF NOT EXISTS idx_users_course ON users(course);
CREATE INDEX IF NOT EXISTS idx_users_year ON users(year);