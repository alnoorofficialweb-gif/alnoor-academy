-- ==============================================================================
-- AL-NOOR ACADEMY: COMPLETE DATABASE TABLES SCHEMA
-- Execute this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. STUDENTS TABLE (For Course & Trial Enrollments)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  parent_name TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  selected_course TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'english',
  scheduled_time TEXT,
  duration TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.students TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for students" ON public.students;
CREATE POLICY "Allow anon inserts for students" ON public.students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for students" ON public.students;
CREATE POLICY "Allow read for students" ON public.students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for students" ON public.students;
CREATE POLICY "Allow update for students" ON public.students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for students" ON public.students;
CREATE POLICY "Allow delete for students" ON public.students FOR DELETE USING (true);


-- 2. TEACHERS TABLE (For Faculty Applications & Profiles)
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  specialization TEXT,
  experience TEXT,
  sanad_details TEXT,
  cv_url TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure columns exist if table was already created
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.teachers TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for teachers" ON public.teachers;
CREATE POLICY "Allow anon inserts for teachers" ON public.teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for teachers" ON public.teachers;
CREATE POLICY "Allow read for teachers" ON public.teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for teachers" ON public.teachers;
CREATE POLICY "Allow update for teachers" ON public.teachers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for teachers" ON public.teachers;
CREATE POLICY "Allow delete for teachers" ON public.teachers FOR DELETE USING (true);


-- 3. CONTACT MESSAGES TABLE (For Admissions & Support Inquiries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.contact_messages TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for contact_messages" ON public.contact_messages;
CREATE POLICY "Allow anon inserts for contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for contact_messages" ON public.contact_messages;
CREATE POLICY "Allow read for contact_messages" ON public.contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for contact_messages" ON public.contact_messages;
CREATE POLICY "Allow update for contact_messages" ON public.contact_messages FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for contact_messages" ON public.contact_messages;
CREATE POLICY "Allow delete for contact_messages" ON public.contact_messages FOR DELETE USING (true);


-- 4. SCHOLAR QUESTIONS TABLE (For Ask the Sheikh Desk)
CREATE TABLE IF NOT EXISTS public.scholar_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.scholar_questions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.scholar_questions TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for scholar_questions" ON public.scholar_questions;
CREATE POLICY "Allow anon inserts for scholar_questions" ON public.scholar_questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for scholar_questions" ON public.scholar_questions;
CREATE POLICY "Allow read for scholar_questions" ON public.scholar_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for scholar_questions" ON public.scholar_questions;
CREATE POLICY "Allow update for scholar_questions" ON public.scholar_questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for scholar_questions" ON public.scholar_questions;
CREATE POLICY "Allow delete for scholar_questions" ON public.scholar_questions FOR DELETE USING (true);


-- 5. TUTOR BOOKINGS TABLE (For Direct Tutor Sessions)
CREATE TABLE IF NOT EXISTS public.tutor_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  teacher_id TEXT,
  teacher_name TEXT NOT NULL,
  time_slot TEXT,
  duration TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tutor_bookings ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.tutor_bookings TO postgres, service_role, authenticated, anon;

DROP POLICY IF EXISTS "Allow anon inserts for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow anon inserts for tutor_bookings" ON public.tutor_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow read for tutor_bookings" ON public.tutor_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow update for tutor_bookings" ON public.tutor_bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for tutor_bookings" ON public.tutor_bookings;
CREATE POLICY "Allow delete for tutor_bookings" ON public.tutor_bookings FOR DELETE USING (true);


-- 6. COURSES TABLE (For dynamic curriculum management)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  arabic_title TEXT,
  level TEXT DEFAULT 'Beginner',
  duration TEXT DEFAULT '30 mins / day',
  lessons INTEGER DEFAULT 24,
  monthly_fee TEXT DEFAULT '£40 / month',
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.courses TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for courses" ON public.courses;
CREATE POLICY "Allow all for courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

-- Insert default academy courses if not existing
INSERT INTO public.courses (slug, title, arabic_title, level, duration, lessons, monthly_fee, description, highlights)
VALUES
  ('quran-reading', 'Quran Reading with Qaida', 'قراءة القرآن مع القاعدة', 'Beginner', '30 mins / day', 24, '£40 / month', 'Step-by-step Arabic letter phonetics, Makharij & word joining.', ARRAY['Noorani Qaida Track', 'Makharij Phonetics', '1-on-1 Child Friendly']),
  ('tajweed-mastery', 'Tajweed Rules & Recitation', 'تجويد القرآن الكريم', 'Intermediate', '45 mins / day', 36, '£50 / month', 'Master melodic recitation with precise articulation rules.', ARRAY['Noon & Meem Rules', 'Tarteel Fluency', 'Live Teacher Correction']),
  ('quran-memorization', 'Quran Memorization (Hifz)', 'تحفيظ القرآن الكريم', 'Advanced', '45 mins / day', 48, '£60 / month', 'Structured daily Sabaq & Manzil revision with Huffaz.', ARRAY['Daily Hifz Targets', 'Rigorous Revision', 'Supervised by Huffaz']),
  ('islamic-basics', 'Islamic Essentials & Duas', 'الأساسيات الإسلامية والأدعية', 'Beginner', '30 mins / day', 20, '£35 / month', 'Essential daily supplications, Sunnah manners & Salah.', ARRAY['Daily Masnoon Duas', 'Prophetic Character', 'All Ages Friendly'])
ON CONFLICT (slug) DO NOTHING;


-- 7. ACADEMY SETTINGS TABLE (For global site configurations)
CREATE TABLE IF NOT EXISTS public.academy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.academy_settings ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.academy_settings TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for academy_settings" ON public.academy_settings;
CREATE POLICY "Allow all for academy_settings" ON public.academy_settings FOR ALL USING (true) WITH CHECK (true);

-- Insert default configurations
INSERT INTO public.academy_settings (setting_key, setting_value)
VALUES
  ('contact_info', '{"whatsapp": "+44 7458 198270", "phone": "+44 20 8123 4567", "email": "admissions@alnooracademy.com", "address": "London, United Kingdom"}'),
  ('class_slots', '["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]')
ON CONFLICT (setting_key) DO NOTHING;


-- 8. SCHEDULE & TIMETABLE SLOTS TABLE (Class Calendar & Teacher Allocations)
CREATE TABLE IF NOT EXISTS public.schedule_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  student_name TEXT NOT NULL,
  teacher_id UUID,
  teacher_name TEXT NOT NULL,
  day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', etc.
  time_slot TEXT NOT NULL,   -- '5:00 PM', '6:00 PM', etc.
  duration TEXT DEFAULT '30 mins',
  meeting_link TEXT DEFAULT 'https://meet.google.com/aln-quran-live',
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'rescheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.schedule_slots TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for schedule_slots" ON public.schedule_slots;
CREATE POLICY "Allow all for schedule_slots" ON public.schedule_slots FOR ALL USING (true) WITH CHECK (true);


-- 9. ATTENDANCE TABLE (Daily Class Tracking)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  student_name TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  class_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'present', -- 'present', 'absent', 'late', 'excused'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.attendance TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for attendance" ON public.attendance;
CREATE POLICY "Allow all for attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);


-- 10. ASSIGNMENTS TABLE (Homework & Recitation Tasks)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  surah_name TEXT,
  ayah_range TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'submitted', 'reviewed'
  score INTEGER DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.assignments TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for assignments" ON public.assignments;
CREATE POLICY "Allow all for assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);


-- 11. PAYMENTS TABLE (Tuition Fees & Invoicing)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  student_name TEXT NOT NULL,
  email TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  month TEXT NOT NULL,          -- e.g. 'October 2026'
  status TEXT DEFAULT 'paid',   -- 'paid', 'pending', 'overdue'
  payment_method TEXT DEFAULT 'Bank Transfer',
  invoice_no TEXT UNIQUE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.payments TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for payments" ON public.payments;
CREATE POLICY "Allow all for payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);


-- 12. QURAN PROGRESS TABLE (Daily Sabaq, Parah & Mistake Counter)
CREATE TABLE IF NOT EXISTS public.quran_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  student_name TEXT NOT NULL,
  current_surah TEXT NOT NULL,
  current_parah INTEGER DEFAULT 1,
  current_ayah INTEGER DEFAULT 1,
  mistake_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quran_progress ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.quran_progress TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for quran_progress" ON public.quran_progress;
CREATE POLICY "Allow all for quran_progress" ON public.quran_progress FOR ALL USING (true) WITH CHECK (true);


-- 13. NOTIFICATIONS TABLE (Academy Broadcasts & Student Alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_role TEXT DEFAULT 'all', -- 'all', 'students', 'teachers', 'specific'
  recipient_email TEXT,
  sent_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.notifications TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for notifications" ON public.notifications;
CREATE POLICY "Allow all for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);


-- 14. TEACHER PAYOUTS TABLE (Faculty Compensation Tracking)
CREATE TABLE IF NOT EXISTS public.teacher_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID,
  teacher_name TEXT NOT NULL,
  classes_taken INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10, 2) DEFAULT 12.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processed'
  month TEXT NOT NULL,
  payout_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_payouts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.teacher_payouts TO postgres, service_role, authenticated, anon;
DROP POLICY IF EXISTS "Allow all for teacher_payouts" ON public.teacher_payouts;
CREATE POLICY "Allow all for teacher_payouts" ON public.teacher_payouts FOR ALL USING (true) WITH CHECK (true);


-- Ensure new columns exist on existing students and teachers tables
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS assigned_teacher TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS attendance_pct INTEGER DEFAULT 100;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS lessons_completed INTEGER DEFAULT 0;

ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{"days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "hours": "4:00 PM - 9:00 PM"}';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS classes_taken INTEGER DEFAULT 0;


-- Enable Realtime publication for tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'students') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'teachers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'courses') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'scholar_questions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.scholar_questions;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tutor_bookings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tutor_bookings;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'schedule_slots') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_slots;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'payments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;


