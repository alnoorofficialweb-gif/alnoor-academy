import React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PaymentsManagerClient, { PaymentItem } from "./PaymentsManagerClient";

export const metadata = {
  title: "Tuition Fees & Payments | Al-Noor Admin",
  description: "Track student fees, overdue tuition, invoice receipts, and remittances",
};

export const instant = false;

export default async function AdminPaymentsPage() {
  let payments: PaymentItem[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      payments = data as PaymentItem[];
    } else {
      // Demo initial records if table is brand new
      payments = [
        {
          id: "pay_1",
          student_id: null,
          student_name: "Zayd Al-Hassan",
          email: "parent.zayd@gmail.com",
          amount: 40.0,
          currency: "GBP",
          month: "October 2026",
          status: "paid",
          payment_method: "Bank Transfer",
          invoice_no: "INV-982141",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: "pay_2",
          student_id: null,
          student_name: "Fatima Zahra",
          email: "zahra.family@outlook.com",
          amount: 50.0,
          currency: "GBP",
          month: "October 2026",
          status: "paid",
          payment_method: "Credit Card (Stripe)",
          invoice_no: "INV-982142",
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: "pay_3",
          student_id: null,
          student_name: "Ibrahim Tariq",
          email: "tariq.ibrahim@yahoo.com",
          amount: 60.0,
          currency: "GBP",
          month: "October 2026",
          status: "pending",
          payment_method: "Bank Transfer",
          invoice_no: "INV-982143",
          paid_at: null,
          created_at: new Date().toISOString(),
        },
        {
          id: "pay_4",
          student_id: null,
          student_name: "Amina Yusuf",
          email: "amina.parents@gmail.com",
          amount: 40.0,
          currency: "GBP",
          month: "September 2026",
          status: "overdue",
          payment_method: "Bank Transfer",
          invoice_no: "INV-982144",
          paid_at: null,
          created_at: new Date().toISOString(),
        },
      ];
    }
  } catch (err) {
    console.error("Error fetching payments from Supabase:", err);
  }

  return <PaymentsManagerClient initialPayments={payments} />;
}
