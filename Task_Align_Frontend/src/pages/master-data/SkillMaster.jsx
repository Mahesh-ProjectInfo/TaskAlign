import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Sparkles, Plus, Upload } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import SearchInput from "@/components/common/SearchInput.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import Button from "@/components/common/Button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import ActionButtons from "@/components/common/ActionButtons.jsx";
import Modal from "@/components/common/Modal.jsx";
import SkillForm from "@/components/master-data/SkillForm.jsx";
import BulkUploadModal from "@/components/master-data/BulkUploadModal.jsx";
import { showConfirmDialog } from "@/components/common/ConfirmDialog.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";

export default function SkillMaster() {
  const { skills, assignmentTypesList, addSkill, updateSkill, deleteSkill, bulkUploadSkills } = useMasterData();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, mode: "add", record: null });
  const [form, setForm] = useState({ type: "", name: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      if (typeFilter !== "All" && s.type !== typeFilter) return false;
      if (q && !s.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [skills, search, typeFilter]);

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
          ? await addSkill(form.type, form.name)
          : await updateSkill(modal.record.id || modal.record.skillId, form.type, form.name);

      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success(
        modal.mode === "add" ? "Skill added successfully." : "Skill updated successfully.",
      );
      setModal({ open: false, mode: "add", record: null });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    const confirmed = await showConfirmDialog({
      title: "Delete Skill?",
      text: `"${r.name}" will be removed from ${r.type}.`,
      confirmButtonText: "Delete",
    });
    if (confirmed) {
      const res = await deleteSkill(r.id || r.skillId);
      if (res.ok) {
        toast.success("Skill deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete skill.");
      }
    }
  };

  const handleConfirmUpload = async (file, items) => {
    const res = await bulkUploadSkills(items);
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
      label: "Skill Name",
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
        icon={Sparkles}
        title="Skill Master"
        description="Manage reusable skills required for resource matching and task execution."
      />

      {/* Filter / Action Toolbar */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="md:col-span-4 lg:col-span-4">
            <SearchInput
              label="Search Skill"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name..."
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
              Add Skill
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
          emptyTitle="No skills found."
          emptyDescription="Try adjusting your search query or Assignment Type filter."
        />
      </div>

      {/* Skill Form Modal */}
      <Modal
        open={modal.open}
        title={
          modal.mode === "add"
            ? "Add New Skill"
            : modal.mode === "edit"
              ? "Edit Skill"
              : "Skill Details"
        }
        onClose={() => setModal({ open: false, mode: "add", record: null })}
        maxWidth="max-w-md"
      >
        <SkillForm
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
        entityType="skill"
        onClose={() => setBulkOpen(false)}
        onConfirmUpload={handleConfirmUpload}
      />
    </div>
  );
}

