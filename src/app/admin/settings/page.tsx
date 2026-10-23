import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SettingsManagerClient from "./SettingsManagerClient";

export const metadata = {
  title: "Academy Settings | Al-Noor Academy Admin",
  description: "Global academy settings, contact channels, and timetable slots.",
};

export const instant = false;

const DEFAULT_CONTACT = {
  whatsapp: "+44 7458 198270",
  phone: "+44 20 8123 4567",
  email: "admissions@alnooracademy.com",
  address: "London, United Kingdom",
};

const DEFAULT_SLOTS = [
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export default async function AdminSettingsPage() {
  let contact = DEFAULT_CONTACT;
  let slots = DEFAULT_SLOTS;

  try {
    const { data: contactRow } = await supabaseAdmin
      .from("academy_settings")
      .select("setting_value")
      .eq("setting_key", "contact_info")
      .single();

    if (contactRow && contactRow.setting_value) {
      contact = { ...DEFAULT_CONTACT, ...(contactRow.setting_value as Record<string, string>) };
    }

    const { data: slotsRow } = await supabaseAdmin
      .from("academy_settings")
      .select("setting_value")
      .eq("setting_key", "class_slots")
      .single();

    if (slotsRow && Array.isArray(slotsRow.setting_value)) {
      slots = slotsRow.setting_value as string[];
    }
  } catch (err) {
    console.error("Error fetching settings for admin settings page:", err);
  }

  return (
    <SettingsManagerClient initialContact={contact} initialSlots={slots} />
  );
}
