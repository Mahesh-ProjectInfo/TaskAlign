import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Users, Plus, Upload } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import SearchInput from "@/components/common/SearchInput.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import Button from "@/components/common/Button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import ActionButtons from "@/components/common/ActionButtons.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";
import Modal from "@/components/common/Modal.jsx";
import ResourceForm from "@/components/master-data/ResourceForm.jsx";
import BulkUploadModal from "@/components/master-data/BulkUploadModal.jsx";
import { showConfirmDialog } from "@/components/common/ConfirmDialog.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { isValidResourceName, isValidSalary, isValidRating } from "@/utils/validators.js";

const emptyForm = { type: "", name: "", role: "", salary: "", rating: "", skills: [] };

export default function ResourceManagement() {
  const {
    resources,
    assignmentTypesList,
    rolesByType,
    skillsByType,
    addResource,
    updateResource,
    deleteResource,
    bulkUploadResources,
  } = useMasterData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const [modal, setModal] = useState({ open: false, mode: "add", record: null });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [bulkOpen, setBulkOpen] = useState(false);

  // Reset role filter when type filter changes
  useEffect(() => {
    setRoleFilter("All");
  }, [typeFilter]);

  const availableRolesForFilter = useMemo(() => {
    if (typeFilter === "All") return [];
    return rolesByType(typeFilter).map((r) => r.name);
  }, [typeFilter, rolesByType]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = resources.filter((r) => {
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (roleFilter !== "All" && r.role !== roleFilter) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let av = a[sortKey],
        bv = b[sortKey];
      if (sortKey === "salary" || sortKey === "rating") {
        av = Number(av);
        bv = Number(bv);
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [resources, search, typeFilter, roleFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ open: true, mode: "add", record: null });
  };
  const openEdit = (r) => {
    setForm({
      type: r.type,
      name: r.name,
      role: r.role,
      salary: r.salary,
      rating: r.rating,
      skills: r.skills || [],
    });
    setErrors({});
    setModal({ open: true, mode: "edit", record: r });
  };
  const openView = (r) => {
    setForm({
      type: r.type,
      name: r.name,
      role: r.role,
      salary: r.salary,
      rating: r.rating,
      skills: r.skills || [],
    });
    setErrors({});
    setModal({ open: true, mode: "view", record: r });
  };

  // Roles/skills options for the form dynamically follow selected type
  const formRoles = useMemo(
    () => (form.type ? rolesByType(form.type).map((r) => r.name) : []),
    [form.type, rolesByType],
  );
  const formSkills = useMemo(
    () => (form.type ? skillsByType(form.type).map((s) => s.name) : []),
    [form.type, skillsByType],
  );

  const onTypeChange = (t) => setForm((f) => ({ ...f, type: t, role: "", skills: [] }));

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Assignment Type is required.";
    const nameErr = isValidResourceName(form.name);
    if (nameErr) e.name = nameErr;
    if (!form.role) e.role = "Role is required.";
    const salaryErr = isValidSalary(form.salary);
    if (salaryErr) e.salary = salaryErr;
    const ratingErr = isValidRating(form.rating);
    if (ratingErr) e.rating = ratingErr;
    if (!form.skills || form.skills.length === 0) e.skills = "Select at least one skill.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      type: form.type,
      name: form.name.trim(),
      role: form.role,
      salary: Number(form.salary),
      rating: Number(form.rating),
      skills: form.skills,
    };
    const res =
      modal.mode === "add"
        ? await addResource(payload)
        : await updateResource(modal.record.id || modal.record.resourceId, payload);

    if (!res.ok) {
      setErrors({ name: res.error });
      return;
    }
    toast.success(
      modal.mode === "add" ? "Resource added successfully." : "Resource updated successfully.",
    );
    setModal({ open: false, mode: "add", record: null });
  };

  const handleDelete = async (r) => {
    const confirmed = await showConfirmDialog({
      title: "Delete Resource?",
      text: `"${r.name}" will be removed.`,
      confirmButtonText: "Delete",
    });
    if (confirmed) {
      const res = await deleteResource(r.id || r.resourceId);
      if (res.ok) {
        toast.success("Resource deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete resource.");
      }
    }
  };

  const handleConfirmUpload = async (file) => {
    const res = await bulkUploadResources(file);
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
      label: "Resource Name",
      sortable: true,
      className: "font-semibold text-slate-900 whitespace-nowrap",
    },
    {
      key: "role",
      label: "Role",
      className: "text-slate-700 whitespace-nowrap font-medium",
    },
    {
      key: "salary",
      label: "Monthly Salary",
      sortable: true,
      className: "text-slate-900 font-semibold whitespace-nowrap",
      render: (r) => `₹${Number(r.salary).toLocaleString("en-IN")}`,
    },
    {
      key: "rating",
      label: "Performance Rating",
      sortable: true,
      className: "whitespace-nowrap",
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
          {Number(r.rating).toFixed(2)}
        </span>
      ),
    },
    {
      key: "skills",
      label: "Skills",
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-[280px]">
          {(r.skills || []).map((s) => (
            <SkillTag key={s} label={s} tone="blue" />
          ))}
        </div>
      ),
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
        icon={Users}
        title="Resource Management"
        description="Manage reusable team members and resources available for task assignment."
      />

      {/* Filter / Action Toolbar */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="md:col-span-4 lg:col-span-4">
            <SearchInput
              label="Search Resource"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
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
          <div className="md:col-span-2 lg:col-span-2">
            <SelectField
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              disabled={typeFilter === "All"}
              options={["All", ...availableRolesForFilter]}
              placeholder={null}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-3 flex items-end gap-2">
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
              Add Resource
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
          emptyTitle="No resources found."
          emptyDescription="Try adjusting your filters or search term."
          sortKey={sortKey}

          sortDir={sortDir}
          onSort={toggleSort}
          rowClassName="align-top"
        />
      </div>

      {/* Resource Form Modal */}
      <Modal
        open={modal.open}
        title={
          modal.mode === "add"
            ? "Add New Resource"
            : modal.mode === "edit"
              ? "Edit Resource"
              : "Resource Details"
        }
        onClose={() => setModal({ open: false, mode: "add", record: null })}
        maxWidth="max-w-2xl"
      >
        <ResourceForm
          mode={modal.mode}
          form={form}
          formRoles={formRoles}
          formSkills={formSkills}
          onChange={setForm}
          onTypeChange={onTypeChange}
          errors={errors}
          setErrors={setErrors}
          onSave={handleSave}
          onCancel={() => setModal({ open: false, mode: "add", record: null })}
        />
      </Modal>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onConfirmUpload={handleConfirmUpload}
      />
    </div>
  );
}
