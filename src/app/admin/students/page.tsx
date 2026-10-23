import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import StudentsManagerClient, {
  StudentRecord,
} from "./StudentsManagerClient";

export const metadata = {
  title: "Students Management | Al-Noor Academy Admin",
  description: "Manage student enrollments, statuses, and live timetables.",
};

export const instant = false;

export default async function AdminStudentsPage() {
  let initialStudents: StudentRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      initialStudents = data as StudentRecord[];
    }
  } catch (err) {
    console.error("Error fetching students for admin page:", err);
  }

  return <StudentsManagerClient initialStudents={initialStudents} />;
}
