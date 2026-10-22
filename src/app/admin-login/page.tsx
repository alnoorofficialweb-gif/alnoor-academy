import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { adminLoginAction, setAdminQuickSession } from "@/app/admin/actions";

export const metadata = {
  title: "Admin Sign In | Al-Noor Academy",
  description: "Secure administrator sign-in for Al-Noor Academy management",
};

export const instant = false;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  // If already authenticated as admin, go straight to dashboard
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session && session.value) {
    redirect("/admin");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const errorMessage = resolvedParams.error;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-center items-center px-4 sm:px-6 py-12 antialiased">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#03231a] text-emerald-400 border border-[#083a2c] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Restricted Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-gray-500">
            Sign in with administrative credentials to access the live portal.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const res = await adminLoginAction(formData);
              if (res.success) {
                redirect("/admin");
              } else {
                redirect(`/admin-login?error=${encodeURIComponent(res.error || "Authentication failed")}`);
              }
            }}
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  defaultValue="admin@alnooracademy.com"
                  required
                  placeholder="admin@alnooracademy.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  defaultValue="admin123"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors font-mono"
                />
              </div>
              <p className="text-[10px] text-gray-400">
                Default password: <span className="font-mono font-semibold text-gray-600">admin123</span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#083a2c] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <form action={setAdminQuickSession}>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>One-Click Quick Admin Access</span>
              </button>
            </form>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
