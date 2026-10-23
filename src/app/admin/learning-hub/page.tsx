import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import LearningHubManagerClient, {
  ScholarQuestionRecord,
} from "./LearningHubManagerClient";

export const metadata = {
  title: "Learning Hub Management | Al-Noor Academy Admin",
  description: "Fatwa desk, public theological rulings, and learning resource management.",
};

export const instant = false;

export default async function AdminLearningHubPage() {
  let initialQuestions: ScholarQuestionRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("scholar_questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      initialQuestions = data as ScholarQuestionRecord[];
    }
  } catch (err) {
    console.error("Error fetching scholar questions for admin page:", err);
  }

  return <LearningHubManagerClient initialQuestions={initialQuestions} />;
}
