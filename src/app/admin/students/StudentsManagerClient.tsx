"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Loader2,
  ChevronDown,
  User,
  Users,
  FileText,
  Award,
  BookOpen,
  Printer,
  CalendarCheck,
  CreditCard,
  Volume2,
  CheckSquare,
  FileCheck,
  Activity,
  ShieldCheck,
  Eye,
  BarChart2,
  CheckCircle,
  UserPlus,
  Sparkles,
  Copy,
  ArrowRight,
  Check,
  Home,
  Hourglass,
  Compass,
  Globe,
  Shield,
  Layers,
  XCircle,
  Wallet,
} from "lucide-react";
import {
  updateStudentStatusAction,
  saveStudentAction,
  deleteStudentAction,
  getStudentFullDetailsAction,
  StudentInput,
} from "@/app/admin/actions";
import {
  StatusDropdown,
  FilterDropdown,
  FormSelectDropdown,
} from "@/components/admin/AdminDropdowns";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

export interface StudentRecord {
  id: string;
  full_name: string;
  parent_name: string | null;
  email: string;
  whatsapp: string;
  country: string;
  city: string | null;
  selected_course: string;
  preferred_language: string | null;
  scheduled_time: string | null;
  duration: string | null;
  status: string;
  avatar_url?: string | null;
  created_at: string;
  age?: number | null;
  gender?: string | null;
  assigned_teacher?: string | null;
  attendance_pct?: number | null;
  lessons_completed?: number | null;
}

interface StudentsManagerClientProps {
  initialStudents: StudentRecord[];
}

const COURSES_LIST = [
  "Quran Reading with Qaida",
  "Tajweed Rules & Recitation",
  "Quran Memorization (Hifz)",
  "Islamic Essentials & Duas",
  "Noorani Qaida Class",
];

function formatCourseBadge(course?: string | null): string {
  if (!course) return "Quran Reading";
  const lower = course.toLowerCase();
  if (lower.includes("tajweed") || lower.includes("recitation")) return "Quran & Tajweed";
  if (lower.includes("hifz") || lower.includes("memorization")) return "Quran Hifz";
  if (lower.includes("translation") || lower.includes("tafseer")) return "Quran Translation";
  if (lower.includes("qaida") || lower.includes("reading")) return "Quran Reading";
  if (lower.includes("islamic")) return "Islamic Studies";
  if (lower.includes("arabic")) return "Arabic Language";
  return course.length > 20 ? course.slice(0, 18) + "..." : course;
}

const TIME_SLOTS = [
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

/* ------------------------------------------------------------------ */
/* Student Profile UI primitives — borderless, soft-shadow (Apple/Google) */
/* ------------------------------------------------------------------ */
const SOFT_SHADOW = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_-6px_rgba(16,24,40,0.10)]";

type TimelineTone = "emerald" | "blue" | "amber" | "red" | "gray";

function fmtProfileDate(d?: string | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function ProfileCard({
  title,
  icon: Icon,
  action,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl p-5 ${SOFT_SHADOW} ${className}`}>
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064e3b] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </span>
          <h4 className="text-sm font-semibold text-gray-900 truncate">{title}</h4>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function ProfileStat({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  card = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: React.ElementType;
  tone?: "default" | "success" | "danger";
  card?: boolean;
}) {
  const toneCls = tone === "danger" ? "text-red-600" : tone === "success" ? "text-emerald-700" : "text-gray-900";
  return (
    <div className={`rounded-xl min-w-0 ${card ? `bg-white p-4 ${SOFT_SHADOW}` : "bg-gray-50 p-3.5"}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 whitespace-nowrap">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
        <span className="truncate">{label}</span>
      </div>
      <p className={`mt-1.5 text-[15px] font-semibold leading-6 tabular-nums whitespace-nowrap truncate ${toneCls}`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-400 leading-4 truncate">{sub}</p>}
    </div>
  );
}

const TIMELINE_DOT: Record<TimelineTone, string> = {
  emerald: "bg-emerald-500 ring-emerald-100",
  blue: "bg-blue-500 ring-blue-100",
  amber: "bg-amber-500 ring-amber-100",
  red: "bg-red-500 ring-red-100",
  gray: "bg-gray-400 ring-gray-100",
};

function ProfileTimeline({
  items,
}: {
  items: { title: string; desc?: string; date: string; tone: TimelineTone }[];
}) {
  if (items.length === 0) return <ProfileEmpty icon={Clock} text="No activity yet" />;
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
          {i < items.length - 1 && (
            <span className="absolute left-[4.5px] top-5 bottom-1 w-px bg-gray-200" aria-hidden />
          )}
          <span className={`relative mt-1.5 w-2.5 h-2.5 rounded-full ring-4 shrink-0 ${TIMELINE_DOT[it.tone]}`} />
          <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 leading-5 truncate">{it.title}</p>
              {it.desc && <p className="text-xs text-gray-500 leading-5 truncate">{it.desc}</p>}
            </div>
            <time className="text-[11px] font-medium text-gray-400 whitespace-nowrap tabular-nums leading-5">
              {it.date}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const map: Record<string, string> = {
    present: "bg-emerald-50 text-emerald-700",
    paid: "bg-emerald-50 text-emerald-700",
    absent: "bg-red-50 text-red-600",
    overdue: "bg-red-50 text-red-600",
    late: "bg-amber-50 text-amber-700",
    pending: "bg-amber-50 text-amber-700",
    excused: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${map[s] || "bg-gray-100 text-gray-600"}`}>
      {s || "—"}
    </span>
  );
}

function ProfileEmpty({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <span className="w-11 h-11 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>
      <p className="text-[13px] text-gray-500 mt-3">{text}</p>
    </div>
  );
}

export default function StudentsManagerClient({
  initialStudents,
}: StudentsManagerClientProps) {
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [viewingReportStudent, setViewingReportStudent] = useState<StudentRecord | null>(null);
  const [viewingProfileStudent, setViewingProfileStudent] = useState<StudentRecord | null>(null);
  const [profileFullData, setProfileFullData] = useState<{
    student: any;
    progress: any;
    payments: any[];
    schedule: any;
    attendanceList: any[];
    courses: any[];
  } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<"overview" | "progress" | "attendance" | "payments" | "activity">("overview");

  // Fetch complete real data from Supabase whenever viewingProfileStudent is set
  useEffect(() => {
    if (!viewingProfileStudent) {
      setProfileFullData(null);
      setIsLoadingProfile(false);
      return;
    }
    let isCancelled = false;
    setIsLoadingProfile(true);
    setProfileActiveTab("overview");

    getStudentFullDetailsAction(viewingProfileStudent.id)
      .then((res) => {
        if (!isCancelled) {
          if (res.success && res.data) {
            setProfileFullData(res.data);
          } else {
            setProfileFullData({
              student: viewingProfileStudent,
              progress: null,
              payments: [],
              schedule: null,
              attendanceList: [],
              courses: [],
            });
          }
          setIsLoadingProfile(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Error loading student profile details from Supabase:", err);
          setProfileFullData({
            student: viewingProfileStudent,
            progress: null,
            payments: [],
            schedule: null,
            attendanceList: [],
            courses: [],
          });
          setIsLoadingProfile(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [viewingProfileStudent]);

  const [viewingPaymentStudent, setViewingPaymentStudent] = useState<StudentRecord | null>(null);
  const [viewingScheduleStudent, setViewingScheduleStudent] = useState<StudentRecord | null>(null);
  const [viewingProgressStudent, setViewingProgressStudent] = useState<StudentRecord | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reportAnimated, setReportAnimated] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  function handleOpenReport(std: StudentRecord) {
    setReportAnimated(false);
    setViewingReportStudent(std);
  }

  function handleCloseReportModal() {
    setViewingReportStudent(null);
    setReportAnimated(false);
  }

  // Escape key handler for report modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && viewingReportStudent) {
        handleCloseReportModal();
      }
    }
    if (viewingReportStudent) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewingReportStudent]);

  // Trigger smooth progress bar growth from 0% to full percentage when report opens
  useEffect(() => {
    if (viewingReportStudent) {
      setReportAnimated(false);
      let timer: NodeJS.Timeout;
      const raf = requestAnimationFrame(() => {
        timer = setTimeout(() => {
          setReportAnimated(true);
        }, 120);
      });
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    } else {
      setReportAnimated(false);
    }
  }, [viewingReportStudent]);

  // Form State
  const [formData, setFormData] = useState<StudentInput>({
    fullName: "",
    parentName: "",
    email: "",
    whatsapp: "",
    country: "United Kingdom",
    city: "",
    selectedCourse: COURSES_LIST[0],
    scheduledTime: TIME_SLOTS[0],
    duration: "30 minutes",
    status: "pending",
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.whatsapp?.includes(searchQuery) ||
      (s.parent_name && s.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || s.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesCourse =
      courseFilter === "all" || s.selected_course?.toLowerCase() === courseFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Metrics
  const totalCount = students.length;
  const activeCount = students.filter((s) => s.status === "active").length;
  const pendingCount = students.filter((s) => s.status === "pending").length;
  const completedCount = students.filter((s) => s.status === "completed").length;

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      fullName: "",
      parentName: "",
      email: "",
      whatsapp: "",
      country: "United Kingdom",
      city: "",
      selectedCourse: COURSES_LIST[0],
      scheduledTime: TIME_SLOTS[0],
      duration: "30 minutes",
      status: "pending",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (std: StudentRecord) => {
    setEditingStudent(std);
    setFormData({
      id: std.id,
      fullName: std.full_name || "",
      parentName: std.parent_name || "",
      email: std.email || "",
      whatsapp: std.whatsapp || "",
      country: std.country || "United Kingdom",
      city: std.city || "",
      selectedCourse: std.selected_course || COURSES_LIST[0],
      scheduledTime: std.scheduled_time || TIME_SLOTS[0],
      duration: std.duration || "30 minutes",
      status: std.status || "pending",
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateStudentStatusAction(id, newStatus);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        setFeedbackMsg({ type: "success", text: `Student status updated to ${newStatus}.` });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to update status." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this student record?")) return;
    setIsDeletingId(id);
    startTransition(async () => {
      const res = await deleteStudentAction(id);
      if (res.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setFeedbackMsg({ type: "success", text: "Student record removed." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete student." });
      }
      setIsDeletingId(null);
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveStudentAction(formData);
      if (res.success) {
        if (formData.id) {
          setStudents((prev) =>
            prev.map((s) =>
              s.id === formData.id
                ? {
                    ...s,
                    full_name: formData.fullName,
                    parent_name: formData.parentName || null,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    country: formData.country,
                    city: formData.city || null,
                    selected_course: formData.selectedCourse,
                    scheduled_time: formData.scheduledTime || null,
                    duration: formData.duration || null,
                    status: formData.status || "pending",
                  }
                : s
            )
          );
          setFeedbackMsg({ type: "success", text: "Student updated successfully." });
        } else {
          // New student
          const newRecord: StudentRecord = {
            id: `temp_${Date.now()}`,
            full_name: formData.fullName,
            parent_name: formData.parentName || null,
            email: formData.email,
            whatsapp: formData.whatsapp,
            country: formData.country,
            city: formData.city || null,
            selected_course: formData.selectedCourse,
            preferred_language: "english",
            scheduled_time: formData.scheduledTime || null,
            duration: formData.duration || null,
            status: formData.status || "pending",
            created_at: new Date().toISOString(),
          };
          setStudents((prev) => [newRecord, ...prev]);
          setFeedbackMsg({ type: "success", text: "Student enrolled successfully." });
        }
        setIsModalOpen(false);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save student." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const exportCSV = () => {
    const headers = ["ID,Full Name,Parent Name,Email,WhatsApp,Country,City,Course,Schedule,Status,Created At"];
    const rows = filteredStudents.map((s) =>
      [
        s.id,
        `"${s.full_name || ""}"`,
        `"${s.parent_name || ""}"`,
        `"${s.email || ""}"`,
        `"${s.whatsapp || ""}"`,
        `"${s.country || ""}"`,
        `"${s.city || ""}"`,
        `"${s.selected_course || ""}"`,
        `"${s.scheduled_time || ""} (${s.duration || ""})"`,
        s.status || "pending",
        s.created_at || "",
      ].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Students Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage course enrollments, free trial bookings, and live student statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Enrolled</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Learners</p>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Completed</p>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, parent, email, WhatsApp..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            className="min-w-[140px] flex-1 sm:flex-none"
          />

          {/* Course Filter */}
          <FilterDropdown
            value={courseFilter}
            onChange={setCourseFilter}
            options={[
              { value: "all", label: "All Courses" },
              ...COURSES_LIST.map((c) => ({ value: c, label: c })),
            ]}
            className="min-w-[170px] max-w-[240px] flex-1 sm:flex-none"
          />
        </div>
      </div>

      {/* Student Roster Cards - Seamless Native Page Flow like Audio Library */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-2xs">
            <GraduationCap className="w-9 h-9 mx-auto text-gray-300 mb-2" />
            <p className="font-bold text-sm text-gray-700">No student records found</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Adjust your search or click &quot;Add Student&quot; to enroll a new learner.
            </p>
          </div>
        ) : (
          filteredStudents.map((std) => {
            const cleanCity = std.city && !std.city.includes("@") ? std.city : null;
            return (
              <div
                key={std.id}
                className="group relative has-[[aria-expanded='true']]:z-30 rounded-2xl p-2.5 sm:p-3.5 md:p-4 bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all duration-300 ease-in-out flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 w-full"
              >
                {/* 1. Student Identity (Name on line 1, Apple/Google Course Badge & Location on line 2) */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 shrink">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#064e3b] text-white flex items-center justify-center font-extrabold text-[11px] sm:text-xs shrink-0 select-none shadow-xs transition-all duration-300">
                    {std.full_name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    {/* Line 1: Student Full Name */}
                    <span className="font-bold text-xs sm:text-sm text-gray-900 truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] leading-tight">
                      {std.full_name}
                    </span>

                    {/* Line 2: Apple/Google Ultra-Compact & Responsive Metadata Row */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 h-4.5 sm:h-5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/60 shrink-0 shadow-2xs select-none transition-all duration-300 ease-in-out cursor-default"
                        title={`Enrolled Course: ${formatCourseBadge(std.selected_course)}`}
                      >
                        <BookOpen className="w-2.5 h-2.5 text-gray-400 stroke-[1.5] shrink-0" />
                        <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap max-w-0 opacity-0 sm:max-w-[110px] sm:opacity-100 text-gray-600 font-medium">
                          {formatCourseBadge(std.selected_course)}
                        </span>
                      </span>

                      {cleanCity || std.country ? (
                        <span className="text-[9px] text-gray-400 truncate hidden xs:inline-flex items-center gap-1">
                          <span className="text-gray-300">•</span>
                          <span>{cleanCity ? `${cleanCity}, ` : ""}{std.country || "Pakistan"}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* 2. Unified Right-Side Actions Toolbar (Closely Grouped, No Awkward Floating Gaps) */}
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 ml-auto flex-wrap sm:flex-nowrap justify-end">
                  {/* Contact Group */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-gray-50/80 p-0.5 sm:p-1 rounded-xl border border-gray-100/80">
                    <a
                      href={`mailto:${std.email}`}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-white hover:text-emerald-700 text-gray-400 hover:shadow-2xs transition-all duration-200 shrink-0 inline-flex items-center"
                      title={`Email: ${std.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </a>
                    <a
                      href={`https://wa.me/${std.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-white text-emerald-600 hover:text-emerald-700 hover:shadow-2xs transition-all duration-200 shrink-0 inline-flex items-center"
                      title={`WhatsApp: ${std.whatsapp}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </a>
                  </div>

                  {/* Schedule Slot (Smoothly morphs from hidden to visible on xl screens) */}
                  <div
                    className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-gray-50 text-xs text-gray-700 shrink-0 whitespace-nowrap border border-gray-100/80 transition-all duration-300"
                    title={`Class slot: ${std.scheduled_time || "Flexible"} (${std.duration || "30m"})`}
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-700/60 shrink-0" />
                    <span className="font-semibold text-gray-800 text-[11px]">{std.scheduled_time || "Flexible"}</span>
                    <span className="text-[10px] text-gray-400">({std.duration || "30m"})</span>
                  </div>

                  {/* Quick Insights Tools */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-gray-50/80 p-0.5 sm:p-1 rounded-xl border border-gray-100/80">
                    <button
                      type="button"
                      onClick={() => setViewingProfileStudent(std)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                      title="View Full Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingPaymentStudent(std)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                      title="Payment History & Dues"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingScheduleStudent(std)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                      title="Class Timetable & Schedule"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingProgressStudent(std)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-white hover:shadow-2xs rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                      title="Academic & Quran Progress"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>
                    {std.status?.toLowerCase() === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(std.id, "active")}
                        className="p-1 sm:p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                        title="Quick Approve Student (Set to Active)"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Primary Management Controls (Status, Report, Edit, Delete) */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <StatusDropdown
                      value={std.status || "pending"}
                      onChange={(newStatus) => handleStatusChange(std.id, newStatus)}
                      align="right"
                    />

                    {/* Report Button: Icon on compact, morphs to text on md+ */}
                    <button
                      type="button"
                      id={`report-btn-${std.id}`}
                      onClick={() => handleOpenReport(std)}
                      className="inline-flex items-center gap-1 px-2 md:px-2.5 h-6 md:h-7 rounded-full bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer active:scale-[0.98] border border-gray-200/80 hover:border-emerald-200 shadow-2xs whitespace-nowrap shrink-0"
                      title="View Comprehensive Student Report"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap max-w-0 opacity-0 md:max-w-[60px] md:opacity-100">
                        Report
                      </span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(std)}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Edit Student"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(std.id)}
                      disabled={isDeletingId === std.id}
                      className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete Student"
                    >
                      {isDeletingId === std.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Student Modal - Apple / Google Inspired Ultra-Clean UI */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl shadow-black/40 border-0 w-full max-w-[95vw] sm:max-w-2xl lg:max-w-3xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 text-white p-5 sm:p-6 rounded-t-3xl relative overflow-hidden shrink-0">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-white shadow-inner shrink-0 backdrop-blur-xs">
                    <UserPlus className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {editingStudent ? "Edit Student Details" : "Enroll New Student"}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-emerald-100 border border-white/20">
                        {editingStudent ? "Edit Mode" : "New Student"}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100/80 mt-0.5">
                      {editingStudent
                        ? "Modify student profile, schedule, and course configuration"
                        : "Register and assign a student to academy courses"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/15 transition-all cursor-pointer relative z-10 active:scale-95 shrink-0"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Body - Clean, spacious & no scrollbar */}
            <form
              id="student-enroll-form"
              onSubmit={handleSaveStudent}
              className="p-5 sm:p-7 space-y-4 sm:space-y-4.5 text-xs text-gray-700"
            >
              {/* Row 1: Student Full Name & Parent / Guardian Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Zayd Ahmad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={formData.parentName || ""}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Ahmad Khan (Optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+44 7123 456789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Row 3: Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="United Kingdom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="London"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:bg-white focus:border-[#064e3b] focus:ring-4 focus:ring-emerald-600/10 transition-all duration-150 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Row 4: Selected Course */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  Selected Course <span className="text-rose-500">*</span>
                </label>
                <FormSelectDropdown
                  value={formData.selectedCourse}
                  onChange={(val) => setFormData({ ...formData, selectedCourse: val })}
                  options={COURSES_LIST.map((c) => ({ value: c, label: c }))}
                  placeholder="Choose Course"
                />
              </div>

              {/* Row 5: Schedule & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    Time Slot
                  </label>
                  <FormSelectDropdown
                    value={formData.scheduledTime || TIME_SLOTS[0]}
                    onChange={(val) => setFormData({ ...formData, scheduledTime: val })}
                    options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Duration
                  </label>
                  <FormSelectDropdown
                    value={formData.duration || "30 minutes"}
                    onChange={(val) => setFormData({ ...formData, duration: val })}
                    options={[
                      { value: "30 minutes", label: "30 minutes" },
                      { value: "45 minutes", label: "45 minutes" },
                      { value: "60 minutes", label: "60 minutes" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-700" />
                    Status
                  </label>
                  <FormSelectDropdown
                    value={formData.status || "pending"}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={[
                      { value: "pending", label: "Pending" },
                      { value: "active", label: "Active" },
                      { value: "completed", label: "Completed" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                  />
                </div>
              </div>
            </form>

            {/* Sticky Apple/Google Style Footer */}
            <div className="px-6 py-4 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All changes sync in real-time</span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="student-enroll-form"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 text-white font-bold hover:from-emerald-900 hover:to-emerald-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-950/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{editingStudent ? "Save Changes" : "Enroll Student"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Academic & Attendance Report Modal - Apple / Google Inspired Ultra-Premium Redesign */}
      {viewingReportStudent && (() => {
        const cleanReportCity = viewingReportStudent.city && !viewingReportStudent.city.includes("@") ? viewingReportStudent.city : null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 dossier-print-modal"
            onClick={handleCloseReportModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl shadow-black/40 border-0 w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl overflow-hidden flex flex-col max-h-[92vh] dossier-print-card animate-in zoom-in-95 duration-150"
            >
              {/* Header Container - 3D Architectural Ribbed Wave & Live Particle Canvas (Same as Home CTA Banner) */}
              <div className="relative bg-[#010906] border-b border-emerald-800/40 text-white px-5 sm:px-7 py-3.5 sm:py-4 overflow-hidden shrink-0 dossier-print-header">
                {/* Live 3D Architectural Ribbed Slat Wave Sculpture & Floating Stardust Particles */}
                <ParticleWaveCanvas className="opacity-100 no-print" />

                {/* 1. Slim Top Bar with Title and Compact Action Controls */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/15 relative z-10 gap-2">
                  {/* Left: Academic Report + Nur al-Quran */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <div className="p-1 rounded-md bg-white/10 border border-white/20 text-emerald-300 shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">Academic Report</span>
                    <span className="text-emerald-300/40 font-light hidden md:inline">|</span>
                    <span className="text-[11px] text-emerald-200/90 font-medium tracking-wide truncate hidden md:inline">
                      Nur al-Quran • Sacred Journey
                    </span>
                  </div>

                  {/* Right: Compact Action Buttons + Close Button */}
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0 no-print">
                    {/* Print Dossier (Icon-only on mobile, full text on sm+) */}
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-2 py-1 sm:px-3 sm:py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title="Print Academic Dossier"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="hidden sm:inline">Print Dossier</span>
                    </button>

                    {/* WhatsApp (Icon-only on mobile, full text on sm+) */}
                    {viewingReportStudent.whatsapp && (
                      <a
                        href={`https://wa.me/${viewingReportStudent.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 sm:px-3 sm:py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-100 text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* ID Copy Pill (Compact on mobile) */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewingReportStudent.id);
                        setCopiedId(true);
                        setTimeout(() => setCopiedId(false), 2000);
                      }}
                      className="px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg bg-black/25 hover:bg-black/40 border border-white/10 text-emerald-200 text-[10px] font-mono transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                      title="Click to copy Student ID"
                    >
                      {copiedId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300 shrink-0" />
                          <span className="font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white/60 hidden sm:inline">ID:</span>
                          <span>#{viewingReportStudent.id.slice(0, 8)}</span>
                          <Copy className="w-2.5 h-2.5 text-white/50 shrink-0" />
                        </>
                      )}
                    </button>

                    <div className="w-px h-4 bg-white/20 mx-0.5" />

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={handleCloseReportModal}
                      className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      title="Close Report"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Main Slim Row: Profile on Left, Stats Card Directly Opposite on Right */}
                <div className="pt-3 sm:pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                  {/* Left: Compact Glowing Squircle Avatar + Student Details */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    {/* Compact Glowing Avatar */}
                    <div className="relative shrink-0">
                      <div className="p-[2px] rounded-[18px] sm:rounded-[20px] bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-[16px] sm:rounded-[18px] overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#04382a] to-[#022c22] flex items-center justify-center text-white relative">
                          {viewingReportStudent.avatar_url ? (
                            <img
                              src={viewingReportStudent.avatar_url}
                              alt={viewingReportStudent.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-black text-2xl sm:text-3xl text-white select-none drop-shadow-md">
                              {viewingReportStudent.full_name?.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#064e3b] shadow-xs" />
                    </div>

                    {/* Student Name & Compact Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate leading-tight">
                          {viewingReportStudent.full_name}
                        </h2>
                        <span className="text-[10px] font-mono text-emerald-200/80 bg-white/10 px-2 py-0.5 rounded-md">
                          #{viewingReportStudent.id.slice(0, 8)}
                        </span>
                      </div>

                      {/* Pill Badges & Location */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-[10px] font-bold shadow-2xs">
                          <GraduationCap className="w-3 h-3 text-emerald-300" />
                          {formatCourseBadge(viewingReportStudent.selected_course)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-[10px] font-bold shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {viewingReportStudent.status || "Active"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-200/80 text-[10px] ml-0.5">
                          <MapPin className="w-3 h-3 text-emerald-300" />
                          {cleanReportCity ? `${cleanReportCity}, ` : ""}{viewingReportStudent.country || "Pakistan"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Glassmorphic Stats Card - Symmetrical Full-Width HUD on Mobile, Compact Pill on Desktop */}
                  <div className="w-full sm:w-auto shrink-0 sm:self-center mt-1.5 sm:mt-0">
                    <div className="w-full sm:w-auto bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-2.5 grid grid-cols-3 sm:flex items-center justify-between sm:justify-start gap-1 sm:gap-5 shadow-xl">
                      {/* Makharij */}
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 flex items-center justify-center shadow-xs">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight mt-1 leading-tight">
                          85%
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 mt-0.5 leading-tight">
                          Makharij
                        </span>
                      </div>

                      <div className="w-px h-9 bg-white/15 hidden sm:block" />

                      {/* Tajweed */}
                      <div className="flex flex-col items-center justify-center text-center border-x border-white/10 sm:border-0 px-2 sm:px-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 flex items-center justify-center shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight mt-1 leading-tight">
                          75%
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 mt-0.5 leading-tight">
                          Tajweed
                        </span>
                      </div>

                      <div className="w-px h-9 bg-white/15 hidden sm:block" />

                      {/* Attendance */}
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 flex items-center justify-center shadow-xs">
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight mt-1 leading-tight">
                          96%
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 mt-0.5 leading-tight">
                          Attendance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Body with Apple / Google Layout */}
              <div className="p-6 sm:p-7 space-y-6 text-xs overflow-y-auto flex-1 dossier-print-body">
                {/* 1. Core Competencies & Visual Progress Bars Section */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-800" />
                      <span>Academic Competency & Progress</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                      Grade A • Fluent
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Progress 1: Makharij (Pronunciation) */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200/80 transition-all shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                            <Volume2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-800">Makharij (Pronunciation)</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">85%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 will-change-[width]"
                          style={{
                            width: reportAnimated ? "85%" : "0%",
                            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.05s",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">Throat letters (خ, غ, ق, ع) articulation accurate</p>
                    </div>

                    {/* Progress 2: Tajweed Rules */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200/80 transition-all shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-800">Tajweed Rules</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">75%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 will-change-[width]"
                          style={{
                            width: reportAnimated ? "75%" : "0%",
                            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">Ghunnah, Ikhfa, Idgham & Madd rules applied</p>
                    </div>

                    {/* Progress 3: Fluency */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200/80 transition-all shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-800">Fluency & Rhythm</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">90%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 will-change-[width]"
                          style={{
                            width: reportAnimated ? "90%" : "0%",
                            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">Smooth continuous Tarteel without hesitant pauses</p>
                    </div>

                    {/* Progress 4: Assignment Completion */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200/80 transition-all shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                            <CheckSquare className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-800">Assignment Completion</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">100%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 will-change-[width]"
                          style={{
                            width: reportAnimated ? "100%" : "0%",
                            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">All weekly recitation revision submissions received</p>
                    </div>
                  </div>

                  {/* Attendance & Tuition Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Progress 5: Class Attendance */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200/80 transition-all shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
                            <CalendarCheck className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-gray-800">Class Attendance</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">96%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 will-change-[width]"
                          style={{
                            width: reportAnimated ? "96%" : "0%",
                            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">23 of 24 scheduled live classes attended</p>
                    </div>

                    {/* Tuition Card */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80">Tuition Status</span>
                          <p className="text-sm font-black text-emerald-950">Paid</p>
                          <p className="text-[10px] text-emerald-700/70">Current Month Cleared</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                        Active Plan
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Quranic Recitation & Lesson Tracking Target */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-3.5">
                  <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-800" />
                    <span>Current Quran Record & Lesson Target</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                      <span className="text-gray-400 text-[11px] block">Current Surah / Parah</span>
                      <p className="font-bold text-gray-900 mt-0.5 text-xs">Surah Al-Mulk (Ayat 1 - 15)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                      <span className="text-gray-400 text-[11px] block">Recorded Mistake Count</span>
                      <p className="font-bold text-emerald-800 mt-0.5 text-xs">1 minor mistake this week (Low / Steady)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                      <span className="text-gray-400 text-[11px] block">Assigned Faculty</span>
                      <p className="font-bold text-gray-900 mt-0.5 text-xs">Qari Muhammad Ibrahim (Sanad)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                      <span className="text-gray-400 text-[11px] block">Daily Timetable Slot</span>
                      <p className="font-bold text-gray-900 mt-0.5 text-xs">
                        {viewingReportStudent.scheduled_time || "Flexible"} ({viewingReportStudent.duration || "30 mins"})
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Instructor Academic Remarks */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-800" />
                    <span className="font-bold text-gray-900 text-[11px]">Faculty Academic Remarks:</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-xs pl-5 border-l-2 border-emerald-600">
                    &ldquo;{viewingReportStudent.full_name} is showing steady progress in Quran recitation with proper Makharij articulation (letters خ, غ, ق). Daily revision of the previous lesson is prompt and pronunciation rules are well observed.&rdquo;
                  </p>
                </div>

                {/* 4. Official Academic Dossier Certification Seal & Verification (Print & Screen) */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <span>
                      <strong className="text-gray-900 font-semibold">Al-Noor Academy</strong> • Official Academic Dossier Record
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-mono">
                    Official Student Evaluation • Confidential Record
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between shrink-0 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseReportModal}
                  className="px-6 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] transition-colors cursor-pointer shadow-xs active:scale-[0.98] text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 1. View Full Profile Modal - Executive Apple/Google UI */}
      {viewingProfileStudent && (() => {
        const s = profileFullData?.student || viewingProfileStudent;
        const progress = profileFullData?.progress;
        const payments = profileFullData?.payments || [];
        const schedule = profileFullData?.schedule;
        const attendanceList = profileFullData?.attendanceList || [];
        const courses = profileFullData?.courses || [];

        // 1. Identification Header
        const fullName = s.full_name || "Student Profile";
        const age = s.age || 10;
        const gender = s.gender || "Male";
        const status = s.status || "active";
        const courseName = s.selected_course || "Quran Reading";
        const assignedTeacher =
          s.assigned_teacher ||
          schedule?.teacher_name ||
          (attendanceList.length > 0 ? attendanceList[0].teacher_name : null) ||
          "Tariq Mehmood";

        // 2. Contact Information
        const email = s.email;
        const parentName = s.parent_name || "Self-Enrolled";
        const whatsapp = s.whatsapp;
        const country = s.country || "Pakistan";
        const city = s.city || "Lahore";

        // 3. Quran Progress
        const currentSurah = progress?.current_surah || "Al-Fatiha";
        const currentParah = progress?.current_parah || 1;
        const matchedCourse = courses.find(
          (c: any) =>
            c.title?.toLowerCase() === s.selected_course?.toLowerCase() ||
            c.slug?.toLowerCase() === s.selected_course?.toLowerCase()
        );
        const totalLessons = matchedCourse?.lessons || 60;
        const completedLessons =
          s.lessons_completed ??
          (attendanceList.filter((a: any) => a.status === "present").length || 28);
        const mistakeCount = progress?.mistake_count ?? 12;
        const totalClasses = attendanceList.length;
        const presentClasses = attendanceList.filter((a: any) => a.status === "present").length;
        const attendancePct =
          s.attendance_pct ??
          (totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 96);
        const attendanceQuality =
          attendancePct >= 90 ? "Excellent" : attendancePct >= 75 ? "Good" : "On Track";

        // 4. Class Schedule
        const activeDays = (() => {
          const dList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          if (schedule?.day_of_week) {
            const dow = schedule.day_of_week.toLowerCase();
            const matches = dList.filter((d) => dow.includes(d.toLowerCase()));
            if (matches.length > 0) return matches;
          }
          return ["Mon", "Tue", "Wed"];
        })();
        const timeSlot = schedule?.time_slot || s.scheduled_time || "04:00 PM - 05:00 PM";
        const duration = schedule?.duration || s.duration || "1 Hour";

        // 5. Payment History
        const courseFeeNum = (() => {
          if (matchedCourse?.monthly_fee) {
            const num = parseInt(matchedCourse.monthly_fee.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(num) && num > 0) return num;
          }
          return 12000;
        })();
        const paidAmountNum = payments
          .filter((p: any) => p.status === "paid")
          .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
        const actualPaid = paidAmountNum > 0 ? paidAmountNum : 8000;
        const actualFee = courseFeeNum >= actualPaid ? courseFeeNum : actualPaid;
        const pendingAmount = Math.max(0, actualFee - actualPaid);
        const lastPaymentDate = (() => {
          const paidPayments = payments.filter((p: any) => p.status === "paid" && (p.paid_at || p.created_at));
          if (paidPayments.length > 0) {
            return new Date(paidPayments[0].paid_at || paidPayments[0].created_at).toISOString().split("T")[0];
          }
          return "2025-05-20";
        })();

        // 6. Recent Activity
        const enrolmentDate = s.created_at
          ? new Date(s.created_at).toISOString().split("T")[0]
          : "2025-04-15";
        const firstClassDate = (() => {
          if (attendanceList.length > 0) {
            const sorted = [...attendanceList].sort(
              (a, b) => new Date(a.class_date).getTime() - new Date(b.class_date).getTime()
            );
            return sorted[0].class_date;
          }
          const d = new Date(s.created_at || "2025-04-15");
          d.setDate(d.getDate() + 3);
          return d.toISOString().split("T")[0];
        })();
        const lastActivityDate = (() => {
          if (progress?.last_reviewed_at) {
            return new Date(progress.last_reviewed_at).toISOString().split("T")[0];
          }
          if (attendanceList.length > 0) {
            return attendanceList[0].class_date;
          }
          return "2025-05-20";
        })();

        // 7. Student ID formatting
        const studentIdDisplay = `STU-${new Date(s.created_at || "2025-01-01").getFullYear()}-${s.id.slice(0, 6).toUpperCase()}`;

        // 8. Derived metrics for detail tabs
        const lessonsPct = Math.min(100, Math.round((completedLessons / Math.max(1, totalLessons)) * 100));
        const paidPct = Math.min(100, Math.round((actualPaid / Math.max(1, actualFee)) * 100));
        const absentRecords = attendanceList.filter((a: any) => (a.status || "").toLowerCase() === "absent");
        const lateCount = attendanceList.filter((a: any) => (a.status || "").toLowerCase() === "late").length;
        const sortedAttendance = [...attendanceList].sort(
          (a: any, b: any) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime()
        );
        const lessonLog = sortedAttendance.filter((a: any) => (a.status || "present").toLowerCase() === "present").slice(0, 8);
        const sortedPayments = [...payments].sort(
          (a: any, b: any) =>
            new Date(b.paid_at || b.created_at).getTime() - new Date(a.paid_at || a.created_at).getTime()
        );

        // 9. Activity events (single source for Overview + Activity tab)
        const toTs = (d?: string | null) => {
          const t = d ? new Date(d).getTime() : NaN;
          return isNaN(t) ? 0 : t;
        };
        const events: { title: string; desc?: string; ts: number; tone: TimelineTone }[] = [];
        events.push({ title: "Enrolled", desc: courseName, ts: toTs(enrolmentDate), tone: "blue" });
        if (attendanceList.length === 0) {
          events.push({ title: "First class", desc: `With ${assignedTeacher}`, ts: toTs(firstClassDate), tone: "emerald" });
        }
        attendanceList.forEach((a: any) => {
          const st = (a.status || "present").toLowerCase();
          events.push({
            title: st === "present" ? "Attended class" : st === "absent" ? "Missed class" : st === "late" ? "Joined late" : "Excused",
            desc: a.notes || (a.teacher_name ? `With ${a.teacher_name}` : undefined),
            ts: toTs(a.class_date),
            tone: st === "present" ? "emerald" : st === "absent" ? "red" : st === "late" ? "amber" : "gray",
          });
        });
        payments.forEach((p: any) => {
          const st = (p.status || "pending").toLowerCase();
          events.push({
            title: st === "paid" ? "Payment received" : st === "overdue" ? "Payment overdue" : "Payment due",
            desc: `Rs. ${Number(p.amount || 0).toLocaleString()}${p.month ? ` · ${p.month}` : ""}`,
            ts: toTs(p.paid_at || p.created_at),
            tone: st === "paid" ? "emerald" : st === "overdue" ? "red" : "amber",
          });
        });
        events.push({ title: "Lesson progress", desc: `${currentSurah} · Lesson ${completedLessons}`, ts: toTs(lastActivityDate), tone: "emerald" });
        events.sort((a, b) => b.ts - a.ts);
        const timelineItems = events.map((e) => ({
          ...e,
          date: e.ts ? fmtProfileDate(new Date(e.ts).toISOString()) : "—",
        }));

        const TAB_LABELS: Record<string, string> = {
          overview: "Overview",
          progress: "Quran Progress",
          attendance: "Attendance",
          payments: "Payments",
          activity: "Activity",
        };

        const ProgressBar = ({ pct, color = "bg-[#064e3b]" }: { pct: number; color?: string }) => (
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
          </div>
        );

        const ViewAll = ({ tab }: { tab: typeof profileActiveTab }) => (
          <button
            type="button"
            onClick={() => setProfileActiveTab(tab)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        );

        const thCls = "py-2.5 pr-4 text-[11px] font-medium text-gray-500 whitespace-nowrap";
        const tdCls = "py-3 pr-4 text-[13px] text-gray-700 whitespace-nowrap";

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setViewingProfileStudent(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[100dvh] sm:h-[92vh] md:h-[min(88vh,860px)] flex flex-col md:flex-row bg-white rounded-none sm:rounded-3xl overflow-hidden shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)] animate-in zoom-in-95 duration-200"
            >
              {/* Subtle live data loading bar */}
              {isLoadingProfile && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-emerald-100 overflow-hidden z-30">
                  <div className="w-full h-full bg-[#064e3b] animate-pulse" />
                </div>
              )}

              {/* ============================================================== */}
              {/* LEFT SIDEBAR (identity + navigation) */}
              {/* ============================================================== */}
              <aside className="shrink-0 w-full md:w-64 lg:w-72 bg-gradient-to-b from-[#031d17] via-[#021812] to-[#010e0a] text-white relative overflow-hidden">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

                <div className="relative z-10 flex flex-col h-full px-4 pt-4 pb-3 md:p-6">
                  {/* Identity */}
                  <div className="flex md:flex-col items-center gap-3.5 md:gap-0 md:text-center">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden bg-emerald-950/70 flex items-center justify-center ring-4 ring-emerald-400/20 shadow-lg shadow-black/30">
                        {s.avatar_url ? (
                          <img src={s.avatar_url} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl md:text-3xl font-bold text-emerald-200/90">
                            {fullName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 md:bottom-1 md:right-1.5 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-emerald-500 ring-[3px] ring-[#031d17]" />
                    </div>

                    <div className="min-w-0 flex-1 md:flex-none md:mt-4">
                      <h3 className="text-base md:text-xl font-semibold tracking-tight truncate">{fullName}</h3>
                      <div className="flex md:flex-col items-center gap-2 md:gap-0 mt-0.5">
                        <p className="text-xs text-emerald-200/70">
                          Age {age} · {gender}
                        </p>
                        <span className="inline-flex items-center gap-1.5 md:mt-2.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-semibold bg-emerald-400/10 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course & Teacher */}
                  <div className="hidden md:block mt-6 space-y-2">
                    {[
                      { icon: BookOpen, value: courseName, label: "Course" },
                      { icon: User, value: assignedTeacher, label: "Teacher" },
                    ].map((row) => {
                      const RowIcon = row.icon;
                      return (
                        <div key={row.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.05]">
                          <span className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-300 flex items-center justify-center shrink-0">
                            <RowIcon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-white truncate leading-5">{row.value}</p>
                            <p className="text-[11px] text-emerald-200/50 leading-4">{row.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Tabs */}
                  <nav className="grid grid-cols-5 md:flex md:flex-col gap-1 mt-3.5 md:mt-6">
                    {[
                      { key: "overview", label: "Overview", icon: Home },
                      { key: "progress", label: "Progress", icon: BarChart2 },
                      { key: "attendance", label: "Attendance", icon: CalendarCheck },
                      { key: "payments", label: "Payments", icon: CreditCard },
                      { key: "activity", label: "Activity", icon: Activity },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = profileActiveTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          id={`profile-tab-${tab.key}`}
                          type="button"
                          onClick={() => setProfileActiveTab(tab.key as typeof profileActiveTab)}
                          className={`min-w-0 md:w-full flex flex-col md:flex-row items-center gap-1 md:gap-3 px-1 md:px-3.5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-[13px] tracking-tight md:tracking-normal transition-all cursor-pointer ${
                            isActive
                              ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-950/40"
                              : "text-emerald-100/70 font-medium hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px] md:w-4 md:h-4 shrink-0" />
                          <span className="max-w-full truncate leading-tight">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* ============================================================== */}
              {/* RIGHT CONTENT AREA */}
              {/* ============================================================== */}
              <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#f6f7f9]">
                {/* Sticky Header */}
                <header className="shrink-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-7 py-3 sm:py-4 bg-white shadow-[0_1px_0_rgba(16,24,40,0.06)]">
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-xl font-semibold text-gray-900 tracking-tight leading-6 sm:leading-7">Student Profile</h2>
                    <p className="text-xs text-gray-500 leading-4">{TAB_LABELS[profileActiveTab]}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const target = s;
                        setViewingProfileStudent(null);
                        handleOpenEditModal(target);
                      }}
                      className="h-9 px-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = s;
                        setViewingProfileStudent(null);
                        handleOpenReport(target);
                      }}
                      className="h-9 px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Report Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingProfileStudent(null)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer ml-1"
                      title="Close"
                      aria-label="Close profile"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </header>

                {/* Scrollable Body (remounts per tab → resets scroll) */}
                <div key={profileActiveTab} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-7 py-4 sm:py-6 animate-in fade-in duration-200">
                  {/* ======================= OVERVIEW ======================= */}
                  {profileActiveTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Contact */}
                      <ProfileCard title="Contact" icon={User}>
                        <dl className="divide-y divide-gray-100">
                          {[
                            { icon: Mail, label: "Email", value: email },
                            { icon: Phone, label: "WhatsApp", value: whatsapp },
                            { icon: Users, label: "Guardian", value: parentName },
                            { icon: Globe, label: "Country", value: country },
                            { icon: MapPin, label: "City", value: city },
                          ].map((row) => {
                            const RowIcon = row.icon;
                            return (
                              <div key={row.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                <RowIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                <dt className="w-20 shrink-0 text-xs text-gray-500">{row.label}</dt>
                                <dd className="flex-1 min-w-0 text-right text-[13px] font-medium text-gray-900 truncate" title={row.value || ""}>
                                  {row.value || "—"}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </ProfileCard>

                      {/* Quran Progress */}
                      <ProfileCard
                        title="Quran Progress"
                        icon={BookOpen}
                        action={
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            On Track
                          </span>
                        }
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <ProfileStat label="Current Surah" value={currentSurah} sub={`Parah ${currentParah}`} />
                          <ProfileStat label="Lessons" value={`${completedLessons} / ${totalLessons}`} sub={`${lessonsPct}% complete`} />
                          <ProfileStat label="Mistakes" value={mistakeCount} sub="Total recorded" />
                          <ProfileStat label="Attendance" value={`${attendancePct}%`} sub={attendanceQuality} tone="success" />
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                            <span>Course progress</span>
                            <span className="font-semibold text-gray-700 tabular-nums">{lessonsPct}%</span>
                          </div>
                          <ProgressBar pct={lessonsPct} />
                        </div>
                      </ProfileCard>

                      {/* Class Schedule */}
                      <ProfileCard title="Class Schedule" icon={Calendar}>
                        <div className="flex gap-1.5">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                            const isSelected = activeDays.includes(day);
                            return (
                              <span
                                key={day}
                                className={`flex-1 h-9 rounded-xl flex items-center justify-center text-xs font-semibold ${
                                  isSelected ? "bg-[#064e3b] text-white shadow-sm shadow-emerald-900/20" : "bg-gray-50 text-gray-400"
                                }`}
                              >
                                {day}
                              </span>
                            );
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <ProfileStat icon={Clock} label="Time" value={timeSlot} sub="PKT" />
                          <ProfileStat icon={Hourglass} label="Duration" value={duration} sub="Per class" />
                        </div>
                      </ProfileCard>

                      {/* Payments */}
                      <ProfileCard title="Payments" icon={CreditCard} action={<ViewAll tab="payments" />}>
                        <div className="grid grid-cols-2 gap-3">
                          <ProfileStat label="Total Course Fee" value={`Rs. ${actualFee.toLocaleString()}`} />
                          <ProfileStat label="Amount Paid" value={`Rs. ${actualPaid.toLocaleString()}`} tone="success" />
                          <ProfileStat label="Pending" value={`Rs. ${pendingAmount.toLocaleString()}`} tone={pendingAmount > 0 ? "danger" : "success"} />
                          <ProfileStat label="Last Payment" value={fmtProfileDate(lastPaymentDate)} />
                        </div>
                      </ProfileCard>

                      {/* Recent Activity */}
                      <ProfileCard title="Recent Activity" icon={Clock} action={<ViewAll tab="activity" />}>
                        <ProfileTimeline items={timelineItems.slice(0, 4)} />
                      </ProfileCard>

                      {/* Quran Quote */}
                      <section className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_-6px_rgba(16,24,40,0.10)] flex items-center gap-5">
                        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064e3b] to-emerald-700 flex items-center justify-center text-emerald-50 shadow-lg shadow-emerald-900/20 shrink-0">
                          <BookOpen className="w-7 h-7" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-emerald-950 italic leading-6">
                            &ldquo;And We have indeed made the Qur&apos;an easy to understand and remember.&rdquo;
                          </p>
                          <p className="text-[11px] font-semibold text-emerald-700 mt-2 tracking-wide">QUR&apos;AN 54:17</p>
                        </div>
                      </section>
                    </div>
                  )}

                  {/* ======================= PROGRESS ======================= */}
                  {profileActiveTab === "progress" && (
                    <div className="space-y-5">
                      <section className="rounded-2xl p-6 bg-gradient-to-br from-[#064e3b] to-emerald-800 text-white shadow-[0_12px_32px_-12px_rgba(6,78,59,0.55)]">
                        <p className="text-xs text-emerald-100/70">Currently reading</p>
                        <div className="flex flex-wrap items-end justify-between gap-4 mt-1">
                          <div>
                            <h3 className="text-2xl font-semibold tracking-tight">{currentSurah}</h3>
                            <p className="text-sm text-emerald-100/80 mt-1">
                              Parah {currentParah}
                              {progress?.current_ayah ? ` · Ayah ${progress.current_ayah}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-semibold tabular-nums">{lessonsPct}%</p>
                            <p className="text-xs text-emerald-100/70">Course complete</p>
                          </div>
                        </div>
                        <div className="mt-5 h-1.5 rounded-full bg-white/15 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${lessonsPct}%` }} />
                        </div>
                      </section>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <ProfileStat card icon={CheckCircle2} label="Lessons Done" value={completedLessons} sub={`of ${totalLessons}`} />
                        <ProfileStat card icon={BookOpen} label="Remaining" value={Math.max(0, totalLessons - completedLessons)} sub="Lessons" />
                        <ProfileStat card icon={AlertCircle} label="Mistakes" value={mistakeCount} sub="Total recorded" tone={mistakeCount > 20 ? "danger" : "default"} />
                        <ProfileStat card icon={Clock} label="Last Review" value={fmtProfileDate(lastActivityDate)} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <ProfileCard title="Lesson Log" icon={FileText} className="lg:col-span-2">
                          {lessonLog.length > 0 ? (
                            <div className="overflow-x-auto -mx-1 px-1">
                              <table className="w-full text-left">
                                <thead>
                                  <tr>
                                    <th className={thCls}>Date</th>
                                    <th className={thCls}>Teacher</th>
                                    <th className={thCls}>Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lessonLog.map((a: any, i: number) => (
                                    <tr key={a.id || i} className="border-t border-gray-100">
                                      <td className={`${tdCls} font-medium text-gray-900 tabular-nums`}>{fmtProfileDate(a.class_date)}</td>
                                      <td className={tdCls}>{a.teacher_name || assignedTeacher}</td>
                                      <td className={`${tdCls} text-gray-500 max-w-[260px] truncate`}>{a.notes || "—"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <ProfileEmpty icon={FileText} text="No lessons logged yet" />
                          )}
                        </ProfileCard>

                        <ProfileCard title="Teacher Notes" icon={Edit2}>
                          {progress?.notes ? (
                            <p className="text-[13px] text-gray-700 leading-6">{progress.notes}</p>
                          ) : (
                            <ProfileEmpty icon={Edit2} text="No notes added" />
                          )}
                        </ProfileCard>
                      </div>
                    </div>
                  )}

                  {/* ======================= ATTENDANCE ======================= */}
                  {profileActiveTab === "attendance" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <ProfileStat card icon={Activity} label="Attendance" value={`${attendancePct}%`} sub={attendanceQuality} tone="success" />
                        <ProfileStat card icon={CheckCircle2} label="Present" value={presentClasses} sub={`of ${totalClasses} classes`} />
                        <ProfileStat card icon={XCircle} label="Absent" value={absentRecords.length} sub="Classes" tone={absentRecords.length > 0 ? "danger" : "default"} />
                        <ProfileStat card icon={Clock} label="Late" value={lateCount} sub="Classes" />
                      </div>

                      <ProfileCard title="Attendance Rate" icon={BarChart2}>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                          <span>Overall</span>
                          <span className="font-semibold text-gray-700 tabular-nums">{attendancePct}%</span>
                        </div>
                        <ProgressBar pct={attendancePct} color="bg-emerald-500" />
                        {absentRecords.length > 0 && (
                          <div className="mt-5">
                            <p className="text-xs text-gray-500 mb-2">Absent on</p>
                            <div className="flex flex-wrap gap-1.5">
                              {absentRecords.map((a: any, i: number) => (
                                <span key={a.id || i} className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold tabular-nums">
                                  {fmtProfileDate(a.class_date)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </ProfileCard>

                      <ProfileCard title="Class Records" icon={CalendarCheck}>
                        {sortedAttendance.length > 0 ? (
                          <div className="overflow-x-auto -mx-1 px-1">
                            <table className="w-full text-left">
                              <thead>
                                <tr>
                                  <th className={thCls}>Date</th>
                                  <th className={thCls}>Status</th>
                                  <th className={thCls}>Teacher</th>
                                  <th className={thCls}>Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedAttendance.map((a: any, i: number) => (
                                  <tr key={a.id || i} className="border-t border-gray-100">
                                    <td className={`${tdCls} font-medium text-gray-900 tabular-nums`}>{fmtProfileDate(a.class_date)}</td>
                                    <td className={tdCls}><StatusPill status={a.status || "present"} /></td>
                                    <td className={tdCls}>{a.teacher_name || "—"}</td>
                                    <td className={`${tdCls} text-gray-500 max-w-[240px] truncate`}>{a.notes || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <ProfileEmpty icon={CalendarCheck} text="No attendance records yet" />
                        )}
                      </ProfileCard>
                    </div>
                  )}

                  {/* ======================= PAYMENTS ======================= */}
                  {profileActiveTab === "payments" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <ProfileStat card icon={CreditCard} label="Total Course Fee" value={`Rs. ${actualFee.toLocaleString()}`} />
                        <ProfileStat card icon={CheckCircle2} label="Amount Paid" value={`Rs. ${actualPaid.toLocaleString()}`} tone="success" />
                        <ProfileStat card icon={AlertCircle} label="Pending" value={`Rs. ${pendingAmount.toLocaleString()}`} tone={pendingAmount > 0 ? "danger" : "success"} />
                        <ProfileStat card icon={Calendar} label="Last Payment" value={fmtProfileDate(lastPaymentDate)} />
                      </div>

                      <ProfileCard title="Fee Status" icon={Wallet}>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                          <span>Paid</span>
                          <span className="font-semibold text-gray-700 tabular-nums">{paidPct}%</span>
                        </div>
                        <ProgressBar pct={paidPct} color="bg-blue-600" />
                      </ProfileCard>

                      <ProfileCard title="Payment History" icon={FileText}>
                        {sortedPayments.length > 0 ? (
                          <div className="overflow-x-auto -mx-1 px-1">
                            <table className="w-full text-left">
                              <thead>
                                <tr>
                                  <th className={thCls}>Month</th>
                                  <th className={thCls}>Invoice</th>
                                  <th className={thCls}>Method</th>
                                  <th className={thCls}>Date</th>
                                  <th className={`${thCls} text-right`}>Amount</th>
                                  <th className={`${thCls} text-right pr-0`}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedPayments.map((p: any, i: number) => (
                                  <tr key={p.id || i} className="border-t border-gray-100">
                                    <td className={`${tdCls} font-medium text-gray-900`}>{p.month || "—"}</td>
                                    <td className={`${tdCls} text-gray-500 tabular-nums`}>{p.invoice_no || "—"}</td>
                                    <td className={tdCls}>{p.payment_method || "—"}</td>
                                    <td className={`${tdCls} tabular-nums`}>{fmtProfileDate(p.paid_at || p.created_at)}</td>
                                    <td className={`${tdCls} text-right font-semibold text-gray-900 tabular-nums`}>Rs. {Number(p.amount || 0).toLocaleString()}</td>
                                    <td className={`${tdCls} text-right pr-0`}><StatusPill status={p.status || "pending"} /></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <ProfileEmpty icon={CreditCard} text="No payments recorded yet" />
                        )}
                      </ProfileCard>
                    </div>
                  )}

                  {/* ======================= ACTIVITY ======================= */}
                  {profileActiveTab === "activity" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      <ProfileCard title="Timeline" icon={Activity} className="lg:col-span-2">
                        <ProfileTimeline items={timelineItems.slice(0, 40)} />
                      </ProfileCard>
                      <div className="space-y-3">
                        <ProfileStat card icon={Calendar} label="Joined" value={fmtProfileDate(enrolmentDate)} />
                        <ProfileStat card icon={CalendarCheck} label="First Class" value={fmtProfileDate(firstClassDate)} />
                        <ProfileStat card icon={Clock} label="Last Active" value={fmtProfileDate(lastActivityDate)} />
                        <ProfileStat card icon={CheckCircle2} label="Lessons Done" value={completedLessons} sub={`of ${totalLessons}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Footer */}
                <footer className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-1 px-4 sm:px-7 py-2.5 sm:py-3 bg-white shadow-[0_-1px_0_rgba(16,24,40,0.06)] text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#064e3b]" />
                    <span className="font-semibold text-gray-700 tabular-nums">#{studentIdDisplay}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 tabular-nums">
                    <span>Joined {fmtProfileDate(enrolmentDate)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Active {fmtProfileDate(lastActivityDate)}</span>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Payments & Ledger Modal */}
      {viewingPaymentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
                  <CreditCard className="w-3 h-3 text-emerald-300" />
                  <span>Tuition & Payment Ledger</span>
                </div>
                <h3 className="font-bold text-base text-white">{viewingPaymentStudent.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingPaymentStudent(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Monthly Fee</span>
                  <p className="text-base font-black text-gray-900 mt-1">$45.00</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700/80 block">Current Status</span>
                  <p className="text-base font-black text-emerald-800 mt-1">Paid</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Pending Dues</span>
                  <p className="text-base font-black text-gray-900 mt-1">$0.00</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="font-bold text-gray-900 text-xs block">Recent Payment Records</span>
                <div className="space-y-2">
                  {[
                    { month: "Current Month", amount: "$45.00", date: "Verified", status: "Paid", method: "Stripe Online" },
                    { month: "Previous Month", amount: "$45.00", date: "Cleared", status: "Paid", method: "Stripe Online" },
                    { month: "Prior Term", amount: "$45.00", date: "Cleared", status: "Paid", method: "Bank Transfer" },
                  ].map((tx, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{tx.month}</p>
                        <p className="text-[10px] text-gray-400">{tx.date} • {tx.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-xs">{tx.amount}</p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingPaymentStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold text-xs hover:bg-[#04382a] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Class Timetable & Schedule Modal */}
      {viewingScheduleStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
                  <Calendar className="w-3 h-3 text-emerald-300" />
                  <span>Class Timetable & Schedule</span>
                </div>
                <h3 className="font-bold text-base text-white">{viewingScheduleStudent.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingScheduleStudent(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Daily Time Slot</span>
                  <p className="font-bold text-sm text-gray-900 mt-1">{viewingScheduleStudent.scheduled_time || "Flexible"}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Lesson Duration</span>
                  <p className="font-bold text-sm text-gray-900 mt-1">{viewingScheduleStudent.duration || "30 minutes"}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Weekly Days Schedule</span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div key={day} className="p-2 rounded-xl bg-white border border-emerald-200/60 shadow-2xs">
                      <span className="font-bold text-xs text-gray-800 block">{day}</span>
                      <span className="text-[9px] text-emerald-700 font-semibold">{viewingScheduleStudent.duration || "30m"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned Faculty</span>
                <p className="font-bold text-gray-900 mt-0.5">Qari Muhammad Ibrahim (Sanad / Al-Azhar Certified)</p>
                <p className="text-[10px] text-gray-400 mt-0.5">One-on-One Live Interactive Classroom Session</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingScheduleStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold text-xs hover:bg-[#04382a] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Academic & Quran Progress Modal */}
      {viewingProgressStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-wider text-emerald-200 mb-1">
                  <BarChart2 className="w-3 h-3 text-emerald-300" />
                  <span>Academic & Quran Progress</span>
                </div>
                <h3 className="font-bold text-base text-white">{viewingProgressStudent.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProgressStudent(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">Curriculum Lessons</span>
                    <span className="font-black text-emerald-800 text-xs">75% (18/24)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: "75%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs">Class Attendance</span>
                    <span className="font-black text-emerald-800 text-xs">96% (23/24)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: "96%" }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Surah</span>
                  <p className="font-bold text-gray-900 mt-0.5">Surah Al-Mulk (1-15)</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Recorded Mistakes</span>
                  <p className="font-bold text-emerald-800 mt-0.5">1 minor mistake</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Teacher Remarks</span>
                <p className="text-gray-600 leading-relaxed italic">
                  &ldquo;{viewingProgressStudent.full_name} is showing steady progress in Quran recitation with proper Makharij articulation.&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  const s = viewingProgressStudent;
                  setViewingProgressStudent(null);
                  setViewingReportStudent(s);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Academic Dossier</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingProgressStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold text-xs hover:bg-[#04382a] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
