"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Compass,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  Bell,
  BarChart3,
} from "lucide-react";
import { adminLogoutAction } from "@/app/admin/actions";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  teacherCount?: number;
}

export default function AdminLayoutClient({
  children,
  teacherCount = 0,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogoutAction();
    });
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Students", href: "/admin/students", icon: GraduationCap },
    {
      name: "Teachers",
      href: "/admin/teachers",
      icon: ShieldCheck,
      badge: teacherCount,
    },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Schedule", href: "/admin/schedule", icon: Calendar },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Learning Hub", href: "/admin/learning-hub", icon: Compass },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans antialiased flex flex-col">
      {/* =========================================================================
          1. LEFT SIDEBAR (Dark Green Theme)
             - Includes dedicated collapse/expand toggle
             - Icon-only mode when collapsed (icons remain clearly visible)
             - User Avatar & Logout button fixed at the very bottom
         ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#03231a] border-r border-[#083a2c] flex flex-col transition-all duration-300 ease-in-out ${
          // Mobile drawer logic
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"
        } ${
          // Desktop collapse logic: w-64 when expanded, w-[72px] when collapsed (icons visible!)
          sidebarCollapsed ? "lg:translate-x-0 lg:w-[72px]" : "lg:translate-x-0 lg:w-64"
        }`}
      >
        {/* Sidebar Header & Toggle */}
        {sidebarCollapsed ? (
          // Collapsed Header: Centered Expand Button
          <div className="h-16 flex items-center justify-center border-b border-[#083a2c]/80 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 rounded-xl text-emerald-300/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // Expanded Header: Brand Title & Collapse Button
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#083a2c]/80 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-90 min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-white leading-tight truncate">
                  Al-Noor Admin
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400/80 truncate">
                  Management Console
                </span>
              </div>
            </Link>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Items (Icons stay visible in both collapsed and expanded states) */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (sidebarCollapsed) {
              // Collapsed Item: Centered icon with tooltip
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={`${item.name}${typeof item.badge === "number" ? ` (${item.badge})` : ""}`}
                  className={`group flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-colors duration-150 ${
                    isActive
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "text-emerald-100/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </Link>
              );
            }

            // Expanded Item: Icon + Label + Badge
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? "bg-[#064e3b] text-white border-l-2 border-emerald-400 shadow-xs"
                    : "text-emerald-100/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                    isActive ? "text-emerald-300" : "text-emerald-200/60 group-hover:text-white"
                  }`}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {typeof item.badge === "number" && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-emerald-400/20 text-emerald-200"
                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* =========================================================================
            SIDEBAR FOOTER:
            User Profile Account & Logout Button fixed at the bottom of the left bar
           ========================================================================= */}
        {sidebarCollapsed ? (
          // Collapsed Footer: Avatar + Logout Icon Button
          <div className="p-2 border-t border-[#083a2c]/80 flex flex-col items-center gap-2.5 bg-[#021811]/60 shrink-0">
            <div
              className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/30 text-white flex items-center justify-center font-bold text-xs select-none"
              title="Administrator (admin@alnooracademy.com)"
            >
              AD
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-colors cursor-pointer disabled:opacity-50"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Expanded Footer: Full Profile Details & Logout Button
          <div className="p-3 border-t border-[#083a2c]/80 space-y-2.5 bg-[#021811]/60 shrink-0">
            <div className="flex items-center gap-2.5 px-1 py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/30 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                AD
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white leading-tight truncate">
                  Administrator
                </span>
                <span className="text-[10px] text-emerald-300/70 truncate">
                  admin@alnooracademy.com
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 hover:border-red-800/60 transition-colors cursor-pointer disabled:opacity-50"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isPending ? "Signing out..." : "Logout"}</span>
            </button>
          </div>
        )}
      </aside>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* =========================================================================
          2. MAIN CONTENT AREA
             - Dynamically offsets when sidebar collapses to icon-only (w-[72px]) or expands (w-64)
         ========================================================================= */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        {/* =========================================================================
            TOP ADMIN HEADER:
            - Left: "AL-Noor Admin Panel"
            - Right: Clean minimal status indicator
           ========================================================================= */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
          {/* Header Left: Exact title only */}
          <div className="flex items-center gap-3">
            {/* Mobile-only toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-gray-950 hover:bg-gray-100 border border-gray-200/80 transition-colors cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
              AL-Noor Admin Panel
            </h1>
          </div>

          {/* Header Right: Minimal system status indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">System Active</span>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
