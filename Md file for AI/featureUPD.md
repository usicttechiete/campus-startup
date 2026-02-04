# featureUPD.md
## Feature Update Context for Windsurf / ChatGPT Codex

This file documents **recent feature updates and UX changes** proposed for the platform.
It must be used alongside `@PROJECT_ANALYSIS.md` as contextual guidance.

Do NOT introduce features beyond what is explicitly described here.

---

## 🔹 Internship Tab Updates

### 1. Enhanced Internship Postcards

**What Changed**
Internship cards must now display key information directly on the card instead of hiding it inside the detail page.

**Required Fields on Internship Card**
- Duration (e.g., 3 months)
- Stipend / Compensation
- Location (Remote / On-campus / Hybrid)
- Work type (Internship / Part-time / Full-time)
- Application deadline

**Why**
- Faster decision making
- Fewer unnecessary clicks
- Aligns with platforms like Unstop and Internshala

**Implementation Notes**
- Create a reusable `InternshipCard` component
- Use strong visual hierarchy:
  - Title → Organization → Key metadata
- Use icons for stipend, duration, and location
- Must be mobile-responsive

---

### 2. Filters & Sorting System (Internships)

**What Changed**
Internship listings must support filtering and sorting.

**Filters**
- Skill required
- Duration
- Paid / Unpaid
- Location
- Work type

**Sorting Options**
- Latest
- Highest stipend
- Shortest duration
- Closing soon

**Implementation Notes**
- Filters should be frontend-driven
- Filter state should persist in the URL
- Search input must be debounced
- Backend-compatible query structure (do not hardcode)

---

### 3. Application Confirmation Feedback

**What Changed**
After applying for internships or events, users must receive confirmation feedback.

**Confirmation Types**
- Modal pop-up
- Toast notification
- (Future) Email notification

**Example Message**
“Application submitted successfully. The organizer will contact you if shortlisted.”

**Implementation Notes**
- Trigger confirmation only after successful API response
- Use a centralized notification component
- Prevent duplicate applications via UI feedback

---

## 🔹 Events Tab Updates

### 1. Improved Event Postcards

**What Changed**
Event cards must clearly show scheduling and location details.

**Required Fields on Event Card**
- Event date range
- Start and end time
- Location (Campus / Online / Hybrid)
- Registration status

**Implementation Notes**
- Extend existing `EventCard` component
- Use compact timeline indicators
- Add location badges
- Highlight current event stage visually

---

### 2. Save / Star Events for Later

**What Changed**
Users can bookmark events they want to revisit later.

**Behavior**
- Star icon on event cards
- Saved events visible in:
  - Profile tab
  - Events tab
- Save state persists across sessions

**Implementation Notes**
- Toggle-based save state
- Store saved events in user profile
- Use optimistic UI updates

---

## 🔹 Profile Tab Updates

### 1. Privacy Controls

**What Changed**
Users now control visibility of their profile information.

**Privacy Levels**
- Public
- Friends / Followers only
- Private

**Controllable Fields**
- Projects
- Skills
- Activity status
- Availability

**Implementation Notes**
- Per-field privacy configuration
- Conditional rendering on frontend
- Backend-ready permission flags

---

### 2. Activity Indicator (Online / Offline)

**What Changed**
Profiles now show whether a user is active.

**States**
- Online
- Offline
- Idle (optional)

**Implementation Notes**
- WebSocket or polling-based solution
- Heartbeat mechanism
- Must respect privacy settings

---

### 3. Availability Status (Projects / Internships)

**What Changed**
Users can declare availability for opportunities.

**Status Options**
- Available for internships
- Available for projects
- Not currently available

**Implementation Notes**
- Simple toggle in profile
- Visible availability badge on profile cards
- Used as a filter in:
  - Hiring tab
  - Internship tab

---

## ✅ Constraints & Notes

- All changes are incremental
- No backend implementation required
- Assume APIs already exist
- Do not invent new roles or features
- Reuse existing components where possible
- UX must remain clean and professional

---

## 📌 Purpose of This File

This file exists to:
- Provide implementation clarity
- Prevent feature misinterpretation
- Maintain consistency across UI components
- Align Windsurf output with real-world platforms (Unstop, Internshala)

END OF FILE
