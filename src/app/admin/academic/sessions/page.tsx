"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard as Edit, Trash2, RefreshCw, CircleCheck as CheckCircle } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/admin";
import Modal, { FormField, Input, ModalActions } from "@/components/ui/Modal";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  setCurrentSession,
  type SessionWithDetails,
} from "@/services/academicService";

// Session Form State
interface SessionFormData {
  session_name: string;
  start_date: string;
  end_date: string;
}

const initialFormData: SessionFormData = {
  session_name: "",
  start_date: "",
  end_date: "",
};

export default function SessionsPage() {
  const { authUser, hasRole } = useAuth();
  const schoolId = authUser?.school_id;

  // State
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionWithDetails | null>(null);
  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    if (!schoolId) return;

    setLoading(true);
    try {
      const data = await getSessions({ school_id: schoolId });
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Form handlers
  const handleInputChange = (field: keyof SessionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SessionFormData, string>> = {};
    if (!formData.session_name.trim()) errors.session_name = "Session name is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      errors.end_date = "End date must be after start date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create session
  const handleCreate = async () => {
    if (!validateForm() || !schoolId) return;

    setSaving(true);
    try {
      await createSession({
        session_name: formData.session_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        school_id: schoolId,
        is_active: true,
        is_current: false,
      });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
      fetchSessions();
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Update session
  const handleUpdate = async () => {
    if (!selectedSession || !validateForm()) return;

    setSaving(true);
    try {
      await updateSession(selectedSession.id, {
        session_name: formData.session_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
      });
      setIsEditModalOpen(false);
      setSelectedSession(null);
      setFormData(initialFormData);
      fetchSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update session. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete session
  const handleDelete = async () => {
    if (!selectedSession) return;

    setSaving(true);
    try {
      await deleteSession(selectedSession.id);
      setIsDeleteModalOpen(false);
      setSelectedSession(null);
      fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Set as current session
  const handleSetCurrent = async (session: SessionWithDetails) => {
    if (!schoolId) return;

    try {
      await setCurrentSession(session.id, schoolId);
      fetchSessions();
    } catch (error) {
      console.error("Error setting current session:", error);
      alert("Failed to set current session. Please try again.");
    }
  };

  // Open edit modal
  const openEditModal = (session: SessionWithDetails) => {
    setSelectedSession(session);
    setFormData({
      session_name: session.session_name,
      start_date: session.start_date.split("T")[0],
      end_date: session.end_date.split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  // Get status
  const getStatus = (session: SessionWithDetails): "active" | "completed" | "upcoming" => {
    if (session.is_current) return "active";
    const now = new Date();
    const end = new Date(session.end_date);
    if (end < now) return "completed";
    return "upcoming";
  };

  // Filter by search
  const filteredSessions = sessions.filter((s) =>
    s.session_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check permissions
  const canCreate = hasRole("superadmin") || hasRole("schooladmin");
  const canEdit = hasRole("superadmin") || hasRole("schooladmin");
  const canDelete = hasRole("superadmin") || hasRole("schooladmin");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Academic Sessions"
        description="Manage academic sessions and years"
        action={
          canCreate && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#7b1d2f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#931f38] transition-colors"
            >
              <Plus size={18} />
              Add Session
            </button>
          )
        }
      />

      {/* Search & Refresh */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2f]"
          />
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#7b1d2f] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Loading sessions...</span>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-slate-500">No sessions found</p>
            {canCreate && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-2 text-sm text-[#7b1d2f] hover:underline"
              >
                Create your first session
              </button>
            )}
          </div>
        ) : (
          filteredSessions.map((session) => {
            const status = getStatus(session);
            return (
              <div
                key={session.id}
                className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
                  session.is_current
                    ? "border-[#7b1d2f] ring-2 ring-[#7b1d2f]/10"
                    : "border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{session.session_name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(session.start_date).toLocaleDateString()} -{" "}
                      {new Date(session.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={status} />
                </div>

                {/* Current Session Badge */}
                {session.is_current && (
                  <div className="flex items-center gap-1 text-xs text-[#7b1d2f] bg-[#7b1d2f]/5 px-2 py-1 rounded-full mb-4">
                    <CheckCircle size={12} />
                    Current Session
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  {!session.is_current && canEdit && (
                    <button
                      onClick={() => handleSetCurrent(session)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Set as Current
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => openEditModal(session)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {canDelete && !session.is_current && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
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
        title="Add New Session"
        description="Create a new academic session"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <FormField label="Session Name" required error={formErrors.session_name}>
            <Input
              value={formData.session_name}
              onChange={(e) => handleInputChange("session_name", e.target.value)}
              placeholder="e.g., 2024-25"
            />
          </FormField>
          <FormField label="Start Date" required error={formErrors.start_date}>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
            />
          </FormField>
          <FormField label="End Date" required error={formErrors.end_date}>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
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
          submitLabel="Add Session"
          loading={saving}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSession(null);
          setFormData(initialFormData);
          setFormErrors({});
        }}
        title="Edit Session"
        description="Update session information"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <FormField label="Session Name" required error={formErrors.session_name}>
            <Input
              value={formData.session_name}
              onChange={(e) => handleInputChange("session_name", e.target.value)}
            />
          </FormField>
          <FormField label="Start Date" required error={formErrors.start_date}>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
            />
          </FormField>
          <FormField label="End Date" required error={formErrors.end_date}>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
            />
          </FormField>
        </div>
        <ModalActions
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedSession(null);
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
          setSelectedSession(null);
        }}
        title="Delete Session"
        description="This action cannot be undone"
        size="sm"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold">{selectedSession?.session_name}</span>?
            This will remove all associated data.
          </p>
        </div>
        <ModalActions
          onSubmit={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedSession(null);
          }}
          submitLabel="Delete"
          loading={saving}
        />
      </Modal>
    </div>
  );
}
