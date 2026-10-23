"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export interface EnrollStudentInput {
  fullName: string;
  parentName?: string | null;
  email: string;
  whatsapp: string;
  country: string;
  city?: string | null;
  selectedCourse: string;
  preferredLanguage?: string;
  scheduledTime?: string | null;
  duration?: string | null;
  teacherId?: string | null;
  teacherName?: string | null;
  notes?: string | null;
}

export interface TeacherApplyInput {
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  city?: string | null;
  specialization?: string | null;
  experience?: string | null;
  sanadDetails?: string | null;
  cvUrl?: string | null;
  photoUrl?: string | null;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ScholarQuestionInput {
  name: string;
  email: string;
  topic: string;
  question: string;
  isPublic?: boolean;
}

export type ActionResponse = {
  success: boolean;
  error?: string;
  message?: string;
};

/**
 * 1. Unified Student Enrollment Action
 * Connects /signup, /start-learning, and BookTutorModal to the students table.
 * If a teacher is specified, also records in tutor_bookings table.
 */
export async function enrollStudentAction(
  data: EnrollStudentInput
): Promise<ActionResponse> {
  try {
    const fullName = (data.fullName || "").trim();
    const email = (data.email || "").trim();
    const whatsapp = (data.whatsapp || "").trim();
    const country = (data.country || "").trim();
    const selectedCourse = (data.selectedCourse || "").trim();

    if (!fullName || !email || !whatsapp || !country || !selectedCourse) {
      return {
        success: false,
        error: "Please provide all required fields (Full Name, Email, WhatsApp, Country, and Course).",
      };
    }

    // 1. Insert into students table
    const { error: studentErr } = await supabaseAdmin.from("students").insert([
      {
        full_name: fullName,
        parent_name: data.parentName ? data.parentName.trim() : null,
        email: email,
        whatsapp: whatsapp,
        country: country,
        city: data.city ? data.city.trim() : null,
        selected_course: selectedCourse,
        preferred_language: data.preferredLanguage || "english",
        scheduled_time: data.scheduledTime || "Flexible",
        duration: data.duration || "30 minutes",
        status: "pending",
      },
    ]);

    if (studentErr) {
      console.error("Supabase students insert error:", studentErr);
      return {
        success: false,
        error: studentErr.message || "Failed to submit enrollment request.",
      };
    }

    // 2. If tutor booking (teacher name or ID present), also insert into tutor_bookings table
    if (data.teacherName || data.teacherId) {
      const { error: tutorErr } = await supabaseAdmin
        .from("tutor_bookings")
        .insert([
          {
            student_name: fullName,
            email: email,
            whatsapp: whatsapp,
            teacher_id: data.teacherId || null,
            teacher_name: data.teacherName || "Selected Scholar",
            time_slot: data.scheduledTime || "Flexible",
            duration: data.duration || "30 minutes",
            notes: data.notes ? data.notes.trim() : null,
          },
        ]);

      if (tutorErr) {
        console.warn("Supabase tutor_bookings secondary insert warning:", tutorErr);
        // Student was already recorded, so we don't fail the entire submission
      }
    }

    return {
      success: true,
      message: "Enrollment request submitted successfully.",
    };
  } catch (err: unknown) {
    console.error("enrollStudentAction unexpected exception:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

/**
 * 2. Teacher Faculty Application Action
 * Connects /teacher-apply to the teachers table.
 */
export async function teacherApplyAction(
  data: TeacherApplyInput
): Promise<ActionResponse> {
  try {
    const fullName = (data.fullName || "").trim();
    const email = (data.email || "").trim();
    const whatsapp = (data.whatsapp || "").trim();
    const country = (data.country || "").trim();

    if (!fullName || !email || !whatsapp || !country) {
      return {
        success: false,
        error: "Please fill out all required fields (Name, Email, WhatsApp, and Country).",
      };
    }

    const { error } = await supabaseAdmin.from("teachers").insert([
      {
        full_name: fullName,
        email: email,
        whatsapp: whatsapp,
        country: country,
        city: data.city ? data.city.trim() : null,
        specialization: data.specialization || "Quran Tajweed & Recitation",
        experience: data.experience || "3-5 Years",
        sanad_details: data.sanadDetails ? data.sanadDetails.trim() : null,
        cv_url: data.cvUrl || null,
        photo_url: data.photoUrl || null,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase teachers insert error:", error);
      return {
        success: false,
        error: error.message || "Failed to submit teacher application.",
      };
    }

    return {
      success: true,
      message: "Teacher application submitted successfully.",
    };
  } catch (err: unknown) {
    console.error("teacherApplyAction unexpected exception:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

/**
 * 3. Contact & Admissions Message Action
 * Connects /contact to the contact_messages table.
 */
export async function contactMessageAction(
  data: ContactMessageInput
): Promise<ActionResponse> {
  try {
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const subject = (data.subject || "").trim();
    const message = (data.message || "").trim();

    if (!name || !email || !subject || !message) {
      return {
        success: false,
        error: "Please fill out all required fields (Name, Email, Subject, and Message).",
      };
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert([
      {
        name,
        email,
        subject,
        message,
      },
    ]);

    if (error) {
      console.error("Supabase contact_messages insert error:", error);
      return {
        success: false,
        error: error.message || "Failed to submit message.",
      };
    }

    return {
      success: true,
      message: "Message sent successfully.",
    };
  } catch (err: unknown) {
    console.error("contactMessageAction unexpected exception:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

/**
 * 4. Scholar Question Action
 * Connects /ask to the scholar_questions table.
 */
export async function scholarQuestionAction(
  data: ScholarQuestionInput
): Promise<ActionResponse> {
  try {
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const topic = (data.topic || "").trim();
    const question = (data.question || "").trim();

    if (!name || !email || !topic || !question) {
      return {
        success: false,
        error: "Please fill out all required fields (Name, Email, Topic, and Question).",
      };
    }

    const { error } = await supabaseAdmin.from("scholar_questions").insert([
      {
        name,
        email,
        topic,
        question,
        is_public: data.isPublic ?? true,
      },
    ]);

    if (error) {
      console.error("Supabase scholar_questions insert error:", error);
      return {
        success: false,
        error: error.message || "Failed to submit question.",
      };
    }

    return {
      success: true,
      message: "Question submitted successfully to our scholar panel.",
    };
  } catch (err: unknown) {
    console.error("scholarQuestionAction unexpected exception:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

/**
 * 5. Email & Role Collision Verifications
 * Prevents:
 * 1) A student registering with an already existing teacher's email.
 * 2) A teacher registering with an already existing student's email.
 * 3) Multiple accounts created for the same email (duplicate registration prevention).
 * 4) Cross-role login attempts (e.g. logging in as teacher with a student's email or vice versa).
 */

export async function validateStudentSignupEmailAction(email: string) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { allowed: false, error: "Please enter a valid email address." };
  }

  try {
    // 1. Check if email exists in teachers table
    const { data: teacherRecord } = await supabaseAdmin
      .from("teachers")
      .select("id, full_name")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (teacherRecord) {
      return {
        allowed: false,
        error:
          "This email is already registered as an Educator / Teacher. A single email cannot be used for both Student and Teacher roles. Please log in using the Teacher tab or use a different email.",
      };
    }

    // 2. Check if email exists in students table
    const { data: studentRecord } = await supabaseAdmin
      .from("students")
      .select("id, full_name")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (studentRecord) {
      return {
        allowed: false,
        error:
          "An account with this email is already registered as a Student. Please log in instead of creating a duplicate account.",
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Error validating student email:", err);
    return { allowed: true }; // Allow fallback if network issue
  }
}

export async function validateTeacherApplyEmailAction(email: string) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { allowed: false, error: "Please enter a valid email address." };
  }

  try {
    // 1. Check if email exists in students table
    const { data: studentRecord } = await supabaseAdmin
      .from("students")
      .select("id, full_name")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (studentRecord) {
      return {
        allowed: false,
        error:
          "This email is already registered as a Student. A single email cannot be used for both Student and Teacher accounts. Please use a separate email for your faculty application.",
      };
    }

    // 2. Check if email exists in teachers table
    const { data: teacherRecord } = await supabaseAdmin
      .from("teachers")
      .select("id, full_name")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (teacherRecord) {
      return {
        allowed: false,
        error:
          "A teacher application with this email has already been submitted and is currently on file.",
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Error validating teacher apply email:", err);
    return { allowed: true };
  }
}

export async function validateLoginRoleAction(
  email: string,
  requestedRole: "student" | "teacher"
) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) return { allowed: true };

  try {
    if (requestedRole === "student") {
      // If user tries to log in under Student tab, check if they are in teachers table and NOT in students
      const { data: teacherRecord } = await supabaseAdmin
        .from("teachers")
        .select("id, full_name")
        .eq("email", cleanEmail)
        .maybeSingle();

      const { data: studentRecord } = await supabaseAdmin
        .from("students")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (teacherRecord && !studentRecord) {
        return {
          allowed: false,
          error:
            "This email is registered as an Educator / Teacher account. Please switch to the 'Teacher' tab above to log in.",
        };
      }
    } else {
      // If user tries to log in under Teacher tab, check if they are in students table and NOT in teachers
      const { data: studentRecord } = await supabaseAdmin
        .from("students")
        .select("id, full_name")
        .eq("email", cleanEmail)
        .maybeSingle();

      const { data: teacherRecord } = await supabaseAdmin
        .from("teachers")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (studentRecord && !teacherRecord) {
        return {
          allowed: false,
          error:
            "This email is registered as a Student account. Please switch to the 'Student' tab above to log in.",
        };
      }
    }

    return { allowed: true };
  } catch (err) {
    console.error("Error in validateLoginRoleAction:", err);
    return { allowed: true };
  }
}

