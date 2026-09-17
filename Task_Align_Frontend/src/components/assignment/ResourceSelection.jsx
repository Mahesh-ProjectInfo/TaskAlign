import { useMemo, useState } from "react";
import { Plus, Eye } from "lucide-react";
import { toast } from "react-toastify";
import StepCard from "./StepCard.jsx";
import SearchInput from "@/components/common/SearchInput.jsx";
import SelectField from "@/components/common/SelectField.jsx";
import Button from "@/components/common/Button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import Checkbox from "@/components/common/Checkbox.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";
import IconButton from "@/components/common/IconButton.jsx";
import Modal from "@/components/common/Modal.jsx";
import ResourceForm from "@/components/master-data/ResourceForm.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";

const emptyResourceForm = { name: "", role: "", salary: "", rating: "", skills: [] };

export default function ResourceSelection({ draft, onToggleResource, errors = {} }) {
  const { resources: allResources, rolesByType, skillsByType, addResource } = useMasterData();

  const assignmentType = draft.type;
  const selectedResources = draft.resources || [];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Add/View Resource modal state
  const [resModal, setResModal] = useState({ open: false, mode: "add", record: null });
  const [resForm, setResForm] = useState(emptyResourceForm);
  const [resErrors, setResErrors] = useState({});

  // Master data lookups scoped to the selected assignment type
  const rolesForType = useMemo(
    () => (assignmentType ? rolesByType(assignmentType).map((r) => r.name) : []),
    [assignmentType, rolesByType],
  );
  const skillsForType = useMemo(
    () => (assignmentType ? skillsByType(assignmentType).map((s) => s.name) : []),
    [assignmentType, skillsByType],
  );

  const availableResources = useMemo(
    () => allResources.filter((r) => r.type === assignmentType),
    [allResources, assignmentType],
  );

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = availableResources.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (roleFilter !== "All" && r.role !== roleFilter) return false;
      if (skillFilter !== "All" && !(r.skills || []).includes(skillFilter)) return false;
      if (ratingFilter !== "All") {
        const rt = Number(r.rating);
        if (ratingFilter === "90+" && rt < 90) return false;
        if (ratingFilter === "75-89" && (rt < 75 || rt >= 90)) return false;
        if (ratingFilter === "<75" && rt >= 75) return false;
      }
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
      return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
    });
    return list;
  }, [availableResources, search, roleFilter, skillFilter, ratingFilter, sortKey, sortDir]);

  const isSelected = (id) => selectedResources.some((r) => r.id === id);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openAddResource = () => {
    setResForm(emptyResourceForm);
    setResErrors({});
    setResModal({ open: true, mode: "add", record: null });
  };

  const openViewResource = (r) => {
    setResForm({
      name: r.name,
      role: r.role,
      salary: r.salary,
      rating: r.rating,
      skills: r.skills || [],
    });
    setResErrors({});
    setResModal({ open: true, mode: "view", record: r });
  };

  const validateResourceForm = () => {
    const e = {};
    if (!resForm.name.trim()) e.name = "Resource Name is required.";
    if (!resForm.role) e.role = "Role is required.";
    const sal = Number(resForm.salary);
    if (!resForm.salary || Number.isNaN(sal) || sal <= 0)
      e.salary = "Monthly Salary must be greater than 0.";
    const rating = Number(resForm.rating);
    if (resForm.rating === "" || Number.isNaN(rating) || rating < 1 || rating > 100)
      e.rating = "Rating must be 1-100.";
    if (!resForm.skills || resForm.skills.length === 0) e.skills = "Select at least one skill.";
    setResErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveResource = async () => {
    if (!validateResourceForm()) return;
    const payload = {
      type: assignmentType,
      name: resForm.name.trim(),
      role: resForm.role,
      salary: Number(resForm.salary),
      rating: Number(resForm.rating),
      skills: resForm.skills,
    };
    const res = await addResource(payload);
    if (!res.ok) {
      setResErrors({ name: res.error || "Failed to add resource." });
      toast.error(res.error || "Failed to add resource.");
      return;
    }
    toast.success("Resource added successfully.");
    if (res.data && onToggleResource && !isSelected(res.data.id || res.data.resourceId)) {
      onToggleResource(res.data);
    }
    setResModal({ open: false, mode: "add", record: null });
  };

  const columns = [
    {
      key: "select",
      label: "Select",
      className: "w-12 text-center",
      render: (r) => <Checkbox checked={isSelected(r.id)} onChange={() => onToggleResource(r)} />,
    },
    {
      key: "name",
      label: "Resource Name",
      sortable: true,
      className: "font-medium text-slate-900 whitespace-nowrap",
    },
    {
      key: "role",
      label: "Role",
      className: "text-slate-700 whitespace-nowrap",
    },
    {
      key: "salary",
      label: "Monthly Salary",
      sortable: true,
      className: "text-slate-900 font-medium whitespace-nowrap",
      render: (r) => `₹${Number(r.salary).toLocaleString("en-IN")}`,
    },
    {
      key: "rating",
      label: "Performance Rating",
      sortable: true,
      className: "whitespace-nowrap",
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold ring-1 ring-indigo-100">
          {Number(r.rating).toFixed(2)}
        </span>
      ),
    },
    {
      key: "skills",
      label: "Skills",
      render: (r) => (
        <div className="flex flex-wrap gap-1 max-w-[260px]">
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
        <IconButton
          icon={Eye}
          onClick={() => openViewResource(r)}
          title="View Resource"
          variant="blue"
        />
      ),
    },
  ];

  return (
    <StepCard
      step={2}
      title="Select Resources"
      description={`Choose resources available for "${assignmentType || "Assignment"}".`}
    >
      <div className="space-y-4">
        {errors.resources && <p className="text-sm text-red-600">{errors.resources}</p>}

        <div className="bg-slate-50/60 rounded-xl p-3 ring-1 ring-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resource name..."
            />
          </div>
          <div className="md:col-span-2">
            <SelectField
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={["All", ...rolesForType]}
              placeholder={null}
            />
          </div>
          <div className="md:col-span-2">
            <SelectField
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              options={["All", ...skillsForType]}
              placeholder={null}
            />
          </div>
          <div className="md:col-span-2">
            <SelectField
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              options={[
                { label: "All Ratings", value: "All" },
                { label: "90+ Excellent", value: "90+" },
                { label: "75-89 Good", value: "75-89" },
                { label: "<75 Average", value: "<75" },
              ]}
              placeholder={null}
            />
          </div>
          <div className="md:col-span-2">
            <Button
              variant="blue"
              icon={Plus}
              onClick={openAddResource}
              className="w-full justify-center whitespace-nowrap"
            >
              Add Resource
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredResources}
          emptyTitle="No resources match the selected criteria."
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={toggleSort}
          rowClassName={(r) => (isSelected(r.id) ? "bg-blue-50/30" : "")}
        />

        <div className="text-right text-xs text-slate-500 font-medium">
          Selected: {selectedResources.length} of {availableResources.length} resources
        </div>
      </div>

      <Modal
        open={resModal.open}
        title={resModal.mode === "add" ? "Add New Resource" : "View Resource Details"}
        onClose={() => setResModal({ open: false, mode: "add", record: null })}
        maxWidth="max-w-2xl"
      >
        <ResourceForm
          mode={resModal.mode}
          form={{ ...resForm, type: assignmentType }}
          formRoles={rolesForType}
          formSkills={skillsForType}
          onChange={setResForm}
          errors={resErrors}
          setErrors={setResErrors}
          onSave={saveResource}
          onCancel={() => setResModal({ open: false, mode: "add", record: null })}
        />
      </Modal>
    </StepCard>
  );
}
