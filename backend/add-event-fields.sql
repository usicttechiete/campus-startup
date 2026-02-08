-- Add missing fields to events table

-- Add event_date (when the event happens)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_date DATE;

-- Add registration_deadline (last date to register)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS registration_deadline DATE;

-- Add location (where the event happens)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add registration_link (external link for registration)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_link TEXT;

-- Add event_type (Hackathon, Workshop, etc.)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Drop required_skills column as it's not needed
ALTER TABLE events 
DROP COLUMN IF EXISTS required_skills;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events'
ORDER BY ordinal_position;
