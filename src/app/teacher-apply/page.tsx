"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Send, CheckCircle2, ArrowLeft, ShieldCheck, BookOpen } from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/CustomDropdown";
import CountrySelect from "@/components/CountrySelect";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
              >
                <span>Submit Faculty Application</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
