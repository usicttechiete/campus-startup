-- Debug script to check jobs table constraint and data

-- 1. Check the current foreign key constraint on jobs table
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

-- 2. Check if there are any startups in the database
SELECT id, name, user_id, status, created_at 
FROM startups 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check if there are any jobs in the database
SELECT id, company_id, role_title, created_at 
FROM jobs 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check for orphaned jobs (jobs with company_id not in startups)
SELECT j.id, j.company_id, j.role_title
FROM jobs j
LEFT JOIN startups s ON j.company_id = s.id
WHERE s.id IS NULL;
