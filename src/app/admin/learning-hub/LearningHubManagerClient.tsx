"use client";

import React, { useState, useTransition } from "react";
import {
  HelpCircle,
  BookOpen,
  Headphones,
  CheckCircle2,
  AlertCircle,
  X,
  MessageCircle,
  Search,
  Check,
  Trash2,
  Loader2,
  ExternalLink,
  Eye,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  answerScholarQuestionAction,
  deleteScholarQuestionAction,
} from "@/app/admin/actions";

export interface ScholarQuestionRecord {
  id: string;
  name: string;
  email: string;
  topic: string;
  question: string;
  is_public: boolean;
  answer: string | null;
  created_at: string;
}

interface LearningHubManagerClientProps {
  initialQuestions: ScholarQuestionRecord[];
}

export default function LearningHubManagerClient({
  initialQuestions,
}: LearningHubManagerClientProps) {
  const [questions, setQuestions] = useState<ScholarQuestionRecord[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<"all" | "unanswered" | "answered">("all");

  const [answeringQuestion, setAnsweringQuestion] = useState<ScholarQuestionRecord | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isPublicAnswer, setIsPublicAnswer] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.name.toLowerCase().includes(searchQuery.toLowerCase());

    const isAnswered = Boolean(q.answer && q.answer.trim().length > 0);
    const matchesFilter =
      filterState === "all"
        ? true
        : filterState === "answered"
        ? isAnswered
        : !isAnswered;

    return matchesSearch && matchesFilter;
  });

  const totalQuestions = questions.length;
  const unansweredCount = questions.filter((q) => !q.answer || q.answer.trim().length === 0).length;
  const answeredCount = totalQuestions - unansweredCount;

  const handleOpenAnswerModal = (q: ScholarQuestionRecord) => {
    setAnsweringQuestion(q);
    setAnswerText(q.answer || "");
    setIsPublicAnswer(q.is_public ?? true);
  };

  const handleSaveAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringQuestion) return;

    startTransition(async () => {
      const res = await answerScholarQuestionAction(
        answeringQuestion.id,
        answerText,
        isPublicAnswer
      );
      if (res.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === answeringQuestion.id
              ? { ...q, answer: answerText.trim(), is_public: isPublicAnswer }
              : q
          )
        );
        setFeedbackMsg({
          type: "success",
          text: "Answer saved and published to Learning Hub.",
        });
        setAnsweringQuestion(null);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to submit answer." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this question from records?")) return;
    startTransition(async () => {
      const res = await deleteScholarQuestionAction(id);
      if (res.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        setFeedbackMsg({ type: "success", text: "Question deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Learning Hub & Fatwa Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {unansweredCount} Unanswered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Answer user theological inquiries, publish scholar rulings, and manage foundational resources.
          </p>
        </div>

        <Link
          href="/ask"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <span>View Public Q&A Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>
      </div>

      {/* Notification Banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          href="/learning-hub/quran-qaida"
          target="_blank"
          className="bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-200 shadow-2xs transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Interactive Quran Qaida
              </p>
              <p className="text-[10px] text-gray-400">Arabic letters & phonetics</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
        </Link>

        <Link
          href="/audio"
          target="_blank"
          className="bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-200 shadow-2xs transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                Audio Surah Library
              </p>
              <p className="text-[10px] text-gray-400">Renowned Qari recitations</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-teal-600 transition-colors" />
        </Link>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Fatwa Questions Desk</p>
              <p className="text-[10px] text-gray-400">
                {answeredCount} Answered • {unansweredCount} Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question, topic, name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 transition-all text-gray-900"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterState("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All ({totalQuestions})
          </button>
          <button
            type="button"
            onClick={() => setFilterState("unanswered")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === "unanswered" ? "bg-white text-amber-800 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Unanswered ({unansweredCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterState("answered")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === "answered" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Answered ({answeredCount})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-2xs">
            <HelpCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700">No questions found.</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              User questions submitted on &apos;/ask&apos; will automatically arrive here for review.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isAnswered = Boolean(q.answer && q.answer.trim().length > 0);
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs hover:border-gray-200 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {q.topic || "General"}
                      </span>
                      {isAnswered ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Answered</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Response
                        </span>
                      )}
                      {q.is_public && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          • Public
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 pt-1">
                      &quot;{q.question}&quot;
                    </h3>

                    <p className="text-[11px] text-gray-400">
                      Asked by <strong className="text-gray-600">{q.name}</strong> ({q.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenAnswerModal(q)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100 border border-emerald-200/60 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isAnswered ? "Edit Answer" : "Write Answer"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Show Answer if present */}
                {isAnswered && (
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Scholar Verdict / Answer</span>
                    </div>
                    <p className="whitespace-pre-line text-gray-800 leading-relaxed font-sans">
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Answer Modal */}
      {answeringQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">
                Answer Question
              </h2>
              <button
                type="button"
                onClick={() => setAnsweringQuestion(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnswer} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Question from {answeringQuestion.name} ({answeringQuestion.topic})
                </p>
                <p className="text-xs font-semibold text-gray-900">
                  &quot;{answeringQuestion.question}&quot;
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Scholar Ruling / Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Provide an authentic, clear Islamic answer with references to Quran & Sunnah..."
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 text-gray-900 font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_public_cb"
                  checked={isPublicAnswer}
                  onChange={(e) => setIsPublicAnswer(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="is_public_cb" className="text-xs font-medium text-gray-700 cursor-pointer">
                  Publish publicly to Al-Noor Q&A desk (`/ask`)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAnsweringQuestion(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
