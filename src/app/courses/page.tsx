"use client";

import React, { useState } from "react";
import Link from "next/link";
import CourseCard, { CourseData } from "@/components/CourseCard";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

const ALL_COURSES: CourseData[] = [
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
    id: "quran-memorization",
    title: "Quran Memorization (Hifz)",
    level: "Advanced",
    duration: "45 mins / day",
    lessons: 48,
    description: "Structured daily Sabaq & Manzil revision with Huffaz.",
    highlights: [
      "Daily Hifz Targets",
      "Rigorous Revision",
      "Supervised by Huffaz",
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
  {
    id: "arabic-language",
    title: "Quranic Arabic Grammar",
    level: "Advanced",
    duration: "45 mins / day",
    lessons: 32,
    description: "Understand the Quran through Sarf & Nahw principles.",
    highlights: [
      "Root Word Derivations",
      "Sentence Analysis",
      "Quranic Vocabulary",
    ],
  },
];

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          Structured Learning Courses
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          From basic letter phonetics to advanced Tajweed and Hifz. Every course is taught 1-on-1 by certified scholars.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 app-card">
        {/* Level Filters */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedLevel(level)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedLevel === level
                  ? "bg-[#064e3b] dark:bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-2">
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No courses match your filter</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Try selecting a different level or clearing your search term.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedLevel("All");
              setSearchQuery("");
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-xl border border-emerald-800/50 overflow-hidden bg-[#010906]">
        <ParticleWaveCanvas className="opacity-100" />

        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border bg-emerald-950/80 border-emerald-500/60 text-emerald-200">
            Zero Obligation • Free 3-Day Trial
          </span>

          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Find the Perfect Quran Course for Your Family
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md mx-auto leading-relaxed">
            Personalized 1-on-1 schedules tailored for kids, sisters, and adults.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-zinc-950 hover:bg-emerald-50 shadow-md transition-colors cursor-pointer"
            >
              <span>Start Free Trial Class</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#064e3b]" />
            </Link>
            <Link
              href="/teachers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border text-emerald-100 hover:text-white hover:bg-white/10 border-emerald-500/60 transition-colors cursor-pointer"
            >
              <span>Browse Instructors</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
