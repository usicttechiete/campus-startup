# My Posted Jobs Section - Inline Applicants View

## Summary
Updated the "My Posted Jobs" section in the Internships page to display applicants inline when expanded, similar to the Hire tab design. The section is now more compact and space-efficient.

## Changes Made

### Frontend: `frontend/src/pages/Internships/Internships.jsx`

#### 1. Updated State Management
- Changed from `selectedJobId` to `expandedJobId` for tracking which job's applicants are shown
- Changed from single `applicants` array to `applicantsByJob` object to cache applicants per job
- Changed from single `loadingApplicants` boolean to object tracking loading state per job

**Before:**
```javascript
const [selectedJobId, setSelectedJobId] = useState(null);
const [applicants, setApplicants] = useState([]);
const [loadingApplicants, setLoadingApplicants] = useState(false);
```

**After:**
```javascript
const [expandedJobId, setExpandedJobId] = useState(null);
const [applicantsByJob, setApplicantsByJob] = useState({});
const [loadingApplicants, setLoadingApplicants] = useState({});
```

#### 2. Redesigned "My Posted Jobs" Section
- Removed horizontal scrolling chip-based job selector
- Changed to vertical list with expandable cards
- Each job shows as a full-width card with job details
- "View Applicants" button expands inline to show applicants
- Applicants are loaded on-demand when expanded
- Added ChevronDownIcon for expand/collapse indicator

**Key Features:**
- Compact card design with job title, type badge, description, and info icons
- Inline applicant expansion (no navigation required)
- Applicants cached per job (won't reload if already loaded)
- Shows applicant name, course/branch, year, resume link, and status badge
- Clean white background for applicant cards within the primary-tinted parent card

#### 3. Added Helper Functions
```javascript
const loadApplicants = async (jobId) => {
  if (!jobId || applicantsByJob[jobId]) return; // Don't reload if already loaded
  
  setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
  try {
    const data = await fetchJobApplicants(jobId);
    setApplicantsByJob(prev => ({
      ...prev,
      [jobId]: Array.isArray(data?.results) ? data.results : data || []
    }));
  } catch (err) {
    console.error('Failed to load applicants:', err);
    setApplicantsByJob(prev => ({ ...prev, [jobId]: [] }));
  } finally {
    setLoadingApplicants(prev => ({ ...prev, [jobId]: false }));
  }
};

const toggleJobApplicants = (jobId) => {
  const isExpanding = expandedJobId !== jobId;
  setExpandedJobId(isExpanding ? jobId : null);
  
  if (isExpanding) {
    loadApplicants(jobId);
  }
};
```

#### 4. Added ChevronDownIcon Component
```javascript
const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
```

## UI/UX Improvements

### Before:
- Horizontal scrolling chips to select jobs
- Selected job showed limited applicants (max 3)
- "View all applicants" button navigated away from page
- Wide component with wasted space

### After:
- Vertical list of all jobs with full details visible
- Each job has inline "View Applicants" button
- Clicking expands the card to show all applicants inline
- No navigation required - everything in one place
- More compact and space-efficient design
- Consistent with Hire tab design pattern

## Design Consistency
This update makes the "My Posted Jobs" section consistent with the Hire tab's company-grouped view:
- Same expandable card pattern
- Same applicant card design
- Same loading states and empty states
- Same visual hierarchy and spacing

## Status
✅ Complete - All changes implemented and tested
