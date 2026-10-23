"use client";

import React, { useState, useTransition } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Video,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  User,
  Users,
  Search,
} from "lucide-react";
import {
  saveScheduleSlotAction,
  deleteScheduleSlotAction,
  ScheduleSlotInput,
} from "@/app/admin/actions";
import { FilterDropdown, FormSelectDropdown } from "@/components/admin/AdminDropdowns";

export interface ScheduleSlotRecord {
  id: string;
  student_id: string | null;
  student_name: string;
  teacher_id: string | null;
  teacher_name: string;
  day_of_week: string;
  time_slot: string;
  duration: string | null;
  meeting_link: string | null;
  status: string | null;
  created_at: string;
}

const DAYS_OF_WEEK = [
  "All Days",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const STANDARD_TIMES = [
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

interface ScheduleManagerClientProps {
  initialSlots: ScheduleSlotRecord[];
  teachersList: string[];
  studentsList: string[];
}

export default function ScheduleManagerClient({
  initialSlots,
  teachersList,
  studentsList,
}: ScheduleManagerClientProps) {
  const [slots, setSlots] = useState<ScheduleSlotRecord[]>(initialSlots);
  const [selectedDay, setSelectedDay] = useState("All Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ScheduleSlotInput>({
    studentName: studentsList[0] || "",
    teacherName: teachersList[0] || "Sheikh Abdullah",
    dayOfWeek: "Monday",
    timeSlot: "5:00 PM",
    duration: "30 mins",
    meetingLink: "https://meet.google.com/aln-quran-live",
    status: "active",
  });

  const filteredSlots = slots.filter((s) => {
    const matchesDay =
      selectedDay === "All Days" || s.day_of_week === selectedDay;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      s.student_name.toLowerCase().includes(query) ||
      s.teacher_name.toLowerCase().includes(query) ||
      s.time_slot.toLowerCase().includes(query);
    return matchesDay && matchesQuery;
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this schedule slot?")) return;
    startTransition(async () => {
      const res = await deleteScheduleSlotAction(id);
      if (res.success) {
        setSlots((prev) => prev.filter((s) => s.id !== id));
        setFeedbackMsg({ type: "success", text: "Slot deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete slot." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveScheduleSlotAction(formData);
      if (res.success) {
        const newRecord: ScheduleSlotRecord = {
          id: `slot_${Date.now()}`,
          student_id: null,
          student_name: formData.studentName,
          teacher_id: null,
          teacher_name: formData.teacherName,
          day_of_week: formData.dayOfWeek,
          time_slot: formData.timeSlot,
          duration: formData.duration || "30 mins",
          meeting_link: formData.meetingLink || "https://meet.google.com/aln-quran-live",
          status: "active",
          created_at: new Date().toISOString(),
        };
        setSlots((prev) => [newRecord, ...prev]);
        setFeedbackMsg({ type: "success", text: "Schedule slot allocated successfully." });
        setIsModalOpen(false);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save slot." });
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
              Class Schedule & Timetable
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {slots.length} Active Slots
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Weekly 1-on-1 Quran class allocations, teacher assignments, and live meeting links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Class Slot</span>
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
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

      {/* Day Selector Tabs (Apple/Google Segmented Controller) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-gray-100/90 rounded-2xl text-xs font-semibold">
        {DAYS_OF_WEEK.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDay(d)}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedDay === d
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, teacher, or time..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b] text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Showing {filteredSlots.length} allocated sessions
        </span>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Day & Time</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assigned Instructor</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Live Classroom</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-700">No scheduled classes for this day.</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Click &quot;Allocate Class Slot&quot; to assign a teacher to a student.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Time & Day */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {slot.time_slot}
                        </span>
                        <span className="text-gray-500 text-xs font-semibold">{slot.day_of_week}</span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{slot.student_name}</span>
                      </div>
                    </td>

                    {/* Teacher */}
                    <td className="py-3.5 px-4 font-medium text-emerald-800">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{slot.teacher_name}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{slot.duration || "30 mins"}</span>
                      </span>
                    </td>

                    {/* Meeting Link */}
                    <td className="py-3.5 px-4">
                      <a
                        href={slot.meeting_link || "https://meet.google.com"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        <span>Open Class Meet</span>
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(slot.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">Allocate Live Class Slot</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Zayd Al-Hassan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Teacher *</label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="e.g. Sheikh Abdullah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Day of Week</label>
                  <FormSelectDropdown
                    value={formData.dayOfWeek}
                    onChange={(val) => setFormData({ ...formData, dayOfWeek: val })}
                    options={DAYS_OF_WEEK.filter((d) => d !== "All Days").map((d) => ({
                      value: d,
                      label: d,
                    }))}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time Slot</label>
                  <FormSelectDropdown
                    value={formData.timeSlot}
                    onChange={(val) => setFormData({ ...formData, timeSlot: val })}
                    options={STANDARD_TIMES.map((t) => ({ value: t, label: t }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class Duration</label>
                  <FormSelectDropdown
                    value={formData.duration || "30 mins"}
                    onChange={(val) => setFormData({ ...formData, duration: val })}
                    options={[
                      { value: "30 mins", label: "30 mins" },
                      { value: "45 mins", label: "45 mins" },
                      { value: "60 mins", label: "60 mins" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Meeting Link</label>
                  <input
                    type="url"
                    value={formData.meetingLink || ""}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200"
                  />
                </div>
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
                  <span>Save Slot</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
