import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import TeachersManagerClient, {
  TeacherRecord,
} from "./TeachersManagerClient";

export const metadata = {
  title: "Faculty Management | Al-Noor Academy Admin",
  description: "Review teacher applications, verify credentials, and manage instructors.",
};

export const instant = false;

export default async function AdminTeachersPage() {
  let initialTeachers: TeacherRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      initialTeachers = data as TeacherRecord[];
    }
  } catch (err) {
    console.error("Error fetching teachers for admin page:", err);
  }

  return <TeachersManagerClient initialTeachers={initialTeachers} />;
}
