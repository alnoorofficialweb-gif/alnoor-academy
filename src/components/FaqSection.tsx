"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How do 1-on-1 online classes work?",
    answer:
      "Classes take place inside our interactive virtual room with real-time audio, video, and digital Quran recitation displays. Your dedicated instructor listens live, corrects pronunciation points (Makharij), and tracks your daily progress.",
  },
  {
    question: "Is there really a free trial before enrollment?",
    answer:
      "Yes, we provide an unconditional 3-day free evaluation with zero payment or credit card required. You can experience the lesson format, meet your instructor, and decide if the curriculum fits your expectations.",
  },
  {
    question: "Can I choose my class timings and frequency?",
    answer:
      "Yes. We offer 24/7 scheduling to fit international timezones across the US, UK, Europe, Australia, and the Middle East. You can select your preferred days and lesson times during onboarding.",
  },
  {
    question: "Do you have female instructors for sisters and young children?",
    answer:
      "Yes. We have certified female scholars (Ustadhas) and Hafizas available for sisters, daughters, and young kids who prefer learning with a female tutor.",
  },
  {
    question: "What happens if I need to reschedule a class?",
    answer:
      "You can reschedule any lesson by notifying your academic coordinator at least 4 hours in advance. Makeup sessions can easily be scheduled so you never lose study hours.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-lg mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 text-xs font-bold border border-emerald-100 dark:border-emerald-800">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-100 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Clear answers regarding trial scheduling, class structure, and tutor allocation.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden app-card transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 dark:text-zinc-400 shrink-0 transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-180 text-[#064e3b] dark:text-emerald-400" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
