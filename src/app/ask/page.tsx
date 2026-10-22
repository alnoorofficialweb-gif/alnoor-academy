"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Search,
} from "lucide-react";
import { CustomDropdown, DropdownOption } from "@/components/CustomDropdown";

interface AnsweredQuestion {
  id: number;
  category: string;
  question: string;
  date: string;
  answeredBy: string;
  scholarTitle: string;
  answer: string;
}

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: "quran-tajweed", label: "Quran Recitation & Tajweed Rulings" },
  { value: "salah-worship", label: "Salah, Wudu & Daily Worship" },
  { value: "family-life", label: "Family, Upbringing & Youth" },
  { value: "zakat-finance", label: "Zakat, Sadaqah & Halal Wealth" },
  { value: "general-faith", label: "General Islamic Beliefs & Duas" },
];

const RECENT_ANSWERS: AnsweredQuestion[] = [
  {
    id: 1,
    category: "Quran Recitation & Tajweed Rulings",
    question: "Can I recite the Holy Quran from my smartphone without having Wudu?",
    date: "October 18, 2026",
    answeredBy: "Sheikh Ahmad Al-Masri",
    scholarTitle: "Faculty of Shariah, Al-Azhar University",
    answer:
      "Yes, according to the majority of contemporary scholars, touching a smartphone screen to read the digital Quran does not carry the exact fiqh status of touching the physical Mus'haf. While having Wudu is superior in all states of Dhikr and recitation, reading from a phone without Wudu is permissible, provided one is not in a state of major ritual impurity (Janabah).",
  },
  {
    id: 2,
    category: "Salah, Wudu & Daily Worship",
    question: "What should I do if I wake up late and miss Fajr prayer past sunrise?",
    date: "October 15, 2026",
    answeredBy: "Sheikh Dr. Farooq Al-Azhari",
    scholarTitle: "Senior Mufti & Dean of Quranic Studies",
    answer:
      "If you wake up after sunrise despite having taken reasonable steps (setting an alarm and sleeping with good intention), you should make Wudu immediately upon waking and pray the two Sunnah Rak'ahs followed by the two Fard Rak'ahs of Fajr. The Prophet (peace be upon him) taught that whoever sleeps past a prayer or forgets it should perform it as soon as they remember.",
  },
  {
    id: 3,
    category: "Quran Recitation & Tajweed Rulings",
    question: "How do I ensure consistent Ghunnah and Madd when reciting quietly during individual Salah?",
    date: "October 11, 2026",
    answeredBy: "Ustadh Bilal Mansoor",
    scholarTitle: "Ijazah in Hafs & Shu'bah",
    answer:
      "Even in silent prayers (Dhuhr, Asr), Tajweed rules such as Ghunnah (nasalization duration of 2 harakahs) and Madd (lengthening) remain recommended (Mustahabb). The key practice is to move your lips and tongue properly with internal vocalization rather than reciting entirely in thought. Practicing slow, measured Murattal during your daily revision builds the muscle memory needed for prayer.",
  },
  {
    id: 4,
    category: "Family, Upbringing & Youth",
    question: "At what age should children begin learning Noorani Qaida vs. listening to recitations?",
    date: "October 08, 2026",
    answeredBy: "Ustadha Fatima Al-Zahra",
    scholarTitle: "Head of Youth Quranic Pedagogy",
    answer:
      "Listening can begin as early as infancy to accustom the child's auditory perception to Arabic phonetics. Formal Noorani Qaida instruction typically begins between the ages of 4 and 6, when a child can identify distinct letter shapes and repeat sounds accurately. Keep lessons short (15-20 minutes) and filled with positive encouragement.",
  },
  {
    id: 5,
    category: "General Islamic Beliefs & Duas",
    question: "Is it permissible to listen to Quran audio while studying or doing desk work?",
    date: "October 04, 2026",
    answeredBy: "Sheikh Dr. Farooq Al-Azhari",
    scholarTitle: "Senior Mufti & Dean of Quranic Studies",
    answer:
      "Listening to the Quran with attentiveness and silence is the recommended norm (Surah Al-A'raf 7:204). However, having Quran recitation gently playing in the background while working or studying is permissible if done with respect, provided it brings peace and does not lead to irreverent behavior or disrespect toward the sacred words.",
  },
];

export default function AskSheikhPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("quran-tajweed");
  const [questionText, setQuestionText] = useState("");
  const [allowPublic, setAllowPublic] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [searchFilter, setSearchFilter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const filteredAnswers = RECENT_ANSWERS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Scholarly Inquiry Desk</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Ask the Sheikh
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Have questions about Quranic recitation, Tajweed, or daily worship? Submit your question privately to our certified faculty.
        </p>
      </div>

      {/* Question Submission Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Question Successfully Received
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                JazakAllah Khair. Your inquiry has been routed to our academic advisory board. You will receive a scholarly response at <span className="font-semibold text-zinc-700 dark:text-zinc-200">{email}</span> within 24 to 48 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setQuestionText("");
              }}
              className="text-xs font-semibold text-[#064e3b] dark:text-emerald-400 hover:underline pt-2 cursor-pointer transition-colors"
            >
              Submit another question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <MessageSquare className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Submit Your Question
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mansoor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="scholar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Inquiry Topic
              </label>
              <CustomDropdown
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={setCategory}
                buttonClassName="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Your Detailed Question *
              </label>
              <textarea
                required
                rows={4}
                placeholder="State your question with any necessary context (e.g. circumstances, specific Surah/Ayah, or prayer in question)..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="allow-public"
                type="checkbox"
                checked={allowPublic}
                onChange={(e) => setAllowPublic(e.target.checked)}
                className="mt-0.5 rounded text-[#064e3b] focus:ring-[#064e3b]"
              />
              <label htmlFor="allow-public" className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                Allow this question and answer to be published anonymously in the public library to benefit other students.
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Confidential and handled strictly by qualified teachers</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#043327] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Send Question to Sheikh</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recently Answered Public Questions */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              Recently Answered Questions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Browse authentic answers provided to students and seekers by our scholarly panel.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search rulings & topics..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-[#064e3b] dark:focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filteredAnswers.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-4 sm:p-5 flex items-start justify-between text-left gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="shrink-0 text-zinc-400 dark:text-zinc-500 pt-1">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        isExpanded ? "rotate-180 text-[#064e3b] dark:text-emerald-400" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-3">
                      <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {item.answer}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-zinc-200/60 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#064e3b] dark:bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {item.answeredBy.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{item.answeredBy}</span>
                            <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline"> • {item.scholarTitle}</span>
                          </div>
                        </div>

                        <Link
                          href="/teachers"
                          className="text-[#064e3b] dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                        >
                          <span>View Faculty</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAnswers.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs">
              No inquiries found matching &ldquo;{searchFilter}&rdquo;.
            </div>
          )}
        </div>
      </div>

      {/* Islamic Jurisprudence Trust Footer */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          Academic Integrity & Sunni Jurisprudence
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Inquiries are adjudicated strictly according to sound principles of Ahl al-Sunnah wal-Jama&lsquo;ah under classical methodologies. Specific legal conflicts should be brought before local community authorities.
        </p>
      </div>

    </div>
  );
}
