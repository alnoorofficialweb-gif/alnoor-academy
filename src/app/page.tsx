import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  Calendar,
  Award,
  Video,
  Globe,
  Star,
} from "lucide-react";
import CourseCard, { CourseData } from "@/components/CourseCard";
import FaqSection from "@/components/FaqSection";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";
import AnimatedProgramButton from "@/components/AnimatedProgramButton";

const FEATURED_COURSES: CourseData[] = [
  {
    id: "quran-reading",
    title: "Quran Reading with Qaida",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 24,
    description: "Step-by-step Arabic letter phonetics, Makharij & joining.",
    highlights: [
      "Noorani Qaida Track",
      "Makharij Phonetics",
      "1-on-1 Child Friendly",
    ],
  },
  {
    id: "tajweed-mastery",
    title: "Tajweed Rules & Recitation",
    level: "Intermediate",
    duration: "45 mins / day",
    lessons: 36,
    description: "Master melodic recitation with precise articulation rules.",
    highlights: [
      "Noon & Meem Rules",
      "Tarteel Fluency",
      "Live Teacher Correction",
    ],
  },
  {
    id: "islamic-basics",
    title: "Islamic Essentials & Duas",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 20,
    description: "Essential daily supplications, Sunnah manners & Adab.",
    highlights: [
      "Daily Masnoon Duas",
      "Prophetic Character",
      "All Ages Friendly",
    ],
  },
  {
    id: "namaz-salah",
    title: "Complete Namaz & Salah",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 16,
    description: "Step-by-step masterclass on Wudu, postures & recitation.",
    highlights: [
      "Wudu & Cleanliness",
      "Word-by-Word Salah",
      "Prayer Corrections",
    ],
  },
];

const PILLARS = [
  {
    title: "1-on-1 Focus",
    description: "Dedicated personal attention tailored to your exact pace and learning style.",
    icon: Users,
  },
  {
    title: "Certified Scholars",
    description: "Verified native teachers and Ijazah holders graduated from reputable institutions.",
    icon: Award,
  },
  {
    title: "Flexible Timetable",
    description: "Choose class times that seamlessly fit your school, work, or family commitments.",
    icon: Calendar,
  },
  {
    title: "Interactive Classroom",
    description: "Crystal clear audio-video call with digital screen sharing and pronunciation boards.",
    icon: Video,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register for Trial",
    description: "Fill out a 30-second form with zero financial commitment or credit card.",
  },
  {
    step: "02",
    title: "Meet Your Tutor",
    description: "Attend a live 1-on-1 evaluation to assess level and define learning targets.",
  },
  {
    step: "03",
    title: "Start Learning",
    description: "Begin regular classes with weekly progress tracking and continuous support.",
  },
];

const TESTIMONIALS = [
  {
    name: "Tariq Mahmood",
    initials: "TM",
    avatarBg: "bg-emerald-700",
    role: "Parent of 2 • London, UK",
    course: "Tajweed & Qaida",
    rating: 5,
    quote:
      "My 7-year-old was struggling with Makharij at our local weekend madrasah. Sheikh Farooq connected with him immediately over the interactive board. In just 3 months, his letter pronunciation was sharper than mine.",
  },
  {
    name: "Dr. Ayesha Siddiqa",
    initials: "AS",
    avatarBg: "bg-teal-800",
    role: "Physician • Dallas, TX",
    course: "Adult Tarteel Recitation",
    rating: 5,
    quote:
      "With unpredictable hospital shifts, finding a certified female teacher who accommodates 6:30 AM CST was a blessing. Ustadha Fatima never rushes, thoroughly auditing my Waqf and Ibtida rules every session.",
  },
  {
    name: "Omar & Maryam Khan",
    initials: "OK",
    avatarBg: "bg-[#064e3b]",
    role: "Parents • Mississauga, CA",
    course: "Youth Quran Memorization",
    rating: 5,
    quote:
      "What stood out was the structured weekly progress notes. We actually know exactly what Surah and revision targets our son covered each week. Patient tutors, clean audio-video, zero tech friction.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <span>Accepting New Students for 3-Day Free Trial</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.15]">
          Learn the Holy Quran Online with{" "}
          <span className="text-[#064e3b] dark:text-emerald-400">Certified Scholars</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Structured 1-on-1 classes in Quran reading, Tajweed, and Islamic fundamentals designed for kids and adults at your preferred schedule.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors text-center cursor-pointer"
          >
            Explore Courses
          </Link>
        </div>

        {/* 2. TRUST BAR & TIMEZONE INDICATOR (Single Row on Mobile) */}
        <div className="pt-6 sm:pt-8 space-y-3">
          <div className="w-full max-w-xl mx-auto grid grid-cols-3 items-center px-2 py-2 sm:px-6 sm:py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 app-card text-[10px] sm:text-xs font-semibold text-zinc-700 dark:text-zinc-200 divide-x divide-zinc-100 dark:divide-zinc-800 shadow-xs">
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-0.5 text-center min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">500+ Students</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-0.5 text-center min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#064e3b] dark:text-emerald-400 shrink-0" />
              <span className="truncate">20+ Scholars</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-0.5 text-center min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#064e3b] dark:text-emerald-400 shrink-0" />
              <span className="truncate">100% Guarantee</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400 shrink-0" />
            <span>Classes scheduled in your local timezone.</span>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS (Mobile-Optimized 2x2 Grid) */}
      <section className="max-w-6xl mx-auto px-2 sm:px-6">
        <div className="text-center max-w-lg mx-auto mb-6 sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-400 mb-1">
            Our Foundation
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Why Families Choose AL-Noor
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3.5 sm:p-5 app-card space-y-2 sm:space-y-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-snug sm:leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED COURSES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Courses
          </h2>
          <AnimatedProgramButton
            href="/courses"
            label="View All Programs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 STEPS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-lg mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-400 mb-1">
            Simple Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            How It Works in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 app-card relative"
            >
              <span className="text-2xl font-black text-emerald-800/20 dark:text-emerald-400/20 block mb-3">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS (Community Reviews) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-lg mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-400 mb-1">
            Community Reviews
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            What Our Families & Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 app-card flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {t.course}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3.5 border-t border-zinc-100 dark:border-zinc-800">
                <div
                  className={`w-9 h-9 rounded-full ${t.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{t.name}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQS SECTION */}
      <FaqSection />

      {/* 7. PREMIUM CTA BANNER (Screenshot 1 3D Vertical Architectural Ribbed Wave on Deep Dark Backdrop) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 sm:p-14 text-center space-y-5 shadow-2xl overflow-hidden border transition-all duration-300 bg-[#010906] border-emerald-800/50 text-white">
          
          {/* Live 3D Architectural Ribbed Slat Wave Sculpture (Screenshot 1 exact pattern) */}
          <ParticleWaveCanvas className="opacity-100" />

          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border bg-emerald-950/80 border-emerald-500/60 text-emerald-200">
              Zero Obligation • Free 3-Day Trial
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              Ready to Start Your Quranic Journey?
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md mx-auto leading-relaxed">
              Master Tajweed, Hifz, and Quran recitation with certified 1-on-1 scholars.
            </p>
          </div>

          <div className="relative z-10 pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-zinc-950 hover:bg-emerald-50 shadow-lg transition-all cursor-pointer"
            >
              <span>Sign Up for Free Trial</span>
              <ArrowRight className="w-4 h-4 text-[#064e3b]" />
            </Link>
            <Link
              href="/teachers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold border text-emerald-100 hover:text-white hover:bg-white/10 border-emerald-500/60 transition-colors cursor-pointer"
            >
              <span>Meet the Faculty</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
