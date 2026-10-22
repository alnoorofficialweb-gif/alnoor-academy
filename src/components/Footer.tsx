"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800 pt-12 pb-16 md:pb-12 text-zinc-600 dark:text-zinc-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                AL-Noor <span className="text-[#064e3b] dark:text-emerald-400">Academy</span>
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed max-w-xs">
              Structured 1-on-1 Quran recitation, Tajweed, and Islamic fundamentals taught by verified scholars worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#064e3b] dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Certified Native Scholars</span>
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">Curriculum</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Quran Reading (Qaida)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Tajweed Mastery
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Quran Memorization (Hifz)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Complete Namaz & Daily Dua
                </Link>
              </li>
            </ul>
          </div>

          {/* Academy Info */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">Academy</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/teachers" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Faculty Instructors
                </Link>
              </li>
              <li>
                <Link href="/audio" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Audio Recitations
                </Link>
              </li>
              <li>
                <Link href="/ask" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Ask the Sheikh
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Mission & Methodology
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Support & Schedule Trial
                </Link>
              </li>
              <li>
                <Link href="/teacher-apply" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[#064e3b] dark:text-emerald-400 font-medium">
                  Apply as Teacher
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">Portal</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link href="/teacher-login" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  3-Day Free Trial
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600 dark:text-zinc-400">
          <p>© 2026 AL-Noor Academy. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with devotion for Islamic education</span>
            <Heart className="w-3 h-3 text-emerald-700 fill-emerald-700" />
          </div>
        </div>
      </div>
    </footer>
  );
}
