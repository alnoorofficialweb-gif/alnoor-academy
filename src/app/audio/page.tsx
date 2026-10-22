"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Search,
  Headphones,
  CheckCircle2,
  ListMusic,
  ArrowRight,
  Radio,
  Disc3,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/CustomDropdown";
import { QURAN_SURAHS, Surah } from "@/data/quranSurahs";
import AcousticWaveCanvas from "@/components/AcousticWaveCanvas";
import ParticleWaveCanvas from "@/components/ParticleWaveCanvas";

const RECITER_OPTIONS: DropdownOption[] = [
  { value: "afs", label: "Sheikh Mishary Rashid Alafasy (Hafs)" },
  { value: "basit", label: "Sheikh Abdul Basit Abdul Samad (Murattal)" },
  { value: "maher", label: "Sheikh Maher Al-Muaiqly (Haramain)" },
  { value: "sudais", label: "Sheikh Abdul Rahman Al-Sudais" },
  { value: "ghamdi", label: "Sheikh Saad Al-Ghamdi" },
];

// Direct Cloudflare CDN audio endpoints (HTTP 200, fast, no 301 redirects)
const RECITER_AUDIO_BASES: Record<string, string> = {
  afs: "https://cdn.mp3quran.net/audio/mishary-alafasy/r1",
  basit: "https://cdn.mp3quran.net/audio/abdulbasit-abdulsamad/r3",
  maher: "https://cdn.mp3quran.net/audio/maher-muaiqly/r1",
  sudais: "https://cdn.mp3quran.net/audio/abdulrahman-sudais/r1",
  ghamdi: "https://cdn.mp3quran.net/audio/saad-ghamdi/r1",
};

// 8-Point Rub-el-Hizb Geometric Star Islamic Medallion for Surah numbers
function SurahNumberBadge({ number, isActive }: { number: number; isActive: boolean }) {
  return (
    <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 44 44"
        className="w-full h-full transition-all"
        aria-hidden="true"
      >
        {/* Base square 1 */}
        <rect
          x="8"
          y="8"
          width="28"
          height="28"
          rx="3.5"
          className={
            isActive
              ? "fill-[#064e3b] stroke-emerald-400 dark:stroke-emerald-300"
              : "fill-zinc-100 dark:fill-zinc-800/90 stroke-zinc-300 dark:stroke-zinc-700"
          }
          strokeWidth="1.25"
        />
        {/* Rotated square 2 at 45 deg */}
        <rect
          x="8"
          y="8"
          width="28"
          height="28"
          rx="3.5"
          transform="rotate(45 22 22)"
          className={
            isActive
              ? "fill-[#064e3b] stroke-emerald-400 dark:stroke-emerald-300"
              : "fill-zinc-100 dark:fill-zinc-800/90 stroke-zinc-300 dark:stroke-zinc-700"
          }
          strokeWidth="1.25"
        />
        {/* Inner decorative circle */}
        <circle
          cx="22"
          cy="22"
          r="9.5"
          fill="none"
          className={
            isActive
              ? "stroke-emerald-300/40"
              : "stroke-emerald-700/20 dark:stroke-emerald-400/20"
          }
          strokeWidth="1"
        />
      </svg>
      <span
        className={`absolute font-digital text-[11px] sm:text-xs font-bold leading-none select-none tabular-nums ${
          isActive ? "text-white" : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {number}
      </span>
    </div>
  );
}



// Popular Surahs frequently recited worldwide
const POPULAR_SURAH_NUMBERS = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];

export default function AudioPlayerPage() {
  const [currentSurahId, setCurrentSurahId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [reciter, setReciter] = useState<string>("afs");
  const [durationSec, setDurationSec] = useState<number>(72);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "meccan" | "medinan">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [isViewAll, setIsViewAll] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const timeElapsedRef = useRef<HTMLSpanElement | null>(null);
  const lastSecondRef = useRef<number>(-1);
  const isDraggingRef = useRef<boolean>(false);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [hoverPercent, setHoverPercent] = useState<number>(0);

  // High-precision base reference for linear interpolation at 60fps
  const baseTimeRef = useRef<{ audioTime: number; perfTime: number }>({
    audioTime: 0,
    perfTime: 0,
  });

  const syncBaseTime = useCallback(() => {
    if (audioRef.current) {
      baseTimeRef.current = {
        audioTime: audioRef.current.currentTime || 0,
        perfTime: performance.now(),
      };
    }
  }, []);

  const currentSurah: Surah =
    QURAN_SURAHS.find((s) => s.id === currentSurahId) || QURAN_SURAHS[0];

  const paddedNumber = String(currentSurah.number).padStart(3, "0");
  const audioBase = RECITER_AUDIO_BASES[reciter] || RECITER_AUDIO_BASES.afs;
  const currentAudioSrc = audioError
    ? `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedNumber}.mp3`
    : `${audioBase}/${paddedNumber}.mp3`;

  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Sync Audio playback state with user-gesture safety
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            syncBaseTime();
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.warn("Audio playback error on source, trying fallback:", err);
              if (!audioError) {
                setAudioError(true);
              }
            }
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentAudioSrc, syncBaseTime, audioError]);

  // High-performance 60fps smooth progress bar via requestAnimationFrame
  // Anchored strictly to real audio currentTime to prevent ghost-running while audio is loading/paused
  useEffect(() => {
    let animId: number;

    const animateProgress = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused && isPlaying && !isDraggingRef.current) {
        const realCurrent = audio.currentTime || 0;
        const totalDuration = audio.duration || durationSec || currentSurah.durationSeconds || 1;

        // Linear interpolation anchored to real audio playback
        const elapsedSinceBase = (performance.now() - baseTimeRef.current.perfTime) / 1000;
        let interpolatedTime = baseTimeRef.current.audioTime + elapsedSinceBase;

        // If drift exceeds 0.3s or audio has not started, snap to realCurrent
        if (Math.abs(interpolatedTime - realCurrent) > 0.35 || realCurrent < 0.15) {
          interpolatedTime = realCurrent;
          baseTimeRef.current = {
            audioTime: realCurrent,
            perfTime: performance.now(),
          };
        }

        const percent = Math.min(100, Math.max(0, (interpolatedTime / totalDuration) * 100));

        // Direct DOM update for buttery 60fps linear motion
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${percent}%`;
        }

        // Update elapsed time label when whole second increments
        const currentWholeSecond = Math.floor(interpolatedTime);
        if (timeElapsedRef.current && currentWholeSecond !== lastSecondRef.current) {
          lastSecondRef.current = currentWholeSecond;
          timeElapsedRef.current.textContent = formatTime(currentWholeSecond);
        }
      }

      if (isPlaying) {
        animId = requestAnimationFrame(animateProgress);
      }
    };

    if (isPlaying) {
      syncBaseTime();
      animId = requestAnimationFrame(animateProgress);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, durationSec, currentSurah.durationSeconds, syncBaseTime]);

  // Reset visual progress to 00:00
  const resetProgressUI = () => {
    if (progressFillRef.current) {
      progressFillRef.current.style.width = "0%";
    }
    if (timeElapsedRef.current) {
      timeElapsedRef.current.textContent = "00:00";
    }
    lastSecondRef.current = 0;
    baseTimeRef.current = { audioTime: 0, perfTime: performance.now() };
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            syncBaseTime();
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.warn("Direct play error:", err);
              if (!audioError) setAudioError(true);
            }
          });
      }
    }
  };

  const handleSurahSelect = (id: number) => {
    setCurrentSurahId(id);
    resetProgressUI();
    setAudioError(false);
    setIsPlaying(true);
  };

  const handleNext = useCallback(() => {
    const currentIndex = QURAN_SURAHS.findIndex((s) => s.id === currentSurahId);
    const nextIndex = (currentIndex + 1) % QURAN_SURAHS.length;
    const nextSurah = QURAN_SURAHS[nextIndex];
    setCurrentSurahId(nextSurah.id);
    resetProgressUI();
    setAudioError(false);
  }, [currentSurahId]);

  const handlePrev = () => {
    const currentIndex = QURAN_SURAHS.findIndex((s) => s.id === currentSurahId);
    const prevIndex = (currentIndex - 1 + QURAN_SURAHS.length) % QURAN_SURAHS.length;
    const prevSurah = QURAN_SURAHS[prevIndex];
    setCurrentSurahId(prevSurah.id);
    resetProgressUI();
    setAudioError(false);
  };

  const calculateScrubPercent = (clientX: number): number => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    return Math.max(0, Math.min(1, clickX / rect.width));
  };

  const applySeek = (percentage: number) => {
    const totalDuration =
      audioRef.current?.duration || durationSec || currentSurah.durationSeconds || 1;
    const targetTime = percentage * totalDuration;

    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }

    baseTimeRef.current = {
      audioTime: targetTime,
      perfTime: performance.now(),
    };

    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${percentage * 100}%`;
    }
    if (timeElapsedRef.current) {
      timeElapsedRef.current.textContent = formatTime(targetTime);
    }
    lastSecondRef.current = Math.floor(targetTime);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    const pct = calculateScrubPercent(e.clientX);
    applySeek(pct);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const pct = calculateScrubPercent(e.clientX);
    const totalDuration =
      audioRef.current?.duration || durationSec || currentSurah.durationSeconds || 1;
    setHoverTime(formatTime(pct * totalDuration));
    setHoverPercent(pct * 100);

    if (isDraggingRef.current) {
      applySeek(pct);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
      syncBaseTime();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const filteredSurahs = QURAN_SURAHS.filter((s) => {
    // 1. Tab filter
    if (activeTab === "popular" && !POPULAR_SURAH_NUMBERS.includes(s.number)) {
      return false;
    }
    if (activeTab === "meccan" && s.type !== "Meccan") {
      return false;
    }
    if (activeTab === "medinan" && s.type !== "Medinan") {
      return false;
    }
    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.number.toString().includes(q)
      );
    }
    return true;
  });

  const totalSurahsCount = filteredSurahs.length;
  const totalPages = Math.max(1, Math.ceil(totalSurahsCount / pageSize));
  const isPaged = !isViewAll && !searchQuery.trim() && activeTab !== "popular" && totalPages > 1;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(totalSurahsCount, startIndex + pageSize);

  const isDirectList = Boolean(searchQuery.trim() || activeTab === "popular");

  // Dynamic batching for silky smooth wipe-in / wipe-out expansion
  const batch1Surahs = isDirectList
    ? filteredSurahs
    : isViewAll || pageSize >= 48
    ? filteredSurahs.slice(0, 24)
    : filteredSurahs.slice((currentPage - 1) * 24, currentPage * 24);

  const batch2Surahs = !isDirectList ? filteredSurahs.slice(24, 48) : [];
  const batch3Surahs = !isDirectList ? filteredSurahs.slice(48) : [];

  const isBatch2Open = !isDirectList && (pageSize >= 48 || isViewAll);
  const isBatch3Open = !isDirectList && isViewAll;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const selectedReciterLabel =
    RECITER_OPTIONS.find((r) => r.value === reciter)?.label || "";

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
      
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentAudioSrc}
        loop={isLooping}
        muted={isMuted}
        crossOrigin="anonymous"
        preload="auto"
        onTimeUpdate={syncBaseTime}
        onSeeked={syncBaseTime}
        onPlay={syncBaseTime}
        onPlaying={() => {
          setIsPlaying(true);
          syncBaseTime();
        }}
        onLoadedMetadata={(e) => {
          const dur = Math.floor(e.currentTarget.duration);
          if (dur && !isNaN(dur) && isFinite(dur)) {
            setDurationSec(dur);
          } else {
            setDurationSec(currentSurah.durationSeconds);
          }
        }}
        onEnded={() => {
          if (!isLooping) {
            handleNext();
          }
        }}
        onError={() => {
          console.warn("Audio error on source:", currentAudioSrc);
          if (!audioError) {
            setAudioError(true);
          }
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>Digital Audio Player</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Holy Quran Audio Player
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Stream all 114 Surahs with continuous recitation, reactive visualizer, and 60fps timeline.
          </p>
        </div>

        {/* Reciter selector */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
            Select Reciter Voice
          </label>
          <CustomDropdown
            value={reciter}
            options={RECITER_OPTIONS}
            onChange={(val) => {
              setReciter(val);
              setAudioError(false);
            }}
            buttonClassName="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
          />
        </div>
      </div>

      {/* Main Music App Player Card (Wide Landscape, Clean Minimal Border, Zero Green Halo) */}
      <div
        className={`rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all duration-500 min-h-[210px] sm:min-h-[230px] flex flex-col justify-between bg-[#010906] shadow-xl shadow-black/80 ${
          isPlaying
            ? "border border-emerald-800/40"
            : "border border-emerald-950/80"
        }`}
      >
        {/* Live Concentric Acoustic Sound Waves & Lateral Lens Arcs */}
        <AcousticWaveCanvas isPlaying={isPlaying} audioRef={audioRef} className="opacity-100" />

        {/* 1. TOP ROW: Extreme Corners Alignment (Minimalist, Uncluttered, Edge Anchored) */}
        <div className="relative z-10 flex items-start justify-between gap-3 w-full">
          {/* Top-Left: Clean Surah Identity (Center-aligned number without '#') */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 shadow-xs leading-none">
              {currentSurah.number}
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                  {currentSurah.englishName}
                </h2>
                <span className="text-xs sm:text-sm font-serif text-emerald-300/90 font-medium">
                  {currentSurah.arabicName}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                {currentSurah.verses} Verses • {currentSurah.type}
              </p>
            </div>
          </div>

          {/* Top-Right: Sleek Reciter Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 border border-emerald-500/30 backdrop-blur-md">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-emerald-600"
              }`}
            />
            <span className="text-[11px] font-medium text-emerald-200 truncate max-w-[130px] sm:max-w-[220px]">
              {selectedReciterLabel}
            </span>
          </div>
        </div>

        {/* 2. EXACT CENTER: Transparent Glassmorphic Play/Pause Button located right at the acoustic wave epicenter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative flex items-center justify-center">
            {/* Ambient Acoustic Emitter Ring (makes pattern look like it's emerging from this button) */}
            <div
              className={`absolute -inset-2.5 sm:-inset-3 rounded-full border border-emerald-500/20 transition-all duration-700 pointer-events-none ${
                isPlaying ? "scale-110 opacity-70 border-emerald-400/30" : "scale-100 opacity-30"
              }`}
            />

            <button
              type="button"
              onClick={handleTogglePlay}
              className={`pointer-events-auto relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md ${
                isPlaying
                  ? "bg-emerald-950/40 border border-emerald-400/60 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/40 hover:bg-emerald-900/50"
                  : "bg-black/40 border border-emerald-500/35 text-emerald-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:border-emerald-400/60 hover:bg-emerald-950/50 hover:text-white"
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {/* Smooth Animated Morphing Play <-> Pause Transition */}
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                {/* Play Icon (Morphs out with rotation + scale when playing) */}
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isPlaying
                      ? "opacity-0 scale-40 rotate-45 pointer-events-none"
                      : "opacity-100 scale-100 rotate-0 translate-x-0.5"
                  }`}
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </span>

                {/* Pause Icon (Morphs in with rotation + scale when playing) */}
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isPlaying
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-40 -rotate-45 pointer-events-none"
                  }`}
                >
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. BOTTOM ROW: Video-Player Style Bar at the Very Bottom */}
        <div className="relative z-10 w-full space-y-1.5 pt-4">
          {/* Slender Timeline Scrubber across the bottom */}
          <div
            ref={progressBarRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={() => {
              if (!isDraggingRef.current) setHoverTime(null);
            }}
            className="relative w-full h-1.5 sm:h-2 bg-black/80 rounded-full cursor-pointer group border border-emerald-500/25 touch-none select-none backdrop-blur-xs"
            title="Click or drag to seek smoothly"
          >
            {/* Seek Tooltip */}
            {hoverTime && (
              <div
                className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-950/95 border border-emerald-400/80 text-[11px] font-digital font-bold text-emerald-200 pointer-events-none shadow-[0_0_10px_rgba(52,211,153,0.6)] z-30 tabular-nums tracking-wider"
                style={{ left: `${Math.max(4, Math.min(96, hoverPercent))}%` }}
              >
                {hoverTime}
              </div>
            )}

            {/* 60fps frame-synced slender fill track */}
            <div
              ref={progressFillRef}
              className="h-full bg-linear-to-r from-emerald-600 via-emerald-400 to-mint-300 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)] relative transition-none"
              style={{ width: "0%" }}
            >
              {/* Glowing Tactile Thumb Bead */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white border border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] transition-transform duration-150 group-hover:scale-130" />
            </div>
          </div>

          {/* Under-Timeline Controls Bar: [Time Elapsed / Total Duration] on Left, Navigation Buttons in Middle, Volume/Loop on Right */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
            {/* Left: Time indicator */}
            <div className="flex items-center gap-1.5 font-digital text-xs sm:text-[13px] tracking-wider select-none">
              <span ref={timeElapsedRef} className="text-emerald-400 font-bold tabular-nums">00:00</span>
              <span className="text-zinc-600 font-medium">/</span>
              <span className="text-zinc-400 font-semibold tabular-nums">{formatTime(durationSec || currentSurah.durationSeconds)}</span>
            </div>

            {/* Middle: Prev, Next, Loop */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-emerald-950/60 transition-colors cursor-pointer"
                aria-label="Previous Surah"
                title="Previous Surah"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-emerald-950/60 transition-colors cursor-pointer"
                aria-label="Next Surah"
                title="Next Surah"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                  isLooping
                    ? "text-emerald-300 bg-emerald-900/80 ring-1 ring-emerald-400/80 rotate-180"
                    : "text-zinc-400 hover:text-white rotate-0"
                }`}
                title="Toggle Repeat"
                aria-label="Toggle repeat"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Mute / Volume with Animated Morphing Switch */}
            <button
              type="button"
              onClick={toggleMute}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMuted
                  ? "text-rose-300 bg-rose-950/80 ring-1 ring-rose-400"
                  : "text-zinc-400 hover:text-white"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                    isMuted
                      ? "opacity-0 scale-50 rotate-45 pointer-events-none"
                      : "opacity-100 scale-100 rotate-0"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                    isMuted
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-50 -rotate-45 pointer-events-none"
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Surah List Section (All 114 Surahs - Seamless Native Integration) */}
      <div id="surah-playlist-top" className="space-y-5 pt-2">
        {/* Header Controls: Title & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Complete Quran Playlist
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {filteredSurahs.length === 114
                ? "All 114 Surahs with continuous audio playback"
                : `Showing ${filteredSurahs.length} of 114 Surahs`}
            </p>
          </div>

          {/* Search Input with Instant Clear Button */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, number, or meaning..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          {[
            { id: "all", label: "All Surahs", count: 114 },
            { id: "popular", label: "Popular", count: 10 },
            { id: "meccan", label: "Meccan", count: 86 },
            { id: "medinan", label: "Medinan", count: 28 },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isTabActive
                    ? "bg-[#064e3b] dark:bg-emerald-600 text-white shadow-xs"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isTabActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Seamless Floating Surah Cards with Accordion Wipe-In / Wipe-Out Animation */}
        <div className="space-y-2.5">
          {/* Helper Surah Card Renderer */}
          {(() => {
            const renderCard = (surah: (typeof QURAN_SURAHS)[0]) => {
              const isCurrent = currentSurahId === surah.id;
              return (
                <div
                  key={surah.id}
                  onClick={() => handleSurahSelect(surah.id)}
                  className={`group relative rounded-2xl p-3.5 sm:p-4 border transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                    isCurrent
                      ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/70 dark:border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/25"
                      : "bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/60 shadow-2xs hover:shadow-xs"
                  }`}
                >
                  {/* Left: Islamic Rub-el-Hizb Star Medallion & Surah Details */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <SurahNumberBadge number={surah.number} isActive={isCurrent} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-white truncate group-hover:text-[#064e3b] dark:group-hover:text-emerald-300 transition-colors">
                          {surah.englishName}
                        </span>

                        {/* Revelation Tag Pill */}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ${
                            surah.type === "Meccan"
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40"
                              : "bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40"
                          }`}
                        >
                          {surah.type}
                        </span>

                        {/* Live Dancing Equalizer Wave (Active & Playing only) */}
                        {isCurrent && isPlaying && (
                          <div
                            className="flex items-center gap-0.5 h-3.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 shrink-0"
                            title="Now Playing"
                          >
                            <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full visualizer-bar-1" />
                            <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full visualizer-bar-2" />
                            <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full visualizer-bar-3" />
                            <span className="w-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full visualizer-bar-4" />
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {surah.translation} • {surah.verses} Verses
                      </div>
                    </div>
                  </div>

                  {/* Right: Arabic Calligraphy Name, Duration & Play Button */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0 pl-2">
                    <span className="font-serif text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors hidden sm:inline-block">
                      {surah.arabicName}
                    </span>

                    <span className="text-xs font-digital tabular-nums tracking-wide text-zinc-400 dark:text-zinc-500 hidden xs:inline-block">
                      {surah.duration}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          handleTogglePlay();
                        } else {
                          handleSurahSelect(surah.id);
                        }
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        isCurrent && isPlaying
                          ? "bg-[#064e3b] dark:bg-emerald-600 text-white shadow-xs"
                          : "bg-zinc-100 dark:bg-zinc-800 hover:bg-[#064e3b] dark:hover:bg-emerald-600 hover:text-white text-zinc-700 dark:text-zinc-300"
                      }`}
                      aria-label={`Play Surah ${surah.englishName}`}
                    >
                      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                        <span
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                            isCurrent && isPlaying
                              ? "opacity-0 scale-40 rotate-45 pointer-events-none"
                              : "opacity-100 scale-100 rotate-0 translate-x-0.25"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </span>
                        <span
                          className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                            isCurrent && isPlaying
                              ? "opacity-100 scale-100 rotate-0"
                              : "opacity-0 scale-40 -rotate-45 pointer-events-none"
                          }`}
                        >
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <>
                {/* Batch 1: Primary 24 cards (or full search/popular list) */}
                <div className="space-y-2.5">
                  {batch1Surahs.map(renderCard)}
                </div>

                {/* Batch 2 (Surahs 25–48): Smooth Accordion Wipe-In when 48/page or All 114 is chosen */}
                {!isDirectList && batch2Surahs.length > 0 && (
                  <div
                    className={`accordion-wipe-grid ${
                      isBatch2Open ? "accordion-wipe-open" : "accordion-wipe-closed"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2.5 pt-2.5">
                        {batch2Surahs.map(renderCard)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch 3 (Surahs 49–114): Smooth Accordion Wipe-In when All 114 is chosen */}
                {!isDirectList && batch3Surahs.length > 0 && (
                  <div
                    className={`accordion-wipe-grid ${
                      isBatch3Open ? "accordion-wipe-open" : "accordion-wipe-closed"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-2.5 pt-2.5">
                        {batch3Surahs.map(renderCard)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {filteredSurahs.length === 0 && (
            <div className="p-10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 text-center space-y-3">
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                No Surahs match &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#064e3b] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Reset Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Apple-Inspired Minimal Pagination & Navigation Dock (Rock-Solid 3-Column Zero-Jitter Layout) */}
        {filteredSurahs.length > 0 && (
          <div className="pt-5 pb-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              
              {/* 1. Left Info: Current Range Summary (FIXED WIDTH PREVENTS HORIZONTAL DRIFT) */}
              <div className="w-full sm:w-[220px] flex items-center justify-start shrink-0 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {isPaged ? (
                    <span>
                      Surahs <strong className="font-bold text-zinc-900 dark:text-white tabular-nums font-digital">{startIndex + 1}–{endIndex}</strong> of <strong className="font-bold text-zinc-900 dark:text-white tabular-nums font-digital">{totalSurahsCount}</strong>
                    </span>
                  ) : (
                    <span>
                      Showing all <strong className="font-bold text-zinc-900 dark:text-white tabular-nums font-digital">{totalSurahsCount}</strong> Surahs
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Center Controls: Forward / Backward Navigation & Page Numbers (PERFECTLY CENTERED, 0PX JITTER) */}
              <div className="flex-1 flex items-center justify-center min-w-0">
                {isPaged ? (
                  <div className="flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-800/90 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                    {/* Prev Page Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        currentPage === 1
                          ? "opacity-30 cursor-not-allowed text-zinc-400"
                          : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                      aria-label="Previous Page"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isCurrent = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 shrink-0 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center font-digital tabular-nums ${
                              isCurrent
                                ? "bg-[#064e3b] dark:bg-emerald-600 text-white shadow-xs"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Page Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        currentPage === totalPages
                          ? "opacity-30 cursor-not-allowed text-zinc-400"
                          : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                      aria-label="Next Page"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="hidden sm:block text-[11px] text-zinc-400 font-medium">
                    Continuous Full Catalog View
                  </div>
                )}
              </div>

              {/* 3. Right Options: Density / View Mode Switcher (FIXED WIDTH PREVENTS HORIZONTAL DRIFT) */}
              <div className="w-full sm:w-[220px] flex items-center justify-end shrink-0">
                <div className="flex items-center bg-zinc-100/90 dark:bg-zinc-800/90 p-0.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsViewAll(false);
                      setPageSize(24);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      !isViewAll && pageSize === 24
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-bold"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                    title="24 Surahs per page"
                  >
                    24 / page
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsViewAll(false);
                      setPageSize(48);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      !isViewAll && pageSize === 48
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-bold"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                    title="48 Surahs per page"
                  >
                    48 / page
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsViewAll(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isViewAll
                        ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs font-bold"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                    title="View all 114 Surahs on one page"
                  >
                    All 114
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Audio Page CTA Banner with Screenshot 1 3D Vertical Architectural Ribbed Wave */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-[#010906] border border-emerald-800/50 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ParticleWaveCanvas className="opacity-100" />
        
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              Recitation Certified by Hafs &lsquo;an &lsquo;Asim Standards
            </h3>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Want to perfect your Makharij and Tajweed rules 1-on-1 with a qualified Sheikh?
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#064e3b] bg-white hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer"
          >
            <span>Learn with a Sheikh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
