import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ChevronRight,
  BookOpen,
  Heart,
  Scroll,
  Sun,
  ArrowRight,
  Lock,
} from "lucide-react";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

export const metadata: Metadata = {
  title: "Learning Hub | AL-Noor Academy",
  description:
    "Free interactive Islamic foundational resources, Quran Qaida, daily supplications, and Tajweed practice.",
};

const RESOURCES = [
  {
    id: "quran-qaida",
    title: "Quran Qaida",
    arabicTitle: "قَاعِدَة الْقُرْآن",
    arabicWatermark: "قَاعِدَة",
    tag: "Phonetics & Tajweed",
    subtitle: "29 Arabic letters, Makharij articulation & foundational Tajweed rules.",
    icon: BookOpen,
    href: "/learning-hub/quran-qaida",
    status: "active",
    ctaText: "Open Quran Qaida",
  },
  {
    id: "daily-duas",
    title: "Daily Duas & Adhkar",
    arabicTitle: "الْأَدْعِيَةُ الْيَوْمِيَّة",
    arabicWatermark: "أَدْعِيَة",
    tag: "Supplications",
    subtitle: "Authentic Prophetic morning, evening, and protection prayers with audio.",
    icon: Heart,
    href: "#",
    status: "coming-soon",
    ctaText: "Coming Soon",
  },
  {
    id: "six-kalimas",
    title: "The Six Kalimas",
    arabicTitle: "الْكَلِمَاتُ السِّتّ",
    arabicWatermark: "كَلِمَات",
    tag: "Foundational Creed",
    subtitle: "Essential declarations of faith and Tawheed taught with clear pronunciation.",
    icon: Scroll,
    href: "#",
    status: "coming-soon",
    ctaText: "Coming Soon",
  },
  {
    id: "asma-ul-husna",
    title: "99 Names of Allah",
    arabicTitle: "أَسْمَاءُ اللهِ الْحُسْنَىٰ",
    arabicWatermark: "أَسْمَاء",
    tag: "Divine Attributes",
    subtitle: "Sublime divine attributes, profound meanings, and spiritual reflections.",
    icon: Sun,
    href: "#",
    status: "coming-soon",
    ctaText: "Coming Soon",
  },
];

export default function LearningHubPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Learning Hub
          </span>
        </nav>

        {/* Top CTA Banner (Minimal, clean, Homepage 3D canvas pattern) */}
        <div className="relative rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border transition-all duration-300 bg-[#010906] border-emerald-800/50">
          <ParticleWaveCanvas className="opacity-100" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider border bg-emerald-950/80 border-emerald-500/60 text-emerald-200 uppercase">
              Free Quranic Learning Resources
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Learning Hub
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Foundational Islamic curriculum, phonetic guides, and beginner lessons designed to study at your own pace.
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Curriculum Modules
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Structured foundations for self-paced study
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              4 Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {RESOURCES.map((item) => {
              const Icon = item.icon;
              const isActive = item.status === "active";

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? "bg-white dark:bg-zinc-900/90 border-emerald-600/30 dark:border-emerald-500/30 hover:border-emerald-500/80 dark:hover:border-emerald-400/80 shadow-sm hover:shadow-xl"
                      : "bg-white/80 dark:bg-zinc-900/75 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-md"
                  }`}
                >
                  {/* Subtle Background Movement Pattern (Undulating Wave & Ambient Glow) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
                    {/* Animated Architectural Wave Pattern (16s smooth undulating movement) */}
                    <img
                      src="/images/architectural-wave.jpg"
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover object-bottom animate-wave-flow transition-transform duration-700 group-hover:scale-108 ${
                        isActive
                          ? "opacity-[0.07] dark:opacity-[0.18]"
                          : "opacity-[0.04] dark:opacity-[0.10]"
                      }`}
                    />

                    {/* Smooth Gradient Mask ensuring crystal-clear text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/88 to-white/75 dark:from-zinc-900/95 dark:via-zinc-900/88 dark:to-zinc-900/75" />

                    {/* Ambient Breathing Radial Glow Orb */}
                    <div
                      className={`absolute -right-10 -top-10 w-44 h-44 rounded-full blur-2xl ambient-glow-pulse transition-opacity duration-700 ${
                        isActive
                          ? "bg-emerald-500/20 dark:bg-emerald-400/20 group-hover:bg-emerald-500/30"
                          : "bg-zinc-400/10 dark:bg-zinc-700/15 group-hover:bg-zinc-400/20"
                      }`}
                    />

                    {/* Refined Arabic Watermark Accent in Bottom Corner */}
                    <div className="absolute -right-2 -bottom-2 font-serif text-5xl sm:text-6xl font-black text-zinc-950/[0.04] dark:text-emerald-300/[0.06] select-none pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:translate-x-1">
                      {item.arabicWatermark}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Header Row: Icon & Status Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                          isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-[#064e3b] dark:text-emerald-300 border border-emerald-500/30 shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Interactive Audio</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                          <Lock className="w-3 h-3 text-zinc-400" />
                          <span>Coming Soon</span>
                        </span>
                      )}
                    </div>

                    {/* Category & Arabic Script */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          {item.tag}
                        </span>
                        <span className="font-serif text-sm font-semibold text-zinc-600 dark:text-zinc-300" dir="rtl">
                          {item.arabicTitle}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white group-hover:text-[#064e3b] dark:group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Crisp 1-Line Subtitle (No Cluttered Checklist) */}
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal pt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Action / Footer Area */}
                  <div className="relative z-10 pt-5 mt-4 border-t border-zinc-100/80 dark:border-zinc-800/80">
                    {isActive ? (
                      <Link
                        href={item.href}
                        className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md cursor-pointer group/btn"
                      >
                        <span>{item.ctaText}</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="w-full py-2.5 px-3.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Module in Production</span>
                        </div>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          In Recording
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner (Exact Home Page component, design, dark green pattern, and animation) */}
        <section className="pt-4">
          <div className="relative rounded-3xl p-8 sm:p-14 text-center space-y-5 shadow-2xl overflow-hidden border transition-all duration-300 bg-[#010906] border-emerald-800/50 text-white">
            <ParticleWaveCanvas className="opacity-100" />

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border bg-emerald-950/80 border-emerald-500/60 text-emerald-200">
                Zero Obligation • Free 3-Day Trial
              </span>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
                Want to learn with a certified teacher?
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-md mx-auto leading-relaxed">
                Book a personalized 1-on-1 evaluation with certified Quran tutors today.
              </p>
            </div>

            <div className="relative z-10 pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-zinc-950 hover:bg-emerald-50 shadow-lg transition-all cursor-pointer"
              >
                <span>Book a Free Trial</span>
                <ArrowRight className="w-4 h-4 text-[#064e3b]" />
              </Link>
              <Link
                href="/teachers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold border text-emerald-100 hover:text-white hover:bg-white/10 border-emerald-500/60 transition-colors cursor-pointer"
              >
                <span>Meet Faculty</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
