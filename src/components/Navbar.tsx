"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Headphones,
  HelpCircle,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedProgramButton from "@/components/AnimatedProgramButton";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [mobileHubOpen, setMobileHubOpen] = useState(false);
  const hubDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        hubDropdownRef.current &&
        !hubDropdownRef.current.contains(event.target as Node)
      ) {
        setHubDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setHubDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setHubDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const hubDropdownLinks = [
    {
      label: "Learning Hub Overview",
      href: "/learning-hub",
      description: "Free Quranic foundational curriculum",
      icon: BookOpen,
    },
    {
      label: "Quran Qaida",
      href: "/learning-hub/quran-qaida",
      description: "Interactive Arabic phonetics & Tajweed",
      icon: GraduationCap,
    },
    {
      label: "Audio Library",
      href: "/audio",
      description: "Quran recitations by renowned Qaris",
      icon: Headphones,
    },
    {
      label: "Ask a Scholar",
      href: "/ask",
      description: "Islamic Q&A and authentic rulings",
      icon: HelpCircle,
    },
  ];

  const isHubActive =
    pathname.startsWith("/learning-hub") ||
    pathname.startsWith("/audio") ||
    pathname.startsWith("/ask");

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Dark Mode & Light Mode Image Logos */}
        <Link
          href="/"
          className="flex items-center shrink-0 py-1 transition-opacity hover:opacity-90 focus:outline-hidden"
          aria-label="AL-Noor Academy Home"
        >
          {/* Light Mode Logo */}
          <Image
            src="/images/logo-light.png"
            alt="AL-Noor Academy"
            width={132}
            height={44}
            priority
            className="h-8 sm:h-9 w-auto object-contain dark:hidden"
          />

          {/* Dark Mode Logo */}
          <Image
            src="/images/logo-dark.png"
            alt="AL-Noor Academy"
            width={132}
            height={44}
            priority
            className="h-8 sm:h-9 w-auto object-contain hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation Links - Modern Minimal Pill Dock */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 p-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-full shadow-2xs backdrop-blur-md">
          {/* 1. Home */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/") && pathname === "/"
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            Home
          </Link>

          {/* 2. Courses (Academic Offerings) */}
          <Link
            href="/courses"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/courses")
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            Courses
          </Link>

          {/* 3. Teachers (Our Certified Faculty) */}
          <Link
            href="/teachers"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/teachers")
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            Teachers
          </Link>

          {/* 4. Start Learning (Live 1-on-1 Monthly Tuition) */}
          <Link
            href="/start-learning"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/start-learning")
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            Start Learning
          </Link>

          {/* 5. Learning Hub Dropdown Menu (Free Self-Study Library) */}
          <div className="relative" ref={hubDropdownRef}>
            <button
              type="button"
              onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
              onMouseEnter={() => setHubDropdownOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none whitespace-nowrap ${
                isHubActive || hubDropdownOpen
                  ? "bg-[#064e3b] text-white shadow-xs font-bold"
                  : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
              }`}
              aria-expanded={hubDropdownOpen}
            >
              <span>Learning Hub</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-250 ease-out ${
                  hubDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Elevated Dropdown Card with Smooth Entrance */}
            <div
              onMouseEnter={() => setHubDropdownOpen(true)}
              onMouseLeave={() => setHubDropdownOpen(false)}
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 z-50 transition-all duration-200 ease-out origin-top ${
                hubDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {/* Invisible Hover Bridge */}
              <div className="absolute -top-3 left-0 w-full h-3" />

              {/* Floating Menu Card */}
              <div className="overflow-hidden rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-xl">
                {/* Mini Header */}
                <div className="px-3.5 pt-3 pb-1 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Student Resources
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/60">
                    Curriculum &amp; Tools
                  </span>
                </div>

                {/* Dropdown Items List */}
                <div className="p-2 space-y-1">
                  {hubDropdownLinks.map((item) => {
                    const isItemActive =
                      item.href === "/learning-hub"
                        ? pathname === "/learning-hub"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setHubDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                          isItemActive
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300"
                            : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isItemActive
                              ? "bg-[#064e3b] text-white"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight">
                            {item.label}
                          </div>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Footer Banner */}
                <div className="p-2.5 bg-zinc-50/80 dark:bg-zinc-850/60 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    100% Free Materials
                  </span>
                  <Link
                    href="/learning-hub"
                    onClick={() => setHubDropdownOpen(false)}
                    className="font-bold text-[#064e3b] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Library</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 6. About */}
          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/about")
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            About
          </Link>

          {/* 7. Contact */}
          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive("/contact")
                ? "bg-[#064e3b] text-white shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </Link>
          <AnimatedProgramButton
            href="/signup"
            label="Start Free Trial"
            className="shadow-xs"
          />
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="/signup"
            className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#064e3b] shadow-xs"
          >
            Trial
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                  mobileMenuOpen
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-40 -rotate-90 pointer-events-none"
                }`}
              >
                <X className="w-5 h-5" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-250 ease-out ${
                  mobileMenuOpen
                    ? "opacity-0 scale-40 rotate-90 pointer-events-none"
                    : "opacity-100 scale-100 rotate-0"
                }`}
              >
                <Menu className="w-5 h-5" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Expandable with Wipe-In / Wipe-Out Animation) */}
      <div
        className={`lg:hidden grid transition-[grid-template-rows] duration-300 ease-in-out border-zinc-200 dark:border-zinc-800 ${
          mobileMenuOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden bg-white dark:bg-zinc-900">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/") && pathname === "/"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Home
            </Link>

            {/* Courses */}
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/courses")
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Courses
            </Link>

            {/* Teachers */}
            <Link
              href="/teachers"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/teachers")
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Teachers
            </Link>

            {/* Start Learning (Monthly Subscription) */}
            <Link
              href="/start-learning"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/start-learning")
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Start Learning
            </Link>

            {/* Learning Hub Mobile Collapsible Accordion */}
            <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileHubOpen(!mobileHubOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                  isHubActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                    : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>Learning Hub</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                    mobileHubOpen ? "rotate-180 text-[#064e3b] dark:text-emerald-400" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-250 ease-in-out bg-zinc-50/70 dark:bg-zinc-800/40 ${
                  mobileHubOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-1 space-y-0.5 pl-3 border-l-2 border-emerald-600 ml-3 my-1">
                    {hubDropdownLinks.map((item) => {
                      const isItemActive =
                        item.href === "/learning-hub"
                          ? pathname === "/learning-hub"
                          : pathname.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileHubOpen(false);
                          }}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                            isItemActive
                              ? "bg-emerald-100/70 dark:bg-emerald-950/80 text-[#064e3b] dark:text-emerald-300 font-bold"
                              : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/about")
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive("/contact")
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              Contact
            </Link>

            {/* Auth Actions in Drawer */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#04382a] transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
