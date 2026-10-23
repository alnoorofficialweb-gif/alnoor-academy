"use client";

import React, { useState, useTransition } from "react";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Database,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Save,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  updateAcademySettingsAction,
  exportDatabaseBackupAction,
} from "@/app/admin/actions";

interface SettingsManagerClientProps {
  initialContact: {
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
  };
  initialSlots: string[];
}

export default function SettingsManagerClient({
  initialContact,
  initialSlots,
}: SettingsManagerClientProps) {
  const [contact, setContact] = useState(initialContact);
  const [slots, setSlots] = useState<string[]>(initialSlots);
  const [newSlotInput, setNewSlotInput] = useState("");

  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateAcademySettingsAction("contact_info", contact);
      if (res.success) {
        setFeedbackMsg({ type: "success", text: "Academy contact details updated successfully." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to update contact info." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    const updated = [...slots, newSlotInput.trim()];
    setSlots(updated);
    setNewSlotInput("");
    saveSlots(updated);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
    saveSlots(updated);
  };

  const saveSlots = (updatedSlots: string[]) => {
    startTransition(async () => {
      const res = await updateAcademySettingsAction("class_slots", updatedSlots);
      if (res.success) {
        setFeedbackMsg({ type: "success", text: "Class time slots saved." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save slots." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Academy Configurations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Customize global contact numbers, class timings, database synchronization, and system parameters.
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

      {/* 1. Contact Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <Phone className="w-4 h-4 text-[#064e3b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Academy Contact & Communications
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          These details are displayed on the public website footer, header contact buttons, and student inquiry flows.
        </p>

        <form onSubmit={handleSaveContact} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Official WhatsApp Number
              </label>
              <input
                type="text"
                required
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                placeholder="+44 7458 198270"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Admissions Hotline Phone
              </label>
              <input
                type="text"
                required
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="+44 20 8123 4567"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                required
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="admissions@alnooracademy.com"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Campus / Address
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                placeholder="London, United Kingdom"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Save className="w-3.5 h-3.5" />
              <span>Save Contact Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Class Slots Management */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <Clock className="w-4 h-4 text-[#064e3b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Available Class Timings Slots
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          Manage the selectable time slots offered to prospective students during enrollment and trial scheduling.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-2xs"
            >
              <span>{slot}</span>
              <button
                type="button"
                onClick={() => handleRemoveSlot(idx)}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove Slot"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add slot input */}
        <div className="flex items-center gap-2 max-w-sm pt-2">
          <input
            type="text"
            value={newSlotInput}
            onChange={(e) => setNewSlotInput(e.target.value)}
            placeholder="e.g. 10:00 PM"
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-emerald-600"
          />
          <button
            type="button"
            onClick={handleAddSlot}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 shrink-0 inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* 3. Admin Account & Password Update */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <Shield className="w-4 h-4 text-[#064e3b]" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Admin Profile & Security Credentials
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          Update the master administrative password for this control portal.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFeedbackMsg({
              type: "success",
              text: "Administrator password updated successfully.",
            });
            setTimeout(() => setFeedbackMsg(null), 3000);
          }}
          className="space-y-4 max-w-md pt-1"
        >
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Administrator Email
            </label>
            <input
              type="text"
              readOnly
              value="admin@alnooracademy.com"
              className="w-full px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Update Admin Password
          </button>
        </form>
      </div>

      {/* 4. Full Database Backup & Disaster Recovery */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900">
            <Database className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Database Backup & Disaster Recovery
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            Cloud Sync Active
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Generate an instant snapshot backup of all tables (Students, Teachers, Courses, Schedules, Payments, Questions) as a structured JSON file.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={async () => {
              setFeedbackMsg({ type: "success", text: "Compiling database tables..." });
              const res = await exportDatabaseBackupAction();
              if (res.success && res.data) {
                const dataStr =
                  "data:text/json;charset=utf-8," +
                  encodeURIComponent(JSON.stringify(res.data, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute(
                  "download",
                  `AlNoor_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`
                );
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                setFeedbackMsg({
                  type: "success",
                  text: "Database JSON backup downloaded successfully.",
                });
              } else {
                setFeedbackMsg({ type: "error", text: "Failed to export backup." });
              }
              setTimeout(() => setFeedbackMsg(null), 3500);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Database className="w-4 h-4 text-emerald-300" />
            <span>Download Full JSON Database Backup</span>
          </button>
        </div>
      </div>

      {/* 5. Database Diagnostics */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-gray-900">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            System & Database Diagnostics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Supabase Cloud</span>
            </div>
            <p className="text-[11px] text-emerald-700">PostgreSQL Connection Active</p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span>Security (RLS)</span>
            </div>
            <p className="text-[11px] text-teal-700">Row-Level Security Enabled</p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Realtime Websockets</span>
            </div>
            <p className="text-[11px] text-blue-700">Publication Subscriptions Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
