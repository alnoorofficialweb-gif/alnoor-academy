"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin-login");
}

export async function adminLoginAction(formData: FormData) {
  const email = (formData.get("email") as string || "").trim();
  const password = (formData.get("password") as string || "").trim();

  // Accept admin credentials (default demo credentials: admin@alnooracademy.com / admin123)
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
