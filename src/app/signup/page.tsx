"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/CustomDropdown";
import CountrySelect from "@/components/CountrySelect";
import { enrollStudentAction, validateStudentSignupEmailAction } from "@/app/actions/forms";
import { supabase } from "@/lib/supabase";

const COURSE_OPTIONS: DropdownOption[] = [
  { value: "quran-reading", label: "Quran Reading with Qaida" },
  { value: "tajweed-mastery", label: "Tajweed Rules & Recitation" },
  { value: "quran-memorization", label: "Quran Memorization (Hifz)" },
  { value: "islamic-basics", label: "Islamic Essentials & Duas" },
  { value: "namaz-salah", label: "Complete Namaz & Salah" },
  { value: "arabic-language", label: "Quranic Arabic Grammar" },
];

const LIVE_CLASS_OPTIONS: DropdownOption[] = [
  { value: "quran-reading-class", label: "Quran Reading Class" },
  { value: "tajweed-mastery-class", label: "Tajweed Mastery Class" },
  { value: "noorani-qaida-class", label: "Noorani Qaida Class" },
  { value: "islamic-essentials-class", label: "Islamic Essentials Class" },
];

const PROGRAM_TITLES: Record<string, { title: string; category: "course" | "class" }> = {
  "quran-reading": { title: "Quran Reading with Qaida", category: "course" },
  "tajweed-mastery": { title: "Tajweed Rules & Recitation", category: "course" },
  "quran-memorization": { title: "Quran Memorization (Hifz)", category: "course" },
  "islamic-basics": { title: "Islamic Essentials & Duas", category: "course" },
  "namaz-salah": { title: "Complete Namaz & Salah", category: "course" },
  "arabic-language": { title: "Quranic Arabic Grammar", category: "course" },

  "quran-reading-class": { title: "Quran Reading Class", category: "class" },
  "tajweed-mastery-class": { title: "Tajweed Mastery Class", category: "class" },
  "noorani-qaida-class": { title: "Noorani Qaida Class", category: "class" },
  "islamic-essentials-class": { title: "Islamic Essentials Class", category: "class" },
};

function SignUpFormContent() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");
  const classParam = searchParams.get("class");
  const teacherParam = searchParams.get("teacher");

  const initialKey = courseParam || classParam || "";
  const matchedProgram = initialKey ? PROGRAM_TITLES[initialKey] : null;

  const [isPreselected, setIsPreselected] = useState<boolean>(!!matchedProgram);
  const [studyCategory, setStudyCategory] = useState<"course" | "class">(
    matchedProgram?.category || "course"
  );
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [applicantType, setApplicantType] = useState<"student" | "parent">("student");
  const [name, setName] = useState("");
  const [childName, setChildName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [residentialCountry, setResidentialCountry] = useState("United Kingdom");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [course, setCourse] = useState(initialKey || "quran-reading");
  const [language, setLanguage] = useState("english");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const preselectedTitle = matchedProgram?.title || (courseParam ? courseParam.replace(/-/g, " ") : "");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !name.trim() ||
      (applicantType === "parent" && !childName.trim()) ||
      !email.trim() ||
      !whatsappNumber.trim() ||
      !residentialCountry.trim() ||
      !password.trim()
    ) {
      setErrorMessage("Please fill out all required fields, including account password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProgramName = PROGRAM_TITLES[course]?.title || course;
      const studentFullName = applicantType === "parent" ? childName.trim() : name.trim();
      const parentFullName = applicantType === "parent" ? name.trim() : null;

      // Pre-validation: prevent duplicate student signup or teacher email collision
      const validation = await validateStudentSignupEmailAction(email.trim());
      if (!validation.allowed) {
        setErrorMessage(validation.error || "This email cannot be used for registration.");
        setIsSubmitting(false);
        return;
      }

      // 1. Create real Supabase user in auth.users
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: studentFullName,
            parent_name: parentFullName,
            role: "student",
            selected_course: selectedProgramName,
            preferred_language: language,
            whatsapp: whatsappNumber.trim(),
            country: residentialCountry.trim(),
            city: city.trim() || null,
          },
        },
      });

      if (authError) {
        setErrorMessage(authError.message || "Failed to create Supabase account.");
        setIsSubmitting(false);
        return;
      }

      // 2. Also populate the custom students table
      await enrollStudentAction({
        fullName: studentFullName,
        parentName: parentFullName,
        email: email.trim(),
        whatsapp: whatsappNumber.trim(),
        country: residentialCountry.trim(),
        city: city.trim() || null,
        selectedCourse: selectedProgramName,
        preferredLanguage: language,
        scheduledTime: "Flexible",
        duration: "30 minutes",
        teacherName: teacherParam || null,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Submission exception:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
          {role === "teacher"
            ? "Faculty Portal"
            : isPreselected
            ? "Course Enrollment"
            : "3-Day Evaluation"}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          {role === "teacher"
            ? "Join Faculty Roster"
            : isPreselected && preselectedTitle
            ? `Enroll in ${preselectedTitle}`
            : "Start 3-Day Free Trial"}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {role === "teacher"
            ? "Guide eager students globally with flexible remote hours."
            : isPreselected && preselectedTitle
            ? "Complete your details below to activate your 1-on-1 trial lessons."
            : "1-on-1 personalized lessons. Zero credit card or commitment."}
        </p>
      </div>

      {/* App-Style Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 md:p-9 app-card shadow-sm space-y-6">
        
        {/* Role Selector Tabs (Centered & Compact) */}
        <div className="max-w-xs sm:max-w-sm mx-auto p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center gap-1 border border-zinc-200/70 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => {
              setRole("student");
              setSubmitted(false);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              role === "student"
                ? "bg-[#064e3b] text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Trial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("teacher");
              setSubmitted(false);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              role === "teacher"
                ? "bg-[#064e3b] text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Teacher Role</span>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              Account Created &amp; Trial Registered!
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              JazakAllah Khair <span className="font-semibold text-zinc-800 dark:text-zinc-200">{name}</span>. Your student account has been created and your 3-day free trial application for{" "}
              <span className="font-bold text-[#064e3b] dark:text-emerald-400">
                {PROGRAM_TITLES[course]?.title || course}
              </span>{" "}
              has been recorded.
            </p>

            <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto leading-relaxed">
              Please check your email to verify your address, or sign in now with your email and password to access your student portal.
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-400">Account Email:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">WhatsApp:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{whatsappNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Residential Country:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{residentialCountry}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/login?role=student"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:underline cursor-pointer"
              >
                Register another student
              </button>
            </div>
          </div>
        ) : role === "teacher" ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Faculty Instructor Application
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Teachers are verified through our formal academic onboarding board before access is granted.
            </p>
            <Link
              href="/teacher-apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <span>Go to Faculty Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Row 1: Applicant Role & Instruction Language Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  I am registering as *
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setApplicantType("student")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      applicantType === "student"
                        ? "bg-[#064e3b] text-white shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student (Myself)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApplicantType("parent")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      applicantType === "parent"
                        ? "bg-[#064e3b] text-white shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Parent (For Child)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Preferred Instruction Language *
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setLanguage("english")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      language === "english"
                        ? "bg-[#064e3b] text-white shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("urdu")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      language === "urdu"
                        ? "bg-[#064e3b] text-white shadow-xs"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    Urdu
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Names */}
            {applicantType === "parent" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Parent&apos;s Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Child / Student&apos;s Name *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rayan Khan (Age 9)"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Student&apos;s Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Bilal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Row 3: Email Address & WhatsApp Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +44 7123 456789 or +92 300 1234567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Residential Country & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CountrySelect
                label="Residential Country"
                value={residentialCountry}
                onChange={setResidentialCountry}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  City / Town
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. London, Birmingham, Dallas"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Password & Security Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Create Account Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Portal Access Guarantee
                </label>
                <div className="h-[42px] px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">Encrypted credentials for your 1-on-1 portal access.</span>
                </div>
              </div>
            </div>

            {/* Row 6: Course or Class Selector */}
            {isPreselected && preselectedTitle ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/60">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Selected Course Program
                      </p>
                      <span className="text-[10px] font-bold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {preselectedTitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreselected(false)}
                  className="text-xs font-bold text-[#064e3b] dark:text-emerald-400 hover:underline cursor-pointer self-start sm:self-auto"
                >
                  Change Course
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Choose What to Study <span className="text-red-500">*</span>
                </label>

                {/* Category Switcher & Dropdown in 2 Columns on Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200/70 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => {
                        setStudyCategory("course");
                        setCourse("quran-reading");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        studyCategory === "course"
                          ? "bg-[#064e3b] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>Course Programs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStudyCategory("class");
                        setCourse("quran-reading-class");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        studyCategory === "class"
                          ? "bg-[#064e3b] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span>Live Classes</span>
                    </button>
                  </div>

                  <div>
                    {studyCategory === "course" ? (
                      <CustomDropdown
                        value={course}
                        options={COURSE_OPTIONS}
                        onChange={setCourse}
                        buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 py-2.5"
                      />
                    ) : (
                      <CustomDropdown
                        value={course}
                        options={LIVE_CLASS_OPTIONS}
                        onChange={setCourse}
                        buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 py-2.5"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#064e3b] hover:bg-[#04382a] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Book 3-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Alternate Link to Login */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already enrolled in classes?{" "}
          <Link href="/login" className="font-bold text-[#064e3b] dark:text-emerald-400 hover:underline">
            Sign In here
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpFormContent />
    </Suspense>
  );
}
