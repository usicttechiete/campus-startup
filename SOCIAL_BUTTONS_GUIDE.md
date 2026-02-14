# ✅ Social Media Buttons - Complete Setup!

## 🎉 What's Been Done:

### 1. **Component Updated** ✅
- Social buttons are **ALWAYS visible** now
- Shows **grayed out** icons when URLs are empty
- Shows small hint: "Add your social links in profile settings"

### 2. **Profile Edit Form Created** ✅  
- Added input fields for LinkedIn, GitHub, and  LeetCode
- Located in **Profile Tab** → **Edit Profile** → **Social Connections** section
- Saves directly to your database when you click "Save Changes"

### 3. **Database Schema Ready** ✅
- SQL migration file created: `add-social-urls.sql`
- Instructions provided: `SOCIAL_LINKS_SETUP.md`

---

## 📍 Where to Find the Buttons:

### **Option 1: Sidebar (Always Visible)**
Go to your profile page and look at the **left sidebar**:

```
┌─────────────────────────────────┐
│  [Profile Picture]              │
│  Your Name                      │
│  STUDENT                        │
├─────────────────────────────────┤
│  AVAILABILITY STATUS            │
│  Available          [●──]       │
│  Open for work                  │
├─────────────────────────────────┤
│  CONNECT WITH ME                │
│  [in] [gh] [lc]  ← HERE!       │
│  (Add your social links)        │
└─────────────────────────────────┘
```

The buttons show as **grayed out icons** until you add URLs.

---

## 📝 How to Add Your Social Links:

### **Step 1: Add Database Columns** (One-time setup)

1. Open **Supabase Dashboard** → https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Click **"New Query"**
4. Paste and run:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS leetcode_url TEXT;
```

### **Step 2: Add Your Links in the App**

1. Go to your **Profile Page**
2. Click the **"Profile" tab**
3. Click **"Edit Profile"** button
4. Scroll down to **"Social Connections"** section
5. Enter your URLs:
   - **LinkedIn**: `https://linkedin.com/in/yourprofile`
   - **GitHub**: `https://github.com/yourusername`
   - **LeetCode**: `https://leetcode.com/yourusername`
6. Click **"Save Changes"**

### **Step 3: See the Magic!** ✨

Once saved:
- The **grayed buttons become active**
- **Hover effects** work (scale up, color change)
- **Clicking** opens your profile in a new tab
- Shows in **sidebar** AND in **Profile tab** (as colored badges)

---

## 🎨 Visual Guide:

### **Before Adding URLs:**
```
CONNECT WITH ME
[in] [gh] [lc]  ← All grayed out
(Add your social links in profile settings)
```

### **After Adding LinkedIn Only:**
```
CONNECT WITH ME
[in]  [gh]  [lc]
 ↑     ↑     ↑
blue  gray  gray
```

### **After Adding All URLs:**
```
CONNECT WITH ME
[in]   [gh]    [lc]
 ↑      ↑       ↑
blue   dark    orange
(All active with hover effects!)
```

---

## 🔍 Where Buttons Appear:

### **1. Profile Sidebar** (Left side, always visible)
- Icon-only buttons
- Compact, space-efficient
- Part of availability status section

### **2. Profile Tab** (When viewing your own profile)
- Colored badge buttons with text
- LinkedIn (blue), GitHub (gray), LeetCode (orange)
- Shows below your academic info

---

## 🚀 Quick Test:

1. **Add database columns** (Step 1 above)
2. **Refresh** your profile page
3. You should see **3 grayed icons** in the sidebar
4. Click **"Edit Profile"**
5. See the **Social Connections** section with 3 input fields
6. Add at least one URL and **save**
7. Watch the button **turn blue!** 🎉

---

## 💡 Tips:

- URLs must start with `https://` or `http://`
- Leave blank if you don't have an account
- You can edit anytime by clicking "Edit Profile"
- Changes save to database and update instantly

---

## ❓ Troubleshooting:

**Problem**: Buttons not showing
- **Solution**: Make sure you ran the SQL migration (Step 1)

**Problem**: Can't see input fields
- **Solution**: Click "Edit Profile" button, scroll to "Social Connections"

**Problem**: Buttons still grayed out after  saving
- **Solution**: Check if URL was saved correctly in Supabase Table Editor

---

Need help? Let me know! 🎯
