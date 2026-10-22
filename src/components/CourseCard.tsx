import React from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  Volume2,
  BookmarkCheck,
  Compass,
  CheckCircle2,
  Languages,
  Video,
  ArrowRight,
  Check,
} from "lucide-react";

export interface CourseData {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  description: string;
  highlights: string[];
}

interface CourseCardProps {
  course: CourseData;
}

function getCourseIcon(id: string) {
  switch (id) {
    case "quran-reading":
      return <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    case "tajweed-mastery":
      return <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
    case "quran-memorization":
      return <BookmarkCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
    case "islamic-basics":
      return <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    case "namaz-salah":
      return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
    case "arabic-language":
      return <Languages className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    default:
      return <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 app-card flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200">
      <div>
        {/* Top Meta: Level & Duration (No wrapping on duration) */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide shrink-0 ${
              course.level === "Beginner"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/60"
                : course.level === "Intermediate"
                ? "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-100 dark:border-sky-800/60"
                : "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-100 dark:border-purple-800/60"
            }`}
          >
            {course.level}
          </span>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100/80 dark:bg-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium font-digital tabular-nums whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Title with Formal Educational SVG Icon */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-100/90 dark:bg-zinc-800/90 flex items-center justify-center shrink-0 mt-0.5">
            {getCourseIcon(course.id)}
          </div>
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug group-hover:text-[#064e3b] dark:group-hover:text-emerald-400 transition-colors">
            {course.title}
          </h3>
        </div>

        {/* Concise 1-Line Description */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3.5 line-clamp-2">
          {course.description}
        </p>

        {/* Highlighted Feature Badges with SVG Check Mark */}
        <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {course.highlights.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50/80 dark:bg-emerald-950/50 text-[#064e3b] dark:text-emerald-300 border border-emerald-100/90 dark:border-emerald-800/50"
            >
              <Check className="w-3 h-3 text-[#064e3b] dark:text-emerald-400 shrink-0 stroke-[2.5]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer with Compact Proportionate Button */}
      <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
          <Video className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>{course.lessons} Live Sessions</span>
        </div>

        <Link
          href={`/signup?course=${course.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-[#064e3b] hover:bg-[#083a2c] dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-2xs transition-colors cursor-pointer group/btn"
        >
          <span>Enroll</span>
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
