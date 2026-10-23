import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import CoursesManagerClient, {
  CourseRecord,
} from "./CoursesManagerClient";

export const metadata = {
  title: "Curriculum Management | Al-Noor Academy Admin",
  description: "Configure courses, pricing, lesson structures, and availability.",
};

export const instant = false;

export default async function AdminCoursesPage() {
  let initialCourses: CourseRecord[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      initialCourses = data as CourseRecord[];
    }
  } catch (err) {
    console.error("Error fetching courses for admin page:", err);
  }

  return <CoursesManagerClient initialCourses={initialCourses} />;
}
