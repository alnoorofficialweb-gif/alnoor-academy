import React from "react";
import Link from "next/link";
import { UserCheck, Globe, Star, GraduationCap, ArrowRight } from "lucide-react";

export interface TeacherData {
  id: string;
  name: string;
  title: string;
  gender: "Male" | "Female";
  specialization: string;
  language: string;
  experience: string;
  rating: string;
  studentsCount: number;
}

interface TeacherCardProps {
  teacher: TeacherData;
  onSelect?: (teacher: TeacherData) => void;
}

export default function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 app-card flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
            {teacher.specialization}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{teacher.rating}</span>
          </div>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[#064e3b] dark:text-emerald-400 font-bold text-sm shrink-0">
            {teacher.name.split(" ").slice(-1)[0][0]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
              {teacher.name}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{teacher.title}</p>
          </div>
        </div>

        {/* Quick Attributes */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400 shrink-0" />
            <span className="truncate">{teacher.language}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <GraduationCap className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400 shrink-0" />
            <span>{teacher.experience} Exp</span>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          {teacher.studentsCount}+ Enrolled
        </span>
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(teacher)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Select Tutor</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <Link
            href={`/signup?teacher=${teacher.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Select Tutor</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
