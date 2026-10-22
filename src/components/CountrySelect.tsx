"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, Globe } from "lucide-react";

export const WORLD_COUNTRIES: string[] = [
  "United Kingdom",
  "United States",
  "Canada",
  "Pakistan",
  "Australia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Germany",
  "France",
  "Ireland",
  "New Zealand",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Belgium",
  "Switzerland",
  "Austria",
  "Italy",
  "Spain",
  "Turkey",
  "Malaysia",
  "Singapore",
  "South Africa",
  "India",
  "Bangladesh",
  "Egypt",
  "Jordan",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Afghanistan",
  "Albania",
  "Argentina",
  "Azerbaijan",
  "Bahamas",
  "Barbados",
  "Belarus",
  "Belize",
  "Bermuda",
  "Bosnia and Herzegovina",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Ecuador",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "Georgia",
  "Ghana",
  "Greece",
  "Guyana",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "Indonesia",
  "Iraq",
  "Japan",
  "Kazakhstan",
  "Kenya",
  "Kosovo",
  "Kyrgyzstan",
  "Lebanon",
  "Libya",
  "Lithuania",
  "Luxembourg",
  "Maldives",
  "Malta",
  "Mauritius",
  "Mexico",
  "Nepal",
  "Nigeria",
  "North Macedonia",
  "Palestine",
  "Panama",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Korea",
  "Sri Lanka",
  "Sudan",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Trinidad and Tobago",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
  "Zimbabwe",
];

interface CountrySelectProps {
  label?: string;
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function CountrySelect({
  label = "Residential Country",
  value,
  onChange,
  placeholder = "Select your residential country...",
  required = false,
  className = "",
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter countries based on user search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return WORLD_COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return WORLD_COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [searchQuery]);

  // Click outside & Escape key listeners
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Focus the search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (country: string) => {
    onChange(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full pl-3 pr-3.5 py-1.5 text-xs rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ${
          isOpen
            ? "border-[#064e3b] dark:border-emerald-500 ring-1 ring-[#064e3b]/20 dark:ring-emerald-500/20"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <span
            className={`truncate font-medium ${
              value
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {value || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 shrink-0 ml-2 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180 text-[#064e3b] dark:text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel with Search Box & Countries List */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Live Search Input */}
          <div className="p-2 border-b border-zinc-100 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-900/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500"
              />
            </div>
          </div>

          {/* List of Countries */}
          <div
            role="listbox"
            className="py-1 max-h-52 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800/40"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country === value;
                return (
                  <div
                    key={country}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    className={`px-3 py-1.5 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/70 text-[#064e3b] dark:text-emerald-300 font-bold"
                        : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 hover:text-zinc-950 dark:hover:text-white"
                    }`}
                  >
                    <span className="truncate">{country}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-xs text-zinc-400 text-center">
                No matching country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
