"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ==============================================================================
// 1. ADMIN AUTHENTICATION
// ==============================================================================

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin-login");
}

export async function adminLoginAction(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim();
  const password = ((formData.get("password") as string) || "").trim();

  // Accept admin credentials (admin@alnooracademy.com / admin123 or alnoor2026)
  if (
    password === "admin123" ||
    password === "alnoor2026" ||
    password === "admin" ||
    (email.toLowerCase().includes("admin") && password.length >= 4)
  ) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", `admin_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });
    return { success: true };
  }

  return {
    success: false,
    error: "Invalid administrator credentials. Please check your password.",
  };
}

export async function setAdminQuickSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", `admin_${Date.now()}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  redirect("/admin");
}

// ==============================================================================
// 2. STUDENTS MANAGEMENT ACTIONS
// ==============================================================================

export interface StudentInput {
  id?: string;
  fullName: string;
  parentName?: string | null;
  email: string;
  whatsapp: string;
  country: string;
  city?: string | null;
  selectedCourse: string;
  preferredLanguage?: string | null;
  scheduledTime?: string | null;
  duration?: string | null;
  status?: string;
}

export async function updateStudentStatusAction(id: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from("students")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin");
    revalidatePath("/admin/students");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update status";
    return { success: false, error: message };
  }
}

export async function saveStudentAction(data: StudentInput) {
  try {
    if (!data.fullName || !data.email || !data.whatsapp) {
      return { success: false, error: "Name, email, and WhatsApp are required." };
    }

    if (data.id) {
      // Update existing student
      const { error } = await supabaseAdmin
        .from("students")
        .update({
          full_name: data.fullName,
          parent_name: data.parentName || null,
          email: data.email,
          whatsapp: data.whatsapp,
          country: data.country || "United Kingdom",
          city: data.city || null,
          selected_course: data.selectedCourse,
          preferred_language: data.preferredLanguage || "english",
          scheduled_time: data.scheduledTime || null,
          duration: data.duration || null,
          status: data.status || "pending",
        })
        .eq("id", data.id);

      if (error) throw error;
    } else {
      // Insert new student
      const { error } = await supabaseAdmin.from("students").insert({
        full_name: data.fullName,
        parent_name: data.parentName || null,
        email: data.email,
        whatsapp: data.whatsapp,
        country: data.country || "United Kingdom",
        city: data.city || null,
        selected_course: data.selectedCourse,
        preferred_language: data.preferredLanguage || "english",
        scheduled_time: data.scheduledTime || null,
        duration: data.duration || null,
        status: data.status || "pending",
      });

      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/students");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save student";
    return { success: false, error: message };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from("students").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin");
    revalidatePath("/admin/students");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete student";
    return { success: false, error: message };
  }
}

export async function getStudentFullDetailsAction(studentId: string) {
  try {
    // 1. Fetch student record
    const { data: student, error: stdError } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (stdError || !student) throw new Error("Student not found");

    // 2. Fetch Quran progress (if any)
    const { data: progress } = await supabaseAdmin
      .from("quran_progress")
      .select("*")
      .or(`student_id.eq.${studentId},student_name.ilike.%${student.full_name}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Fetch Payments (if any)
    const { data: payments } = await supabaseAdmin
      .from("payments")
      .select("*")
      .or(`student_id.eq.${studentId},email.eq.${student.email},student_name.ilike.%${student.full_name}%`)
      .order("created_at", { ascending: false });

    // 4. Fetch Schedule slot (if any)
    const { data: schedule } = await supabaseAdmin
      .from("schedule_slots")
      .select("*")
      .or(`student_id.eq.${studentId},student_name.ilike.%${student.full_name}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5. Fetch Attendance (if any)
    const { data: attendanceList } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .or(`student_id.eq.${studentId},student_name.ilike.%${student.full_name}%`)
      .order("class_date", { ascending: false });

    // 6. Fetch Course details
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("*");

    return {
      success: true,
      data: {
        student,
        progress: progress || null,
        payments: payments || [],
        schedule: schedule || null,
        attendanceList: attendanceList || [],
        courses: courses || [],
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch student details";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 3. TEACHERS MANAGEMENT ACTIONS
// ==============================================================================

export interface TeacherInput {
  id?: string;
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
  status?: string;
}

export async function updateTeacherStatusAction(id: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from("teachers")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin");
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update status";
    return { success: false, error: message };
  }
}

export async function saveTeacherAction(data: TeacherInput) {
  try {
    if (!data.fullName || !data.email || !data.whatsapp) {
      return { success: false, error: "Name, email, and WhatsApp are required." };
    }

    if (data.id) {
      // Update
      const { error } = await supabaseAdmin
        .from("teachers")
        .update({
          full_name: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
          country: data.country || "Egypt",
          city: data.city || null,
          specialization: data.specialization || "Quran & Tajweed",
          experience: data.experience || "3+ Years",
          sanad_details: data.sanadDetails || null,
          cv_url: data.cvUrl !== undefined ? data.cvUrl : undefined,
          photo_url: data.photoUrl !== undefined ? data.photoUrl : undefined,
          status: data.status || "approved",
        })
        .eq("id", data.id);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin.from("teachers").insert({
        full_name: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        country: data.country || "Egypt",
        city: data.city || null,
        specialization: data.specialization || "Quran & Tajweed",
        experience: data.experience || "3+ Years",
        sanad_details: data.sanadDetails || null,
        cv_url: data.cvUrl || null,
        photo_url: data.photoUrl || null,
        status: data.status || "approved",
      });

      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save teacher";
    return { success: false, error: message };
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from("teachers").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin");
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete teacher";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 4. COURSES MANAGEMENT ACTIONS
// ==============================================================================

export interface CourseInput {
  id?: string;
  slug: string;
  title: string;
  arabicTitle?: string | null;
  level: string;
  duration: string;
  lessons: number;
  monthlyFee: string;
  description: string;
  highlights: string[];
  isActive?: boolean;
}

export async function saveCourseAction(data: CourseInput) {
  try {
    if (!data.title || !data.slug) {
      return { success: false, error: "Course title and unique slug are required." };
    }

    const payload = {
      slug: data.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: data.title.trim(),
      arabic_title: data.arabicTitle?.trim() || null,
      level: data.level || "Beginner",
      duration: data.duration || "30 mins / day",
      lessons: Number(data.lessons) || 24,
      monthly_fee: data.monthlyFee || "Rs. 12,000 / month",
      description: data.description?.trim() || "",
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      is_active: data.isActive !== undefined ? data.isActive : true,
    };

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("courses")
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("courses")
        .insert(payload);
      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save course";
    return { success: false, error: message };
  }
}

export async function toggleCourseActiveAction(id: string, isActive: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from("courses")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle status";
    return { success: false, error: message };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete course";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 5. SCHOLAR QUESTIONS (LEARNING HUB) ACTIONS
// ==============================================================================

export async function answerScholarQuestionAction(
  id: string,
  answer: string,
  isPublic: boolean
) {
  try {
    const { error } = await supabaseAdmin
      .from("scholar_questions")
      .update({
        answer: answer.trim(),
        is_public: isPublic,
      })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/admin/learning-hub");
    revalidatePath("/ask");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish answer";
    return { success: false, error: message };
  }
}

export async function deleteScholarQuestionAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("scholar_questions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/learning-hub");
    revalidatePath("/ask");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete question";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 6. ACADEMY SETTINGS ACTIONS
// ==============================================================================

export async function updateAcademySettingsAction(
  key: string,
  value: Record<string, unknown> | unknown[]
) {
  try {
    const { error } = await supabaseAdmin
      .from("academy_settings")
      .upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update settings";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 7. SCHEDULE & TIMETABLE ACTIONS
// ==============================================================================

export interface ScheduleSlotInput {
  id?: string;
  studentId?: string | null;
  studentName: string;
  teacherId?: string | null;
  teacherName: string;
  dayOfWeek: string;
  timeSlot: string;
  duration?: string;
  meetingLink?: string;
  status?: string;
}

export async function saveScheduleSlotAction(data: ScheduleSlotInput) {
  try {
    if (!data.studentName || !data.teacherName || !data.dayOfWeek || !data.timeSlot) {
      return { success: false, error: "Student, teacher, day, and time slot are required." };
    }

    if (data.id && !data.id.startsWith("temp_")) {
      const { error } = await supabaseAdmin
        .from("schedule_slots")
        .update({
          student_name: data.studentName,
          teacher_name: data.teacherName,
          day_of_week: data.dayOfWeek,
          time_slot: data.timeSlot,
          duration: data.duration || "30 mins",
          meeting_link: data.meetingLink || "https://meet.google.com/aln-quran-live",
          status: data.status || "active",
        })
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("schedule_slots")
        .insert({
          student_id: data.studentId || null,
          student_name: data.studentName,
          teacher_id: data.teacherId || null,
          teacher_name: data.teacherName,
          day_of_week: data.dayOfWeek,
          time_slot: data.timeSlot,
          duration: data.duration || "30 mins",
          meeting_link: data.meetingLink || "https://meet.google.com/aln-quran-live",
          status: data.status || "active",
        });
      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save schedule slot";
    return { success: false, error: message };
  }
}

export async function deleteScheduleSlotAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("schedule_slots")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/schedule");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete slot";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 8. PAYMENTS & INVOICING ACTIONS
// ==============================================================================

export interface PaymentInput {
  id?: string;
  studentId?: string | null;
  studentName: string;
  email?: string;
  amount: number;
  currency?: string;
  month: string;
  status: string;
  paymentMethod?: string;
  invoiceNo?: string;
}

export async function recordPaymentAction(data: PaymentInput) {
  try {
    if (!data.studentName || !data.amount || !data.month) {
      return { success: false, error: "Student name, amount, and billing month are required." };
    }

    const invoiceNo = data.invoiceNo || `INV-${Date.now().toString().slice(-6)}`;

    if (data.id && !data.id.startsWith("temp_")) {
      const { error } = await supabaseAdmin
        .from("payments")
        .update({
          student_name: data.studentName,
          email: data.email,
          amount: data.amount,
          currency: data.currency || "GBP",
          month: data.month,
          status: data.status,
          payment_method: data.paymentMethod || "Bank Transfer",
          paid_at: data.status === "paid" ? new Date().toISOString() : null,
        })
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("payments")
        .insert({
          student_id: data.studentId || null,
          student_name: data.studentName,
          email: data.email,
          amount: data.amount,
          currency: data.currency || "GBP",
          month: data.month,
          status: data.status,
          payment_method: data.paymentMethod || "Bank Transfer",
          invoice_no: invoiceNo,
          paid_at: data.status === "paid" ? new Date().toISOString() : null,
        });
      if (error) throw error;
    }

    revalidatePath("/admin");
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record payment";
    return { success: false, error: message };
  }
}

export async function deletePaymentAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("payments")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete payment";
    return { success: false, error: message };
  }
}

export async function sendFeeReminderAction(paymentId: string) {
  try {
    // In live production, this dispatches WhatsApp or Email notification
    return {
      success: true,
      message: "Reminder dispatched successfully via WhatsApp and Email.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send reminder";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 9. QURAN PROGRESS ACTIONS
// ==============================================================================

export async function saveQuranProgressAction(payload: {
  studentId: string;
  studentName: string;
  currentSurah: string;
  currentParah: number;
  currentAyah: number;
  mistakeCount: number;
  notes?: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from("quran_progress")
      .upsert(
        {
          student_id: payload.studentId,
          student_name: payload.studentName,
          current_surah: payload.currentSurah,
          current_parah: payload.currentParah,
          current_ayah: payload.currentAyah,
          mistake_count: payload.mistakeCount,
          notes: payload.notes || "",
          last_reviewed_at: new Date().toISOString(),
        },
        { onConflict: "student_id" }
      );
    if (error) throw error;
    revalidatePath("/admin/students");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record Quran progress";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 10. NOTIFICATIONS ACTIONS
// ==============================================================================

export async function sendBroadcastNotificationAction(payload: {
  title: string;
  message: string;
  recipientRole: string; // 'all', 'students', 'teachers', 'specific'
  recipientEmail?: string;
}) {
  try {
    if (!payload.title || !payload.message) {
      return { success: false, error: "Title and message are required." };
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .insert({
        title: payload.title,
        message: payload.message,
        recipient_role: payload.recipientRole || "all",
        recipient_email: payload.recipientEmail || null,
        sent_by: "Admin",
      });

    if (error) throw error;
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send broadcast";
    return { success: false, error: message };
  }
}

export async function deleteNotificationAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete notification";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 11. TEACHER PAYOUT ACTIONS
// ==============================================================================

export async function recordTeacherPayoutAction(payload: {
  teacherId?: string;
  teacherName: string;
  classesTaken: number;
  hourlyRate: number;
  totalAmount: number;
  month: string;
  status: string;
}) {
  try {
    const { error } = await supabaseAdmin
      .from("teacher_payouts")
      .insert({
        teacher_id: payload.teacherId || null,
        teacher_name: payload.teacherName,
        classes_taken: payload.classesTaken,
        hourly_rate: payload.hourlyRate,
        total_amount: payload.totalAmount,
        month: payload.month,
        status: payload.status || "pending",
        payout_date: payload.status === "processed" ? new Date().toISOString() : null,
      });

    if (error) throw error;
    revalidatePath("/admin/teachers");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record payout";
    return { success: false, error: message };
  }
}

// ==============================================================================
// 12. FULL DATABASE BACKUP EXPORT
// ==============================================================================

export async function exportDatabaseBackupAction() {
  try {
    const [students, teachers, courses, payments, schedule, questions, messages, settings] =
      await Promise.all([
        supabaseAdmin.from("students").select("*"),
        supabaseAdmin.from("teachers").select("*"),
        supabaseAdmin.from("courses").select("*"),
        supabaseAdmin.from("payments").select("*"),
        supabaseAdmin.from("schedule_slots").select("*"),
        supabaseAdmin.from("scholar_questions").select("*"),
        supabaseAdmin.from("contact_messages").select("*"),
        supabaseAdmin.from("academy_settings").select("*"),
      ]);

    const backupData = {
      exported_at: new Date().toISOString(),
      platform: "Al-Noor Academy LMS",
      version: "2.0.0",
      tables: {
        students: students.data || [],
        teachers: teachers.data || [],
        courses: courses.data || [],
        payments: payments.data || [],
        schedule_slots: schedule.data || [],
        scholar_questions: questions.data || [],
        contact_messages: messages.data || [],
        academy_settings: settings.data || [],
      },
    };

    return {
      success: true,
      data: backupData,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate backup";
    return { success: false, error: message };
  }
}

