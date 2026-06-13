"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin";
import Modal, { FormField, Input, ModalActions, Select } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import { getSessions, type SessionWithDetails } from "@/services/academicService";
import { createExam, createExamType, deleteExam, getExamTypes, getExams, updateExam, type ExamType, type ExamWithDetails } from "@/services/schoolAdminService";

interface ExamFormData { exam_type_id: string; session_id: string; start_date: string; end_date: string }
const initialFormData: ExamFormData = { exam_type_id: "", session_id: "", start_date: "", end_date: "" };

export default function ExamsPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;
  const canManage = hasRole("superadmin") || hasRole("schooladmin");

  const [exams, setExams] = useState<ExamWithDetails[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamWithDetails | null>(null);
  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [newExamTypeName, setNewExamTypeName] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "type" | null>(null);

  const fetchData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [examData, typeData, sessionData] = await Promise.all([
        getExams(schoolId),
        getExamTypes(schoolId),
        getSessions({ school_id: schoolId }),
      ]);
      setExams(examData);
      setExamTypes(typeData);
      setSessions(sessionData);
    } catch (error) {
      console.error("Error loading exams:", error);
      alert("Failed to load exams.");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const openCreate = () => { setSelectedExam(null); setFormData(initialFormData); setModalMode("create"); };
  const openEdit = (exam: ExamWithDetails) => {
    setSelectedExam(exam);
    setFormData({
      exam_type_id: exam.exam_type_id,
      session_id: exam.session_id,
      start_date: exam.start_date ?? "",
      end_date: exam.end_date ?? "",
    });
    setModalMode("edit");
  };

  const validate = () => formData.exam_type_id && formData.session_id;

  const handleSave = async () => {
    if (!schoolId || !validate()) return alert("Exam type and session are required.");
    setSaving(true);
    try {
      const payload = {
        school_id: schoolId,
        exam_type_id: formData.exam_type_id,
        session_id: formData.session_id,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };
      if (modalMode === "create") await createExam(payload);
      if (modalMode === "edit" && selectedExam) await updateExam(selectedExam.id, payload);
      setModalMode(null);
      await fetchData();
    } catch (error) {
      console.error("Error saving exam:", error);
      alert("Failed to save exam.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selectedExam) return;
    setSaving(true);
    try {
      await deleteExam(selectedExam.id);
      setModalMode(null);
      setSelectedExam(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam.");
    } finally { setSaving(false); }
  };

  const handleCreateType = async () => {
    if (!schoolId || !newExamTypeName.trim()) return;
    setSaving(true);
    try {
      await createExamType(newExamTypeName.trim(), schoolId);
      setNewExamTypeName("");
      setModalMode(null);
      await fetchData();
    } catch (error) {
      console.error("Error creating exam type:", error);
      alert("Failed to create exam type.");
    } finally { setSaving(false); }
  };

  const filteredExams = exams.filter((exam) =>
    [exam.exam_types?.name, exam.sessions?.session_name, exam.start_date, exam.end_date].some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Create exam types and schedule exams by academic session" action={canManage && <div className="flex gap-2"><button onClick={() => setModalMode("type")} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Add Type</button><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#931f38]"><Plus size={16} /> Create Exam</button></div>} />

      <div className="flex gap-3"><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search exams..." className="h-10 flex-1 rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]" /><button onClick={fetchData} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm hover:bg-slate-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr><th className="px-4 py-3">Exam</th><th className="px-4 py-3">Session</th><th className="px-4 py-3">Dates</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">Loading exams...</td></tr> : filteredExams.length === 0 ? <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No exams found.</td></tr> : filteredExams.map((exam) => <tr key={exam.id} className="border-t border-slate-100"><td className="px-4 py-3 font-medium text-slate-900">{exam.exam_types?.name ?? "Untitled exam"}</td><td className="px-4 py-3 text-slate-600">{exam.sessions?.session_name ?? "No session"}</td><td className="px-4 py-3 text-slate-600">{exam.start_date || "Not set"} - {exam.end_date || "Not set"}</td><td className="px-4 py-3"><div className="flex justify-end gap-2">{canManage && <button onClick={() => openEdit(exam)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"><Pencil size={16} /></button>}{canManage && <button onClick={() => { setSelectedExam(exam); setModalMode("delete"); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>}</div></td></tr>)}
        </tbody></table>
      </div>

      <Modal isOpen={modalMode === "create" || modalMode === "edit"} onClose={() => setModalMode(null)} title={modalMode === "create" ? "Create Exam" : "Edit Exam"} size="md">
        <div className="space-y-4 p-6"><FormField label="Exam Type" required><Select value={formData.exam_type_id} onChange={(event) => setFormData((prev) => ({ ...prev, exam_type_id: event.target.value }))} options={examTypes.map((type) => ({ value: type.id, label: type.name }))} /></FormField><FormField label="Session" required><Select value={formData.session_id} onChange={(event) => setFormData((prev) => ({ ...prev, session_id: event.target.value }))} options={sessions.map((session) => ({ value: session.id, label: session.session_name }))} /></FormField><FormField label="Start Date"><Input type="date" value={formData.start_date} onChange={(event) => setFormData((prev) => ({ ...prev, start_date: event.target.value }))} /></FormField><FormField label="End Date"><Input type="date" value={formData.end_date} onChange={(event) => setFormData((prev) => ({ ...prev, end_date: event.target.value }))} /></FormField></div>
        <ModalActions onSubmit={handleSave} onCancel={() => setModalMode(null)} submitLabel="Save Exam" loading={saving} />
      </Modal>

      <Modal isOpen={modalMode === "type"} onClose={() => setModalMode(null)} title="Add Exam Type" size="sm"><div className="p-6"><FormField label="Type Name" required><Input value={newExamTypeName} onChange={(event) => setNewExamTypeName(event.target.value)} placeholder="Mid Term" /></FormField></div><ModalActions onSubmit={handleCreateType} onCancel={() => setModalMode(null)} submitLabel="Add Type" loading={saving} /></Modal>
      <Modal isOpen={modalMode === "delete"} onClose={() => setModalMode(null)} title="Delete Exam" size="sm"><div className="p-6 text-sm text-slate-600">Delete this exam schedule?</div><ModalActions onSubmit={handleDelete} onCancel={() => setModalMode(null)} submitLabel="Delete" loading={saving} /></Modal>
    </div>
  );
}
