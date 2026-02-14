# 🔗 Add Social Media Links to Profile

## Step 1: Add Database Fields

You need to add three new columns to your `users` table in Supabase.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your **Supabase Dashboard** → `https://supabase.com/dashboard`
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Paste this SQL and click **"Run"**:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS leetcode_url TEXT;
```

6. Wait for "Success" message

### Option B: Using Table Editor

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select **"users"** table
3. Click **"+"** to add a new column, and add each of these:
   - **Column name**: `linkedin_url`, **Type**: `text`, leave nullable
   - **Column name**: `github_url`, **Type**: `text`, leave nullable
   - **Column name**: `leetcode_url`, **Type**: `text`, leave nullable

---

## Step 2: See the Buttons!

Once you've added the database fields, **refresh your profile page** and you'll now see:

```
┌─────────────────────────────────┐
│  Available              [●──]   │
│  Open for work                  │
├─────────────────────────────────┤
│  CONNECT WITH ME                │
│  [in] [gh] [lc]  ← THESE!      │
│  (grayed out until you add URLs)│
└─────────────────────────────────┘
```

The buttons are **always visible now**, but disabled (grayed out) until you add your social URLs.

---

## Step 3: Add Your Social Links (Coming Next!)

I'll create an interface for you to edit these links. For now, you can add them directly in Supabase:

1. Go to **Table Editor** → **users** table
2. Find your user row
3. Click to edit
4. Add your URLs:
   - **linkedin_url**: `https://linkedin.com/in/yourprofile`
   - **github_url**: `https://github.com/yourusername`
   - **leetcode_url**: `https://leetcode.com/yourusername`

Once added, the buttons will become active and clickable! 🎉

---

## What Changed?

✅ **Social buttons are ALWAYS visible** (no more hiding)  
✅ **Shows grayed out icons** when URLs are empty  
✅ **Becomes active** when you add URLs  
✅ **Small hint text** "Add your social links in profile settings"  
✅ **Smooth animations** and hover effects when active  

---

## Visual Comparison:

**Before** (buttons hidden):
```
Available    [●──]
Open for work
──────────────────
(nothing here)
```

**After** (buttons visible):
```
Available    [●──]
Open for work
──────────────────
CONNECT WITH ME
[in] [gh] [lc]
(Add your social links)
```

---

Need help with any step? Let me know!
