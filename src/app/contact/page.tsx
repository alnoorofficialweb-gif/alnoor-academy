"use client";

import React, { useState } from "react";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import { Mail, MessageSquare, Send, CheckCircle2, Phone, Clock, MapPin, Loader2 } from "lucide-react";
import { contactMessageAction } from "@/app/actions/forms";

const INQUIRY_TOPICS: DropdownOption[] = [
  { value: "Class Inquiry", label: "Class Inquiry & Trial Details" },
  { value: "Course Curriculum", label: "Course Curriculum & Materials" },
  { value: "Scheduling", label: "Custom Scheduling & Timezones" },
  { value: "Billing", label: "Tuition Fees & Family Discounts" },
  { value: "Other", label: "Other Questions" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Class Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await contactMessageAction({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Unable to send message. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      console.error("Submission exception:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-lg mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support & Admissions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          Get in Touch with AL-Noor
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Have questions regarding class timings, fee assistance, or trial scheduling? Our academic advisors are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Information Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Email Admissions</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">admissions@alnooracademy.com</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Response within 24 hours</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">WhatsApp Coordinator</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">+1 (555) 786-2468</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Available Mon - Sat for live queries</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Class Hours</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">24/7 Global Timezone Support</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">US, UK, Europe, Australia schedules</p>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Message Received</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. An academic coordinator will review your message and respond via email or WhatsApp within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "Class Inquiry", message: "" });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mansoor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Inquiry Topic Custom Dropdown */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">Subject / Inquiry Topic</label>
                  <CustomDropdown
                    value={formData.subject}
                    options={INQUIRY_TOPICS}
                    onChange={(val) => setFormData({ ...formData, subject: val })}
                    buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the student's age, previous Quranic knowledge, preferred days/times, or any questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message to Admissions</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
