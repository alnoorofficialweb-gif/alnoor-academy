"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Send,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Loader2,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  Paperclip,
} from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/CustomDropdown";
import CountrySelect from "@/components/CountrySelect";
import { teacherApplyAction, validateTeacherApplyEmailAction } from "@/app/actions/forms";

const SPECIALIZATION_OPTIONS: DropdownOption[] = [
  { value: "Quran Tajweed & Recitation", label: "Tajweed & Recitation" },
  { value: "Quran Memorization (Hifz)", label: "Hifz (Memorization)" },
  { value: "Noorani Qaida for Kids", label: "Qaida for Beginners" },
  { value: "Islamic Studies & Hadith", label: "Islamic Studies" },
  { value: "Quranic Arabic", label: "Quranic Arabic" },
];

const TEACHING_LANG_OPTIONS: DropdownOption[] = [
  { value: "English & Urdu", label: "English & Urdu" },
  { value: "English Only", label: "English Only" },
  { value: "Urdu Only", label: "Urdu Only" },
  { value: "Arabic & English", label: "Arabic & English" },
  { value: "Bilingual", label: "Multi-lingual" },
];

const EXPERIENCE_OPTIONS: DropdownOption[] = [
  { value: "1-2 Years", label: "1 - 2 Years" },
  { value: "3-5 Years", label: "3 - 5 Years" },
  { value: "5-10 Years", label: "5 - 10 Years" },
  { value: "10+ Years", label: "10+ Years" },
];

export default function TeacherApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    residentialCountry: "Pakistan",
    city: "",
    specialization: "Quran Tajweed & Recitation",
    language: "English & Urdu",
    experience: "3-5 Years",
    qualifications: "",
  });

  const [cvFile, setCvFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCvFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Pre-validation: prevent student email collision or duplicate teacher application
      const validation = await validateTeacherApplyEmailAction(formData.email);
      if (!validation.allowed) {
        setErrorMessage(validation.error || "This email cannot be used for a teacher application.");
        setIsSubmitting(false);
        return;
      }

      const res = await teacherApplyAction({
        fullName: formData.name,
        email: formData.email,
        whatsapp: formData.phone,
        country: formData.residentialCountry,
        city: formData.city || null,
        specialization: formData.specialization,
        experience: formData.experience,
        sanadDetails: formData.qualifications,
        cvUrl: cvFile ? cvFile.dataUrl : null,
        photoUrl: photoFile ? photoFile.dataUrl : null,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Unable to submit application. Please try again.");
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Faculty</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Faculty Recruitment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          Apply as an AL-Noor Instructor
        </h1>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          We invite passionate, certified Quran teachers and Ijazah holders to guide global students with flexible remote schedules.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Application Submitted!</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              JazakAllah Khair for your interest. Our Academic Board will review your credentials and reach out via WhatsApp / Email for a recitation evaluation.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl transition-colors"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name (with Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Qari Bilal Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  WhatsApp Number (with country code) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +44 7123 456789 or +92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
              </div>

              {/* City / Town */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  City / Town of Residence
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lahore, Cairo, London"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Residential Country */}
            <div>
              <CountrySelect
                label="Residential Country"
                value={formData.residentialCountry}
                onChange={(val) => setFormData({ ...formData, residentialCountry: val })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Specialization */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Primary Specialization
                </label>
                <CustomDropdown
                  value={formData.specialization}
                  options={SPECIALIZATION_OPTIONS}
                  onChange={(val) => setFormData({ ...formData, specialization: val })}
                  buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Teaching Language */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Instruction Language
                </label>
                <CustomDropdown
                  value={formData.language}
                  options={TEACHING_LANG_OPTIONS}
                  onChange={(val) => setFormData({ ...formData, language: val })}
                  buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Teaching Experience
                </label>
                <CustomDropdown
                  value={formData.experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={(val) => setFormData({ ...formData, experience: val })}
                  buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Qualifications / Ijazah */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Sanad / Ijazah / Education Details *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Mention your university degree (e.g. Al-Azhar, Wafaq-ul-Madaris), Ijazah chain in Qira'at, and online teaching experience..."
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Upload CV / Resume & Profile Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* CV / Resume Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Upload CV / Resume (Optional)
                </label>
                {cvFile ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#064e3b] dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-[11px]">
                          {cvFile.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">{cvFile.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCvFile(null)}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#064e3b] dark:hover:border-emerald-500 bg-zinc-50/50 dark:bg-zinc-800/40 cursor-pointer transition-colors group">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-[#064e3b] dark:group-hover:text-emerald-400 mb-1" />
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Click to upload CV
                    </span>
                    <span className="text-[10px] text-zinc-400">PDF, DOCX up to 5MB</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Photo / Sanad Document Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Profile Photo / Sanad Document (Optional)
                </label>
                {photoFile ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-[11px]">
                          {photoFile.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">{photoFile.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoFile(null)}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-teal-600 dark:hover:border-teal-400 bg-zinc-50/50 dark:bg-zinc-800/40 cursor-pointer transition-colors group">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 mb-1" />
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Click to upload Photo / Sanad
                    </span>
                    <span className="text-[10px] text-zinc-400">JPG, PNG, PDF up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Faculty Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
