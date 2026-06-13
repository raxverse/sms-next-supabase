"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard as Edit, Trash2, Eye, RefreshCw, UserCheck, UserX } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, Select, ModalActions } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  getStaff,
  createStaff,
  updateStaff,
  deactivateStaff,
  activateStaff,
  deleteStaff,
  getRoles,
  type StaffMember,
} from "@/services/staffService";

// Staff Form State
interface StaffFormData {
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
}

const initialFormData: StaffFormData = {
  first_name: "",
  last_name: "",
  email: "",
  role_id: "",
};

export default function StaffPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;

  // State
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Dropdown options
  const [roles, setRoles] = useState<Array<{ value: string; label: string }>>([]);

  // Fetch staff
  const fetchStaff = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const filters: any = { school_id: schoolId };
      if (statusFilter !== "all") {
        filters.is_active = statusFilter === "active";
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }
      const data = await getStaff(filters);
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  }, [schoolId, statusFilter, searchTerm]);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const rolesData = await getRoles();
      setRoles(
        rolesData.map((role) => ({
          value: role.id.toString(),
          label: role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1),
        }))
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, [fetchStaff, fetchRoles]);

  // Form handlers
  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof StaffFormData, string>> = {};

    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Enter a valid email address";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create staff
  const handleCreate = async () => {
    if (!validateForm() || !schoolId) return;

    setSaving(true);
    try {
      await createStaff({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name || undefined,
        school_id: schoolId,
        role_id: formData.role_id ? parseInt(formData.role_id) : undefined,
        is_active: true,
      });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
      fetchStaff();
    } catch (error) {
      console.error("Error creating staff:", error);
      alert("Failed to create staff member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Update staff
  const handleUpdate = async () => {
    if (!selectedStaff || !validateForm()) return;

    setSaving(true);
    try {
      await updateStaff(selectedStaff.id, {
        first_name: formData.first_name,
        last_name: formData.last_name || null,
        email: formData.email,
        role_id: formData.role_id ? parseInt(formData.role_id) : null,
      });
      setIsEditModalOpen(false);
      setSelectedStaff(null);
      setFormData(initialFormData);
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to update staff member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle staff status
  const handleToggleStatus = async (staffMember: StaffMember) => {
    try {
      if (staffMember.is_active) {
        await deactivateStaff(staffMember.id);
      } else {
        await activateStaff(staffMember.id);
      }
      fetchStaff();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Delete staff
  const handleDelete = async () => {
    if (!selectedStaff) return;

    setSaving(true);
    try {
      await deleteStaff(selectedStaff.id);
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal
  const openEditModal = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      first_name: staffMember.first_name,
      last_name: staffMember.last_name || "",
      email: staffMember.email,
      role_id: staffMember.role_id?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  // Get staff display name
  const getStaffName = (staffMember: StaffMember) => {
    return `${staffMember.first_name} ${staffMember.last_name || ""}`.trim();
  };

  // Check permissions
  const canCreate = hasRole("superadmin") || hasRole("schooladmin");
  const canEdit = hasRole("superadmin") || hasRole("schooladmin");
  const canDelete = hasRole("superadmin");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Staff"
        description="Manage staff members and teachers"
        action={
          canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#931f38] transition-colors"
            >
              <Plus size={18} />
              Add Staff
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
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
          onClick={fetchStaff}
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
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#7b1d2f] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-slate-500">Loading staff...</span>
                    </div>
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">No staff members found</p>
                    {canCreate && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-2 text-sm text-[#7b1d2f] hover:underline"
                      >
                        Add your first staff member
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white font-semibold text-sm">
                          {getStaffName(member).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{getStaffName(member)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {member.role_name || "No Role"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={member.is_active ? "active" : "inactive"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedStaff(member);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                            title={member.is_active ? "Deactivate" : "Activate"}
                          >
                            {member.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              setSelectedStaff(member);
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
        {!loading && staff.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">Showing {staff.length} staff member(s)</p>
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
        title="Add New Staff Member"
        description="Enter staff details to create a new record"
        size="md"
      >
        <div className="p-6 space-y-4">
          <FormField label="First Name" required error={formErrors.first_name}>
            <Input
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Enter first name"
            />
          </FormField>
          <FormField label="Last Name">
            <Input
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Enter last name"
            />
          </FormField>
          <FormField label="Email" required error={formErrors.email}>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </FormField>
          <FormField label="Role">
            <Select
              value={formData.role_id}
              onChange={(e) => handleInputChange("role_id", e.target.value)}
              options={roles}
              placeholder="Select role"
            />
          </FormField>
        </div>
        <ModalActions
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setFormData(initialFormData);
            setFormErrors({});
          }}
          submitLabel="Add Staff"
          loading={saving}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
          setFormData(initialFormData);
          setFormErrors({});
        }}
        title="Edit Staff Member"
        description="Update staff information"
        size="md"
      >
        <div className="p-6 space-y-4">
          <FormField label="First Name" required error={formErrors.first_name}>
            <Input
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
            />
          </FormField>
          <FormField label="Last Name">
            <Input
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
            />
          </FormField>
          <FormField label="Email" required error={formErrors.email}>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </FormField>
          <FormField label="Role">
            <Select
              value={formData.role_id}
              onChange={(e) => handleInputChange("role_id", e.target.value)}
              options={roles}
              placeholder="Select role"
            />
          </FormField>
        </div>
        <ModalActions
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedStaff(null);
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
          setSelectedStaff(null);
        }}
        title="Delete Staff Member"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold">{selectedStaff && getStaffName(selectedStaff)}</span>?
            This will remove the staff record permanently.
          </p>
        </div>
        <ModalActions
          onSubmit={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedStaff(null);
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
          setSelectedStaff(null);
        }}
        title="Staff Details"
        size="md"
      >
        {selectedStaff && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#7b1d2f] to-[#931f38] text-white font-bold text-xl">
                {getStaffName(selectedStaff).charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{getStaffName(selectedStaff)}</h3>
                <p className="text-sm text-slate-500">{selectedStaff.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Role</p>
                <p className="font-medium text-slate-900">{selectedStaff.role_name || "No Role"}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <StatusBadge status={selectedStaff.is_active ? "active" : "inactive"} />
              </div>
              <div>
                <p className="text-slate-500">School</p>
                <p className="font-medium text-slate-900">{selectedStaff.school_name || "No School"}</p>
              </div>
              <div>
                <p className="text-slate-500">Created At</p>
                <p className="font-medium text-slate-900">
                  {selectedStaff.created_at ? new Date(selectedStaff.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </div>
        )}
        <ModalActions
          onCancel={() => {
            setIsViewModalOpen(false);
            setSelectedStaff(null);
          }}
          cancelLabel="Close"
        />
      </Modal>
    </div>
  );
}
