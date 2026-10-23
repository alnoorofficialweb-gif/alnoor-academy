import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ScheduleManagerClient, {
  ScheduleSlotRecord,
} from "./ScheduleManagerClient";

export const metadata = {
  title: "Class Schedule & Timetable | Al-Noor Admin",
  description: "Live schedule timetable and teacher-student slot allocations",
};

export const instant = false;

export default async function AdminSchedulePage() {
  let slots: ScheduleSlotRecord[] = [];
  let teachersList: string[] = [];
  let studentsList: string[] = [];

  try {
    const [slotsRes, teachersRes, studentsRes] = await Promise.all([
      supabaseAdmin
        .from("schedule_slots")
        .select("*")
        .order("time_slot", { ascending: true }),
      supabaseAdmin
        .from("teachers")
        .select("full_name")
        .eq("status", "approved"),
      supabaseAdmin
        .from("students")
        .select("full_name")
        .order("full_name", { ascending: true }),
    ]);

    if (slotsRes.data && slotsRes.data.length > 0) {
      slots = slotsRes.data as ScheduleSlotRecord[];
    } else {
      // Default initial schedule demo data
      slots = [
        {
          id: "demo_1",
          student_id: null,
          student_name: "Zayd Al-Hassan",
          teacher_id: null,
          teacher_name: "Sheikh Abdullah Mansoor",
          day_of_week: "Monday",
          time_slot: "5:00 PM",
          duration: "30 mins",
          meeting_link: "https://meet.google.com/aln-quran-live",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo_2",
          student_id: null,
          student_name: "Fatima Zahra",
          teacher_id: null,
          teacher_name: "Ustadha Maryam Siddiqa",
          day_of_week: "Tuesday",
          time_slot: "6:00 PM",
          duration: "45 mins",
          meeting_link: "https://meet.google.com/aln-quran-live",
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo_3",
          student_id: null,
          student_name: "Ibrahim Tariq",
          teacher_id: null,
          teacher_name: "Qari Tariq Masood",
          day_of_week: "Wednesday",
          time_slot: "7:00 PM",
          duration: "30 mins",
          meeting_link: "https://meet.google.com/aln-quran-live",
          status: "active",
          created_at: new Date().toISOString(),
        },
      ];
    }

    if (teachersRes.data) {
      teachersList = teachersRes.data.map((t) => t.full_name);
    }
    if (studentsRes.data) {
      studentsList = studentsRes.data.map((s) => s.full_name);
    }
  } catch (err) {
    console.error("Error fetching schedule from Supabase:", err);
  }

  return (
    <ScheduleManagerClient
      initialSlots={slots}
      teachersList={teachersList}
      studentsList={studentsList}
    />
  );
}
