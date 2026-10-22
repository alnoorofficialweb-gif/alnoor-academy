import React from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, Heart, Users, Target, Award, ArrowRight } from "lucide-react";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

export default function AboutPage() {
  const VALUES = [
    {
      title: "Authentic Transmission",
      description: "Rooted in unbroken chains of recitation (Sanad) and classical Tajweed rules verified by senior scholars.",
      icon: ShieldCheck,
    },
    {
      title: "Individual Focus",
      description: "Zero crowded groups. Every lesson is an exclusive 1-on-1 session to identify and correct individual phonetic tendencies.",
      icon: Users,
    },
    {
      title: "Gentle Pedagogy",
      description: "Inspired by the Prophetic approach of patience, encouragement, and gradual mastery without stress.",
      icon: Heart,
    },
    {
      title: "Global Reach",
      description: "Connecting Muslim households across North America, Europe, and Australasia with top native scholars 24/7.",
      icon: Target,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>About AL-Noor Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
          Dedicated to Sacred Quranic Education
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Founded with the singular purpose of making authentic, individualized Quranic recitation and Islamic fundamentals accessible to families worldwide.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Our Mission</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            To empower students of every background to recite the Holy Quran with phonetic perfection (Tajweed), deep reverence, and practical comprehension through structured, patient 1-on-1 mentorship.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Our Vision</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A globally connected generation of Muslims who find peace, discipline, and moral guidance in their daily recitation, equipped with solid Islamic foundations regardless of geographical borders.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Our Guiding Principles
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Every teacher and curriculum milestone follows these four bedrock standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                  {val.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA (Screenshot 1 3D Vertical Ribbed Wave on Deep Dark Backdrop) */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-xl border border-emerald-800/50 overflow-hidden bg-[#010906]">
        <ParticleWaveCanvas className="opacity-100" />
        
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border bg-emerald-950/80 border-emerald-500/60 text-emerald-200">
            Zero Obligation • Free 3-Day Trial
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Join Over 500+ Satisfied Families
          </h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Start your learning with a dedicated instructor today.
          </p>
          <div className="pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-[#064e3b] bg-white hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
            >
              <span>Start 3-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
