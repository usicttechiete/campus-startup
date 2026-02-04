# Database Setup Instructions

## Required Changes for New User Registration Fields

The application now requires additional fields during user registration: name, college, course, branch, and year.

### 1. Update Database Schema

Run the following SQL script in your Supabase SQL editor to add the new columns:

```sql
-- Add new columns to the users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS course TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Add constraints to ensure data integrity
ALTER TABLE users 
ALTER COLUMN college SET NOT NULL,
ALTER COLUMN course SET NOT NULL,
ALTER COLUMN branch SET NOT NULL,
ALTER COLUMN year SET NOT NULL;

-- Add check constraint for year (typically 1-5 for most courses)
ALTER TABLE users 
ADD CONSTRAINT check_year_range CHECK (year >= 1 AND year <= 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college);
CREATE INDEX IF NOT EXISTS idx_users_course ON users(course);
CREATE INDEX IF NOT EXISTS idx_users_year ON users(year);
```

Alternatively, you can run the migration file:
```bash
# Copy the contents of migrate-users-table.sql and run in Supabase SQL editor
```

### 2. Clean Up Existing User Profiles

Since you mentioned you've already deleted accounts from the database, you can run the cleanup script to ensure all profiles are removed:

```bash
cd backend
node cleanup-users.js
```

### 3. Test with Seed Data (Optional)

To test the new structure, you can create a test user profile:

```bash
cd backend
node seed-user.js
```

### 4. Database Schema

After migration, your users table should have these columns:

- `id` (UUID, Primary Key)
- `email` (TEXT, NOT NULL)
- `name` (TEXT, NOT NULL)
- `role` (TEXT, NOT NULL)
- `college` (TEXT, NOT NULL) - **NEW**
- `course` (TEXT, NOT NULL) - **NEW**
- `branch` (TEXT, NOT NULL) - **NEW**
- `year` (INTEGER, NOT NULL, CHECK: 1-5) - **NEW**
- Other existing columns...

### 5. Application Changes

The application now:

1. **Registration Form**: Collects name, college, course, branch, and year during signup
2. **User Profile**: Stores additional fields in user metadata and database
3. **API**: New endpoint `PUT /api/users/profile` to update user profiles
4. **Validation**: Ensures all required fields are provided during registration

### Notes

- All new fields are required during registration
- Year field accepts values 1-5 (representing academic years)
- Existing authentication flow remains the same for login
- User metadata is stored in Supabase Auth and synced to the users table