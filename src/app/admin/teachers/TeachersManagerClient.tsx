"use client";

import React, { useState, useTransition } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Check,
  X,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Eye,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Download,
  User,
  ChevronDown,
} from "lucide-react";
import {
  updateTeacherStatusAction,
  saveTeacherAction,
  deleteTeacherAction,
  TeacherInput,
} from "@/app/admin/actions";
import {
  StatusDropdown,
  FilterDropdown,
  TEACHER_STATUSES,
} from "@/components/admin/AdminDropdowns";

export interface TeacherRecord {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string | null;
  specialization: string | null;
  experience: string | null;
  sanad_details: string | null;
  cv_url?: string | null;
  photo_url?: string | null;
  status: string;
  created_at: string;
}

interface TeachersManagerClientProps {
  initialTeachers: TeacherRecord[];
}

export default function TeachersManagerClient({
  initialTeachers,
}: TeachersManagerClientProps) {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [viewingApplication, setViewingApplication] = useState<TeacherRecord | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<TeacherInput>({
    fullName: "",
    email: "",
    whatsapp: "",
    country: "Egypt",
    city: "Cairo",
    specialization: "Quran & Tajweed",
    experience: "5+ Years",
    sanadDetails: "Hafs 'an 'Asim Sanad",
    status: "approved",
  });

  // Filtered List
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.whatsapp?.includes(searchQuery) ||
      (t.specialization && t.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || t.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = teachers.length;
  const approvedCount = teachers.filter((t) => t.status === "approved").length;
  const pendingTeachers = teachers.filter((t) => t.status === "pending");
  const pendingCount = pendingTeachers.length;

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      fullName: "",
      email: "",
      whatsapp: "",
      country: "Egypt",
      city: "Cairo",
      specialization: "Quran & Tajweed",
      experience: "3+ Years",
      sanadDetails: "",
      status: "approved",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: TeacherRecord) => {
    setEditingTeacher(t);
    setFormData({
      id: t.id,
      fullName: t.full_name || "",
      email: t.email || "",
      whatsapp: t.whatsapp || "",
      country: t.country || "Egypt",
      city: t.city || "",
      specialization: t.specialization || "Quran & Tajweed",
      experience: t.experience || "3+ Years",
      sanadDetails: t.sanad_details || "",
      status: t.status || "approved",
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateTeacherStatusAction(id, newStatus);
      if (res.success) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
        if (viewingApplication && viewingApplication.id === id) {
          setViewingApplication({ ...viewingApplication, status: newStatus });
        }
        setFeedbackMsg({
          type: "success",
          text: `Teacher application marked as ${newStatus}.`,
        });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to update status." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this instructor?")) return;
    setIsDeletingId(id);
    startTransition(async () => {
      const res = await deleteTeacherAction(id);
      if (res.success) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        if (viewingApplication && viewingApplication.id === id) {
          setViewingApplication(null);
        }
        setFeedbackMsg({ type: "success", text: "Teacher profile deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete teacher." });
      }
      setIsDeletingId(null);
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveTeacherAction(formData);
      if (res.success) {
        if (formData.id) {
          setTeachers((prev) =>
            prev.map((t) =>
              t.id === formData.id
                ? {
                    ...t,
                    full_name: formData.fullName,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                    country: formData.country,
                    city: formData.city || null,
                    specialization: formData.specialization || null,
                    experience: formData.experience || null,
                    sanad_details: formData.sanadDetails || null,
                    status: formData.status || "approved",
                  }
                : t
            )
          );
          setFeedbackMsg({ type: "success", text: "Teacher updated successfully." });
        } else {
          const newRecord: TeacherRecord = {
            id: `temp_${Date.now()}`,
            full_name: formData.fullName,
            email: formData.email,
            whatsapp: formData.whatsapp,
            country: formData.country,
            city: formData.city || null,
            specialization: formData.specialization || null,
            experience: formData.experience || null,
            sanad_details: formData.sanadDetails || null,
            status: formData.status || "approved",
            created_at: new Date().toISOString(),
          };
          setTeachers((prev) => [newRecord, ...prev]);
          setFeedbackMsg({ type: "success", text: "New teacher added to faculty." });
        }
        setIsModalOpen(false);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save teacher." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Faculty & Instructors
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review teacher applications, inspect uploaded CVs & Sanad credentials, and manage active instructors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instructor</span>
        </button>
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

      {/* Pending Applications Review Banner (if any) */}
      {pendingCount > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {pendingCount} Pending Instructor Application{pendingCount > 1 ? "s" : ""} Awaiting Review
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 font-medium">Click to inspect application</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingTeachers.slice(0, 2).map((pt) => (
              <div
                key={pt.id}
                className="bg-white p-3.5 rounded-xl border border-amber-100 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div
                  className="cursor-pointer group flex items-center gap-2.5 min-w-0"
                  onClick={() => setViewingApplication(pt)}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    {pt.photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={pt.photo_url} alt={pt.full_name} className="w-full h-full object-cover" />
                    ) : (
                      pt.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-xs group-hover:text-amber-800 transition-colors truncate">
                      {pt.full_name}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {pt.specialization || "Quran & Tajweed"}
                    </div>
                    {pt.cv_url && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                        <FileText className="w-2.5 h-2.5" />
                        <span>CV Attached</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewingApplication(pt)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(pt.id, "approved")}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Instructors</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-teal-100 bg-teal-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">Approved & Active</p>
          <p className="text-2xl font-extrabold text-teal-800 mt-1">{approvedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-800/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty name, email, specialization..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-gray-50/80 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
          />
        </div>

        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
          className="min-w-[150px]"
        />
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Credentials & Files</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <ShieldCheck className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium">No instructors found.</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Adjust your search or click &quot;Add Instructor&quot; to onboard faculty.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Name & Photo */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-emerald-100">
                          {t.photo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover" />
                          ) : (
                            t.full_name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{t.full_name}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>
                              {t.city ? `${t.city}, ` : ""}
                              {t.country || "Egypt"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 space-y-1 align-middle">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{t.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <a
                          href={`https://wa.me/${t.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {t.whatsapp}
                        </a>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="whitespace-nowrap inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
                        {t.specialization || "Quran & Tajweed"}
                      </span>
                    </td>

                    {/* Credentials & Files */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-medium text-gray-800">
                        {t.experience || "3+ Years"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {t.cv_url && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <FileText className="w-2.5 h-2.5" />
                            <span>CV Attached</span>
                          </span>
                        )}
                        {t.sanad_details && (
                          <div className="text-[10px] text-gray-500 truncate max-w-[140px]">
                            {t.sanad_details}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle">
                      <StatusDropdown
                        value={t.status || "approved"}
                        onChange={(newStatus) => handleStatusChange(t.id, newStatus)}
                        options={TEACHER_STATUSES}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right align-middle">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingApplication(t)}
                          className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Inspect Full Application"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Instructor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          disabled={isDeletingId === t.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          {isDeletingId === t.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT APPLICATION MODAL (Detailed View as requested) */}
      {viewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">
                  Faculty Application Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingApplication(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Profile Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden border border-emerald-200">
                  {viewingApplication.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={viewingApplication.photo_url}
                      alt={viewingApplication.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    viewingApplication.full_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-gray-900">
                      {viewingApplication.full_name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        viewingApplication.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : viewingApplication.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {viewingApplication.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {viewingApplication.specialization || "Quran & Tajweed"}
                  </p>
                  <p className="text-gray-400 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {viewingApplication.city ? `${viewingApplication.city}, ` : ""}
                      {viewingApplication.country}
                    </span>
                  </p>
                </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Email Address
                  </span>
                  <div className="font-semibold text-gray-900 mt-0.5 truncate">
                    {viewingApplication.email}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    WhatsApp Hotline
                  </span>
                  <div className="font-semibold text-emerald-700 mt-0.5">
                    <a
                      href={`https://wa.me/${viewingApplication.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{viewingApplication.whatsapp}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Qualifications & Sanad */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Sanad / Ijazah / Education Details
                </span>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                  {viewingApplication.sanad_details || "No explicit sanad details submitted."}
                </div>
              </div>

              {/* Uploaded Documents (CV & Photo) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Attached Documents
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* CV Document */}
                  {viewingApplication.cv_url ? (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">Curriculum Vitae (CV)</p>
                          <p className="text-[10px] text-emerald-700">Document Uploaded</p>
                        </div>
                      </div>
                      <a
                        href={viewingApplication.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        download={`${viewingApplication.full_name}_CV`}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#064e3b] text-white hover:bg-[#04382a] transition-colors inline-flex items-center gap-1 shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>View / Open</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-[11px] flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>No CV file attached</span>
                    </div>
                  )}

                  {/* Photo / Certificate */}
                  {viewingApplication.photo_url ? (
                    <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ImageIcon className="w-4 h-4 text-teal-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">Photo / Certificate</p>
                          <p className="text-[10px] text-teal-700">Image Attached</p>
                        </div>
                      </div>
                      <a
                        href={viewingApplication.photo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-700 text-white hover:bg-teal-800 transition-colors inline-flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-[11px] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>No Photo file attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-gray-400">
                Applied on {new Date(viewingApplication.created_at).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {viewingApplication.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(viewingApplication.id, "approved")}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Application</span>
                  </button>
                )}
                {viewingApplication.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(viewingApplication.id, "rejected")}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">
                {editingTeacher ? "Edit Instructor" : "Onboard New Instructor"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sheikh Abdullah"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization || ""}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Ten Qira'at, Tajweed"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+20 100 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Egypt"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience || ""}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 5+ Years"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Sanad / Ijazah Details
                </label>
                <input
                  type="text"
                  value={formData.sanadDetails || ""}
                  onChange={(e) => setFormData({ ...formData, sanadDetails: e.target.value })}
                  placeholder="e.g. Certified Sanad connected to Prophet (pbuh)"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] flex items-center gap-1.5 shadow-xs"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingTeacher ? "Save Changes" : "Onboard Instructor"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
