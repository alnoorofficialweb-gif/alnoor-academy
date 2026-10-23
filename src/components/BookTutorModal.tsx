"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
  Send,
  Star,
  Globe,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { TeacherData } from "@/components/TeacherCard";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import CountrySelect from "@/components/CountrySelect";
import { enrollStudentAction } from "@/app/actions/forms";

interface BookTutorModalProps {
  teacher: TeacherData | null;
  isOpen: boolean;
  onClose: () => void;
}

const LEARNING_GOAL_OPTIONS: DropdownOption[] = [
  { value: "Quran Reading", label: "Quran Reading & Nazra" },
  { value: "Tajweed Mastery", label: "Tajweed Rules & Recitation" },
  { value: "Noorani Qaida", label: "Noorani Qaida Basics" },
  { value: "Quran Memorization", label: "Quran Memorization (Hifz)" },
  { value: "Islamic Essentials", label: "Islamic Studies & Duas" },
  { value: "Namaz & Salah", label: "Complete Namaz & Salah Practice" },
];

const TIME_SLOT_OPTIONS: DropdownOption[] = [
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" },
  { value: "6:00 PM", label: "6:00 PM" },
  { value: "7:00 PM", label: "7:00 PM" },
];

const DURATION_OPTIONS: DropdownOption[] = [
  { value: "30 minutes", label: "30 minutes / day" },
  { value: "45 minutes", label: "45 minutes / day" },
  { value: "60 minutes", label: "60 minutes / day" },
];

export default function BookTutorModal({
  teacher,
  isOpen,
  onClose,
}: BookTutorModalProps) {
  const [applicantType, setApplicantType] = useState<"student" | "parent">("parent");
  const [applicantName, setApplicantName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [residentialCountry, setResidentialCountry] = useState("United Kingdom");
  const [city, setCity] = useState("");
  const [learningGoal, setLearningGoal] = useState("Quran Reading");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("5:00 PM");
  const [preferredDuration, setPreferredDuration] = useState("30 minutes");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close on Escape & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !teacher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !applicantName.trim() ||
      (applicantType === "parent" && !studentName.trim()) ||
      !email.trim() ||
      !whatsappNumber.trim() ||
      !residentialCountry.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await enrollStudentAction({
        fullName:
          applicantType === "parent" ? studentName.trim() : applicantName.trim(),
        parentName: applicantType === "parent" ? applicantName.trim() : null,
        email: email.trim(),
        whatsapp: whatsappNumber.trim(),
        country: residentialCountry.trim(),
        city: city.trim() || null,
        selectedCourse: learningGoal,
        scheduledTime: preferredTimeSlot,
        duration: preferredDuration,
        teacherId: teacher.id,
        teacherName: teacher.name,
        notes: notes.trim() || null,
      });

      if (!res.success) {
        setErrorMessage(
          res.error ||
            "Unable to submit tutor request. Please try again or contact support."
        );
      } else {
        setIsSubmitted(true);
      }
    } catch (err: unknown) {
      console.error("Submission exception:", err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setApplicantType("parent");
    setApplicantType("parent");
    setApplicantName("");
    setStudentName("");
    setEmail("");
    setWhatsappNumber("");
    setResidentialCountry("United Kingdom");
    setCity("");
    setLearningGoal("Quran Reading");
    setPreferredTimeSlot("5:00 PM");
    setPreferredDuration("30 minutes");
    setNotes("");
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border-0 shadow-2xl shadow-black/40 p-5 sm:p-7 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-4"
      >
        {/* Top Header & Close Button */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-400">
              Direct Tutor Booking
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Select &amp; Schedule with {teacher.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Teacher Mini Profile Banner */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-[#064e3b] dark:text-emerald-400 font-bold text-sm shrink-0">
            {teacher.name.split(" ").slice(-1)[0][0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-zinc-950 dark:text-white truncate">
                {teacher.name}
              </h4>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{teacher.rating}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {teacher.title} • {teacher.specialization}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          /* Success Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                Tutor Selection Request Received!
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                JazakAllah Khair. Your request to study with{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {teacher.name}
                </span>{" "}
                has been submitted.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-3 border border-zinc-200/60 dark:border-zinc-700/60 text-left text-xs space-y-1.5">
              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">Applicant</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {applicantType === "parent" ? `Parent: ${applicantName}` : `Student: ${applicantName}`}
                </span>
              </div>
              {applicantType === "parent" && (
                <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                  <span className="text-zinc-500 dark:text-zinc-400">Student / Child</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{studentName}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">Selected Tutor</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{teacher.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">Residential Country</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{residentialCountry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">Schedule</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {preferredTimeSlot} ({preferredDuration})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 dark:text-zinc-400">WhatsApp</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{whatsappNumber}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-2 text-left">
              <MessageCircle className="w-4 h-4 text-[#064e3b] dark:text-emerald-400 shrink-0" />
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                Our coordinator will reach out on WhatsApp to schedule your 3-day free trial with {teacher.name}.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
              >
                Submit Another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#04382a] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Tutor Booking Form */
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Applicant Role Selector (Parent vs Student) */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                I am registering as: <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setApplicantType("parent")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    applicantType === "parent"
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>A Parent (For Child)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApplicantType("student")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    applicantType === "student"
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>A Student (Myself)</span>
                </button>
              </div>
            </div>

            {/* Name Fields based on Applicant Type */}
            {applicantType === "parent" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Parent&apos;s Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Child / Student&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rayan Tariq (Age 8)"
                      className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Student&apos;s Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Muhammad Bilal"
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Email & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. +44 7123 456789 or +92 300 1234567"
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Residential Country & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CountrySelect
                label="Residential Country"
                value={residentialCountry}
                onChange={setResidentialCountry}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  City / Town
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London, Birmingham, Dallas"
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Subject to Study with Tutor */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subject to Study <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                value={learningGoal}
                options={LEARNING_GOAL_OPTIONS}
                onChange={(val) => setLearningGoal(val)}
                placeholder="Select subject"
              />
            </div>

            {/* Time Slot & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={preferredTimeSlot}
                  options={TIME_SLOT_OPTIONS}
                  onChange={(val) => setPreferredTimeSlot(val)}
                  placeholder="Select time slot"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Daily Duration <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  value={preferredDuration}
                  options={DURATION_OPTIONS}
                  onChange={(val) => setPreferredDuration(val)}
                  placeholder="Select duration"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#064e3b] hover:bg-[#04382a] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking with {teacher.name}...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Book Tutor</span>
                  </>
                )}
              </button>
              <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 text-center mt-2">
                3-day free trial included with this tutor. Zero obligation.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
