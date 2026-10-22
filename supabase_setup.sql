-- ==============================================================================
-- AL-NOOR ACADEMY: SUPABASE DATABASE SCHEMA (FULL SETUP)
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create or update profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  selected_course TEXT DEFAULT 'quran-reading',
  preferred_language TEXT DEFAULT 'english',
  scheduled_days TEXT,
  scheduled_time TEXT,
  is_online BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure is_online column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'is_online'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_online BOOLEAN DEFAULT false;
  END IF;
-- Ensure photo_url column exists in profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN photo_url TEXT;
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grants for full access to profiles
GRANT ALL ON TABLE public.profiles TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon updates for class status" ON public.profiles;
CREATE POLICY "Allow anon updates for class status"
  ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for profiles" ON public.profiles;
CREATE POLICY "Allow delete for profiles"
  ON public.profiles FOR DELETE USING (true);

-- Trigger function to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    selected_course,
    preferred_language,
    scheduled_days,
    scheduled_time,
    is_online,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'selected_course', 'quran-reading'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'english'),
    COALESCE(NEW.raw_user_meta_data->>'scheduled_days', ''),
    COALESCE(NEW.raw_user_meta_data->>'scheduled_time', ''),
    false,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    selected_course = EXCLUDED.selected_course,
    preferred_language = EXCLUDED.preferred_language,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users into public.profiles
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  selected_course,
  preferred_language,
  scheduled_days,
  scheduled_time,
  is_online,
  updated_at
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Student'),
  COALESCE(raw_user_meta_data->>'selected_course', 'quran-reading'),
  COALESCE(raw_user_meta_data->>'preferred_language', 'english'),
  COALESCE(raw_user_meta_data->>'scheduled_days', ''),
  COALESCE(raw_user_meta_data->>'scheduled_time', ''),
  false,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  selected_course = EXCLUDED.selected_course,
  preferred_language = EXCLUDED.preferred_language,
  updated_at = NOW();

-- Realtime for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;


-- ==============================================================================
-- 2. TEACHERS TABLE SETUP & MIGRATION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  location TEXT,
  specialization TEXT,
  language TEXT,
  status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure additional columns exist if table was created previously
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teachers' AND column_name='email') THEN
    ALTER TABLE public.teachers ADD COLUMN email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teachers' AND column_name='photo_url') THEN
    ALTER TABLE public.teachers ADD COLUMN photo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teachers' AND column_name='location') THEN
    ALTER TABLE public.teachers ADD COLUMN location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teachers' AND column_name='status') THEN
    ALTER TABLE public.teachers ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
END $$;

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public teachers are viewable by everyone" ON public.teachers;
CREATE POLICY "Public teachers are viewable by everyone"
  ON public.teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for teachers" ON public.teachers;
CREATE POLICY "Allow insert for teachers"
  ON public.teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for teachers" ON public.teachers;
CREATE POLICY "Allow update for teachers"
  ON public.teachers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for teachers" ON public.teachers;
CREATE POLICY "Allow delete for teachers"
  ON public.teachers FOR DELETE USING (true);

-- Realtime for teachers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'teachers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
  END IF;
END $$;


-- ==============================================================================
-- 3. COURSES TABLE SETUP & MIGRATION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON public.courses;
CREATE POLICY "Public courses are viewable by everyone"
  ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert for courses" ON public.courses;
CREATE POLICY "Allow insert for courses"
  ON public.courses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for courses" ON public.courses;
CREATE POLICY "Allow update for courses"
  ON public.courses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for courses" ON public.courses;
CREATE POLICY "Allow delete for courses"
  ON public.courses FOR DELETE USING (true);

-- Realtime for courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'courses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
  END IF;
END $$;


-- ==============================================================================
-- 4. SUPABASE STORAGE BUCKET: AVATARS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to avatar images
DROP POLICY IF EXISTS "Public avatars are viewable by everyone" ON storage.objects;
CREATE POLICY "Public avatars are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow uploading avatar files
DROP POLICY IF EXISTS "Allow uploads to avatars" ON storage.objects;
CREATE POLICY "Allow uploads to avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

-- Allow updating avatar files
DROP POLICY IF EXISTS "Allow updates to avatars" ON storage.objects;
CREATE POLICY "Allow updates to avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars');

-- Allow deleting avatar files
DROP POLICY IF EXISTS "Allow deletes from avatars" ON storage.objects;
CREATE POLICY "Allow deletes from avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');


-- ==============================================================================
-- 5. SUBSCRIPTION REQUESTS TABLE (START LEARNING)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  city TEXT NOT NULL,
  what_to_learn TEXT NOT NULL,
  preferred_time_slot TEXT NOT NULL,
  preferred_duration TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.subscription_requests TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for subscription_requests" ON public.subscription_requests;
CREATE POLICY "Allow anon inserts for subscription_requests"
  ON public.subscription_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for subscription_requests" ON public.subscription_requests;
CREATE POLICY "Allow read for subscription_requests"
  ON public.subscription_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for subscription_requests" ON public.subscription_requests;
CREATE POLICY "Allow update for subscription_requests"
  ON public.subscription_requests FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for subscription_requests" ON public.subscription_requests;
CREATE POLICY "Allow delete for subscription_requests"
  ON public.subscription_requests FOR DELETE USING (true);

-- Realtime for subscription_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'subscription_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subscription_requests;
  END IF;
END $$;

-- Add applicant_type, student_name, and residential_country to subscription_requests if they do not exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscription_requests' AND column_name='applicant_type') THEN
    ALTER TABLE public.subscription_requests ADD COLUMN applicant_type TEXT DEFAULT 'student';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscription_requests' AND column_name='student_name') THEN
    ALTER TABLE public.subscription_requests ADD COLUMN student_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='subscription_requests' AND column_name='residential_country') THEN
    ALTER TABLE public.subscription_requests ADD COLUMN residential_country TEXT;
  END IF;
END $$;


-- ==============================================================================
-- 6. TUTOR BOOKINGS TABLE (SELECT TUTOR MODAL FLOW)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tutor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT,
  teacher_name TEXT NOT NULL,
  applicant_type TEXT DEFAULT 'student',
  applicant_name TEXT NOT NULL,
  student_name TEXT,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  residential_country TEXT,
  city TEXT NOT NULL,
  learning_goal TEXT NOT NULL,
  preferred_time_slot TEXT NOT NULL,
  preferred_duration TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tutor_bookings ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.tutor_bookings TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow anon inserts for tutor_bookings"
  ON public.tutor_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow read for tutor_bookings"
  ON public.tutor_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow update for tutor_bookings"
  ON public.tutor_bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow delete for tutor_bookings"
  ON public.tutor_bookings FOR DELETE USING (true);

-- Add residential_country to tutor_bookings if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tutor_bookings' AND column_name='residential_country') THEN
    ALTER TABLE public.tutor_bookings ADD COLUMN residential_country TEXT;
  END IF;
END $$;

-- Realtime for tutor_bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tutor_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tutor_bookings;
  END IF;
END $$;


