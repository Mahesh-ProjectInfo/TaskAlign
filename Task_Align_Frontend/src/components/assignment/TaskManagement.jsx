import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { toast } from "react-toastify";
import StepCard from "./StepCard.jsx";
import Button from "@/components/common/Button.jsx";
import DataTable from "@/components/common/DataTable.jsx";
import ActionButtons from "@/components/common/ActionButtons.jsx";
import SkillTag from "@/components/common/SkillTag.jsx";
import InputField from "@/components/common/InputField.jsx";
import Modal from "@/components/common/Modal.jsx";
import SkillMultiSelect from "@/components/master-data/SkillMultiSelect.jsx";
import TaskBulkUploadModal from "./TaskBulkUploadModal.jsx";
import { showConfirmDialog } from "@/components/common/ConfirmDialog.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { taskService } from "@/services/taskService.js";
import { isValidTaskName, isValidEstimatedEffort } from "@/utils/validators.js";

const emptyTaskForm = { name: "", days: "", requiredSkills: [] };

export default function TaskManagement({ draft, onChange, errors = {} }) {
  const { skillsByType } = useMasterData();
  const assignmentType = draft.type;
  const tasks = draft.tasks || [];

  const [taskModal, setTaskModal] = useState({ open: false, editing: null });
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [taskErrors, setTaskErrors] = useState({});

  const masterSkillsForType = useMemo(
    () => (assignmentType ? skillsByType(assignmentType) : []),
    [assignmentType, skillsByType],
  );

  const skillsForType = useMemo(
    () => masterSkillsForType.map((s) => s.name || s.skillName || ""),
    [masterSkillsForType],
  );

  const openAddTask = () => {
    setTaskForm(emptyTaskForm);
    setTaskErrors({});
    setTaskModal({ open: true, editing: null });
  };

  const openEditTask = (t) => {
    setTaskForm({
      name: t.name,
      days: String(t.days ?? ""),
      requiredSkills: t.requiredSkills || [],
    });
    setTaskErrors({});
    setTaskModal({ open: true, editing: t.id });
  };

  const deleteTask = async (t) => {
    const confirmed = await showConfirmDialog({
      title: "Delete Task?",
      text: `"${t.name}" will be removed.`,
      confirmButtonText: "Delete",
    });
    if (confirmed) {
      if (draft.assignmentId && t.taskId) {
        await taskService.delete(draft.assignmentId, t.taskId).catch(() => null);
      }
      onChange({ tasks: tasks.filter((x) => x.id !== t.id) });
    }
  };

  const handleConfirmBulkUpload = (newUploadedTasks) => {
    if (!newUploadedTasks || newUploadedTasks.length === 0) return;
    onChange({ tasks: [...tasks, ...newUploadedTasks] });
    toast.success(`Successfully imported ${newUploadedTasks.length} task(s).`);
  };

  const handleNameChange = (e) => {
    const raw = e.target.value;
    const clean = raw
      .replace(/[^A-Za-z ]/g, "")
      .replace(/^\s+/, "")
      .replace(/ {2,}/g, " ")
      .slice(0, 50);

    setTaskForm((f) => ({ ...f, name: clean }));

    const err = isValidTaskName(clean);
    setTaskErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next.name = err;
      } else {
        delete next.name;
      }
      return next;
    });
  };

  const handleDaysChange = (e) => {
    const raw = e.target.value;
    let clean = raw.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = clean.replace(/^0+/, "");
    }
    if (clean !== "") {
      const num = Number(clean);
      if (num > 30) return;
    }

    setTaskForm((f) => ({ ...f, days: clean }));

    const err = isValidEstimatedEffort(clean);
    setTaskErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next.days = err;
      } else {
        delete next.days;
      }
      return next;
    });
  };

  const validateTaskForm = () => {
    const e = {};
    const nameErr = isValidTaskName(taskForm.name);
    if (nameErr) e.name = nameErr;

    const daysErr = isValidEstimatedEffort(taskForm.days);
    if (daysErr) e.days = daysErr;

    if (!taskForm.requiredSkills || taskForm.requiredSkills.length === 0)
      e.requiredSkills = "Select at least one required skill.";
    setTaskErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveTask = () => {
    if (!validateTaskForm()) return;
    if (taskModal.editing) {
      onChange({
        tasks: tasks.map((t) =>
          t.id === taskModal.editing
            ? {
                ...t,
                name: taskForm.name.trim(),
                days: Number(taskForm.days),
                requiredSkills: taskForm.requiredSkills,
              }
            : t,
        ),
      });
    } else {
      const newTask = {
        id: "task-" + Date.now(),
        name: taskForm.name.trim(),
        days: Number(taskForm.days),
        requiredSkills: taskForm.requiredSkills,
      };
      onChange({ tasks: [...tasks, newTask] });
    }
    setTaskModal({ open: false, editing: null });
  };

  const columns = [
    {
      key: "name",
      label: "Task Name",
      className: "font-medium text-slate-900",
    },
    {
      key: "days",
      label: "Estimated Days",
      className: "text-slate-700 whitespace-nowrap",
      render: (t) => `${t.days} Days`,
    },
    {
      key: "requiredSkills",
      label: "Required Skills",
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {(t.requiredSkills || []).map((s) => (
            <SkillTag key={s} label={s} tone="indigo" />
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      className: "whitespace-nowrap",
      render: (t) => (
        <ActionButtons onEdit={() => openEditTask(t)} onDelete={() => deleteTask(t)} />
      ),
    },
  ];

  return (
    <StepCard
      step={3}
      title="Task Management"
      description="Define the specific tasks, effort estimates, and required skill profiles."
    >
      <div className="space-y-4">
        {errors.tasks && <p className="text-sm text-red-600">{errors.tasks}</p>}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Total Tasks Created: {tasks.length}</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              icon={Upload}
              onClick={() => setBulkUploadOpen(true)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Bulk Upload
            </Button>
            <Button variant="blue" icon={Plus} onClick={openAddTask}>
              Add Task
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={tasks} emptyTitle="No tasks created yet." />
      </div>

      <TaskBulkUploadModal
        open={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onConfirmUpload={handleConfirmBulkUpload}
        masterSkills={masterSkillsForType}
        assignmentType={assignmentType}
        existingTasks={tasks}
      />

      <Modal
        open={taskModal.open}
        title={taskModal.editing ? "Edit Task" : "Add New Task"}
        onClose={() => setTaskModal({ open: false, editing: null })}
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setTaskModal({ open: false, editing: null })}
            >
              Cancel
            </Button>
            <Button variant="blue" onClick={saveTask}>
              {taskModal.editing ? "Save Task" : "Add Task"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Task Name"
            required
            maxLength={50}
            value={taskForm.name}
            onChange={handleNameChange}
            placeholder="e.g. Backend API Development"
            error={taskErrors.name}
          />
          <InputField
            label="Estimated Effort (Days)"
            required
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={taskForm.days}
            onChange={handleDaysChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ",", " "].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 10"
            error={taskErrors.days}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Required Skills <span className="text-red-500">*</span>
            </label>
            <SkillMultiSelect
              options={skillsForType}
              value={taskForm.requiredSkills}
              onChange={(v) => setTaskForm((f) => ({ ...f, requiredSkills: v }))}
              placeholder="Search and select required skills..."
            />
            {taskErrors.requiredSkills && (
              <p className="mt-1 text-xs text-red-500">{taskErrors.requiredSkills}</p>
            )}
          </div>
        </div>
      </Modal>
    </StepCard>
  );
}

