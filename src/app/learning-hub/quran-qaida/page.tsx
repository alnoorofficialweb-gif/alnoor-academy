"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  AlertCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  quranQaidaData,
  quranQaidaQnA,
  QaidaLesson,
  QaidaItem,
} from "@/data/quranQaida";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

export type HighlightGroup = "all" | "heavy" | "lip" | "whistle";

export const TAJWEED_GROUPS: Record<
  HighlightGroup,
  {
    name: string;
    shortName: string;
    badgeLabel: string;
    letters: Set<string>;
  }
> = {
  heavy: {
    name: "7 Heavy Letters (Musta'aliyah)",
    shortName: "7 Heavy",
    badgeLabel: "Heavy",
    letters: new Set(["خ", "ص", "ض", "غ", "ط", "ظ", "ق"]),
  },
  lip: {
    name: "4 Lip Letters (Shafawiyyah)",
    shortName: "4 Lip Letters",
    badgeLabel: "Lip",
    letters: new Set(["ب", "ف", "م", "و"]),
  },
  whistle: {
    name: "3 Whistle Letters (Safeeriyah)",
    shortName: "3 Whistle",
    badgeLabel: "Whistle",
    letters: new Set(["س", "ص", "ز"]),
  },
  all: {
    name: "29 Mufridat Letters",
    shortName: "29 Letters",
    badgeLabel: "All",
    letters: new Set([
      "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "و", "ه", "ء", "ي"
    ]),
  },
};

export default function QuranQaidaPage() {
  const [selectedLesson, setSelectedLesson] = useState<QaidaLesson | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<QaidaItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRulesExpanded, setIsRulesExpanded] = useState<boolean>(false);
  const [activeHighlightGroup, setActiveHighlightGroup] = useState<HighlightGroup | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lock background scroll when lesson modal is open to ensure no page scroll shift
  useEffect(() => {
    if (selectedLesson) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedLesson]);

  // Cleanup audio & toast timers on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setPlayingIndex(null);
    setActiveItem(null);
  };

  const handlePlayItem = (item: QaidaItem, index: number) => {
    // If clicking same item and playing, pause it
    if (playingIndex === index && audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
        return;
      } else {
        audioRef.current.play().catch(() => {
          showToast("Audio coming soon");
          setIsPlayingAudio(false);
          setPlayingIndex(null);
        });
        setIsPlayingAudio(true);
        return;
      }
    }

    setPlayingIndex(index);
    setActiveItem(item);

    if (audioRef.current) {
      audioRef.current.src = item.audio;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingAudio(true);
          })
          .catch(() => {
            showToast("Audio coming soon");
            setIsPlayingAudio(false);
            setPlayingIndex(null);
          });
      }
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleToggleHighlight = (group: HighlightGroup) => {
    setActiveHighlightGroup((prev) => (prev === group ? null : group));
  };

  const handleCloseModal = () => {
    handleStopAudio();
    setSelectedLesson(null);
    setIsRulesExpanded(false);
    setActiveHighlightGroup(null);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* Hidden Native HTML5 Audio Tag with clean Event Handlers */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
        onEnded={() => {
          setIsPlayingAudio(false);
          setPlayingIndex(null);
        }}
        onError={() => {
          showToast("Audio coming soon");
          setIsPlayingAudio(false);
          setPlayingIndex(null);
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* ======================================================== */}
        {/* 1. BREADCRUMB NAVIGATION */}
        {/* ======================================================== */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/learning-hub" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Learning Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            Quran Qaida
          </span>
        </nav>

        {/* ======================================================== */}
        {/* 2. TOP CTA HERO BANNER (CLEAN, MINIMAL, HOMEPAGE CANVAS) */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border transition-all duration-300 bg-[#010906] border-emerald-800/50">
          <ParticleWaveCanvas className="opacity-100" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-[11px] font-semibold text-emerald-200 tracking-wider uppercase">
              Foundational Tajweed &amp; Phonetics
            </span>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
                Quran Qaida
              </h1>
              <span className="font-serif text-xl sm:text-2xl text-emerald-300/90 font-medium">
                قَاعِدَة الْقُرْآن
              </span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Interactive Arabic phonetics and foundational Tajweed pronunciation for beginners.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedLesson(quranQaidaData[0]);
                  setActiveHighlightGroup(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#064e3b] bg-white hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#064e3b]" />
                <span>Practice Lesson 1 Now</span>
              </button>

              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-emerald-500/60 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Book Free Trial Class</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. THE 5 LESSONS GRID */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Course Syllabus and Lessons
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                5 foundational lessons taking students from single letters to Harakat and Tanween rules.
              </p>
            </div>

            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 self-start sm:self-auto">
              5 Core Modules - Interactive Practice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {quranQaidaData.map((lesson) => {
              return (
                <div
                  key={lesson.id}
                  className="rounded-2xl p-5 border bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#064e3b] dark:bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {String(lesson.id).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                          Lesson {lesson.id}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {lesson.items.length} Items
                      </span>
                    </div>

                    {/* Lesson Title */}
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                      {lesson.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {lesson.description}
                    </p>

                    {/* Rules Count */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{lesson.rules.length} Tajweed Rules Included</span>
                    </div>
                  </div>

                  {/* Footer Row: Practice Button */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/90 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      RTL Layout - Audio
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setActiveHighlightGroup(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Practice</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. FREQUENTLY ASKED QUESTIONS (Q&A ACCORDION) */}
        {/* ======================================================== */}
        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Frequently Asked Questions (Q&A)</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Essential questions and answers regarding Quran Qaida phonetics, Tajweed rules, and letter classifications.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/80 shadow-sm overflow-hidden">
            {quranQaidaQnA.map((item, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div key={idx} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                        {item.q}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ease-in-out shrink-0 ${
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-emerald-50/30 dark:bg-emerald-950/15">
                        <p className="pl-9">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. EXACT HOME PAGE CTA BANNER (BOTTOM - UNTOUCHED)       */}
        {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* 6. FULL-SCREEN MODAL OVERLAY (MOBILE OPTIMIZED: h-[100dvh] overflow-hidden) */}
      {/* ======================================================== */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-white dark:bg-zinc-950 flex flex-col justify-between">
          
          {/* A. Modal Header Bar (Compact) */}
          <div className="shrink-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-3 sm:px-6 py-2 sm:py-2.5">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
              
              {/* Back / Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block leading-none">
                    Lesson {selectedLesson.id} of {quranQaidaData.length}
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white truncate">
                    {selectedLesson.title}
                  </h3>
                </div>
              </div>

              {/* Status Indicator & Close 'X' */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Playing Indicator */}
                <div className="h-7 flex items-center">
                  {activeItem && playingIndex !== null ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-serif text-sm font-bold">{activeItem.arabic}</span>
                      <button
                        type="button"
                        onClick={handleStopAudio}
                        className="ml-1 text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Stop"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Lesson"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* B. Modal Body: Redesigned Educational Rules Card + Centered Arabic Letter Grid */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2 sm:py-3 space-y-3 min-h-0 flex flex-col justify-start">
            
            {/* Tajweed Rules Card - Mobbin Standard */}
            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-3 sm:p-4 shadow-2xs shrink-0 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Tajweed Rules &amp; Guidelines
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/60 shrink-0">
                        {selectedLesson.rules.length} Rules
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick teaser preview pills on larger screens when collapsed */}
                {!isRulesExpanded && (
                  <div className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight("all")}
                      className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer select-none ${
                        activeHighlightGroup === "all"
                          ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-700/70 hover:bg-emerald-50 dark:hover:bg-zinc-700"
                      }`}
                      title="Click to highlight all 29 Mufridat letters"
                    >
                      29 Letters
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight("heavy")}
                      className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer select-none ${
                        activeHighlightGroup === "heavy"
                          ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-700/70 hover:bg-emerald-50 dark:hover:bg-zinc-700"
                      }`}
                      title="Click to highlight 7 Heavy Letters (Musta'aliyah)"
                    >
                      7 Heavy Letters
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight("lip")}
                      className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer select-none ${
                        activeHighlightGroup === "lip"
                          ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-700/70 hover:bg-emerald-50 dark:hover:bg-zinc-700"
                      }`}
                      title="Click to highlight 4 Lip Letters (Shafawiyyah)"
                    >
                      4 Lip Letters
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleHighlight("whistle")}
                      className={`px-2 py-0.5 rounded-md border transition-colors cursor-pointer select-none ${
                        activeHighlightGroup === "whistle"
                          ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-700/70 hover:bg-emerald-50 dark:hover:bg-zinc-700"
                      }`}
                      title="Click to highlight 3 Whistle Letters (Safeeriyah)"
                    >
                      3 Whistle Letters
                    </button>
                  </div>
                )}

                {/* Professional Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsRulesExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/80 shadow-2xs transition-all cursor-pointer select-none shrink-0"
                  aria-expanded={isRulesExpanded}
                >
                  <span>{isRulesExpanded ? "Hide Details" : "View Rules"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                      isRulesExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Professional Rule Cards with Wipe-In / Wipe-Out Animation */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isRulesExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {selectedLesson.id === 1 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                          {/* Card 1: 29 Letters */}
                          <button
                            type="button"
                            onClick={() => handleToggleHighlight("all")}
                            className={`rounded-xl p-3 text-left border flex flex-col justify-between space-y-1.5 transition-all duration-200 cursor-pointer select-none hover:border-emerald-500/70 ${
                              activeHighlightGroup === "all"
                                ? "ring-2 ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-xs"
                                : "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60"
                            }`}
                            title="Click to view all 29 Mufridat letters"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Foundation
                              </span>
                              <span className="font-serif text-sm font-bold text-zinc-600 dark:text-zinc-300">ا - ي</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">29 Mufridat Letters</h5>
                              {activeHighlightGroup === "all" && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">Active</span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                              The individual alphabet letters that form the words of the Holy Quran.
                            </p>
                          </button>

                          {/* Card 2: 7 Heavy Letters */}
                          <button
                            type="button"
                            onClick={() => handleToggleHighlight("heavy")}
                            className={`rounded-xl p-3 text-left border flex flex-col justify-between space-y-1.5 transition-all duration-200 cursor-pointer select-none hover:border-emerald-500/70 ${
                              activeHighlightGroup === "heavy"
                                ? "ring-2 ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-xs"
                                : "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60"
                            }`}
                            title="Click to highlight the 7 Heavy Letters in the grid below"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Heavy Voice
                              </span>
                              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Musta&lsquo;aliyah</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">7 Heavy Letters</h5>
                              {activeHighlightGroup === "heavy" ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">7 Active</span>
                              ) : (
                                <span className="text-[9px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">Click to Highlight</span>
                              )}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/60 px-2 py-1 rounded-lg text-center font-serif text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-wider shadow-2xs" dir="rtl">
                              خ • ص • ض • غ • ط • ظ • ق
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                              Always pronounce with a full, thick, elevated tone.
                            </p>
                          </button>

                          {/* Card 3: 4 Lip Letters */}
                          <button
                            type="button"
                            onClick={() => handleToggleHighlight("lip")}
                            className={`rounded-xl p-3 text-left border flex flex-col justify-between space-y-1.5 transition-all duration-200 cursor-pointer select-none hover:border-emerald-500/70 ${
                              activeHighlightGroup === "lip"
                                ? "ring-2 ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-xs"
                                : "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60"
                            }`}
                            title="Click to highlight the 4 Lip Letters in the grid below"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Articulation
                              </span>
                              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Shafawiyyah</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">4 Lip Letters</h5>
                              {activeHighlightGroup === "lip" ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">4 Active</span>
                              ) : (
                                <span className="text-[9px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">Click to Highlight</span>
                              )}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/60 px-2 py-1 rounded-lg text-center font-serif text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-wider shadow-2xs" dir="rtl">
                              ب • ف • م • و
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                              Pronounced gently from the upper and lower lips.
                            </p>
                          </button>

                          {/* Card 4: 3 Whistle Letters */}
                          <button
                            type="button"
                            onClick={() => handleToggleHighlight("whistle")}
                            className={`rounded-xl p-3 text-left border flex flex-col justify-between space-y-1.5 transition-all duration-200 cursor-pointer select-none hover:border-emerald-500/70 ${
                              activeHighlightGroup === "whistle"
                                ? "ring-2 ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 shadow-xs"
                                : "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60"
                            }`}
                            title="Click to highlight the 3 Whistle Letters in the grid below"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Whistle Sound
                              </span>
                              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Safeeriyah</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">3 Whistle Letters</h5>
                              {activeHighlightGroup === "whistle" ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">3 Active</span>
                              ) : (
                                <span className="text-[9px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">Click to Highlight</span>
                              )}
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/60 px-2 py-1 rounded-lg text-center font-serif text-sm font-bold text-zinc-800 dark:text-zinc-200 tracking-wider shadow-2xs" dir="rtl">
                              س • ص • ز
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                              Produces a crisp, pleasant whistle-like sound.
                            </p>
                          </button>
                        </div>

                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center italic pt-1">
                          Tip: Click any category card above to highlight its letters in the lesson grid below.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedLesson.rules.map((rule, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Arabic Letters Container (ALWAYS CENTERED: flex flex-wrap justify-center gap-4) */}
            <div className="flex-1 min-h-0 flex flex-col justify-start space-y-2">
              
              {/* Active Filter Helper Banner */}
              {activeHighlightGroup && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 shrink-0 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-semibold text-[11px] sm:text-xs">
                      Highlighting: {TAJWEED_GROUPS[activeHighlightGroup].name} ({TAJWEED_GROUPS[activeHighlightGroup].letters.size} letters)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHighlightGroup(null)}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white underline cursor-pointer"
                  >
                    Clear Highlight ✕
                  </button>
                </div>
              )}

              <div
                dir="rtl"
                className="flex flex-wrap justify-center gap-2.5 sm:gap-4 py-1"
              >
                {selectedLesson.items.map((item, idx) => {
                  const isCurrent = playingIndex === idx;
                  const isHighlighted = activeHighlightGroup
                    ? TAJWEED_GROUPS[activeHighlightGroup]?.letters.has(item.arabic)
                    : false;
                  const isDimmed = activeHighlightGroup !== null && !isHighlighted;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePlayItem(item, idx)}
                      className={`relative w-[64px] h-[64px] sm:w-[78px] sm:h-[78px] shrink-0 p-1.5 sm:p-2 rounded-2xl flex flex-col items-center justify-center border cursor-pointer select-none transition-all duration-200 ${
                        isCurrent
                          ? "bg-emerald-100/90 dark:bg-emerald-950/95 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm"
                          : isHighlighted
                          ? "ring-2 ring-emerald-600 dark:ring-emerald-400 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-white shadow-md scale-[1.04] z-10"
                          : isDimmed
                          ? "opacity-35 scale-[0.98] grayscale-25 bg-zinc-50/60 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-emerald-50/50 dark:hover:bg-zinc-800/80"
                      }`}
                      title={`Click to listen to letter ${item.arabic}`}
                    >
                      {/* Top number index */}
                      <span className="absolute top-1.5 right-2 text-[8px] sm:text-[9px] font-medium text-zinc-400 dark:text-zinc-500 leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Highlight Badge if active */}
                      {isHighlighted && activeHighlightGroup && activeHighlightGroup !== "all" && (
                        <span className="absolute top-1.5 left-2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-zinc-900 px-1 py-0.2 rounded border border-emerald-500/30 leading-tight">
                          {TAJWEED_GROUPS[activeHighlightGroup].badgeLabel}
                        </span>
                      )}

                      {/* Large Arabic Item with authentic font - Centered, NO English */}
                      <span className="font-serif text-3xl sm:text-4xl font-bold leading-none select-none my-auto">
                        {item.arabic}
                      </span>

                      {/* Stable Play State Icon */}
                      <div className="absolute bottom-1.5 left-2 text-emerald-600 dark:text-emerald-400">
                        {isCurrent && isPlayingAudio ? (
                          <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-emerald-600 dark:fill-emerald-400" />
                        ) : (
                          <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current opacity-60" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* C. Modal Bottom Bar (Compact Navigation) */}
          <div className="shrink-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-3 sm:px-6 py-2">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  handleStopAudio();
                  const prevIdx = quranQaidaData.findIndex((l) => l.id === selectedLesson.id) - 1;
                  if (prevIdx >= 0) {
                    setSelectedLesson(quranQaidaData[prevIdx]);
                    setActiveHighlightGroup(null);
                  }
                }}
                disabled={selectedLesson.id === 1}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium text-[11px] sm:text-xs cursor-pointer"
              >
                Finish Practice
              </button>

              <button
                type="button"
                onClick={() => {
                  handleStopAudio();
                  const nextIdx = quranQaidaData.findIndex((l) => l.id === selectedLesson.id) + 1;
                  if (nextIdx < quranQaidaData.length) {
                    setSelectedLesson(quranQaidaData[nextIdx]);
                    setActiveHighlightGroup(null);
                  }
                }}
                disabled={selectedLesson.id === quranQaidaData.length}
                className="px-3 py-1.5 rounded-lg text-white bg-[#064e3b] dark:bg-emerald-600 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#04382a] dark:hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Next Lesson
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 7. TOAST NOTIFICATION ("Audio coming soon")               */}
      {/* ======================================================== */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[70]">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xl border border-zinc-700 dark:border-zinc-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
