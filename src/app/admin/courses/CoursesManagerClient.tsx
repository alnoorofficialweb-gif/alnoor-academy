"use client";

import React, { useState, useTransition } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Check,
  Tag,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  saveCourseAction,
  toggleCourseActiveAction,
  deleteCourseAction,
  CourseInput,
} from "@/app/admin/actions";
import { FormSelectDropdown } from "@/components/admin/AdminDropdowns";

export interface CourseRecord {
  id: string;
  slug: string;
  title: string;
  arabic_title: string | null;
  level: string;
  duration: string;
  lessons: number;
  monthly_fee: string;
  description: string;
  highlights: string[];
  is_active: boolean;
  created_at: string;
}

interface CoursesManagerClientProps {
  initialCourses: CourseRecord[];
}

const DEFAULT_COURSES: CourseRecord[] = [
  {
    id: "def_1",
    slug: "quran-reading",
    title: "Quran Reading with Qaida",
    arabic_title: "قراءة القرآن مع القاعدة",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 24,
    monthly_fee: "Rs. 12,000 / month",
    description: "Step-by-step Arabic letter phonetics, Makharij & word joining.",
    highlights: ["Noorani Qaida Track", "Makharij Phonetics", "1-on-1 Child Friendly"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "def_2",
    slug: "tajweed-mastery",
    title: "Tajweed Rules & Recitation",
    arabic_title: "تجويد القرآن الكريم",
    level: "Intermediate",
    duration: "45 mins / day",
    lessons: 36,
    monthly_fee: "Rs. 15,000 / month",
    description: "Master melodic recitation with precise articulation rules.",
    highlights: ["Noon & Meem Rules", "Tarteel Fluency", "Live Teacher Correction"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "def_3",
    slug: "quran-memorization",
    title: "Quran Memorization (Hifz)",
    arabic_title: "تحفيظ القرآن الكريم",
    level: "Advanced",
    duration: "45 mins / day",
    lessons: 48,
    monthly_fee: "Rs. 18,000 / month",
    description: "Structured daily Sabaq & Manzil revision with Huffaz.",
    highlights: ["Daily Hifz Targets", "Rigorous Revision", "Supervised by Huffaz"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "def_4",
    slug: "islamic-basics",
    title: "Islamic Essentials & Duas",
    arabic_title: "الأساسيات الإسلامية والأدعية",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 20,
    monthly_fee: "Rs. 10,000 / month",
    description: "Essential daily supplications, Sunnah manners & Salah.",
    highlights: ["Daily Masnoon Duas", "Prophetic Character", "All Ages Friendly"],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default function CoursesManagerClient({
  initialCourses,
}: CoursesManagerClientProps) {
  const [courses, setCourses] = useState<CourseRecord[]>(
    initialCourses && initialCourses.length > 0 ? initialCourses : DEFAULT_COURSES
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<CourseInput>({
    slug: "",
    title: "",
    arabicTitle: "",
    level: "Beginner",
    duration: "30 mins / day",
    lessons: 24,
    monthlyFee: "Rs. 12,000 / month",
    description: "",
    highlights: [],
    isActive: true,
  });
  const [highlightsInput, setHighlightsInput] = useState("");

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      slug: "",
      title: "",
      arabicTitle: "",
      level: "Beginner",
      duration: "30 mins / day",
      lessons: 24,
      monthlyFee: "Rs. 12,000 / month",
      description: "",
      highlights: [],
      isActive: true,
    });
    setHighlightsInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CourseRecord) => {
    setEditingCourse(c);
    setFormData({
      id: c.id,
      slug: c.slug,
      title: c.title,
      arabicTitle: c.arabic_title || "",
      level: c.level || "Beginner",
      duration: c.duration || "30 mins / day",
      lessons: c.lessons || 24,
      monthlyFee: c.monthly_fee || "Rs. 12,000 / month",
      description: c.description || "",
      highlights: c.highlights || [],
      isActive: c.is_active,
    });
    setHighlightsInput((c.highlights || []).join(", "));
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    const nextVal = !current;
    startTransition(async () => {
      const res = await toggleCourseActiveAction(id, nextVal);
      if (res.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: nextVal } : c))
        );
        setFeedbackMsg({
          type: "success",
          text: `Course ${nextVal ? "activated" : "deactivated"} successfully.`,
        });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to update." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this course from curriculum?")) return;
    startTransition(async () => {
      const res = await deleteCourseAction(id);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        setFeedbackMsg({ type: "success", text: "Course removed." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete course." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsArr = highlightsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      highlights: highlightsArr,
    };

    startTransition(async () => {
      const res = await saveCourseAction(payload);
      if (res.success) {
        if (formData.id) {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === formData.id
                ? {
                    ...c,
                    slug: formData.slug,
                    title: formData.title,
                    arabic_title: formData.arabicTitle || null,
                    level: formData.level,
                    duration: formData.duration,
                    lessons: formData.lessons,
                    monthly_fee: formData.monthlyFee,
                    description: formData.description,
                    highlights: highlightsArr,
                    is_active: formData.isActive !== false,
                  }
                : c
            )
          );
          setFeedbackMsg({ type: "success", text: "Course updated successfully." });
        } else {
          const newCourse: CourseRecord = {
            id: `course_${Date.now()}`,
            slug: formData.slug,
            title: formData.title,
            arabic_title: formData.arabicTitle || null,
            level: formData.level,
            duration: formData.duration,
            lessons: formData.lessons,
            monthly_fee: formData.monthlyFee,
            description: formData.description,
            highlights: highlightsArr,
            is_active: true,
            created_at: new Date().toISOString(),
          };
          setCourses((prev) => [...prev, newCourse]);
          setFeedbackMsg({ type: "success", text: "New course created." });
        }
        setIsModalOpen(false);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save course." });
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
              Curriculum & Courses
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {courses.length} Programs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Customize course catalog, pricing fees, duration, and website visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
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

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all relative flex flex-col justify-between ${
              course.is_active ? "border-gray-100 hover:border-gray-200" : "border-gray-200 bg-gray-50/50 opacity-80"
            }`}
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        course.level === "Beginner"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : course.level === "Intermediate"
                          ? "bg-sky-50 text-sky-700 border border-sky-100"
                          : "bg-purple-50 text-purple-700 border border-purple-100"
                      }`}
                    >
                      {course.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(course.id, course.is_active)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                        course.is_active
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {course.is_active ? "● Live on Site" : "○ Inactive Draft"}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    {course.title}
                  </h3>
                  {course.arabic_title && (
                    <p className="text-xs text-emerald-700 font-serif font-bold mt-0.5">
                      {course.arabic_title}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#064e3b]">
                    {course.monthly_fee || "Rs. 12,000 / mo"}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {course.lessons} Lessons
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {course.description}
              </p>

              {/* Highlights */}
              {course.highlights && course.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {course.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-gray-50 border border-gray-100 text-gray-600 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Slug: <code className="text-gray-600 font-mono">/{course.slug}</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(course)}
                  className="px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-emerald-800 hover:bg-gray-100 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(course.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">
                {editingCourse ? "Edit Course Program" : "Create New Course"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({
                        ...formData,
                        title: t,
                        slug: editingCourse ? formData.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      });
                    }}
                    placeholder="e.g. Advanced Tajweed Rules"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Arabic Title
                  </label>
                  <input
                    type="text"
                    value={formData.arabicTitle || ""}
                    onChange={(e) => setFormData({ ...formData, arabicTitle: e.target.value })}
                    placeholder="e.g. تجويد القرآن"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="tajweed-rules"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Level</label>
                  <FormSelectDropdown
                    value={formData.level}
                    onChange={(val) => setFormData({ ...formData, level: val })}
                    options={[
                      { value: "Beginner", label: "Beginner" },
                      { value: "Intermediate", label: "Intermediate" },
                      { value: "Advanced", label: "Advanced" },
                      { value: "All Levels", label: "All Levels" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="text"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="Rs. 12,000 / month"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Daily Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30 mins / day"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Lessons</label>
                  <input
                    type="number"
                    value={formData.lessons}
                    onChange={(e) => setFormData({ ...formData, lessons: Number(e.target.value) })}
                    placeholder="24"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of what the student will learn..."
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="1-on-1 Scholar, Kids Friendly, Flexible Timings"
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
                  <span>{editingCourse ? "Save Program" : "Create Course"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
