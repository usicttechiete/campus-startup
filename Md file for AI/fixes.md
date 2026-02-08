# bugfix_changes_ref.md
## Bug Fixes & Change Requests – AI Reference File

This file documents confirmed bugs and requested changes across Admin and Student roles.
AI systems must **not assume behavior beyond what is stated here**.
Use this file together with `@PROJECT_ANALYSIS.md`.

---

## 1. Admin – Hire Tab API Fetch Error

### Issue
The Hire tab fails to load data due to a 404 error.

GET http://localhost:3000/api/hire/jobs
 → 404 (Not Found)

### Observations
- Frontend is calling `/api/hire/jobs`
- Backend does not respond to this route

### Required Action
- Verify backend hire-related routes
- Ensure frontend API path matches backend exactly
- Fix route mismatch (do not rename routes arbitrarily)

### Constraints
- Do not change backend logic unless required
- Do not introduce new endpoints without verification

---

## 2. Login Redirect Bug & Security Risk (Student & Admin)

### Issue
After successful login:
- User is note redirected to any path
- only changing URL to localhost:XXXX/hire redirects into the app 
- Credentials are verified first
- not Redirecting allows route injection

### Required Action
- Post-login redirect must be controlled
- Redirect destination must be validated or hardcoded
- Ignore user-provided redirect paths unless explicitly whitelisted

### Security Note
This behavior is considered a security issue and must be fixed.

---

## 3. Student – Notification Destination Update

### Issue
Notifications currently redirect users to the **Bio tile** on the Profile (Me) page.

### Required Change
- Notifications should redirect users to the **Posts tile** on the Profile page instead.

### Constraints
- Do not duplicate notification logic
- Only update destination routing behavior

---

## 4. Student – Internship Search Bar UI Bug

### Issue
- Search icon and text overlap or interfere visually in the Internship search bar

### Required Action
- Fix layout and spacing
- Ensure text input and icon do not overlap
- Must work correctly on mobile and desktop

### Constraints
- No redesign required
- Fix CSS/layout only

---

## 5. Admin – Hire Tab Editable Fields

### Requested Change
Admins must be able to **add and update** the following fields for internships:
- Location
- Stipend
- Duration

### Required Action
- Ensure these fields are editable in the Hire tab UI
- Ensure updates persist correctly

### Implementation Notes (Added by AI)
**Database columns required:** The `jobs` table needs the following columns:
- `location` (TEXT) - e.g., "Remote", "Mumbai", "Bangalore"
- `stipend` (TEXT or INTEGER) - e.g., "₹10,000/month" or 10000
- `duration` (TEXT) - e.g., "3 months", "6 months"

**Additional Database Requirement:**
- The `applications` table needs a `resume_link` (TEXT) column to support the new "Resume Link side-by-side" feature.

**Current state:** These fields do NOT exist in the current codebase:
- hiring.service.js `createJob()` only handles: role_title, description, type, external_link
- Job model and API do not include these fields
- Application create logic: `resume_link` save is commented out to allow testing without DB changes.

**Action required before implementation:**
1. Add columns to the Supabase `jobs` table
2. Add `resume_link` column to Supabase `applications` table
3. Update Job model to include these fields
4. Update hiring.service.js createJob() to accept these fields
5. Update frontend Hire.jsx form to include these inputs

### Constraints
- Do not assume database changes
- Respect existing data structure

---

## 6. Admin – Profile Tab Content Separation

### Requested Change
Admin profiles must display:
- Internships posted (Hire listings)
- Events hosted

### UI Behavior
- Display content similar to the **Posts tile UI** used in Student profiles
- Use postcard-style layout
- Data source differs, UI pattern reused

### Constraints
- Do not mix student posts with admin content
- Do not redesign card UI from scratch

---

## General Constraints for AI Implementation

- Do NOT assume missing backend behavior
- Ask for clarification if route or data structure is unclear
- Do NOT modify unrelated tabs or features
- Focus strictly on listed issues
- Prefer reuse of existing components

---

## Purpose of This File

This file exists to:
- Prevent incorrect assumptions
- Standardize bug fixes
- Maintain role separation (Admin vs Student)
- Guide AI-assisted implementation safely

# CHANGES AND BUG FIXES 2
# bugfix_antigravity.md
## Bug Fixes & UI Change Reference (Antigravity)

This file documents **confirmed UI bugs and requested changes**.
Antigravity must **not assume missing behavior or backend logic**.
Only implement what is explicitly described here.

Use this file together with `@PROJECT_ANALYSIS.md`.

---

## 1. Remove Text Labels from Post Action Buttons

### Issue
Post action buttons currently show visible text labels:
- like
- comment
- share
- let’s build

### Required Fix
- Remove all visible text labels
- Keep only icon-based buttons
- Push icons to the side using layout styling

### Constraints
- Do NOT remove functionality
- Do NOT change click handlers
- Accessibility labels may remain but must not be visible

---

## 2. Comment Section Appears Behind Navbar

### Issue
When the comment section opens, it renders behind the navigation bar.

### Required Fix
- Ensure the comment section is visible above the navbar
- Prevent any overlap that blocks interaction

### Constraints
- Do NOT redesign the comment UI
- Do NOT move the navbar permanently
- Fix must be layout / stacking related only

---

## 3. Student – Notification Destination Change

### Issue
Clicking notifications redirects the user to the **Bio tile** on the Profile (Me) page.

### Required Fix
- Notifications must redirect to the **Posts tile** on the Profile page instead

### Constraints
- Do NOT duplicate notification logic
- Only update routing / destination logic

---

## 4. Student – Internship Search Bar UI Bug

### Issue
The internship search bar has visual interference between:
- Search icon
- Input text

### Required Fix
- Ensure icon and text do not overlap
- Maintain correct spacing on desktop and mobile

### Constraints
- No redesign
- Layout / CSS fix only

---

## 5. Admin – Hire Tab Editable Fields

### Issue
Admins cannot currently add or update the following fields for hire listings:
- Location
- Stipend
- Duration

### Required Fix
- Allow admins to add and update these fields from the Hire tab UI
- Changes must persist after saving

### Constraints
- Do NOT assume database changes
- Respect existing backend behavior

---

## 6. Admin – Profile Tab Content Separation

### Issue
Admin profile does not clearly separate:
- Hire internships posted
- Events hosted

### Required Fix
- Display **Hire postings** and **Events hosted** separately
- UI should match the **postcard-style layout** used in the Student Posts tile
- Reuse existing card components where possible

### Constraints
- Do NOT mix student posts with admin content
- Do NOT redesign card UI from scratch

---

## 7. Student – Profile Postcards Mobile Layout

### Issue
Postcards in the Profile tab do not fit correctly on mobile screens.

### Required Fix
- Ensure postcards adapt to mobile view
- Prevent overflow and layout breakage
- Cards must be readable and usable on small screens

### Constraints
- Do NOT change desktop layout behavior
- Use responsive layout techniques only

---

## General Constraints for Antigravity

- Do NOT assume missing routes or APIs
- Do NOT modify backend logic unless explicitly stated
- Do NOT change unrelated tabs or features
- Prefer reuse of existing components
- Ask for clarification if implementation detail is unclear

---

## Purpose of This File

This file exists to:
- Prevent incorrect AI assumptions
- Standardize bug fixes
- Preserve role separation (Student vs Admin)
- Ensure safe, minimal UI changes

END OF FILE


