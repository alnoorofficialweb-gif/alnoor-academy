"use client";

import React, { useState, useTransition } from "react";
import {
  Bell,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Users,
  GraduationCap,
  ShieldCheck,
  Mail,
} from "lucide-react";
import {
  sendBroadcastNotificationAction,
  deleteNotificationAction,
} from "@/app/admin/actions";
import { FormSelectDropdown } from "@/components/admin/AdminDropdowns";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  recipient_role: string;
  recipient_email: string | null;
  sent_by: string;
  created_at: string;
}

interface NotificationsManagerClientProps {
  initialNotifications: NotificationItem[];
}

export default function NotificationsManagerClient({
  initialNotifications,
}: NotificationsManagerClientProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientRole, setRecipientRole] = useState("all");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    startTransition(async () => {
      const res = await sendBroadcastNotificationAction({
        title,
        message,
        recipientRole,
        recipientEmail: recipientRole === "specific" ? recipientEmail : undefined,
      });

      if (res.success) {
        const newNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          title,
          message,
          recipient_role: recipientRole,
          recipient_email: recipientRole === "specific" ? recipientEmail : null,
          sent_by: "Admin",
          created_at: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotif, ...prev]);
        setFeedbackMsg({
          type: "success",
          text: "Broadcast notification dispatched to academy members.",
        });
        setTitle("");
        setMessage("");
        setRecipientEmail("");
      } else {
        setFeedbackMsg({
          type: "error",
          text: res.error || "Failed to dispatch broadcast.",
        });
      }
      setTimeout(() => setFeedbackMsg(null), 3500);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotificationAction(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setFeedbackMsg({ type: "success", text: "Notification log deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: "Failed to delete log." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Academy Broadcasts & Alerts
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {notifications.length} Sent
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Send urgent class updates, exam alerts, and calendar notices to students and faculty.
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose Broadcast */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Compose Broadcast</h2>
              <p className="text-[11px] text-gray-400">Dispatch message instantly</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Target Audience</label>
              <FormSelectDropdown
                value={recipientRole}
                onChange={(val) => setRecipientRole(val)}
                options={[
                  { value: "all", label: "All Academy (Students + Teachers)" },
                  { value: "students", label: "All Enrolled Students" },
                  { value: "teachers", label: "All Qualified Instructors" },
                  { value: "specific", label: "Specific Individual Email" },
                ]}
              />
            </div>

            {recipientRole === "specific" && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Recipient Email *</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">Subject / Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Class Schedule Notice"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Notification Body *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement or notice here..."
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Dispatch Broadcast</span>
            </button>
          </form>
        </div>

        {/* Right: Broadcast History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 sm:px-5 sm:py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Broadcast History Log</h2>
              <p className="text-[11px] text-gray-500">Previously transmitted alerts</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {notifications.length} alerts recorded
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs flex-1">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700">No broadcasts sent yet.</p>
                <p className="text-[11px] mt-0.5">Use the compose panel to dispatch your first alert.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 sm:p-5 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            n.recipient_role === "all"
                              ? "bg-purple-50 text-purple-800 border border-purple-100"
                              : n.recipient_role === "students"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : n.recipient_role === "teachers"
                              ? "bg-teal-50 text-teal-800 border border-teal-100"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                          }`}
                        >
                          {n.recipient_role === "all"
                            ? "All Members"
                            : n.recipient_role === "students"
                            ? "All Students"
                            : n.recipient_role === "teachers"
                            ? "Instructors"
                            : n.recipient_email || "Individual"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(n.created_at).toLocaleDateString()} at{" "}
                          {new Date(n.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-sm mt-1">{n.title}</h3>
                      <p className="text-gray-600 leading-relaxed mt-1">{n.message}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      title="Delete Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
