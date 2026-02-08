# Troubleshooting: Jobs Foreign Key Constraint Error

## Error Message
```
Error creating job: insert or update on table "jobs" violates foreign key constraint "jobs_company_id_fkey"
```

## What This Means
The database is rejecting the job creation because the `company_id` value doesn't exist in the table it references. This could be because:

1. The foreign key constraint references the wrong table (users instead of startups)
2. The `company_id` being sent doesn't exist in the startups table
3. The startup exists but with a different ID than what's being sent

## Debugging Steps

### Step 1: Check What's Being Sent
Look at the browser console and backend logs for:
```
Submitting job form: { company_id: "...", ... }
postJobController - req.body: { company_id: "...", ... }
Startup found: { id: "...", name: "..." }
```

### Step 2: Run Database Checks
Execute `backend/debug-jobs-constraint.sql` in your database to check:
- Current foreign key constraint configuration
- Existing startups in the database
- Any orphaned jobs

### Step 3: Fix the Constraint
If the constraint references the wrong table, run:
```bash
psql -d your_database -f backend/fix-jobs-company-id-constraint.sql
```

This will:
1. Drop the old constraint
2. Clean up any orphaned jobs
3. Create new constraint: `jobs.company_id → startups.id`

## Common Issues & Solutions

### Issue 1: Constraint References Users Table
**Symptom:** Constraint exists but references `users(id)` instead of `startups(id)`

**Solution:** Run the fix script:
```sql
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
ALTER TABLE jobs ADD CONSTRAINT jobs_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES startups(id) ON DELETE CASCADE;
```

### Issue 2: Startup ID Mismatch
**Symptom:** Logs show different IDs for startup in frontend vs backend

**Solution:** 
1. Check browser console for the `company_id` being sent
2. Check backend logs for `req.approvedStartup.id`
3. Verify they match
4. Query database: `SELECT id, name FROM startups WHERE user_id = 'YOUR_USER_ID';`

### Issue 3: Startup Not Approved
**Symptom:** User has a startup but it's not approved

**Solution:**
1. Check startup status: `SELECT id, name, status FROM startups WHERE user_id = 'YOUR_USER_ID';`
2. If status is not 'APPROVED', approve it:
   ```sql
   UPDATE startups SET status = 'APPROVED' WHERE id = 'STARTUP_ID';
   ```

### Issue 4: No Startup Exists
**Symptom:** User doesn't have a startup in the database

**Solution:**
1. User needs to register a startup first
2. Admin needs to approve it
3. Then user can post jobs

## Verification Queries

### Check User's Startup
```sql
SELECT s.id, s.name, s.status, s.user_id, s.created_at
FROM startups s
WHERE s.user_id = 'YOUR_USER_ID';
```

### Check Foreign Key Constraint
```sql
SELECT
    tc.constraint_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='jobs'
  AND kcu.column_name='company_id';
```

Expected result:
- `foreign_table_name`: `startups`
- `foreign_column_name`: `id`

### Test Job Creation Manually
```sql
-- First, get a valid startup ID
SELECT id FROM startups WHERE status = 'APPROVED' LIMIT 1;

-- Then try to insert a test job
INSERT INTO jobs (company_id, role_title, description, type)
VALUES ('STARTUP_ID_HERE', 'Test Role', 'Test Description', 'Internship');

-- If successful, delete the test job
DELETE FROM jobs WHERE role_title = 'Test Role';
```

## Code Logging Added

### Frontend (StartupDetail.jsx)
```javascript
console.log('Submitting job form:', jobForm);
console.log('Startup ID:', startupId);
console.log('Startup data:', startup);
```

### Backend (hire.controller.js)
```javascript
console.log('postJobController - req.user:', req.user?.id);
console.log('postJobController - req.approvedStartup:', req.approvedStartup);
console.log('postJobController - req.body:', req.body);
```

### Backend (hiring.service.js)
```javascript
console.log('createJob called with:', { companyId, company_id, jobDetails });
console.log('Startup found:', startupExists);
```

## Next Steps

1. Try posting a job and check all console logs
2. Copy the `company_id` from the logs
3. Run this query to verify the startup exists:
   ```sql
   SELECT * FROM startups WHERE id = 'COMPANY_ID_FROM_LOGS';
   ```
4. If startup doesn't exist, there's a data issue
5. If startup exists, run the constraint fix script
6. Try posting again

## Files to Check
- `backend/debug-jobs-constraint.sql` - Diagnostic queries
- `backend/fix-jobs-company-id-constraint.sql` - Fix script
- Browser console - Frontend logs
- Backend terminal - Server logs
