"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard as Edit, Trash2, Eye, MoveVertical as MoreVertical, RefreshCw } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, Select, ModalActions } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  type StudentWithDetails,
  type CreateStudentData,
  type StudentFilters,
} from "@/services/studentService";
import { getClasses, getSections, getSessions, getSessionClassSections } from "@/services/academicService";

// Student Form State
interface StudentFormData {
  first_name: string;
  last_name: string;
  admission_number: string;
  dob: string;
  gender: string;
  father_name: string;
  mother_name: string;
  primary_phone: string;
  address: string;
  session_class_section_id: string;
  roll_number: string;
}

const initialFormData: StudentFormData = {
  first_name: "",
  last_name: "",
  admission_number: "",
  dob: "",
  gender: "",
  father_name: "",
  mother_name: "",
  primary_phone: "",
  address: "",
  session_class_section_id: "",
  roll_number: "",
};

export default function StudentsPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;

  // State
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithDetails | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Dropdown options
  const [classSections, setClassSections] = useState<any[]>([]);
  const [genders] = useState([
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ]);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const filters: StudentFilters = { school_id: schoolId };
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }
      const data = await getStudents(filters);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  }, [schoolId, statusFilter, searchTerm]);

  // Fetch class sections for dropdown
  const fetchClassSections = useCallback(async () => {
    if (!schoolId) return;

    try {
      const data = await getSessionClassSections({ school_id: schoolId });
      setClassSections(
        data.map((cs) => ({
          value: cs.id,
          label: `${cs.class?.name || "Class"} - ${cs.section?.name || "Section"} (${cs.session?.session_name || "Session"})`,
        }))
      );
    } catch (error) {
      console.error("Error fetching class sections:", error);
    }
  }, [schoolId]);

  // Initial fetch
  useEffect(() => {
    fetchStudents();
    fetchClassSections();
  }, [fetchStudents, fetchClassSections]);

  // Form handlers
  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.admission_number.trim()) errors.admission_number = "Admission number is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.primary_phone.trim()) errors.primary_phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.primary_phone.replace(/\D/g, "")))
      errors.primary_phone = "Enter a valid 10-digit phone number";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create student
  const handleCreate = async () => {
    if (!validateForm() || !schoolId) return;

    setSaving(true);
    try {
      const studentData: CreateStudentData = {
        first_name: formData.first_name,
        last_name: formData.last_name || undefined,
        admission_number: formData.admission_number,
        dob: formData.dob,
        gender: formData.gender || undefined,
        school_id: schoolId,
        father_name: formData.father_name || undefined,
        mother_name: formData.mother_name || undefined,
        primary_phone: formData.primary_phone,
        address: formData.address || undefined,
        session_class_section_id: formData.session_class_section_id || undefined,
        roll_number: formData.roll_number ? parseInt(formData.roll_number) : undefined,
      };

      await createStudent(studentData);
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Update student
  const handleUpdate = async () => {
    if (!selectedStudent || !validateForm()) return;

    setSaving(true);
    try {
      await updateStudent(selectedStudent.id, {
        first_name: formData.first_name,
        last_name: formData.last_name || null,
        gender: formData.gender || null,
      });
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      setFormData(initialFormData);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete student
  const handleDelete = async () => {
    if (!selectedStudent) return;

    setSaving(true);
    try {
      await deleteStudent(selectedStudent.id);
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (student: StudentWithDetails) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name || "",
      admission_number: student.admission_number,
      dob: student.dob,
      gender: student.gender || "",
      father_name: student.guardian?.father_name || "",
      mother_name: student.guardian?.mother_name || "",
      primary_phone: student.guardian?.primary_phone || "",
      address: student.guardian?.address || "",
      session_class_section_id: student.enrollment?.session_class_section_id || "",
      roll_number: student.enrollment?.roll_number?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  // Get student display name
  const getStudentName = (student: StudentWithDetails) => {
    return `${student.first_name} ${student.last_name || ""}`.trim();
  };

  // Get class section info
  const getClassSection = (student: StudentWithDetails) => {
    if (!student.enrollment?.session_class_section) return "-";
    const cs = student.enrollment.session_class_section as any;
    return `${cs.classes?.name || "-"} ${cs.sections?.name || ""}`.trim();
  };

  // Check permissions
  const canCreate = hasRole("superadmin") || hasRole("schooladmin");
  const canEdit = hasRole("superadmin") || hasRole("schooladmin");
  const canDelete = hasRole("superadmin") || hasRole("schooladmin");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Students"
        description="View and manage student records"
        action={
          canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#931f38] transition-colors"
            >
              <Plus size={18} />
              Add Student
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={fetchStudents}
          disabled={loading}
          className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Admission No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Parent Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#7b1d2f] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-slate-500">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">No students found</p>
                    {canCreate && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-2 text-sm text-[#7b1d2f] hover:underline"
                      >
                        Add your first student
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{getStudentName(student)}</p>
                        <p className="text-xs text-slate-500">{student.admission_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.admission_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{getClassSection(student)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.guardian?.primary_phone || "-"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={student.status || "active"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
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

        {/* Table Footer */}
        {!loading && students.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">Showing {students.length} student(s)</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData(initialFormData);
          setFormErrors({});
        }}
        title="Add New Student"
        description="Enter student details to create a new record"
        size="lg"
      >
        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Student Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" required error={formErrors.first_name}>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                />
              </FormField>
              <FormField label="Last Name" error={formErrors.last_name}>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                />
              </FormField>
              <FormField label="Admission Number" required error={formErrors.admission_number}>
                <Input
                  value={formData.admission_number}
                  onChange={(e) => handleInputChange("admission_number", e.target.value)}
                  placeholder="e.g., ADM001"
                />
              </FormField>
              <FormField label="Date of Birth" required error={formErrors.dob}>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </FormField>
              <FormField label="Gender" error={formErrors.gender}>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  options={genders}
                  placeholder="Select gender"
                />
              </FormField>
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Parent/Guardian Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Father's Name" error={formErrors.father_name}>
                <Input
                  value={formData.father_name}
                  onChange={(e) => handleInputChange("father_name", e.target.value)}
                  placeholder="Enter father's name"
                />
              </FormField>
              <FormField label="Mother's Name" error={formErrors.mother_name}>
                <Input
                  value={formData.mother_name}
                  onChange={(e) => handleInputChange("mother_name", e.target.value)}
                  placeholder="Enter mother's name"
                />
              </FormField>
              <FormField label="Phone Number" required error={formErrors.primary_phone}>
                <Input
                  value={formData.primary_phone}
                  onChange={(e) => handleInputChange("primary_phone", e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
              </FormField>
            </div>
          </div>

          {/* Enrollment Information */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Class Assignment (Optional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Class & Section" error={formErrors.session_class_section_id}>
                <Select
                  value={formData.session_class_section_id}
                  onChange={(e) => handleInputChange("session_class_section_id", e.target.value)}
                  options={classSections}
                  placeholder="Select class"
                />
              </FormField>
              <FormField label="Roll Number" error={formErrors.roll_number}>
                <Input
                  type="number"
                  value={formData.roll_number}
                  onChange={(e) => handleInputChange("roll_number", e.target.value)}
                  placeholder="e.g., 1"
                  min="1"
                />
              </FormField>
            </div>
          </div>
        </div>
        <ModalActions
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setFormData(initialFormData);
            setFormErrors({});
          }}
          submitLabel="Add Student"
          loading={saving}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
          setFormData(initialFormData);
          setFormErrors({});
        }}
        title="Edit Student"
        description="Update student information"
        size="md"
      >
        <div className="p-6 space-y-4">
          <FormField label="First Name" required error={formErrors.first_name}>
            <Input
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
            />
          </FormField>
          <FormField label="Last Name" error={formErrors.last_name}>
            <Input
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
            />
          </FormField>
          <FormField label="Gender" error={formErrors.gender}>
            <Select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              options={genders}
              placeholder="Select gender"
            />
          </FormField>
        </div>
        <ModalActions
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedStudent(null);
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
          setSelectedStudent(null);
        }}
        title="Delete Student"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold">{selectedStudent && getStudentName(selectedStudent)}</span>?
            This will remove the student record permanently.
          </p>
        </div>
        <ModalActions
          onSubmit={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedStudent(null);
          }}
          submitLabel="Delete"
          loading={saving}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
        size="lg"
      >
        {selectedStudent && (
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Full Name</p>
                  <p className="font-medium text-slate-900">{getStudentName(selectedStudent)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Admission Number</p>
                  <p className="font-medium text-slate-900">{selectedStudent.admission_number}</p>
                </div>
                <div>
                  <p className="text-slate-500">Date of Birth</p>
                  <p className="font-medium text-slate-900">{new Date(selectedStudent.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Gender</p>
                  <p className="font-medium text-slate-900">{selectedStudent.gender || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Guardian Info */}
            {selectedStudent.guardian && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Parent/Guardian</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Father's Name</p>
                    <p className="font-medium text-slate-900">{selectedStudent.guardian.father_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Mother's Name</p>
                    <p className="font-medium text-slate-900">{selectedStudent.guardian.mother_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Contact Number</p>
                    <p className="font-medium text-slate-900">{selectedStudent.guardian.primary_phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Info */}
            {selectedStudent.enrollment && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Enrollment</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Class</p>
                    <p className="font-medium text-slate-900">{getClassSection(selectedStudent)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Roll Number</p>
                    <p className="font-medium text-slate-900">{selectedStudent.enrollment.roll_number || "-"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <ModalActions
          onCancel={() => {
            setIsViewModalOpen(false);
            setSelectedStudent(null);
          }}
          cancelLabel="Close"
        />
      </Modal>
    </div>
  );
}
