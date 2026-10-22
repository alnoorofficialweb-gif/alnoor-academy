"use client";

import React, { useState } from "react";
import Link from "next/link";
import TeacherCard, { TeacherData } from "@/components/TeacherCard";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import BookTutorModal from "@/components/BookTutorModal";
import { Users, Search, GraduationCap, ArrowRight } from "lucide-react";

const LANGUAGE_OPTIONS: DropdownOption[] = [
  { value: "All", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Urdu", label: "Urdu" },
  { value: "Arabic", label: "Arabic" },
];

const TEACHERS: TeacherData[] = [
  {
    id: "sheikh-ahmad",
    name: "Sheikh Ahmad Al-Mansoor",
    title: "Senior Quran Reciter & Tajweed Specialist",
    gender: "Male",
    specialization: "Tajweed & Qira'at",
    language: "English & Arabic",
    experience: "12 Years",
    rating: "5.0",
    studentsCount: 140,
  },
  {
    id: "ustadha-maryam",
    name: "Ustadha Maryam Siddiqui",
    title: "Certified Hafiza & Children Educator",
    gender: "Female",
    specialization: "Noorani Qaida & Hifz",
    language: "English & Urdu",
    experience: "8 Years",
    rating: "4.9",
    studentsCount: 110,
  },
  {
    id: "qari-bilal",
    name: "Qari Bilal Al-Hussaini",
    title: "Ijazah Holder in Hafs an Asim",
    gender: "Male",
    specialization: "Tarteel & Memorization",
    language: "English",
    experience: "10 Years",
    rating: "5.0",
    studentsCount: 95,
  },
  {
    id: "ustadha-fatima",
    name: "Ustadha Fatima Zahra",
    title: "Islamic Studies & Female Quran Mentor",
    gender: "Female",
    specialization: "Islamic Basics & Dua",
    language: "English & Urdu",
    experience: "7 Years",
    rating: "5.0",
    studentsCount: 85,
  },
  {
    id: "sheikh-tariq",
    name: "Sheikh Tariq Abdullah",
    title: "Al-Azhar Graduate & Arabic Scholar",
    gender: "Male",
    specialization: "Quranic Arabic & Tajweed",
    language: "Arabic & English",
    experience: "14 Years",
    rating: "4.9",
    studentsCount: 160,
  },
  {
    id: "ustadha-zainab",
    name: "Ustadha Zainab Khan",
    title: "Beginner Specialist & Qaida Mentor",
    gender: "Female",
    specialization: "Noorani Qaida for Kids",
    language: "English & Urdu",
    experience: "6 Years",
    rating: "5.0",
    studentsCount: 75,
  },
];

export default function TeachersPage() {
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState<TeacherData | null>(null);

  const filteredTeachers = TEACHERS.filter((teacher) => {
    const matchesGender =
      selectedGender === "All" || teacher.gender === selectedGender;
    const matchesLanguage =
      selectedLanguage === "All" ||
      teacher.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGender && matchesLanguage && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Certified Educators</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          Meet Our Faculty Scholars
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Ijazah-certified male and female tutors dedicated to providing patient, structured 1-on-1 recitation guidance.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 app-card">
        {/* Gender Filter */}
        <div className="flex items-center gap-1 w-full md:w-auto">
          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Tutor:
          </span>
          {["All", "Male", "Female"].map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setSelectedGender(gender)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedGender === gender
                  ? "bg-[#064e3b] dark:bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {gender === "All" ? "All Genders" : `${gender} Tutors`}
            </button>
          ))}
        </div>

        {/* Language Filter & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Custom Language Dropdown */}
          <CustomDropdown
            value={selectedLanguage}
            options={LANGUAGE_OPTIONS}
            onChange={setSelectedLanguage}
            className="w-full sm:w-36"
            buttonClassName="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
          />

          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Teachers */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onSelect={(t) => setSelectedTeacherForBooking(t)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 space-y-2">
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No tutors match your preferences</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Try adjusting your gender, language or search parameters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedGender("All");
              setSelectedLanguage("All");
              setSearchQuery("");
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            Reset Preferences
          </button>
        </div>
      )}

      {/* Apply Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 app-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
            Are you a certified Islamic Scholar or Quran Reciter?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Join our global faculty and teach eager students with flexible remote hours.
          </p>
        </div>
        <Link
          href="/teacher-apply"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors shrink-0 cursor-pointer"
        >
          <span>Apply as Teacher</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dedicated Book/Select Tutor Modal */}
      <BookTutorModal
        teacher={selectedTeacherForBooking}
        isOpen={!!selectedTeacherForBooking}
        onClose={() => setSelectedTeacherForBooking(null)}
      />
    </div>
  );
}
