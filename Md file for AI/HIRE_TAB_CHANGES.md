# Hire Tab Changes - Startup-Based Job Posting

## Overview
Changed the hire/jobs system so that approved startups (not admins) can post jobs. Admins can now only view jobs but cannot create or manage them.

## Key Changes

### Backend Changes

#### 1. `backend/middleware/hire.middleware.js`
- Modified to allow admins read-only access (set `req.isAdmin = true`)
- Stores approved startup info in `req.approvedStartup` for students with approved startups
- Maintains access control for unapproved users

#### 2. `backend/controllers/hire.controller.js`
- **postJobController**: 
  - Blocks admins from posting jobs
  - Validates that `startup_id` matches user's approved startup
  - Uses `startup_id` from request body as `company_id`
  
- **updateJobController**: 
  - Blocks admins from updating jobs
  - Verifies job ownership before allowing updates
  
- **getJobsController**: 
  - Admins see all jobs via `getAllJobsWithStartups()`
  - Startups see only their own jobs via `getJobsByCompanyId()`
  
- **getApplicantsController**: 
  - Verifies job ownership for non-admins
  - Admins can view all applicants
  
- **updateApplicationStatusController**: 
  - Blocks admins from updating application status
  - Only startup owners can manage applications

#### 3. `backend/services/hiring.service.js`
- **getJobsByCompanyId**: Now fetches and includes startup name with each job
- **getAllJobsWithStartups**: New function to fetch all jobs with startup details (for admins)
- **createJob**: 
  - Requires `startup_id` in payload
  - Uses `startup_id` as `company_id` in database
  - Returns job with startup name
- **updateJob**: Added ownership verification via `startupId` parameter

### Frontend Changes

#### 1. `frontend/src/services/hire.api.js`
- Added `fetchMyApprovedStartup()` function to get user's approved startup

#### 2. `frontend/src/components/Navbar/Navbar.jsx`
- **FIXED**: Added 'student' role to Hire tab navigation
- Now both students and admins can see and access the Hire tab
- Students with approved startups can post jobs
- Students without approved startups see informational messages

#### 3. `frontend/src/pages/Hire/Hire.jsx`
- **New State**:
  - `myStartup`: Stores user's approved startup
  - `loadingStartup`: Loading state for startup fetch
  - `isAdmin`: Derived from role context
  - `canPostJobs`: Computed based on role and startup approval status

- **New Function**:
  - `loadMyStartup()`: Fetches user's approved startup and auto-selects it in form

- **UI Changes**:
  - Added startup dropdown in job form (auto-selected and disabled if user has only one startup)
  - Header text changes based on admin/student role
  - Admin notice card explaining read-only access
  - Warning card for users without approved startup
  - "Post Role" button only shown to users with approved startups
  - "Edit" button hidden for admins
  - Application status buttons disabled for admins with explanatory text
  - Updated section headers and empty states based on role
  - useEffect now depends on `role` to reload data when role changes

## Database Schema
No changes required. The `jobs` table already has `company_id` field which now stores the startup UUID instead of user UUID.

## Flow

### For Approved Startup Owners:
1. User logs in with approved startup
2. **Hire tab is visible in navigation**
3. System fetches their approved startup automatically
4. Startup is auto-selected in job posting form
5. User can create, edit, and manage jobs for their startup
6. User can view and update application statuses

### For Admins:
1. Admin logs in
2. **Hire tab is visible in navigation**
3. Can view all jobs from all approved startups
4. Cannot create, edit, or delete jobs
5. Can view applicants but cannot update application statuses
6. UI shows informational messages about read-only access

### For Students Without Approved Startup:
1. User logs in
2. **Hire tab is visible in navigation**
3. User sees warning message to register and get startup approved
4. Cannot access job posting features
5. Hire tab shows appropriate guidance message

## Access Summary
| User Type | Can See Hire Tab | Can Post Jobs | Can Edit Jobs | Can View Jobs | Can Manage Applications |
|-----------|------------------|---------------|---------------|---------------|-------------------------|
| Admin | ✅ Yes | ❌ No | ❌ No | ✅ Yes (All) | ❌ No |
| Student with Approved Startup | ✅ Yes | ✅ Yes | ✅ Yes (Own) | ✅ Yes (Own) | ✅ Yes (Own) |
| Student without Approved Startup | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |

## Testing Checklist
- [x] Hire tab visible for students in navigation
- [x] Hire tab visible for admins in navigation
- [ ] Approved startup owner can post jobs
- [ ] Startup name appears correctly in job listings
- [ ] Admin can view all jobs but cannot post/edit
- [ ] Admin cannot update application statuses
- [ ] Users without approved startup see appropriate warnings
- [ ] Startup dropdown auto-selects user's approved startup
- [ ] Job ownership is validated on backend
- [ ] Company name displays correctly (startup name, not "Your company")
