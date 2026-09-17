import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Briefcase, Plus, Upload } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import SearchInput from "@/components/common/SearchInput.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import Button from "@/components/common/Button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import ActionButtons from "@/components/common/ActionButtons.jsx";
import Modal from "@/components/common/Modal.jsx";
import RoleForm from "@/components/master-data/RoleForm.jsx";
import BulkUploadModal from "@/components/master-data/BulkUploadModal.jsx";
import { showConfirmDialog } from "@/components/common/ConfirmDialog.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";

export default function RoleMaster() {
  const { roles, assignmentTypesList, addRole, updateRole, deleteRole, bulkUploadRoles } = useMasterData();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, mode: "add", record: null });
  const [form, setForm] = useState({ type: "", name: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roles.filter((r) => {
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [roles, search, typeFilter]);

  const openAdd = () => {
    setForm({ type: "", name: "" });
    setError("");
    setModal({ open: true, mode: "add", record: null });
  };
  const openEdit = (r) => {
    setForm({ type: r.type, name: r.name });
    setError("");
    setModal({ open: true, mode: "edit", record: r });
  };
  const openView = (r) => {
    setForm({ type: r.type, name: r.name });
    setError("");
    setModal({ open: true, mode: "view", record: r });
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res =
        modal.mode === "add"
          ? await addRole(form.type, form.name)
          : await updateRole(modal.record.id || modal.record.roleId, form.type, form.name);

      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success(
        modal.mode === "add" ? "Role added successfully." : "Role updated successfully.",
      );
      setModal({ open: false, mode: "add", record: null });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    const confirmed = await showConfirmDialog({
      title: "Delete Role?",
      text: `"${r.name}" will be removed from ${r.type}.`,
      confirmButtonText: "Delete",
    });
    if (confirmed) {
      const res = await deleteRole(r.id || r.roleId);
      if (res.ok) {
        toast.success("Role deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete role.");
      }
    }
  };

  const handleConfirmUpload = async (file, items) => {
    const res = await bulkUploadRoles(items);
    if (res.ok) {
      const msg = res.data?.message || "Bulk upload completed successfully.";
      toast.success(msg);
    } else {
      toast.error(res.error || "Bulk upload failed.");
    }
    setBulkOpen(false);
  };

  const columns = [
    {
      key: "type",
      label: "Assignment Type",
      className: "font-medium text-slate-600 whitespace-nowrap",
    },
    {
      key: "name",
      label: "Role Name",
      className: "font-semibold text-slate-900",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      className: "whitespace-nowrap",
      render: (r) => (
        <ActionButtons
          onView={() => openView(r)}
          onEdit={() => openEdit(r)}
          onDelete={() => handleDelete(r)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Page Header */}
      <PageHeader
        icon={Briefcase}
        title="Role Master"
        description="Manage reusable job roles assigned across different Assignment Types."
      />

      {/* Filter / Action Toolbar */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="md:col-span-4 lg:col-span-4">
            <SearchInput
              label="Search Role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role name..."
            />
          </div>
          <div className="md:col-span-3 lg:col-span-3">
            <SelectField
              label="Assignment Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={["All", ...(assignmentTypesList || [])]}
              placeholder={null}
            />
          </div>
          <div className="md:col-span-5 lg:col-span-5 flex items-end gap-2">
            <Button
              variant="outline"
              icon={Upload}
              onClick={() => setBulkOpen(true)}
              className="flex-1 h-10 justify-center"
            >
              Bulk Upload
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={openAdd}
              className="flex-1 h-10 justify-center"
            >
              Add Role
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          emptyTitle="No roles found."
          emptyDescription="Try adjusting your search query or Assignment Type filter."
        />
      </div>

      {/* Role Form Modal */}
      <Modal
        open={modal.open}
        title={
          modal.mode === "add"
            ? "Add New Role"
            : modal.mode === "edit"
              ? "Edit Role"
              : "Role Details"
        }
        onClose={() => setModal({ open: false, mode: "add", record: null })}
        maxWidth="max-w-md"
      >
        <RoleForm
          mode={modal.mode}
          form={form}
          onChange={setForm}
          error={error}
          onSave={handleSave}
          onCancel={() => setModal({ open: false, mode: "add", record: null })}
        />
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={bulkOpen}
        entityType="role"
        onClose={() => setBulkOpen(false)}
        onConfirmUpload={handleConfirmUpload}
      />
    </div>
  );
}

