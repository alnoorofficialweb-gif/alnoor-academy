"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Volume2,
  GraduationCap,
  Compass,
  Check,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Send,
  Loader2,
  CalendarCheck,
  Award,
  ArrowRight,
  X,
  MessageCircle,
} from "lucide-react";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";
import CustomDropdown, { DropdownOption } from "@/components/CustomDropdown";
import CountrySelect from "@/components/CountrySelect";
import { supabase } from "@/lib/supabase";

interface ClassOption {
  id: string;
  value: string;
  title: string;
  level: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  highlights: string[];
}

const CLASSES_LIST: ClassOption[] = [
  {
    id: "quran-reading",
    value: "Quran Reading Class",
    title: "Quran Reading Class",
    level: "All Levels",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/60",
    icon: BookOpen,
    description: "Ongoing 1-on-1 live recitation guidance with certified male and female scholars.",
    highlights: ["1-on-1 Scholar", "Fluent Flow", "Flexible Schedule"],
  },
  {
    id: "tajweed-mastery",
    value: "Tajweed Mastery Class",
    title: "Tajweed Mastery Class",
    level: "Intermediate",
    badgeColor: "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-100 dark:border-sky-800/60",
    icon: Volume2,
    description: "Live articulation practice (Makharij), rules of Ghunna/Ikhfa, and melodious tartil.",
    highlights: ["Makharij Precision", "Tartil Melodics", "Scholarly Feedback"],
  },
  {
    id: "qaida-basics",
    value: "Noorani Qaida Class",
    title: "Noorani Qaida Class",
    level: "Beginner",
    badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800/60",
    icon: GraduationCap,
    description: "Foundational Arabic alphabet, phonetic pronunciation, and word joining for kids & beginners.",
    highlights: ["Phonetic Steps", "Kids Friendly", "Patient Teachers"],
  },
  {
    id: "islamic-studies",
    value: "Islamic Essentials Class",
    title: "Islamic Essentials Class",
    level: "Foundational",
    badgeColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-100 dark:border-purple-800/60",
    icon: Compass,
    description: "Practical step-by-step Namaz/Salah, 6 Kalimas, daily Masnoon Duas, and Islamic manners.",
    highlights: ["Salah Practice", "Daily Duas", "6 Kalimas"],
  },
];

const WHAT_TO_LEARN_OPTIONS: DropdownOption[] = [
  { value: "Quran Reading Class", label: "Quran Reading Class" },
  { value: "Tajweed Mastery Class", label: "Tajweed Mastery Class" },
  { value: "Noorani Qaida Class", label: "Noorani Qaida Class" },
  { value: "Islamic Essentials Class", label: "Islamic Essentials Class" },
  { value: "Namaz & Salah Practice", label: "Namaz & Salah Practice" },
  { value: "6 Kalimas & Duas", label: "6 Kalimas & Duas" },
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

export default function StartLearningPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClassTitle, setActiveClassTitle] = useState<string>("Quran Reading Class");

  const [formData, setFormData] = useState({
    applicantType: "parent" as "student" | "parent",
    fullName: "",
    studentName: "",
    email: "",
    whatsappNumber: "",
    residentialCountry: "United Kingdom",
    city: "",
    whatToLearn: "Quran Reading Class",
    preferredTimeSlot: "5:00 PM",
    preferredDuration: "30 minutes",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleOpenEnrollModal = (classValue: string, classTitle: string) => {
    setActiveClassTitle(classTitle);
    setFormData((prev) => ({
      ...prev,
      whatToLearn: classValue,
    }));
    setIsSubmitted(false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !formData.fullName.trim() ||
      (formData.applicantType === "parent" && !formData.studentName.trim()) ||
      !formData.email.trim() ||
      !formData.whatsappNumber.trim() ||
      !formData.residentialCountry.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("subscription_requests").insert([
        {
          full_name: formData.fullName.trim(),
          applicant_type: formData.applicantType,
          student_name:
            formData.applicantType === "parent"
              ? formData.studentName.trim()
              : formData.fullName.trim(),
          email: formData.email.trim(),
          whatsapp_number: formData.whatsappNumber.trim(),
          city: formData.city.trim()
            ? `${formData.city.trim()}, ${formData.residentialCountry.trim()}`
            : formData.residentialCountry.trim(),
          residential_country: formData.residentialCountry.trim(),
          what_to_learn: formData.whatToLearn,
          preferred_time_slot: formData.preferredTimeSlot,
          preferred_duration: formData.preferredDuration,
          status: "pending",
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMessage(
          error.message ||
            "Unable to submit request. Please try again or contact support."
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

  const handleResetForm = () => {
    setFormData({
      applicantType: "parent",
      fullName: "",
      studentName: "",
      email: "",
      whatsappNumber: "",
      residentialCountry: "United Kingdom",
      city: "",
      whatToLearn: activeClassTitle,
      preferredTimeSlot: "5:00 PM",
      preferredDuration: "30 minutes",
    });
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 sm:space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link
            href="/"
            className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Start Learning
          </span>
        </nav>

        {/* 1. TOP CTA BANNER (Exact Homepage Dark Canvas Architecture) */}
        <div className="relative rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border transition-all duration-300 bg-[#010906] border-emerald-800/50">
          <ParticleWaveCanvas className="opacity-100" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider border bg-emerald-950/80 border-emerald-500/60 text-emerald-200 uppercase">
              Monthly Subscription • 1-on-1 Classes
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Start Learning
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Select your desired 1-on-1 live class below to reserve your daily schedule and start your free trial.
            </p>
          </div>
        </div>

        {/* 2. LIVE CLASS SELECTION CARDS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Choose Your Live Class
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Click any class to open the reservation window and schedule your free trial.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              4 Live Classes Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CLASSES_LIST.map((classItem) => {
              const Icon = classItem.icon;

              return (
                <div
                  key={classItem.id}
                  onClick={() => handleOpenEnrollModal(classItem.value, classItem.title)}
                  className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:border-emerald-500/60 dark:hover:border-emerald-500/60"
                >
                  <div className="space-y-3">
                    {/* Top Meta: Level Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${classItem.badgeColor}`}
                      >
                        {classItem.level}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight">
                        {classItem.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {classItem.description}
                    </p>

                    {/* Highlight Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {classItem.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                          <span>{highlight}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enroll in Class Button */}
                  <div className="pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-50/70 dark:bg-emerald-950/40 text-[#064e3b] dark:text-emerald-300 group-hover:bg-[#064e3b] group-hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Enroll in Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. SUBSCRIPTION HIGHLIGHTS & TRUST BAR (Clean Bottom Section) */}
        <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
            <div className="flex items-start gap-3.5 pt-4 md:pt-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  Certified 1-on-1 Scholars
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Male and female scholars with recognized Al-Azhar and Wifaq certifications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:pl-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  Flexible Daily Timings
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  Study for as long as you desire with easy schedule adjustments whenever needed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 md:pl-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  100% Satisfaction Guarantee
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                  3-day free trial included. Tuition pricing confirmed directly via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. SEPARATE POPUP MODAL WINDOW FOR CLASS ENROLLMENT */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header & Close Button */}
            <div className="flex items-start justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-400">
                  Live Class Enrollment
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                  Enroll in {activeClassTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close modal window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmitted ? (
              /* Success View inside Modal */
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800 shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
                    Inquiry Submitted Successfully
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    JazakAllah Khair,{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formData.fullName}
                    </span>
                    . Your class registration has been received.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-200/60 dark:border-zinc-700/60 text-left text-xs space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-zinc-500 dark:text-zinc-400">Applicant</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {formData.applicantType === "parent" ? `Parent: ${formData.fullName}` : `Student: ${formData.fullName}`}
                    </span>
                  </div>
                  {formData.applicantType === "parent" && (
                    <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                      <span className="text-zinc-500 dark:text-zinc-400">Student / Child</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.studentName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-zinc-500 dark:text-zinc-400">Class</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.whatToLearn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-zinc-500 dark:text-zinc-400">Time Slot</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.preferredTimeSlot}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-zinc-500 dark:text-zinc-400">Duration</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.preferredDuration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/50">
                    <span className="text-zinc-500 dark:text-zinc-400">Residential Country</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.residentialCountry}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500 dark:text-zinc-400">WhatsApp</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.whatsappNumber}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-2 text-left">
                  <MessageCircle className="w-4 h-4 text-[#064e3b] dark:text-emerald-400 shrink-0" />
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    Our coordinator will contact you on WhatsApp to confirm your class pricing, schedule, and 3-day free trial.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    Submit Another
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#04382a] transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Enrollment Form inside Modal */
              <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
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
                      onClick={() =>
                        setFormData({ ...formData, applicantType: "parent" })
                      }
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        formData.applicantType === "parent"
                          ? "bg-[#064e3b] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>A Parent (For Child)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, applicantType: "student" })
                      }
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        formData.applicantType === "student"
                          ? "bg-[#064e3b] text-white shadow-xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>A Student (Myself)</span>
                    </button>
                  </div>
                </div>

                {/* Names based on applicant type */}
                {formData.applicantType === "parent" ? (
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
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          placeholder="e.g. Tariq Mehmood"
                          className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
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
                          value={formData.studentName}
                          onChange={(e) =>
                            setFormData({ ...formData, studentName: e.target.value })
                          }
                          placeholder="e.g. Rayan Tariq (Age 8)"
                          className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
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
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. Muhammad Bilal"
                        className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address & WhatsApp Number */}
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
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@example.com"
                        className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
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
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. +44 7123 456789 or +92 300 1234567"
                        className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Residential Country & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CountrySelect
                    label="Residential Country"
                    value={formData.residentialCountry}
                    onChange={(val) =>
                      setFormData({ ...formData, residentialCountry: val })
                    }
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
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="e.g. London, Birmingham, Dallas"
                        className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Enrolled Class Confirmation (Read-only banner, no redundant dropdown) */}
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/60">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Enrolling In
                      </p>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {activeClassTitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                    Selected
                  </span>
                </div>

                {/* Preferred Time Slot & Preferred Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      value={formData.preferredTimeSlot}
                      options={TIME_SLOT_OPTIONS}
                      onChange={(val) =>
                        setFormData({ ...formData, preferredTimeSlot: val })
                      }
                      placeholder="Select time slot"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Daily Class Duration <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                      value={formData.preferredDuration}
                      options={DURATION_OPTIONS}
                      onChange={(val) =>
                        setFormData({ ...formData, preferredDuration: val })
                      }
                      placeholder="Select duration"
                    />
                  </div>
                </div>

                {/* Price Confirmation Note */}
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  Pricing and monthly plans are confirmed directly with our coordinator via WhatsApp or Admin team after your 3-day free trial.
                </p>

                {/* Submit Action */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#064e3b] hover:bg-[#04382a] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Submit Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 text-center mt-2">
                    No upfront payment required. 3-day free trial included.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
