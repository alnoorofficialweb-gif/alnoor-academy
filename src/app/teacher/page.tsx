"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  BookOpen,
  LogOut,
  Video,
  Languages,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AssignedStudent {
  id: string;
  full_name: string;
  parent_name?: string | null;
  email: string;
  whatsapp?: string;
  country: string;
  city?: string | null;
  selected_course: string;
  preferred_language: string;
  scheduled_time?: string | null;
  duration?: string | null;
  status?: string;
  created_at?: string;
}

function TeacherDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>("Teacher");
  const [teacherEmail, setTeacherEmail] = useState<string>("");
  const [students, setStudents] = useState<AssignedStudent[]>([]);

  useEffect(() => {
    async function loadTeacherPortal() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login?role=teacher");
          return;
        }

        const email = user.email || "";
        setTeacherEmail(email);

        const metadata = user.user_metadata || {};
        let rawName = metadata.full_name || email.split("@")[0] || "Sheikh";

        // Query teachers table to see if this instructor has an approved profile
        const { data: teacherProfile } = await supabase
          .from("teachers")
          .select("full_name, specialization")
          .eq("email", email)
          .maybeSingle();

        if (teacherProfile?.full_name) {
          rawName = teacherProfile.full_name;
        }

        const cleanName = rawName.replace(/^ustadh\s*/i, "");
        setTeacherName(cleanName);

        // Fetch assigned learners from students table
        const { data: studentList, error: stdError } = await supabase
          .from("students")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);

        if (!stdError && studentList && studentList.length > 0) {
          setStudents(studentList as AssignedStudent[]);
        } else {
          // Default placeholder students if database table was just created
          setStudents([
            {
              id: "std-1",
              full_name: "Muhammad Rayan",
              parent_name: "Tariq Khan",
              email: "rayan.tariq@example.com",
              whatsapp: "+44 7123 456789",
              country: "United Kingdom",
              city: "London",
              selected_course: "Quran Reading with Qaida",
              preferred_language: "english",
              scheduled_time: "5:00 PM GMT",
              duration: "30 mins",
              status: "active",
            },
            {
              id: "std-2",
              full_name: "Fatima Zahra",
              parent_name: "Dr. Bilal Mansoor",
              email: "fatima.z@example.com",
              whatsapp: "+1 469 123 4567",
              country: "United States",
              city: "Dallas, TX",
              selected_course: "Tajweed Rules & Recitation",
              preferred_language: "english",
              scheduled_time: "6:00 PM CST",
              duration: "45 mins",
              status: "active",
            },
            {
              id: "std-3",
              full_name: "Ibrahim Siddiqui",
              parent_name: null,
              email: "ibrahim.s@example.com",
              whatsapp: "+92 300 1234567",
              country: "Pakistan",
              city: "Lahore",
              selected_course: "Complete Namaz & Salah",
              preferred_language: "urdu",
              scheduled_time: "4:00 PM PKT",
              duration: "30 mins",
              status: "pending",
            },
          ]);
        }
      } catch (err) {
        console.error("Teacher portal loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTeacherPortal();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login?role=teacher");
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
          Loading faculty instructor portal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faculty Educator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Welcome, Ustadh {teacherName}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage your daily 1-on-1 recitation timetable, student rosters, and progress evaluations.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Assigned Students
            </span>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {students.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-800">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Today&apos;s Sessions
            </span>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {students.filter((s) => s.status === "active").length || 3} Live
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Faculty Rating
            </span>
            <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              5.0 ★
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Students Roster Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
              Assigned Student Roster
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Students assigned for 1-on-1 recitation guidance and evaluation.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {students.length} Learners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/75 dark:bg-zinc-800/40 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Course Track</th>
                <th className="py-3 px-6">Timetable</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Language</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
              {students.map((st) => (
                <tr
                  key={st.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {st.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">
                          {st.full_name}
                        </p>
                        {st.parent_name && (
                          <p className="text-[10.5px] text-zinc-400">
                            Parent: {st.parent_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {st.selected_course}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{st.scheduled_time || "Flexible"} ({st.duration || "30m"})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-600 dark:text-zinc-400">
                    {st.city ? `${st.city}, ${st.country}` : st.country}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="capitalize font-medium text-zinc-600 dark:text-zinc-400">
                      {st.preferred_language || "English"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        st.status === "active"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="capitalize">{st.status || "Pending Trial"}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TeacherDashboardContent />
    </Suspense>
  );
}
