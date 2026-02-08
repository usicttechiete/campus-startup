-- Complete fix for jobs.company_id foreign key constraint
-- This ensures company_id references startups(id) instead of users(id)

-- Step 1: Check current constraint
DO $$ 
BEGIN
    RAISE NOTICE 'Checking current constraints on jobs table...';
END $$;

-- Step 2: Drop existing foreign key constraint if it exists
ALTER TABLE jobs 
DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;

-- Step 3: If there are any orphaned jobs (company_id not in startups), delete them
-- This prevents the foreign key constraint from failing
DELETE FROM jobs 
WHERE company_id NOT IN (SELECT id FROM startups);

-- Step 4: Add new foreign key constraint referencing startups table
ALTER TABLE jobs 
ADD CONSTRAINT jobs_company_id_fkey 
FOREIGN KEY (company_id) 
REFERENCES startups(id) 
ON DELETE CASCADE;

-- Step 5: Verify the constraint was created
DO $$ 
BEGIN
    RAISE NOTICE 'Foreign key constraint created successfully!';
    RAISE NOTICE 'jobs.company_id now references startups(id)';
END $$;

-- Step 6: Show the constraint details
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='jobs'
  AND kcu.column_name='company_id';
