"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface StatusOption {
  value: string;
  label: string;
  colorClass: string;
  dotClass: string;
}

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: StatusOption[];
  align?: "left" | "right";
}

export const DEFAULT_STUDENT_STATUSES: StatusOption[] = [
  {
    value: "pending",
    label: "Pending",
    colorClass: "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/70",
    dotClass: "bg-amber-500",
  },
  {
    value: "active",
    label: "Active",
    colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70",
    dotClass: "bg-emerald-500",
  },
  {
    value: "completed",
    label: "Completed",
    colorClass: "bg-blue-50 text-blue-800 border-blue-200/80 hover:bg-blue-100/70",
    dotClass: "bg-blue-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    colorClass: "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/70",
    dotClass: "bg-rose-500",
  },
];

export const TEACHER_STATUSES: StatusOption[] = [
  {
    value: "approved",
    label: "Approved",
    colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70",
    dotClass: "bg-emerald-500",
  },
  {
    value: "pending",
    label: "Pending",
    colorClass: "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/70",
    dotClass: "bg-amber-500",
  },
  {
    value: "rejected",
    label: "Rejected",
    colorClass: "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/70",
    dotClass: "bg-rose-500",
  },
];

/**
 * Sleek Apple/Google Status Badge with Wipe-In / Wipe-Out Ease-In-Out Animation.
 * Zero layout shift, zero jitter.
 */
export function StatusDropdown({
  value,
  onChange,
  options = DEFAULT_STUDENT_STATUSES,
  align = "right",
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const alignClass =
    align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left";

  return (
    <div
      className={`relative inline-block text-left shrink-0 ${isOpen ? "z-50" : "z-10"}`}
      ref={containerRef}
    >
      {/* Pill Trigger Button - Apple/Google Minimalist Badge */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`inline-flex items-center gap-1 md:gap-1.5 text-[11px] font-bold px-1.5 md:pl-2.5 md:pr-2 h-6 md:h-7 rounded-full border cursor-pointer transition-all duration-300 ease-in-out shadow-2xs select-none whitespace-nowrap active:scale-[0.98] ${currentOption.colorClass}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={`Status: ${currentOption.label}`}
      >
        <span
          className={`w-2 h-2 md:w-1.5 md:h-1.5 rounded-full shrink-0 ${currentOption.dotClass}`}
        />
        <span className="transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap max-w-0 opacity-0 md:max-w-[70px] md:opacity-100">
          {currentOption.label}
        </span>
        <ChevronDown
          className={`w-2.5 h-2.5 md:w-3 md:h-3 opacity-60 shrink-0 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Floating Popover Menu with Wipe-In / Wipe-Out Ease-In-Out Animation */}
      <div
        className={`absolute ${alignClass} mt-1.5 z-50 min-w-[155px] bg-white rounded-2xl apple-google-popover py-1.5 overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div role="listbox" className="text-xs space-y-0.5 px-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-colors duration-150 ease-in-out cursor-pointer ${
                  isSelected
                    ? "bg-gray-100 text-gray-900 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dotClass}`}
                  />
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface FilterDropdownOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterDropdownOption[];
  placeholder?: string;
  className?: string;
}

/**
 * Filter listbox with Apple/Google smooth wipe-in / wipe-out transition.
 */
export function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:border-emerald-700/60 transition-colors duration-150 ease-in-out shadow-2xs cursor-pointer flex items-center justify-between text-left active:scale-[0.99]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-emerald-800 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Floating Popover Menu with Wipe-In / Wipe-Out Animation */}
      <div
        className={`absolute left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl apple-google-popover py-1.5 max-h-60 overflow-y-auto dropdown-scrollbar transition-all duration-200 ease-in-out origin-top ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div role="listbox" className="text-xs space-y-0.5 px-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-colors duration-150 ease-in-out cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/70 text-[#064e3b] font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#064e3b] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Universal Form Select Dropdown replacing raw HTML <select> with Apple/Google Wipe-In/Wipe-Out ease-in-out transition.
 */
export function FormSelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
}: FormSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Dynamically determine whether to pop open upward or downward based on viewport space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 240 && rect.top > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`relative ${isOpen ? "z-40" : "z-10"} ${className}`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-800 transition-all duration-200 ease-in-out flex items-center justify-between cursor-pointer active:scale-[0.99] select-none ${
          isOpen
            ? "bg-white border-[#064e3b] ring-2 ring-emerald-500/20 shadow-xs"
            : "bg-gray-50/80 border-gray-200 hover:bg-white hover:border-emerald-600/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-emerald-800 shrink-0 ml-2 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Floating Popover Menu with Wipe-In / Wipe-Out Ease-In-Out Animation */}
      <div
        className={`absolute left-0 right-0 z-50 bg-white rounded-2xl apple-google-popover py-1.5 max-h-56 overflow-y-auto overscroll-contain dropdown-scrollbar transition-all duration-200 ease-in-out ${
          openUpward ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : openUpward
            ? "opacity-0 scale-95 translate-y-2 pointer-events-none"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div role="listbox" className="text-xs space-y-0.5 px-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-colors duration-150 ease-in-out cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/70 text-[#064e3b] font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#064e3b] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

