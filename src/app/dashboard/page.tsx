"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Languages,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StudentData {
  id?: string;
  full_name: string;
  parent_name?: string | null;
  email: string;
  whatsapp?: string;
  country?: string;
  city?: string | null;
  selected_course: string;
  preferred_language: string;
  scheduled_time?: string | null;
  duration?: string | null;
  status?: string;
  created_at?: string;
}

function StudentDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("Student");
  const [studentDetails, setStudentDetails] = useState<StudentData | null>(null);

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login?role=student");
          return;
        }

        const email = user.email || "";
        setUserEmail(email);

        const metadata = user.user_metadata || {};
        const metaName = metadata.full_name || metadata.student_name || "Student";
        setStudentName(metaName);

        // Fetch from custom students table matching email
        const { data: studentRecord, error: dbError } = await supabase
          .from("students")
          .select("*")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!dbError && studentRecord) {
          setStudentDetails(studentRecord as StudentData);
          if (studentRecord.full_name) {
            setStudentName(studentRecord.full_name);
          }
        } else {
          // Fallback to metadata if DB record is not yet synced
          setStudentDetails({
            full_name: metaName,
            email: email,
            selected_course: metadata.selected_course || "Quran Reading with Qaida",
            preferred_language: metadata.preferred_language || "english",
            scheduled_time: metadata.scheduled_time || "Flexible",
            duration: metadata.duration || "30 minutes",
            country: metadata.country || "United Kingdom",
            whatsapp: metadata.whatsapp || "",
            status: "active",
          });
        }
      } catch (err) {
        console.error("Dashboard profile loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStudentProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login?role=student");
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#064e3b] dark:border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          Loading your student portal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Al-Noor Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Welcome, {studentName}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage your Quranic study tracks, scheduled timetables, and learning resources.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Course & Schedule Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Selected Course Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 app-card shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Selected Program
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {studentDetails?.selected_course || "Quran Reading with Qaida"}
            </h3>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-zinc-400" />
              <span className="capitalize">{studentDetails?.preferred_language || "English"} Track</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              Active
            </span>
          </div>
        </div>

        {/* Schedule & Duration Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 app-card shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center border border-sky-100 dark:border-sky-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Class Schedule
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {studentDetails?.scheduled_time || "Flexible Timeslot"}
            </h3>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{studentDetails?.duration || "30 minutes"} / day</span>
            </span>
            <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
              1-on-1 Live
            </span>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 app-card shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center border border-purple-100 dark:border-purple-800">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Registered Profile
            </span>
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
              {userEmail}
            </p>
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
            <div className="flex justify-between">
              <span>Country:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {studentDetails?.country || "United Kingdom"}
              </span>
            </div>
            {studentDetails?.whatsapp && (
              <div className="flex justify-between">
                <span>WhatsApp:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {studentDetails.whatsapp}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Interactive Study Resources */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#03231a] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Continue Your Daily Quranic Practice
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-lg leading-relaxed">
            Practice pronunciation with our digital Noorani Qaida board or listen to authentic recitations from world-renowned scholars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/learning-hub/quran-qaida"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold">Interactive Quran Qaida</p>
                <p className="text-[11px] text-emerald-200/70">29 Letters &amp; Makharij Rules</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/audio"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold">Quran Audio Player</p>
                <p className="text-[11px] text-emerald-200/70">114 Surahs &amp; 5 Top Reciters</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
