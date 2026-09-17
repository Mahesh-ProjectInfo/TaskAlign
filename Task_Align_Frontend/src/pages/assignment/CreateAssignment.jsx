import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Stepper from "@/components/assignment/Stepper.jsx";
import StepFooter from "@/components/assignment/StepFooter.jsx";
import AssignmentDetailsForm from "@/components/assignment/AssignmentDetailsForm.jsx";
import ResourceSelection from "@/components/assignment/ResourceSelection.jsx";
import TaskManagement from "@/components/assignment/TaskManagement.jsx";
import AssignmentConstraints from "@/components/assignment/AssignmentConstraints.jsx";
import AssignmentSummary from "@/components/assignment/AssignmentSummary.jsx";
import SelectedResourceTable from "@/components/assignment/SelectedResourceTable.jsx";
import TaskSummaryTable from "@/components/assignment/TaskSummaryTable.jsx";
import BusinessRuleEngine from "@/components/assignment/BusinessRuleEngine.jsx";
import CostMatrix from "@/components/assignment/CostMatrix.jsx";
import OptimizationSummary from "@/components/assignment/OptimizationSummary.jsx";
import { STEP_LABELS } from "@/components/assignment/constants.js";
import { useAssignmentDraft } from "@/context/AssignmentDraftContext.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { assignmentService } from "@/services/assignmentService.js";
import { assignmentResourceService } from "@/services/assignmentResourceService.js";
import { taskService } from "@/services/taskService.js";
import { taskSkillService } from "@/services/taskSkillService.js";
import { assignmentConstraintService } from "@/services/assignmentConstraintService.js";
import { businessRuleService } from "@/services/businessRuleService.js";
import { optimizationService } from "@/services/optimizationService.js";
import { parseApiError } from "@/utils/errorHandler.js";
import {
  isValidAssignmentName,
  isValidTotalBudget,
  isValidTimeline,
  isValidWorkingDays,
} from "@/utils/validators.js";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draft, setDraft, update, reset } = useAssignmentDraft();
  const { assignmentTypes, skills } = useMasterData();

  const [step, setStep] = useState(location.state?.step || 1);
  const [errors, setErrors] = useState({});
  const [savingStep, setSavingStep] = useState(false);

  // Business Rule Engine & Optimization Preview State
  const [matrixInput, setMatrixInput] = useState(null);
  const [optimizationPreview, setOptimizationPreview] = useState(null);
  const [loadingBusinessRules, setLoadingBusinessRules] = useState(false);

  const {
    assignmentId,
    name: assignmentName,
    type: assignmentType,
    resources: selectedResources = [],
    tasks = [],
    budget,
    timeline,
    workingDays,
    optimizationType,
  } = draft;

  const isLastStep = step === STEP_LABELS.length;

  // Load Business Rule Engine results & Optimization Preview on Step 5
  useEffect(() => {
    if (step === 5 && assignmentId) {
      let isMounted = true;
      setLoadingBusinessRules(true);

      Promise.allSettled([
        businessRuleService.getMatrixInput(assignmentId),
        optimizationService.getPreview(assignmentId),
      ])
        .then(([matrixRes, previewRes]) => {
          if (isMounted) {
            if (matrixRes.status === "fulfilled") {
              setMatrixInput(matrixRes.value);
            }
            if (previewRes.status === "fulfilled") {
              setOptimizationPreview(previewRes.value);
            }
          }
        })
        .catch((err) => {
          if (isMounted) {
            const parsed = parseApiError(err);
            toast.error(parsed.message || "Failed to fetch Business Rule Engine data.");
          }
        })
        .finally(() => {
          if (isMounted) setLoadingBusinessRules(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [step, assignmentId]);

  const toggleResource = (r) => {
    setDraft((d) => {
      const exists = d.resources.some((x) => (x.id || x.resourceId) === (r.id || r.resourceId));
      return {
        ...d,
        resources: exists
          ? d.resources.filter((x) => (x.id || x.resourceId) !== (r.id || r.resourceId))
          : [...d.resources, r],
      };
    });
  };

  const handleTypeChange = (t) => {
    if (t === assignmentType) return;
    setDraft((d) => ({ ...d, type: t, resources: [], tasks: [] }));
  };

  // Convert backend Business Rule Engine Eligible Resources into tabular rows (Resource x Task matrix)
  const eligibilityRows = useMemo(() => {
    if (!matrixInput?.eligibleResources?.tasks) return [];

    // 1. Build distinct map of allocated resources for the assignment
    const resourceMap = new Map();
    (selectedResources || []).forEach((r) => {
      const id = r.id || r.resourceId;
      if (id) {
        resourceMap.set(id, {
          resourceId: id,
          resourceName: r.name || r.resourceName || r.employeeName || `Resource ${id}`,
          skills: r.skills || r.requiredSkills || r.skillNames || [],
        });
      }
    });

    if (matrixInput?.eligibleResources?.tasks) {
      for (const t of matrixInput.eligibleResources.tasks) {
        t.matchingResources?.forEach((mr) => {
          if (mr.resourceId && !resourceMap.has(mr.resourceId)) {
            resourceMap.set(mr.resourceId, {
              resourceId: mr.resourceId,
              resourceName: mr.resourceName || `Resource ${mr.resourceId}`,
              skills: mr.skillName ? [mr.skillName] : [],
            });
          }
        });
        t.eligibleResources?.forEach((er) => {
          if (er.resourceId && !resourceMap.has(er.resourceId)) {
            resourceMap.set(er.resourceId, {
              resourceId: er.resourceId,
              resourceName: er.resourceName || `Resource ${er.resourceId}`,
              skills: er.skillName ? [er.skillName] : [],
            });
          }
        });
      }
    }

    const allocatedResourcesList = Array.from(resourceMap.values());
    if (allocatedResourcesList.length === 0) return [];

    const rows = [];

    // 2. Iterate over every Task x Resource combination
    for (const t of matrixInput.eligibleResources.tasks) {
      const taskName = t.taskName || `Task ${t.taskId}`;

      // Resolve task skill requirements from draft or master data
      const draftTask = (tasks || []).find(
        (dt) =>
          (dt.taskId && dt.taskId === t.taskId) ||
          (dt.title || dt.name || dt.taskName) === t.taskName,
      );
      const reqSkillNames = (draftTask?.requiredSkills || draftTask?.skills || [])
        .map((s) => (typeof s === "string" ? s : s.name || s.skillName || ""))
        .filter(Boolean);

      if (
        reqSkillNames.length === 0 &&
        t.requiredSkillIds &&
        t.requiredSkillIds.length > 0 &&
        skills &&
        skills.length > 0
      ) {
        t.requiredSkillIds.forEach((sId) => {
          const foundSkill = skills.find((sk) => sk.skillId === sId);
          if (foundSkill?.name) reqSkillNames.push(foundSkill.name);
        });
      }

      for (const res of allocatedResourcesList) {
        const matchedEligible = t.eligibleResources?.find((e) => e.resourceId === res.resourceId);
        const matchedMatching = t.matchingResources?.find((m) => m.resourceId === res.resourceId);

        if (
          matchedEligible &&
          (matchedEligible.isEligible === undefined || matchedEligible.isEligible === true)
        ) {
          // Case 1: Resource is Eligible for this task
          rows.push({
            resourceId: res.resourceId,
            taskId: t.taskId,
            resourceName: res.resourceName,
            taskName,
            eligible: true,
            reason: matchedEligible.eligibilityReason || "All required skills available",
          });
        } else if (matchedMatching) {
          // Case 2: Resource matched skills, but failed constraint evaluation
          const reason =
            matchedEligible?.eligibilityReason ||
            matchedMatching.eligibilityReason ||
            matchedMatching.reason ||
            "Ineligible - Assignment constraint mismatch";
          rows.push({
            resourceId: res.resourceId,
            taskId: t.taskId,
            resourceName: res.resourceName,
            taskName,
            eligible: false,
            reason,
          });
        } else {
          // Case 3: Resource did NOT match required skills for this task
          let reason = "Ineligible - Required skill missing";
          if (reqSkillNames.length > 0) {
            const resSkillNames = (res.skills || []).map((s) =>
              typeof s === "string" ? s.toLowerCase() : (s.name || s.skillName || "").toLowerCase(),
            );
            const missingSkills = reqSkillNames.filter(
              (rsn, idx, arr) =>
                !resSkillNames.includes(rsn.toLowerCase()) &&
                arr.findIndex((x) => x.toLowerCase() === rsn.toLowerCase()) === idx,
            );
            if (missingSkills.length > 0) {
              reason = missingSkills.map((s) => `${s} skill missing`).join(", ");
            } else {
              reason = `${reqSkillNames[0]} skill missing`;
            }
          }
          rows.push({
            resourceId: res.resourceId,
            taskId: t.taskId,
            resourceName: res.resourceName,
            taskName,
            eligible: false,
            reason,
          });
        }
      }
    }
    return rows;
  }, [matrixInput, selectedResources, tasks, skills]);

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!assignmentType) e.type = "Assignment Type is required.";
      const nameErr = isValidAssignmentName(assignmentName);
      if (nameErr) e.name = nameErr;
    }
    if (step === 2 && selectedResources.length === 0) e.resources = "Select at least one resource.";
    if (step === 3 && tasks.length === 0) e.tasks = "Add at least one task.";
    if (step === 4) {
      const budgetErr = isValidTotalBudget(budget);
      if (budgetErr) e.budget = budgetErr;

      const timelineErr = isValidTimeline(timeline);
      if (timelineErr) e.timeline = timelineErr;

      const workingDaysErr = isValidWorkingDays(workingDays);
      if (workingDaysErr) e.workingDays = workingDaysErr;

      if (!optimizationType) e.optimizationType = "Optimization Strategy is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resolvedAssignmentTypeId = useMemo(() => {
    if (!assignmentType) return null;
    const found = assignmentTypes.find(
      (t) =>
        t.assignmentTypeName?.toLowerCase() === assignmentType?.toLowerCase() ||
        t.assignmentTypeId === Number(assignmentType),
    );
    return found ? found.assignmentTypeId : 1;
  }, [assignmentType, assignmentTypes]);

  const resolvedOptimizationTypeEnum = useMemo(() => {
    if (!optimizationType) return "COST_MINIMIZATION";
    if (
      optimizationType.toLowerCase().includes("profit") ||
      optimizationType === "PROFIT_MAXIMIZATION"
    ) {
      return "PROFIT_MAXIMIZATION";
    }
    return "COST_MINIMIZATION";
  }, [optimizationType]);

  const goNext = async () => {
    if (!validateStep()) return;

    setSavingStep(true);
    try {
      if (step === 1) {
        const payload = {
          assignmentName: assignmentName.trim(),
          assignmentDescription: draft.description ? draft.description.trim() : null,
          assignmentTypeId: resolvedAssignmentTypeId,
          optimizationType: resolvedOptimizationTypeEnum,
        };
        if (assignmentId) {
          const updated = await assignmentService.update(assignmentId, payload);
          update({ assignmentId: updated.assignmentId });
        } else {
          const created = await assignmentService.create(payload);
          update({ assignmentId: created.assignmentId });
        }
      }

      if (step === 2) {
        const resourceIds = selectedResources.map((r) => r.id || r.resourceId).filter(Boolean);
        if (resourceIds.length > 0 && assignmentId) {
          try {
            await assignmentResourceService.add(assignmentId, { resourceIds });
          } catch {
            await assignmentResourceService.update(assignmentId, { resourceIds }).catch(() => null);
          }
        }
      }

      if (step === 3 && assignmentId) {
        const updatedTasks = [];
        for (const t of tasks) {
          const taskName = t.title || t.name || t.taskName;
          const estimatedDays = Number(t.days || t.estimatedDays) || 1;

          if (taskName) {
            let createdTask;
            if (t.taskId) {
              createdTask = await taskService
                .update(assignmentId, t.taskId, { taskName, estimatedDays })
                .catch(() => null);
            }
            if (!createdTask) {
              createdTask = await taskService
                .create(assignmentId, { taskName, estimatedDays })
                .catch(() => null);
            }

            if (createdTask && createdTask.taskId) {
              t.taskId = createdTask.taskId;
              const skillNames = t.requiredSkills || t.skills || [];
              const taskSkillIds = skills
                .filter((s) =>
                  skillNames.some((sn) => {
                    const nameStr = typeof sn === "string" ? sn : sn.name || sn.skillName || "";
                    const masterNameStr = s.name || s.skillName || "";
                    return nameStr.trim().toLowerCase() === masterNameStr.trim().toLowerCase();
                  }),
                )
                .map((s) => s.skillId);
              const uniqueSkillIds = Array.from(new Set(taskSkillIds));

              await taskSkillService
                .update(createdTask.taskId, { skillIds: uniqueSkillIds })
                .catch(() => null);
            }
            updatedTasks.push(t);
          }
        }
        update({ tasks: updatedTasks });
      }

      if (step === 4 && assignmentId) {
        const assignmentPayload = {
          assignmentName: assignmentName.trim(),
          assignmentDescription: draft.description ? draft.description.trim() : null,
          assignmentTypeId: resolvedAssignmentTypeId,
          optimizationType: resolvedOptimizationTypeEnum,
        };
        await assignmentService.update(assignmentId, assignmentPayload).catch(() => null);

        const constraintPayload = {
          budget: Number(budget),
          timelineDays: Number(timeline),
          workingDaysPerMonth: Number(workingDays),
        };
        try {
          await assignmentConstraintService.create(assignmentId, constraintPayload);
        } catch {
          const existing = await assignmentConstraintService
            .getByAssignmentId(assignmentId)
            .catch(() => null);
          if (existing && existing.assignmentConstraintId) {
            await assignmentConstraintService
              .update(assignmentId, existing.assignmentConstraintId, constraintPayload)
              .catch(() => null);
          }
        }
      }

      if (isLastStep) {
        navigate("/assignment-processing");
        return;
      }

      setStep((s) => Math.min(s + 1, STEP_LABELS.length));
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || `Step ${step} save failed. Please check your entries.`);
    } finally {
      setSavingStep(false);
    }
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const currentOptType =
    draft.optimizationType ||
    optimizationPreview?.optimizationType ||
    matrixInput?.optimizationType ||
    "COST_MINIMIZATION";

  return (
    <div className="space-y-6 pb-4 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Create Assignment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Follow the guided workflow to build and process assignment business rules.
        </p>
      </header>

      <Stepper steps={STEP_LABELS} current={step} />

      {step === 1 && (
        <AssignmentDetailsForm
          draft={draft}
          onChange={update}
          onTypeChange={handleTypeChange}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {step === 2 && (
        <ResourceSelection draft={draft} onToggleResource={toggleResource} errors={errors} />
      )}

      {step === 3 && <TaskManagement draft={draft} onChange={update} errors={errors} />}

      {step === 4 && (
        <AssignmentConstraints
          draft={draft}
          onChange={update}
          errors={errors}
          setErrors={setErrors}
        />
      )}

      {step === 5 && (
        <div className="space-y-6">
          <AssignmentSummary draft={draft} />

          <SelectedResourceTable resources={selectedResources} />

          <TaskSummaryTable tasks={tasks} />

          {/* Real Backend Business Rule Engine Section */}
          {loadingBusinessRules ? (
            <div className="flex items-center justify-center p-8 bg-white rounded-xl ring-1 ring-slate-200/80">
              <Loader2 className="animate-spin text-blue-600 mr-2" size={20} />
              <span className="text-sm font-medium text-slate-600">
                Evaluating Skill Matching, Eligible Resources, and Matrix Preview from Business Rule
                Engine...
              </span>
            </div>
          ) : (
            <>
              {/* 1. Business Rule Engine Preview Table */}
              <BusinessRuleEngine eligibilityData={eligibilityRows} />

              {/* 2. Cost Matrix OR Profit Matrix */}
              <CostMatrix
                optimizationType={currentOptType}
                previewMatrix={optimizationPreview?.matrix}
                resources={selectedResources}
                tasks={tasks}
              />

              {/* 3. Optimization Summary */}
              <OptimizationSummary
                previewData={optimizationPreview}
                matrixInput={matrixInput}
                draft={draft}
                eligibilityData={eligibilityRows}
              />
            </>
          )}
        </div>
      )}

      <StepFooter
        onPrev={goPrev}
        onNext={goNext}
        showPrev={step > 1}
        loading={savingStep}
        disabled={savingStep}
        generate={isLastStep}
        nextLabel={isLastStep ? "Generate Assignment" : "Next"}
      />
    </div>
  );
}
