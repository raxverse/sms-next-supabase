"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, ModalActions, Select, Textarea } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import { getClasses, getSessions, type ClassWithDetails, type SessionWithDetails } from "@/services/academicService";
import { getStudents, type StudentWithDetails } from "@/services/studentService";
import { createFeeStructure, createFeeType, createStudentInvoice, deleteFeeStructure, getFeeStructures, getFeeTypes, getStudentInvoices, recordFeePayment, updateStudentInvoice, type FeeStructureWithDetails, type FeeType, type InvoiceWithDetails } from "@/services/schoolAdminService";

type Tab = "types" | "structures" | "invoices";
interface FeeTypeForm { name: string; description: string }
interface StructureForm { fee_type_id: string; class_id: string; session_id: string; amount: string; frequency: string }
interface InvoiceForm { student_id: string; session_id: string; invoice_month: string; due_date: string; total_amount: string; status: string }
interface PaymentForm { invoice_id: string; amount_paid: string; payment_mode: string; transaction_id: string }

const typeInitial: FeeTypeForm = { name: "", description: "" };
const structureInitial: StructureForm = { fee_type_id: "", class_id: "", session_id: "", amount: "", frequency: "monthly" };
const invoiceInitial: InvoiceForm = { student_id: "", session_id: "", invoice_month: "", due_date: "", total_amount: "", status: "pending" };
const paymentInitial: PaymentForm = { invoice_id: "", amount_paid: "", payment_mode: "cash", transaction_id: "" };

export default function FeesPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;
  const canManage = hasRole("superadmin") || hasRole("schooladmin") || hasRole("accountant");

  const [activeTab, setActiveTab] = useState<Tab>("structures");
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [structures, setStructures] = useState<FeeStructureWithDetails[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalMode, setModalMode] = useState<"type" | "structure" | "invoice" | "payment" | "delete-structure" | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructureWithDetails | null>(null);
  const [typeForm, setTypeForm] = useState<FeeTypeForm>(typeInitial);
  const [structureForm, setStructureForm] = useState<StructureForm>(structureInitial);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(invoiceInitial);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>(paymentInitial);

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [typeData, structureData, invoiceData, classData, sessionData, studentData] = await Promise.all([
        getFeeTypes(schoolId),
        getFeeStructures(schoolId),
        getStudentInvoices(schoolId),
        getClasses({ school_id: schoolId }),
        getSessions({ school_id: schoolId }),
        getStudents({ school_id: schoolId }),
      ]);
      setFeeTypes(typeData);
      setStructures(structureData);
      setInvoices(invoiceData);
      setClasses(classData);
      setSessions(sessionData);
      setStudents(studentData);
    } catch (error) {
      console.error("Error loading fee data:", error);
      alert("Failed to load fee data.");
    } finally { setLoading(false); }
  }, [schoolId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const handleCreateType = async () => {
    if (!schoolId || !typeForm.name.trim()) return;
    setSaving(true);
    try {
      await createFeeType({ name: typeForm.name.trim(), description: typeForm.description.trim() || null, school_id: schoolId });
      setTypeForm(typeInitial);
      setModalMode(null);
      await fetchData();
    } catch (error) { console.error("Error creating fee type:", error); alert("Failed to create fee type."); }
    finally { setSaving(false); }
  };

  const handleCreateStructure = async () => {
    if (!schoolId || !structureForm.fee_type_id || !structureForm.class_id || !structureForm.session_id || !structureForm.amount) return alert("Please fill all required fields.");
    setSaving(true);
    try {
      await createFeeStructure({ school_id: schoolId, fee_type_id: structureForm.fee_type_id, class_id: structureForm.class_id, session_id: structureForm.session_id, amount: Number(structureForm.amount), frequency: structureForm.frequency || null });
      setStructureForm(structureInitial);
      setModalMode(null);
      await fetchData();
    } catch (error) { console.error("Error creating fee structure:", error); alert("Failed to create fee structure."); }
    finally { setSaving(false); }
  };

  const handleCreateInvoice = async () => {
    if (!schoolId || !invoiceForm.student_id || !invoiceForm.session_id || !invoiceForm.invoice_month || !invoiceForm.due_date || !invoiceForm.total_amount) return alert("Please fill all required fields.");
    setSaving(true);
    try {
      await createStudentInvoice({ school_id: schoolId, student_id: invoiceForm.student_id, session_id: invoiceForm.session_id, invoice_month: invoiceForm.invoice_month, due_date: invoiceForm.due_date, total_amount: Number(invoiceForm.total_amount), status: invoiceForm.status });
      setInvoiceForm(invoiceInitial);
      setModalMode(null);
      await fetchData();
    } catch (error) { console.error("Error creating invoice:", error); alert("Failed to create invoice."); }
    finally { setSaving(false); }
  };

  const handleRecordPayment = async () => {
    if (!schoolId || !paymentForm.invoice_id || !paymentForm.amount_paid || !paymentForm.payment_mode) return alert("Please fill all required fields.");
    setSaving(true);
    try {
      await recordFeePayment({ school_id: schoolId, invoice_id: paymentForm.invoice_id, amount_paid: Number(paymentForm.amount_paid), payment_mode: paymentForm.payment_mode, transaction_id: paymentForm.transaction_id.trim() || null, payment_date: new Date().toISOString().slice(0, 10) });
      await updateStudentInvoice(paymentForm.invoice_id, { status: "completed" });
      setPaymentForm(paymentInitial);
      setModalMode(null);
      await fetchData();
    } catch (error) { console.error("Error recording payment:", error); alert("Failed to record payment."); }
    finally { setSaving(false); }
  };

  const handleDeleteStructure = async () => {
    if (!selectedStructure) return;
    setSaving(true);
    try {
      await deleteFeeStructure(selectedStructure.id);
      setSelectedStructure(null);
      setModalMode(null);
      await fetchData();
    } catch (error) { console.error("Error deleting fee structure:", error); alert("Failed to delete fee structure."); }
    finally { setSaving(false); }
  };

  const action = canManage ? <div className="flex flex-wrap gap-2"><button onClick={fetchData} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button><button onClick={() => setModalMode("type")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Fee Type</button><button onClick={() => setModalMode("structure")} className="inline-flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#931f38]"><Plus size={16} /> Structure</button><button onClick={() => setModalMode("invoice")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Invoice</button><button onClick={() => setModalMode("payment")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Payment</button></div> : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Management" description="Manage fee types, class fee structures, invoices, and payments" action={action} />
      <div className="flex w-fit gap-2 rounded-lg bg-slate-100 p-1">{(["types", "structures", "invoices"] as Tab[]).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${activeTab === tab ? "bg-white text-[#7b1d2f] shadow-sm" : "text-slate-600"}`}>{tab}</button>)}</div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {activeTab === "types" && <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Description</th></tr></thead><tbody>{loading ? <tr><td colSpan={2} className="px-4 py-10 text-center text-slate-500">Loading...</td></tr> : feeTypes.map((type) => <tr key={type.id} className="border-t"><td className="px-4 py-3 font-medium">{type.name}</td><td className="px-4 py-3 text-slate-600">{type.description || "-"}</td></tr>)}</tbody></table>}
        {activeTab === "structures" && <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Session</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Loading...</td></tr> : structures.map((item) => <tr key={item.id} className="border-t"><td className="px-4 py-3 font-medium">{item.fee_types?.name}</td><td className="px-4 py-3">{item.classes?.name}</td><td className="px-4 py-3">{item.sessions?.session_name}</td><td className="px-4 py-3">₹{item.amount.toLocaleString()} <span className="text-xs text-slate-500">{item.frequency}</span></td><td className="px-4 py-3 text-right"><button onClick={() => { setSelectedStructure(item); setModalMode("delete-structure"); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></td></tr>)}</tbody></table>}
        {activeTab === "invoices" && <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Month</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Loading...</td></tr> : invoices.map((invoice) => <tr key={invoice.id} className="border-t"><td className="px-4 py-3 font-medium">{invoice.students?.first_name} {invoice.students?.last_name ?? ""}<div className="text-xs text-slate-500">{invoice.students?.admission_number}</div></td><td className="px-4 py-3">{invoice.invoice_month}</td><td className="px-4 py-3">{invoice.due_date}</td><td className="px-4 py-3">₹{invoice.total_amount.toLocaleString()}</td><td className="px-4 py-3"><StatusBadge status={invoice.status ?? "pending"} /></td></tr>)}</tbody></table>}
      </div>

      <Modal isOpen={modalMode === "type"} onClose={() => setModalMode(null)} title="Create Fee Type"><div className="space-y-4 p-6"><FormField label="Name" required><Input value={typeForm.name} onChange={(e) => setTypeForm((p) => ({ ...p, name: e.target.value }))} /></FormField><FormField label="Description"><Textarea value={typeForm.description} onChange={(e) => setTypeForm((p) => ({ ...p, description: e.target.value }))} /></FormField></div><ModalActions onSubmit={handleCreateType} onCancel={() => setModalMode(null)} loading={saving} /></Modal>
      <Modal isOpen={modalMode === "structure"} onClose={() => setModalMode(null)} title="Create Fee Structure"><div className="space-y-4 p-6"><FormField label="Fee Type" required><Select value={structureForm.fee_type_id} onChange={(e) => setStructureForm((p) => ({ ...p, fee_type_id: e.target.value }))} options={feeTypes.map((type) => ({ value: type.id, label: type.name }))} /></FormField><FormField label="Class" required><Select value={structureForm.class_id} onChange={(e) => setStructureForm((p) => ({ ...p, class_id: e.target.value }))} options={classes.map((item) => ({ value: item.id, label: item.name }))} /></FormField><FormField label="Session" required><Select value={structureForm.session_id} onChange={(e) => setStructureForm((p) => ({ ...p, session_id: e.target.value }))} options={sessions.map((item) => ({ value: item.id, label: item.session_name }))} /></FormField><FormField label="Amount" required><Input type="number" value={structureForm.amount} onChange={(e) => setStructureForm((p) => ({ ...p, amount: e.target.value }))} /></FormField><FormField label="Frequency"><Input value={structureForm.frequency} onChange={(e) => setStructureForm((p) => ({ ...p, frequency: e.target.value }))} /></FormField></div><ModalActions onSubmit={handleCreateStructure} onCancel={() => setModalMode(null)} loading={saving} /></Modal>
      <Modal isOpen={modalMode === "invoice"} onClose={() => setModalMode(null)} title="Create Student Invoice"><div className="space-y-4 p-6"><FormField label="Student" required><Select value={invoiceForm.student_id} onChange={(e) => setInvoiceForm((p) => ({ ...p, student_id: e.target.value }))} options={students.map((student) => ({ value: student.id, label: `${student.first_name} ${student.last_name ?? ""} (${student.admission_number})` }))} /></FormField><FormField label="Session" required><Select value={invoiceForm.session_id} onChange={(e) => setInvoiceForm((p) => ({ ...p, session_id: e.target.value }))} options={sessions.map((item) => ({ value: item.id, label: item.session_name }))} /></FormField><FormField label="Invoice Month" required><Input type="month" value={invoiceForm.invoice_month} onChange={(e) => setInvoiceForm((p) => ({ ...p, invoice_month: e.target.value }))} /></FormField><FormField label="Due Date" required><Input type="date" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm((p) => ({ ...p, due_date: e.target.value }))} /></FormField><FormField label="Amount" required><Input type="number" value={invoiceForm.total_amount} onChange={(e) => setInvoiceForm((p) => ({ ...p, total_amount: e.target.value }))} /></FormField></div><ModalActions onSubmit={handleCreateInvoice} onCancel={() => setModalMode(null)} loading={saving} /></Modal>
      <Modal isOpen={modalMode === "payment"} onClose={() => setModalMode(null)} title="Record Payment"><div className="space-y-4 p-6"><FormField label="Invoice" required><Select value={paymentForm.invoice_id} onChange={(e) => setPaymentForm((p) => ({ ...p, invoice_id: e.target.value }))} options={invoices.map((invoice) => ({ value: invoice.id, label: `${invoice.students?.first_name ?? "Student"} - ${invoice.invoice_month} - ₹${invoice.total_amount}` }))} /></FormField><FormField label="Amount Paid" required><Input type="number" value={paymentForm.amount_paid} onChange={(e) => setPaymentForm((p) => ({ ...p, amount_paid: e.target.value }))} /></FormField><FormField label="Payment Mode" required><Input value={paymentForm.payment_mode} onChange={(e) => setPaymentForm((p) => ({ ...p, payment_mode: e.target.value }))} /></FormField><FormField label="Transaction ID"><Input value={paymentForm.transaction_id} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_id: e.target.value }))} /></FormField></div><ModalActions onSubmit={handleRecordPayment} onCancel={() => setModalMode(null)} loading={saving} /></Modal>
      <Modal isOpen={modalMode === "delete-structure"} onClose={() => setModalMode(null)} title="Delete Fee Structure"><div className="p-6 text-sm text-slate-600">Delete this fee structure?</div><ModalActions onSubmit={handleDeleteStructure} onCancel={() => setModalMode(null)} submitLabel="Delete" loading={saving} /></Modal>
    </div>
  );
}
