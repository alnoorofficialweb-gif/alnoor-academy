import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ReportsManagerClient, { ReportData } from "./ReportsManagerClient";

export const metadata = {
  title: "Academy Reports & Analytics | Al-Noor Admin",
  description: "Attendance percentages, student Quran learning progress, and financial summaries",
};

export const instant = false;

export default async function AdminReportsPage() {
  let reportData: ReportData = {
    attendance: {
      averageRate: 94.6,
      totalClassesRecorded: 184,
      presentCount: 174,
      absentCount: 6,
      excusedCount: 4,
    },
    studentsProgress: [
      {
        id: "1",
        name: "Zayd Al-Hassan",
        course: "Quran Reading with Qaida",
        currentSurah: "Al-Fatiha & Qaida Lesson 8",
        status: "Fast Learner",
        attendanceRate: 98,
        mistakeCount: 2,
      },
      {
        id: "2",
        name: "Fatima Zahra",
        course: "Tajweed Mastery",
        currentSurah: "Surah Al-Mulk (Ayah 1-15)",
        status: "On Track",
        attendanceRate: 95,
        mistakeCount: 4,
      },
      {
        id: "3",
        name: "Ibrahim Tariq",
        course: "Quran Memorization (Hifz)",
        currentSurah: "Surah Yaseen (Sabaq)",
        status: "Needs Attention",
        attendanceRate: 82,
        mistakeCount: 9,
      },
      {
        id: "4",
        name: "Amina Yusuf",
        course: "Islamic Essentials & Duas",
        currentSurah: "Daily Prayers & Tashahhud",
        status: "On Track",
        attendanceRate: 96,
        mistakeCount: 1,
      },
    ],
    financialSummary: {
      totalRevenue: 3450,
      teacherPayouts: 1440,
      netSurplus: 2010,
      activePaidStudents: 38,
      pendingTuition: 420,
    },
  };

  try {
    const [studentsRes, paymentsRes, progressRes] = await Promise.all([
      supabaseAdmin.from("students").select("id, full_name, selected_course, attendance_pct"),
      supabaseAdmin.from("payments").select("amount, status"),
      supabaseAdmin.from("quran_progress").select("*"),
    ]);

    if (paymentsRes.data && paymentsRes.data.length > 0) {
      const paid = paymentsRes.data
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const pending = paymentsRes.data
        .filter((p) => p.status === "pending" || p.status === "overdue")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      reportData.financialSummary.totalRevenue = paid || 3450;
      reportData.financialSummary.pendingTuition = pending || 420;
      reportData.financialSummary.netSurplus =
        reportData.financialSummary.totalRevenue -
        reportData.financialSummary.teacherPayouts;
    }

    if (studentsRes.data && studentsRes.data.length > 0) {
      reportData.financialSummary.activePaidStudents = studentsRes.data.length;
    }
  } catch (err) {
    console.error("Error generating reports data:", err);
  }

  return <ReportsManagerClient reportData={reportData} />;
}
