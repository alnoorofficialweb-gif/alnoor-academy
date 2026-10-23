import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import NotificationsManagerClient, {
  NotificationItem,
} from "./NotificationsManagerClient";

export const metadata = {
  title: "Broadcast Notifications | Al-Noor Admin",
  description: "Send alerts, SMS and email broadcasts to students, faculty and staff",
};

export const instant = false;

export default async function AdminNotificationsPage() {
  let notifications: NotificationItem[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      notifications = data as NotificationItem[];
    } else {
      notifications = [
        {
          id: "notif_1",
          title: "Ramadan Schedule Adjustment",
          message:
            "Please note that evening Quran classes will be adjusted by 30 minutes following Maghrib prayer timings.",
          recipient_role: "all",
          recipient_email: null,
          sent_by: "Admin",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: "notif_2",
          title: "Monthly Tajweed Assessment Due",
          message:
            "All students enrolled in the Intermediate Tajweed Mastery course are required to submit their Surah Al-Mulk recitation test by Friday.",
          recipient_role: "students",
          recipient_email: null,
          sent_by: "Admin",
          created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
        },
      ];
    }
  } catch (err) {
    console.error("Error fetching notifications from Supabase:", err);
  }

  return <NotificationsManagerClient initialNotifications={notifications} />;
}
