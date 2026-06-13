"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, ModalActions, Textarea } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import { createSchool, deleteSchool, getSchools, updateSchool, type School } from "@/services/schoolAdminService";

interface SchoolFormData {
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  is_active: boolean;
}

const initialFormData: SchoolFormData = {
  name: "",
  slug: "",
  address: "",
  phone: "",
  email: "",
  logo_url: "",
  is_active: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function SchoolsPage() {
  const { authUser, hasRole } = useAuth();
  const canManageAllSchools = hasRole("superadmin");
  const canEditSchool = canManageAllSchools || hasRole("schooladmin");
  const schoolScopeId = canManageAllSchools ? undefined : authUser?.school_id ?? undefined;

  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState<SchoolFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SchoolFormData, string>>>({});
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | null>(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      setSchools(await getSchools(schoolScopeId));
    } catch (error) {
      console.error("Error fetching schools:", error);
      alert("Failed to load schools.");
    } finally {
      setLoading(false);
    }
  }, [schoolScopeId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchSchools();
    });
  }, [fetchSchools]);

  const updateField = (field: keyof SchoolFormData, value: string | boolean) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !selectedSchool) next.slug = slugify(String(value));
      return next;
    });
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof SchoolFormData, string>> = {};
    if (!formData.name.trim()) errors.name = "School name is required";
    if (!formData.slug.trim()) errors.slug = "Slug is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreate = () => {
    setSelectedSchool(null);
    setFormData(initialFormData);
    setFormErrors({});
    setModalMode("create");
  };

  const openEdit = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      slug: school.slug,
      address: school.address ?? "",
      phone: school.phone ?? "",
      email: school.email ?? "",
      logo_url: school.logo_url ?? "",
      is_active: school.is_active ?? true,
    });
    setFormErrors({});
    setModalMode("edit");
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        logo_url: formData.logo_url.trim() || null,
        is_active: formData.is_active,
      };
      if (modalMode === "create") await createSchool(payload);
      if (modalMode === "edit" && selectedSchool) await updateSchool(selectedSchool.id, payload);
      setModalMode(null);
      await fetchSchools();
    } catch (error) {
      console.error("Error saving school:", error);
      alert("Failed to save school.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchool) return;
    setSaving(true);
    try {
      await deleteSchool(selectedSchool.id);
      setModalMode(null);
      setSelectedSchool(null);
      await fetchSchools();
    } catch (error) {
      console.error("Error deleting school:", error);
      alert("Failed to delete school. If it has related data, deactivate it instead.");
    } finally {
      setSaving(false);
    }
  };

  const filteredSchools = schools.filter((school) =>
    [school.name, school.slug, school.email, school.phone].some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description={canManageAllSchools ? "Create and manage tenant schools" : "Manage your school profile"}
        action={
          <div className="flex gap-2">
            <button onClick={fetchSchools} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            {canManageAllSchools && (
              <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#931f38]">
                <Plus size={16} /> Add School
              </button>
            )}
          </div>
        }
      />

      <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search schools..." className="h-10 w-full rounded-lg border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">Loading schools...</td></tr>
            ) : filteredSchools.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No schools found.</td></tr>
            ) : filteredSchools.map((school) => (
              <tr key={school.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{school.name}</div>
                  <div className="text-xs text-slate-500">/{school.slug}</div>
                  <div className="mt-1 max-w-md text-xs text-slate-500">{school.address || "No address"}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div>{school.email || "No email"}</div>
                  <div className="text-xs">{school.phone || "No phone"}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={school.is_active === false ? "inactive" : "active"} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canEditSchool && <button onClick={() => openEdit(school)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"><Pencil size={16} /></button>}
                    {canManageAllSchools && <button onClick={() => { setSelectedSchool(school); setModalMode("delete"); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalMode === "create" || modalMode === "edit"} onClose={() => setModalMode(null)} title={modalMode === "create" ? "Add School" : "Edit School"} size="lg">
        <div className="space-y-4 p-6">
          <FormField label="School Name" required error={formErrors.name}><Input value={formData.name} onChange={(event) => updateField("name", event.target.value)} /></FormField>
          <FormField label="Slug" required error={formErrors.slug}><Input value={formData.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} /></FormField>
          <FormField label="Email"><Input type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} /></FormField>
          <FormField label="Phone"><Input value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} /></FormField>
          <FormField label="Logo URL"><Input value={formData.logo_url} onChange={(event) => updateField("logo_url", event.target.value)} /></FormField>
          <FormField label="Address"><Textarea value={formData.address} onChange={(event) => updateField("address", event.target.value)} /></FormField>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={formData.is_active} onChange={(event) => updateField("is_active", event.target.checked)} /> Active school</label>
        </div>
        <ModalActions onSubmit={handleSave} onCancel={() => setModalMode(null)} submitLabel="Save School" loading={saving} />
      </Modal>

      <Modal isOpen={modalMode === "delete"} onClose={() => setModalMode(null)} title="Delete School" description="This removes the tenant school record." size="sm">
        <div className="p-6 text-sm text-slate-600">Delete <span className="font-semibold">{selectedSchool?.name}</span>?</div>
        <ModalActions onSubmit={handleDelete} onCancel={() => setModalMode(null)} submitLabel="Delete" loading={saving} />
      </Modal>
    </div>
  );
}
