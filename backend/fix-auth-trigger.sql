-- Migration script to fix the handle_new_user trigger
-- This script updates the trigger to correctly handle the new required fields
-- (college, course, branch, year) by extracting them from user metadata.

-- 1. Drop the existing trigger and function to ensure a clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Re-create the function with updated logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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
    -- Extract fields from raw_user_meta_data
    -- Use COALESCE to handle potential missing values (though frontend requires them)
    COALESCE(new.raw_user_meta_data ->> 'name', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(new.raw_user_meta_data ->> 'college', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'course', 'Unknown'),
    COALESCE(new.raw_user_meta_data ->> 'branch', 'Unknown'),
    -- Cast year to integer, default to 1 if missing/invalid
    COALESCE((new.raw_user_meta_data ->> 'year')::integer, 1)
  );
  RETURN new;
END;
$$;

-- 3. Re-create the trigger to run after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verification instruction:
-- After running this, try signing up a new user. 
-- The 422/400 errors should be resolved.
