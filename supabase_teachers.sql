-- ==============================================================================
-- AL-NOOR ACADEMY: TEACHERS & COURSES MIGRATION SCRIPT
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create or update teachers table
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

-- Ensure newly added columns exist in case table was created previously
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

-- 2. Create courses table
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
