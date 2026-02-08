# Company ID Fix - Using Correct Field Name

## Issue
Foreign key constraint error when creating jobs:
```
Error creating job: insert or update on table "jobs" violates foreign key constraint "jobs_company_id_fkey"
```

## Root Cause
The database table `jobs` has a column named `company_id` that references the `startups` table, but the code was using `startup_id` as the field name, causing a mismatch.

## Solution
Changed all references from `startup_id` to `company_id` throughout the codebase to match the database schema.

## Files Changed

### Frontend

**1. `frontend/src/pages/Startups/StartupDetail.jsx`**
- Changed `jobFormTemplate.startup_id` → `jobFormTemplate.company_id`
- Updated form initialization: `company_id: data.id`
- Updated form reset: `company_id: startupId`
- Updated edit job: `company_id: job.company_id || startupId`

**2. `frontend/src/pages/Hire/Hire.jsx`**
- Changed `jobFormTemplate.startup_id` → `jobFormTemplate.company_id`
- Updated form field: `id="company_id"` and `name="company_id"`
- Updated all form state references to use `company_id`

### Backend

**3. `backend/controllers/hire.controller.js`**
- Changed validation: `const { company_id } = req.body`
- Updated validation check: `if (company_id !== req.approvedStartup.id)`

**4. `backend/services/hiring.service.js`**
- Changed parameter extraction: `const { company_id } = jobDetails`
- Updated validation: `if (!company_id)`
- Updated job creation: `company_id: company_id`
- Updated startup fetch: `eq('id', company_id)`

## Database Schema
The `jobs` table structure (no changes needed):
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES startups(id), -- References startups table
  role_title TEXT,
  description TEXT,
  type TEXT,
  location TEXT,
  stipend TEXT,
  duration TEXT,
  application_deadline TIMESTAMP,
  external_link TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Key Points
- `company_id` in the `jobs` table is a foreign key that references `startups.id`
- The naming `company_id` makes sense because startups are companies
- All code now consistently uses `company_id` to match the database schema
- No database migration needed - only code changes

## Testing
- [x] Code updated to use `company_id`
- [x] No diagnostics errors
- [ ] Test job creation from startup page
- [ ] Verify job is saved with correct company_id
- [ ] Verify startup name appears correctly in job listings
