"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard as Edit, Trash2, Eye, RefreshCw } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, ModalActions } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  getClasses,
  getSections,
  createClass,
  updateClass,
  deleteClass,
  createSection,
  type ClassWithDetails,
  type SectionWithDetails,
} from "@/services/academicService";

// Class Form State
interface ClassFormData {
  name: string;
  level: string;
}

const initialFormData: ClassFormData = {
  name: "",
  level: "",
};

// Section Form State
interface SectionFormData {
  name: string;
}

const initialSectionFormData: SectionFormData = {
  name: "",
};

export default function ClassesPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;

  // State
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [sections, setSections] = useState<SectionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"classes" | "sections">("classes");

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClassWithDetails | null>(null);
  const [formData, setFormData] = useState<ClassFormData>(initialFormData);
  const [sectionFormData, setSectionFormData] = useState<SectionFormData>(initialSectionFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const [classesData, sectionsData] = await Promise.all([
        getClasses({ school_id: schoolId }),
        getSections({ school_id: schoolId }),
      ]);
      setClasses(classesData);
      setSections(sectionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Class form handlers
  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateClassForm = (): boolean => {
    const errors: Partial<Record<keyof ClassFormData, string>> = {};
    if (!formData.name.trim()) errors.name = "Class name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create class
  const handleCreateClass = async () => {
    if (!validateClassForm() || !schoolId) return;

    setSaving(true);
    try {
      await createClass({
        name: formData.name,
        level: formData.level ? parseInt(formData.level) : undefined,
        school_id: schoolId,
      });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
      fetchData();
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Update class
  const handleUpdateClass = async () => {
    if (!selectedItem || !validateClassForm()) return;

    setSaving(true);
    try {
      await updateClass(selectedItem.id, {
        name: formData.name,
        level: formData.level ? parseInt(formData.level) : undefined,
      });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setFormData(initialFormData);
      fetchData();
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Failed to update class. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete class
  const handleDeleteClass = async () => {
    if (!selectedItem) return;

    setSaving(true);
    try {
      await deleteClass(selectedItem.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Create section
  const handleCreateSection = async () => {
    if (!sectionFormData.name.trim() || !schoolId) return;

    setSaving(true);
    try {
      await createSection({
        name: sectionFormData.name,
        school_id: schoolId,
      });
      setIsCreateModalOpen(false);
      setSectionFormData(initialSectionFormData);
      fetchData();
    } catch (error) {
      console.error("Error creating section:", error);
      alert("Failed to create section. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (classItem: ClassWithDetails) => {
    setSelectedItem(classItem);
    setFormData({
      name: classItem.name,
      level: classItem.level?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  // Filter data by search
  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSections = sections.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check permissions
  const canCreate = hasRole("superadmin") || hasRole("schooladmin");
  const canEdit = hasRole("superadmin") || hasRole("schooladmin");
  const canDelete = hasRole("superadmin") || hasRole("schooladmin");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Classes & Sections"
        description="Manage classes and sections for your school"
        action={
          canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#931f38] transition-colors"
            >
              <Plus size={18} />
              Add {activeTab === "classes" ? "Class" : "Section"}
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("classes")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "classes"
              ? "bg-white text-[#7b1d2f] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "sections"
              ? "bg-white text-[#7b1d2f] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sections ({sections.length})
        </button>
      </div>

      {/* Search & Refresh */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
          />
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {activeTab === "classes" ? (
        // Classes Table
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#7b1d2f] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-500">Loading classes...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <p className="text-sm text-slate-500">No classes found</p>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{classItem.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{classItem.level || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(classItem)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => {
                                setSelectedItem(classItem);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Sections Grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#7b1d2f] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-500">Loading sections...</span>
              </div>
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-sm text-slate-500">No sections found</p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow text-center"
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white font-bold">
                  {section.name}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData(initialFormData);
          setSectionFormData(initialSectionFormData);
          setFormErrors({});
        }}
        title={`Add New ${activeTab === "classes" ? "Class" : "Section"}`}
        description={`Enter ${activeTab === "classes" ? "class" : "section"} details`}
        size="sm"
      >
        {activeTab === "classes" ? (
          <>
            <div className="p-6 space-y-4">
              <FormField label="Class Name" required error={formErrors.name}>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Class X, IX, XII"
                />
              </FormField>
              <FormField label="Level (Optional)" hint="Used for sorting (e.g., 10 for Class X)">
                <Input
                  type="number"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  placeholder="e.g., 10"
                  min="1"
                />
              </FormField>
            </div>
            <ModalActions
              onSubmit={handleCreateClass}
              onCancel={() => {
                setIsCreateModalOpen(false);
                setFormData(initialFormData);
              }}
              submitLabel="Add Class"
              loading={saving}
            />
          </>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <FormField label="Section Name" required>
                <Input
                  value={sectionFormData.name}
                  onChange={(e) => setSectionFormData({ name: e.target.value })}
                  placeholder="e.g., A, B, C"
                  maxLength={2}
                />
              </FormField>
            </div>
            <ModalActions
              onSubmit={handleCreateSection}
              onCancel={() => {
                setIsCreateModalOpen(false);
                setSectionFormData(initialSectionFormData);
              }}
              submitLabel="Add Section"
              loading={saving}
            />
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
          setFormData(initialFormData);
          setFormErrors({});
        }}
        title="Edit Class"
        description="Update class information"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <FormField label="Class Name" required error={formErrors.name}>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </FormField>
          <FormField label="Level (Optional)">
            <Input
              type="number"
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              min="1"
            />
          </FormField>
        </div>
        <ModalActions
          onSubmit={handleUpdateClass}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
            setFormData(initialFormData);
          }}
          submitLabel="Save Changes"
          loading={saving}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        title="Delete Class"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold">{selectedItem?.name}</span>?
            This will affect all students enrolled in this class.
          </p>
        </div>
        <ModalActions
          onSubmit={handleDeleteClass}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          submitLabel="Delete"
          loading={saving}
        />
      </Modal>
    </div>
  );
}
