import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, Loader2, Sparkles, AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { useAssignmentDraft } from "@/context/AssignmentDraftContext.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";
import { optimizationService } from "@/services/optimizationService.js";
import { assignmentService } from "@/services/assignmentService.js";
import { parseApiError } from "@/utils/errorHandler.js";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import AlertMessage from "@/components/common/AlertMessage.jsx";
import Button from "@/components/common/Button.jsx";

const STEP_DURATION_MS = 1000;

export default function ProcessingAssignment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draft, update } = useAssignmentDraft();
  const { assignmentTypes } = useMasterData();

  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [completedStageCount, setCompletedStageCount] = useState(0);
  const hasTriggeredRef = useRef(false);

  const targetAssignmentId = draft?.assignmentId || location.state?.assignmentId;

  const stages = useMemo(() => {
    return [
      "Evaluating Business Rule Engine Constraints",
      "Building Optimization Matrix",
      "Executing Hungarian Algorithm",
      "Validating Budget & Timeline Constraints",
      "Calculating Saved Money & Final Results",
    ];
  }, []);

  const resolvedAssignmentTypeId = useMemo(() => {
    if (!draft?.type) return 1;
    const found = assignmentTypes?.find(
      (t) =>
        t.assignmentTypeName?.toLowerCase() === draft.type?.toLowerCase() ||
        t.assignmentTypeId === Number(draft.type),
    );
    return found ? found.assignmentTypeId : 1;
  }, [draft?.type, assignmentTypes]);

  const resolvedOptimizationTypeEnum = useMemo(() => {
    if (!draft?.optimizationType) return "COST_MINIMIZATION";
    if (
      draft.optimizationType.toLowerCase().includes("profit") ||
      draft.optimizationType === "PROFIT_MAXIMIZATION"
    ) {
      return "PROFIT_MAXIMIZATION";
    }
    return "COST_MINIMIZATION";
  }, [draft?.optimizationType]);

  const runOptimizationFlow = useCallback(async () => {
    if (!targetAssignmentId) {
      navigate("/create-assignment", { replace: true });
      return;
    }

    setProcessing(true);
    setError(null);
    setCompletedStageCount(0);

    const startTime = Date.now();
    let isCancelled = false;

    // Sequential step animation loop (~1s per step)
    const stepAnimationPromise = (async () => {
      for (let i = 1; i <= stages.length; i++) {
        const targetTime = startTime + i * STEP_DURATION_MS;
        const delay = Math.max(0, targetTime - Date.now());
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        if (isCancelled) break;
        setCompletedStageCount(i);
      }
    })();

    try {
      // Execute backend optimization algorithm
      const resultData = await optimizationService.generateOptimization(targetAssignmentId);

      // Ensure all sequential processing steps finish so every step is clearly readable
      await stepAnimationPromise;

      if (isCancelled) return;

      // Store result in draft state and navigate to assignment results
      update({ result: resultData });
      toast.success("Assignment optimization generated successfully!");
      navigate("/assignment-results", { state: { assignmentId: targetAssignmentId } });
    } catch (err) {
      isCancelled = true;
      setProcessing(false);
      const parsed = parseApiError(err);
      const errMsg = parsed.message || "Failed to generate assignment optimization result.";
      setError(errMsg);
      toast.error(errMsg);
    }
  }, [
    targetAssignmentId,
    navigate,
    draft?.name,
    resolvedAssignmentTypeId,
    resolvedOptimizationTypeEnum,
    stages.length,
    update,
  ]);

  useEffect(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      runOptimizationFlow();
    }
  }, [runOptimizationFlow]);

  const progress = Math.round((completedStageCount / stages.length) * 100);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          {processing ? (
            <div className="relative h-20 w-20 mb-5">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Loader2 className="text-white animate-spin" size={36} />
              </div>
            </div>
          ) : error ? (
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-5 text-red-600">
              <AlertCircle size={40} />
            </div>
          ) : (
            <LoadingSpinner size={36} className="mb-5" />
          )}

          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />
            Generating Assignment
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-lg">
            Your resources and tasks are being optimized. Please wait while the assignment is
            generated.
          </p>
        </div>

        {error ? (
          <div className="mt-6 space-y-4">
            <AlertMessage type="error" title="Generation Failed" message={error} />
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => navigate("/create-assignment")}
              >
                Back to Preview
              </Button>
              <Button
                variant="primary"
                icon={RotateCcw}
                onClick={() => {
                  hasTriggeredRef.current = false;
                  runOptimizationFlow();
                }}
              >
                Retry Generation
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-right text-xs font-medium text-slate-500">{progress}%</div>
            </div>

            <ul className="mt-6 space-y-2">
              {stages.map((label, i) => {
                const isDone = i < completedStageCount;
                const isActive = i === completedStageCount && processing;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition-all duration-300 ${
                      isDone
                        ? "bg-blue-50/60 ring-blue-100"
                        : isActive
                          ? "bg-white ring-blue-200 shadow-sm"
                          : "bg-white ring-slate-100 opacity-60"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 flex items-center justify-center rounded-full ${
                        isDone
                          ? "bg-blue-600 text-white"
                          : isActive
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <Check size={14} />
                      ) : isActive ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        isDone
                          ? "text-slate-900 font-medium"
                          : isActive
                            ? "text-slate-900"
                            : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
