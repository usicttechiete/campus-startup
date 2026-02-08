-- Comprehensive fix for Auth 500/400/422 Errors
-- Run this ENTIRE script in the Supabase SQL Editor.

-- 1. Safely add columns if they don't exist
DO $$
BEGIN
    -- Add college
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'college') THEN
        ALTER TABLE public.users ADD COLUMN college TEXT DEFAULT 'Unknown';
    END IF;

    -- Add course
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'course') THEN
        ALTER TABLE public.users ADD COLUMN course TEXT DEFAULT 'Unknown';
    END IF;

    -- Add branch
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'branch') THEN
        ALTER TABLE public.users ADD COLUMN branch TEXT DEFAULT 'Unknown';
    END IF;

    -- Add year
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'year') THEN
        ALTER TABLE public.users ADD COLUMN year INTEGER DEFAULT 1;
    END IF;
END $$;

-- 2. Ensure constraints exist (safe to run multiple times)
-- We use a separate block or simple ALTER statements that won't fail if data is valid
-- Update existing NULLs which might cause NOT NULL constraint failure
UPDATE public.users SET college = 'Unknown' WHERE college IS NULL;
UPDATE public.users SET course = 'Unknown' WHERE course IS NULL;
UPDATE public.users SET branch = 'Unknown' WHERE branch IS NULL;
UPDATE public.users SET year = 1 WHERE year IS NULL;

ALTER TABLE public.users ALTER COLUMN college SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN course SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN branch SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN year SET NOT NULL;

-- Drop check constraint if exists to avoid duplication error (Postgres doesn't support DROP CONSTRAINT IF EXISTS nicely in all versions without a DO block, but let's try standard approach or ignore if fails? No, better be safe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_year_range') THEN
        ALTER TABLE public.users DROP CONSTRAINT check_year_range;
    END IF;
END $$;

ALTER TABLE public.users ADD CONSTRAINT check_year_range CHECK (year >= 1 AND year <= 5);

-- 3. Fix the Trigger Function
-- Drop existing trigger/function to ensure clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  extracted_year INTEGER;
BEGIN
  -- Safe casting for year
  BEGIN
    extracted_year := (new.raw_user_meta_data ->> 'year')::integer;
  EXCEPTION WHEN OTHERS THEN
    extracted_year := 1;
  END;

  IF extracted_year IS NULL OR extracted_year < 1 OR extracted_year > 5 THEN
    extracted_year := 1;
  END IF;

  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    college,
    course,
    branch,
    year
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'name', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(new.raw_user_meta_data ->> 'college', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'course', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'branch', 'Unknown'),
    extracted_year
  );
  RETURN new;
END;
$$;

-- 4. Re-create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Optional: Create Indexes (IF NOT EXISTS is standard in Postgres)
CREATE INDEX IF NOT EXISTS idx_users_college ON public.users(college);
CREATE INDEX IF NOT EXISTS idx_users_course ON public.users(course);
CREATE INDEX IF NOT EXISTS idx_users_year ON public.users(year);
