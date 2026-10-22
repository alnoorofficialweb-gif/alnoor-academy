import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata = {
  title: "Admin Dashboard | Al-Noor Academy",
  description: "Live management control center for Al-Noor Academy",
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Route Protection: Immediately verify admin_session cookie
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession || !adminSession.value) {
    redirect("/admin-login");
  }

  // Fetch real teachers count dynamically from Supabase
  let teacherCount = 0;
  try {
    const { count, error } = await supabaseAdmin
      .from("teachers")
      .select("*", { count: "exact", head: true });

    if (!error && typeof count === "number") {
      teacherCount = count;
    }
  } catch (err) {
    console.error("Error fetching teacher count for layout:", err);
  }

  return (
    <AdminLayoutClient teacherCount={teacherCount}>
      {children}
    </AdminLayoutClient>
  );
}
