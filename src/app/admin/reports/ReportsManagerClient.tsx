"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Award,
  BookOpen,
} from "lucide-react";

export interface StudentProgressItem {
  id: string;
  name: string;
  course: string;
  currentSurah: string;
  status: "Fast Learner" | "On Track" | "Needs Attention";
  attendanceRate: number;
  mistakeCount: number;
}

export interface ReportData {
  attendance: {
    averageRate: number;
    totalClassesRecorded: number;
    presentCount: number;
    absentCount: number;
    excusedCount: number;
  };
  studentsProgress: StudentProgressItem[];
  financialSummary: {
    totalRevenue: number;
    teacherPayouts: number;
    netSurplus: number;
    activePaidStudents: number;
    pendingTuition: number;
  };
}

interface ReportsManagerClientProps {
  reportData: ReportData;
}

export default function ReportsManagerClient({
  reportData,
}: ReportsManagerClientProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "attendance" | "finance">("performance");

  const exportCSV = () => {
    const headers = ["Student Name,Course,Current Surah,Status,Attendance Rate,Mistakes"];
    const rows = reportData.studentsProgress.map(
      (s) => `"${s.name}","${s.course}","${s.currentSurah}","${s.status}",${s.attendanceRate}%,${s.mistakeCount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AlNoor_LMS_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Reports & Academic Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Monthly Audit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Student recitation milestones, class attendance rates, and academy balance sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Export Complete CSV Report</span>
        </button>
      </div>

      {/* 3 Main Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Avg Attendance Rate
            </span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-black tracking-tight tabular-nums">
            {reportData.attendance.averageRate}%
          </p>
          <p className="text-xs text-emerald-700 font-semibold">
            {reportData.attendance.presentCount} of {reportData.attendance.totalClassesRecorded} sessions attended
          </p>
        </div>

        {/* Progress Rate */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              On-Track / Fast Learners
            </span>
            <Award className="w-4 h-4 text-blue-700" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 font-black tracking-tight tabular-nums">
            {Math.round(
              (reportData.studentsProgress.filter((s) => s.status !== "Needs Attention").length /
                reportData.studentsProgress.length) *
                100
            )}
            %
          </p>
          <p className="text-xs text-blue-700 font-semibold">Meeting monthly Sabaq milestones</p>
        </div>

        {/* Net Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Net Academy Surplus
            </span>
            <TrendingUp className="w-4 h-4 text-[#064e3b]" />
          </div>
          <p className="text-3xl font-extrabold text-[#064e3b] font-black tracking-tight tabular-nums">
            Rs. {reportData.financialSummary.netSurplus.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            After Rs. {reportData.financialSummary.teacherPayouts.toLocaleString()} faculty compensation
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-semibold w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("performance")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "performance" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Student Performance Roster
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "attendance" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Attendance Breakdown
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === "finance" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Financial Income vs Expenses
        </button>
      </div>

      {/* Tab 1: Student Performance */}
      {activeTab === "performance" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="p-4 sm:px-6 sm:py-3.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Quran Learning Progress & Tajweed Audit</h2>
            <span className="text-xs text-gray-400">Track recitation pacing & corrections</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Enrolled Program</th>
                  <th className="py-3 px-4">Current Sabaq / Surah</th>
                  <th className="py-3 px-4">Mistake Counter</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4 text-right">Learning Pace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {reportData.studentsProgress.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{student.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{student.course}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-800">{student.currentSurah}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold">
                        {student.mistakeCount} errors logged
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">{student.attendanceRate}%</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.status === "Fast Learner"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : student.status === "On Track"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Breakdown */}
      {activeTab === "attendance" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Attendance Distribution (Current Month)</h2>
            <p className="text-xs text-gray-400 mt-0.5">Summary of {reportData.attendance.totalClassesRecorded} total class occurrences</p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-800">Present ({reportData.attendance.presentCount})</span>
                <span>{Math.round((reportData.attendance.presentCount / reportData.attendance.totalClassesRecorded) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${(reportData.attendance.presentCount / reportData.attendance.totalClassesRecorded) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-800">Excused ({reportData.attendance.excusedCount})</span>
                <span>{Math.round((reportData.attendance.excusedCount / reportData.attendance.totalClassesRecorded) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(reportData.attendance.excusedCount / reportData.attendance.totalClassesRecorded) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-red-800">Absent / Missed ({reportData.attendance.absentCount})</span>
                <span>{Math.round((reportData.attendance.absentCount / reportData.attendance.totalClassesRecorded) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(reportData.attendance.absentCount / reportData.attendance.totalClassesRecorded) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Financial Summary */}
      {activeTab === "finance" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Income vs Expenditure Balance Sheet</h2>
            <p className="text-xs text-gray-400 mt-0.5">Monthly revenue from tuition vs instructor compensation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800">Gross Tuition Inflow</span>
              <p className="text-2xl font-extrabold text-[#064e3b] mt-1 font-black tracking-tight tabular-nums">
                Rs. {reportData.financialSummary.totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">From {reportData.financialSummary.activePaidStudents} settled learners</p>
            </div>

            <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
              <span className="text-xs font-bold text-red-800">Teacher Payroll Payouts</span>
              <p className="text-2xl font-extrabold text-red-900 mt-1 font-black tracking-tight tabular-nums">
                -Rs. {reportData.financialSummary.teacherPayouts.toLocaleString()}
              </p>
              <p className="text-[11px] text-red-700 mt-1">Teaching hours compensation</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-xs font-bold text-blue-800">Net Retained Surplus</span>
              <p className="text-2xl font-extrabold text-blue-900 mt-1 font-black tracking-tight tabular-nums">
                +Rs. {reportData.financialSummary.netSurplus.toLocaleString()}
              </p>
              <p className="text-[11px] text-blue-700 mt-1">Academy operating margin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
