"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, GraduationCap, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginFormContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [role, setRole] = useState<"student" | "teacher">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#064e3b] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full">
          Portal Access
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          {role === "student" ? "Student Sign In" : "Educator Sign In"}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {role === "student"
            ? "Access your live recitation room and timetable"
            : "Access your student roster and attendance logs"}
        </p>
      </div>

      {/* App-Style Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 app-card shadow-sm space-y-5">
        
        {/* Role Selector Tabs */}
        <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center gap-1 border border-zinc-200/70 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => {
              setRole("student");
              setSuccess(false);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              role === "student"
                ? "bg-[#064e3b] text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("teacher");
              setSuccess(false);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              role === "teacher"
                ? "bg-[#064e3b] text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-900 dark:text-white">
              Welcome back to AL-Noor Academy!
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Frontend UI demonstration. Backend authentication will connect in the next phase.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="text-xs font-semibold text-[#064e3b] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Sign out / Re-enter credentials
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                {role === "student" ? "Student Email" : "Teacher Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder={role === "student" ? "student@example.com" : "teacher@alnoor.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-[#064e3b] dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
              >
                <span>{role === "student" ? "Sign In as Student" : "Sign In as Teacher"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Alternate Links */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-2 text-xs">
          {role === "teacher" ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/teacher-apply"
                className="font-bold text-[#064e3b] dark:text-emerald-400 hover:underline"
              >
                Create Account
              </Link>
            </p>
          ) : (
            <>
              <p className="text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[#064e3b] dark:text-emerald-400 hover:underline"
                >
                  Start 3-Day Free Trial
                </Link>
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                Are you a faculty instructor?{" "}
                <Link
                  href="/teacher-apply"
                  className="text-[#064e3b] dark:text-emerald-400 font-medium hover:underline"
                >
                  Apply to Teach
                </Link>
              </p>
            </>
          )}
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
