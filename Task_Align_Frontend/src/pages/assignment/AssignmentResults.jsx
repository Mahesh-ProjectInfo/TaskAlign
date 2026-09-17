import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Users, ClipboardList, IndianRupee, ShieldCheck, Clock3, Zap, Loader2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader.jsx";
import AlertMessage from "@/components/common/AlertMessage.jsx";
import StatCard from "@/components/common/StatCard.jsx";
import AssignmentSummary from "@/components/assignment/AssignmentSummary.jsx";
import CostMatrix from "@/components/assignment/CostMatrix.jsx";
import OptimizedAssignmentTable from "@/components/assignment/OptimizedAssignmentTable.jsx";
import ValidationSummary from "@/components/assignment/ValidationSummary.jsx";
import ResultActionBar from "@/components/assignment/ResultActionBar.jsx";
import { useAssignmentDraft } from "@/context/AssignmentDraftContext.jsx";
import { optimizationService } from "@/services/optimizationService.js";
import { reportService } from "@/services/reportService.js";
import { parseApiError } from "@/utils/errorHandler.js";

export default function AssignmentResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { draft, reset } = useAssignmentDraft();

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fetchedResult, setFetchedResult] = useState(null);

  const targetAssignmentId = draft?.assignmentId || location.state?.assignmentId || fetchedResult?.assignmentId;
  const resultData = draft?.result || fetchedResult;

  useEffect(() => {
    if (!resultData && targetAssignmentId) {
      let isMounted = true;
      setLoading(true);
      optimizationService
        .generateOptimization(targetAssignmentId)
        .then((res) => {
          if (isMounted) setFetchedResult(res);
        })
        .catch((err) => {
          if (isMounted) {
            const parsed = parseApiError(err);
            toast.error(parsed.message || "Failed to load assignment optimization results.");
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [resultData, targetAssignmentId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white rounded-xl ring-1 ring-slate-100 max-w-7xl mx-auto my-6">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
        <p className="text-sm font-medium text-slate-700">Loading optimization results...</p>
      </div>
    );
  }

  if (!resultData && !targetAssignmentId) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white rounded-xl ring-1 ring-slate-100 max-w-7xl mx-auto my-6 text-center">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">No Optimization Result Found</h2>
        <p className="text-xs text-slate-500 mb-4">Please create and complete an assignment first.</p>
        <button
          onClick={() => navigate("/create-assignment")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Assignment
        </button>
      </div>
    );
  }

  const rawOptType =
    resultData?.optimizationType ||
    draft?.optimizationType ||
    "COST_MINIMIZATION";
  const isCost =
    !String(rawOptType).toUpperCase().includes("PROFIT") &&
    String(rawOptType).toUpperCase() !== "PROFIT_MAXIMIZATION";

  const assignmentName = resultData?.assignmentName || draft?.name || "Assignment";
  const assignmentType = resultData?.assignmentType || draft?.type || "—";
  const optimizationTypeLabel = isCost ? "Cost Minimization" : "Profit Maximization";
  const budget = resultData?.budget ?? draft?.budget;
  const timeline = resultData?.timelineDays ?? draft?.timeline;
  const workingDays = resultData?.workingDaysPerMonth ?? draft?.workingDays;

  const totalResources = resultData?.totalResources ?? draft?.resources?.length ?? 0;
  const totalTasks = resultData?.totalTasks ?? draft?.tasks?.length ?? 0;
  const totalCost = resultData?.totalCost ?? 0;
  const executionTime = resultData?.executionTime ?? 1;

  const budgetStatusStr = String(resultData?.budgetStatus || "").toUpperCase();
  const isBudgetOk = budgetStatusStr === "WITHIN_BUDGET" || budgetStatusStr.includes("WITHIN");

  const timelineStatusStr = String(resultData?.timelineStatus || "").toUpperCase();
  const isTimelineOk = timelineStatusStr === "WITHIN_TIMELINE" || timelineStatusStr.includes("WITHIN");

  const taskAssignments = resultData?.taskAssignments || [];

  const handlePrevious = () => navigate("/create-assignment", { state: { step: 5 } });
  const handleGoToCreateAssignment = () => navigate("/create-assignment", { state: { step: 1 } });
  const handlePdf = async () => {
    if (!targetAssignmentId) {
      toast.error("Assignment ID is missing for report download.");
      return;
    }
    setDownloading(true);
    try {
      await reportService.downloadPdf(targetAssignmentId, `${assignmentName}_Report.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const handleExcel = async () => {
    if (!targetAssignmentId) {
      toast.error("Assignment ID is missing for report download.");
      return;
    }
    setDownloading(true);
    try {
      await reportService.downloadExcel(targetAssignmentId, `${assignmentName}_Report.xlsx`);
    } finally {
      setDownloading(false);
    }
  };

  const handleFinish = () => {
    reset();
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6 pb-4 max-w-7xl mx-auto">
      <PageHeader
        title="Assignment Results"
        description="Review the optimized allocation generated by the system."
      />

      {/* Success Banner */}
      <AlertMessage
        variant="success"
        title="Assignment generated successfully."
        message={`Optimization strategy: ${optimizationTypeLabel}.`}
      />

      {/* Assignment Summary Card */}
      <AssignmentSummary
        draft={{
          name: assignmentName,
          type: assignmentType,
          optimizationType: optimizationTypeLabel,
          description: resultData?.description || draft?.description || "—",
          budget,
          timeline,
          workingDays,
          resources: { length: totalResources },
          tasks: { length: totalTasks },
        }}
      />

      {/* 6 Statistics Cards in Task Align Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          title="Total Resources"
          value={totalResources}
          accent="blue"
        />
        <StatCard
          icon={ClipboardList}
          title="Total Tasks"
          value={totalTasks}
          accent="primary"
        />
        <StatCard
          icon={IndianRupee}
          title="Total Assignment Cost"
          value={`₹${Number(totalCost).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          accent="green"
        />
        <StatCard
          icon={ShieldCheck}
          title="Budget Status"
          value={isBudgetOk ? "Within Budget" : "Budget Exceeded"}
          accent={isBudgetOk ? "green" : "coral"}
          badge
          layout="vertical"
        />
        <StatCard
          icon={Clock3}
          title="Timeline Status"
          value={isTimelineOk ? "Within Timeline" : "Timeline Exceeded"}
          accent={isTimelineOk ? "green" : "coral"}
          badge
          layout="vertical"
        />
        <StatCard
          icon={Zap}
          title="Execution Time"
          value={`${executionTime || 1} ms`}
          accent="amber"
        />
      </div>

      {/* Profit Optimization Matrix (PROFIT MAXIMIZATION RESULT SCREEN ONLY) */}
      {!isCost && (
        <CostMatrix
          optimizationType={rawOptType}
          previewMatrix={resultData?.matrix}
          title="Profit Optimization Matrix"
          subtitle="Resource-to-task profit transformation matrix generated by backend."
          isResultScreen={true}
        />
      )}

      {/* Optimized Assignment Table */}
      <OptimizedAssignmentTable
        optimizationType={rawOptType}
        rows={taskAssignments}
      />

      {/* Validation Summary Card */}
      <ValidationSummary budgetOk={isBudgetOk} timelineOk={isTimelineOk} />

      {/* Bottom Action Bar */}
      <ResultActionBar
        onPrevious={handlePrevious}
        onGoToCreateAssignment={handleGoToCreateAssignment}
        onSave={handleGoToCreateAssignment}
        onPdf={handlePdf}
        onExcel={handleExcel}
        onFinish={handleFinish}
        downloading={downloading}
      />
    </div>
  );
}
