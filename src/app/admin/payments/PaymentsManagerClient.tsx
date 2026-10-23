"use client";

import React, { useState, useTransition } from "react";
import {
  CreditCard,
  DollarSign,
  Plus,
  Search,
  Download,
  Send,
  Printer,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FileText,
  Clock,
  Shield,
} from "lucide-react";
import {
  recordPaymentAction,
  deletePaymentAction,
  sendFeeReminderAction,
  PaymentInput,
} from "@/app/admin/actions";
import { FilterDropdown, FormSelectDropdown } from "@/components/admin/AdminDropdowns";

export interface PaymentItem {
  id: string;
  student_id: string | null;
  student_name: string;
  email: string | null;
  amount: number;
  currency: string;
  month: string;
  status: string;
  payment_method: string | null;
  invoice_no: string | null;
  paid_at: string | null;
  created_at: string;
}

interface PaymentsManagerClientProps {
  initialPayments: PaymentItem[];
}

export default function PaymentsManagerClient({
  initialPayments,
}: PaymentsManagerClientProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<PaymentItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<PaymentInput>({
    studentName: "",
    email: "",
    amount: 40.0,
    currency: "GBP",
    month: "October 2026",
    status: "paid",
    paymentMethod: "Bank Transfer",
  });

  const totalCollected = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const totalPending = payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const filteredPayments = payments.filter((p) => {
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.student_name.toLowerCase().includes(query) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.invoice_no && p.invoice_no.toLowerCase().includes(query)) ||
      p.month.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleSendReminder = (p: PaymentItem) => {
    startTransition(async () => {
      const res = await sendFeeReminderAction(p.id);
      if (res.success) {
        setFeedbackMsg({
          type: "success",
          text: `Fee reminder dispatched to ${p.student_name} (${p.email || "WhatsApp"}).`,
        });
      } else {
        setFeedbackMsg({ type: "error", text: "Failed to dispatch reminder." });
      }
      setTimeout(() => setFeedbackMsg(null), 3500);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this payment record?")) return;
    startTransition(async () => {
      const res = await deletePaymentAction(id);
      if (res.success) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
        setFeedbackMsg({ type: "success", text: "Payment record deleted." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to delete record." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await recordPaymentAction(formData);
      if (res.success) {
        const newRecord: PaymentItem = {
          id: `pay_${Date.now()}`,
          student_id: null,
          student_name: formData.studentName,
          email: formData.email || null,
          amount: formData.amount,
          currency: formData.currency || "GBP",
          month: formData.month,
          status: formData.status,
          payment_method: formData.paymentMethod || "Bank Transfer",
          invoice_no: `INV-${Date.now().toString().slice(-6)}`,
          paid_at: formData.status === "paid" ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
        };
        setPayments((prev) => [newRecord, ...prev]);
        setFeedbackMsg({ type: "success", text: "Payment record saved successfully." });
        setIsRecordModalOpen(false);
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to save payment." });
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Payments & Invoicing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {payments.length} Invoices
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Student fee tracking, monthly dues, reminder dispatches, and official tax receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRecordModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold hover:bg-[#04382a] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Tuition Payment</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Settled</p>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1 font-black tracking-tight tabular-nums">
            Rs. {totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Dues</p>
          <p className="text-2xl font-extrabold text-amber-800 mt-1 font-black tracking-tight tabular-nums">
            Rs. {totalPending.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Paid Invoices</p>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">
            {payments.filter((p) => p.status === "paid").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-100 bg-red-50/20 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">Overdue / Follow-up</p>
          <p className="text-2xl font-extrabold text-red-800 mt-1">
            {payments.filter((p) => p.status === "overdue").length}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, email, invoice #..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b] transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Payment Statuses" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
          ]}
          className="min-w-[170px]"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student & Contact</th>
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <DollarSign className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-700">No payment invoices found.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                      {p.invoice_no || `INV-${p.id.slice(0, 6)}`}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{p.student_name}</div>
                      <div className="text-[11px] text-gray-400">{p.email || "No email"}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700">{p.month}</td>

                    <td className="py-3.5 px-4 font-extrabold text-gray-900">
                      Rs. {Number(p.amount).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {p.payment_method || "Bank Transfer"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.status === "paid"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : p.status === "overdue"
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(p)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="View Official Receipt"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>

                        {p.status !== "paid" && (
                          <button
                            type="button"
                            onClick={() => handleSendReminder(p)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Dispatch Reminder"
                          >
                            <Send className="w-3 h-3" />
                            <span>Remind</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-bold text-gray-900">Al-Noor Academy Official Receipt</h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingInvoice(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-gray-700" id="receipt-print-area">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-[#064e3b]">Al-Noor Quranic Academy</h3>
                  <p className="text-[11px] text-gray-400">London, United Kingdom • +44 7458 198270</p>
                  <p className="text-[11px] text-gray-400">finance@alnooracademy.com</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-gray-900">
                    {viewingInvoice.invoice_no || "INV-001"}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Date: {new Date(viewingInvoice.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                <p className="font-bold text-gray-900">Billed To:</p>
                <p className="text-sm font-semibold">{viewingInvoice.student_name}</p>
                <p className="text-gray-500">{viewingInvoice.email || "Registered Student"}</p>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Billing Cycle</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="py-3 px-3">1-on-1 Quran & Tajweed Tuition</td>
                      <td className="py-3 px-3">{viewingInvoice.month}</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">
                        Rs. {Number(viewingInvoice.amount).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      viewingInvoice.status === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    STATUS: {viewingInvoice.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">Total Settled:</span>
                  <p className="text-xl font-extrabold text-[#064e3b]">
                    Rs. {Number(viewingInvoice.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border-0 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">Record Tuition Payment</h2>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Zayd Al-Hassan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064e3b]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount (PKR / Rs.) *</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 12000"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Billing Month *</label>
                  <input
                    type="text"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    placeholder="October 2026"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                  <FormSelectDropdown
                    value={formData.paymentMethod || "Bank Transfer"}
                    onChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                    options={[
                      { value: "Bank Transfer", label: "Bank Transfer" },
                      { value: "Credit Card", label: "Credit Card" },
                      { value: "PayPal", label: "PayPal" },
                      { value: "Cash / Manual", label: "Cash / Manual" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <FormSelectDropdown
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={[
                      { value: "paid", label: "Paid" },
                      { value: "pending", label: "Pending" },
                      { value: "overdue", label: "Overdue" },
                    ]}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold hover:bg-[#04382a] flex items-center gap-1.5 shadow-xs"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
