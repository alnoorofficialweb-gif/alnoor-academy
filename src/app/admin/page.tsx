import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Clock,
  ArrowUpRight,
  Database,
  Calendar,
  CheckCircle2,
  Mail,
  User,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const instant = false;

interface StudentRecord {
  id: string;
  full_name: string | null;
  email: string | null;
  selected_course: string | null;
  preferred_language: string | null;
  created_at: string;
  is_online?: boolean;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Recently";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function formatCourseName(courseSlug?: string | null): string {
  if (!courseSlug) return "Quran Reading";
  return courseSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function AdminDashboardPage() {
  // 1. Fetch live metrics concurrently from Supabase
  let studentCount = 0;
  let teacherCount = 0;
  let coursesCount = 0;
  let pendingApprovalsCount = 0;
  let recentStudents: StudentRecord[] = [];

  try {
    // 1. Total Students from profiles table
    const { count: sCount, error: sErr } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (!sErr && typeof sCount === "number") {
      studentCount = sCount;
    } else {
      // Fallback to auth.users count if profiles has an issue
      const { data: uData } = await supabaseAdmin.auth.admin.listUsers();
      if (uData && uData.users) {
        studentCount = uData.users.length;
      }
    }

    // 2. Total Teachers from teachers table
    const { count: tCount, error: tErr } = await supabaseAdmin
      .from("teachers")
      .select("*", { count: "exact", head: true });

    if (!tErr && typeof tCount === "number") {
      teacherCount = tCount;
    }

    // 3. Active Courses from courses table
    const { count: cCount, error: cErr } = await supabaseAdmin
      .from("courses")
      .select("*", { count: "exact", head: true });

    if (!cErr && typeof cCount === "number") {
      coursesCount = cCount;
    } else {
      // If table not yet created in Supabase SQL editor, default to the 4 core academy courses
      coursesCount = 4;
    }

    // 4. Pending Approvals from teachers table (status === 'pending')
    const { count: pCount, error: pErr } = await supabaseAdmin
      .from("teachers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (!pErr && typeof pCount === "number") {
      pendingApprovalsCount = pCount;
    }

    // 5. Recent Activity: 5 most recently registered students
    const { data: recent, error: rErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, selected_course, preferred_language, created_at, is_online")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!rErr && recent) {
      recentStudents = recent as StudentRecord[];
    }
  } catch (error) {
    console.error("Error fetching live admin metrics from Supabase:", error);
  }

  const statCards = [
    {
      title: "Total Students",
      value: studentCount,
      label: "Registered Learners",
      subtext: "Live verified profiles in Supabase",
      icon: GraduationCap,
      href: "/admin/students",
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Total Teachers",
      value: teacherCount,
      label: "Qualified Faculty",
      subtext: "Active Quran & Tajweed instructors",
      icon: ShieldCheck,
      href: "/admin/teachers",
      color: "text-teal-700 bg-teal-50 border-teal-100",
    },
    {
      title: "Active Courses",
      value: coursesCount,
      label: "Structured Programs",
      subtext: "Qaida, Tajweed & Hifz tracks",
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-emerald-800 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovalsCount,
      label: "Applicant Review",
      subtext: "Teacher applications waiting review",
      icon: Clock,
      href: "/admin/teachers",
      color: "text-amber-800 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* =========================================================================
          PAGE HEADER (Minimalist Apple/Google Typography)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time telemetry, student enrolments, and faculty activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-2xs text-xs text-gray-600 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Connected</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4 STAT CARDS (Rounded-2xl, Soft Border, Subtle Shadow, Minimalist Typography)
         ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {card.title}
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight font-digital tabular-nums">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span className="truncate">{card.subtext}</span>
                <Link
                  href={card.href}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-0.5 shrink-0 hover:underline transition-colors ml-2"
                >
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* =========================================================================
          RECENT ACTIVITY: RECENT STUDENT REGISTRATIONS (Clean Minimalist Table)
         ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:px-6 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Recent Activity
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest 5 students registered in the academy portal
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-800">
              {recentStudents.length} {recentStudents.length === 1 ? "Record" : "Records"}
            </span>
            <Link
              href="/admin/students"
              className="text-xs font-semibold text-[#064e3b] hover:text-emerald-800 hover:underline transition-colors"
            >
              View Roster
            </Link>
          </div>
        </div>

        {/* Table / List */}
        {recentStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
                  <th scope="col" className="py-3 px-5 sm:px-6">Student</th>
                  <th scope="col" className="py-3 px-5 sm:px-6">Email Address</th>
                  <th scope="col" className="py-3 px-5 sm:px-6">Selected Course</th>
                  <th scope="col" className="py-3 px-5 sm:px-6">Signup Date</th>
                  <th scope="col" className="py-3 px-5 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-700 font-medium">
                {recentStudents.map((student) => {
                  const displayName = student.full_name?.trim() || "Student";
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#064e3b] font-bold flex items-center justify-center shrink-0 text-xs">
                            {initial}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                              {displayName}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              ID: {student.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 sm:px-6 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{student.email || "No email"}</span>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-5 sm:px-6">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#064e3b] border border-emerald-100">
                          {formatCourseName(student.selected_course)}
                        </span>
                      </td>

                      {/* Signup Date */}
                      <td className="py-3.5 px-5 sm:px-6 text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{formatDate(student.created_at)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 sm:px-6 text-right">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Enrolled</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center space-y-2">
            <User className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No students yet.</p>
            <p className="text-xs text-gray-400">
              When students register on the website, they will appear here in real-time.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
