import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "@/components/common/DataTable.jsx";
import StatusBadge from "@/components/common/StatusBadge.jsx";
import ActionButtons from "@/components/common/ActionButtons.jsx";
import { showConfirmDialog } from "@/components/common/ConfirmDialog.jsx";
import { assignmentService } from "@/services/assignmentService.js";
import { reportService } from "@/services/reportService.js";
import { resolveAssignmentTypeName } from "@/components/dashboard/AssignmentTypeChart.jsx";

export default function RecentAssignmentsTable({
  rows: initialRows,
  maxHeight,
  emptyTitle = "No assignments found.",
  onDeleteSuccess,

  // =========================================================
  // FILTER VALUES FROM ASSIGNMENT HISTORY PAGE
  // =========================================================
  searchTerm = "",
  assignmentType = "All",
  status = "All",
  optimization = "All",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadingType, setDownloadingType] = useState(null);

  // =========================================================
  // SORT
  // =========================================================
  const sortNewestFirst = (arr) => {
    if (!Array.isArray(arr)) return [];

    return [...arr].sort(
      (a, b) =>
        (b.assignmentId || b.id || 0) -
        (a.assignmentId || a.id || 0)
    );
  };

  // =========================================================
  // FETCH ASSIGNMENTS
  // =========================================================
  const fetchAssignments = async () => {
    setLoading(true);

    try {
      const list = await assignmentService.getAll();

      if (Array.isArray(list)) {
        const sorted = sortNewestFirst(list);
        setData(sorted);
      }
    } catch {
      if (Array.isArray(initialRows)) {
        const sorted = sortNewestFirst(initialRows);
        setData(sorted);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL DATA
  // =========================================================
  useEffect(() => {
    if (initialRows !== undefined) {
      const sorted = sortNewestFirst(initialRows);

      setData(sorted);
      setLoading(false);
    } else {
      fetchAssignments();
    }
  }, [initialRows]);

  // =========================================================
  // FILTER DATA
  // =========================================================
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // -------------------------------------------------------
      // ASSIGNMENT NAME
      // -------------------------------------------------------
      const name =
        row.assignmentName ||
        row.name ||
        "";

      // -------------------------------------------------------
      // ASSIGNMENT TYPE
      // -------------------------------------------------------
      const rawType =
        row.assignmentTypeName ||
        row.assignmentType ||
        row.type ||
        "";

      const type = resolveAssignmentTypeName(rawType);

      // -------------------------------------------------------
      // STATUS
      // -------------------------------------------------------
      const rawStatus =
        row.assignmentStatus ||
        row.status ||
        "DRAFT";

      // -------------------------------------------------------
      // OPTIMIZATION
      // -------------------------------------------------------
      const rawOptimization =
        row.optimizationType ||
        "";

      const optimizationName =
        rawOptimization === "COST_MINIMIZATION" ||
        rawOptimization === "Cost Minimization"
          ? "Cost Optimization"
          : rawOptimization === "PROFIT_MAXIMIZATION" ||
            rawOptimization === "Profit Maximization"
          ? "Profit Optimization"
          : rawOptimization;

      // =======================================================
      // SEARCH FILTER
      // =======================================================
      const matchesSearch = String(name)
        .toLowerCase()
        .includes(String(searchTerm).toLowerCase());

      // =======================================================
      // ASSIGNMENT TYPE FILTER
      // =======================================================
      const matchesType =
        assignmentType === "All" ||
        String(type).trim().toLowerCase() ===
          String(assignmentType).trim().toLowerCase();

      // =======================================================
      // STATUS FILTER
      // =======================================================
      const matchesStatus =
        status === "All" ||
        String(rawStatus).trim().toLowerCase() ===
          String(status).trim().toLowerCase();

      // =======================================================
      // OPTIMIZATION FILTER
      // =======================================================
      const matchesOptimization =
        optimization === "All" ||
        String(optimizationName).trim().toLowerCase() ===
          String(optimization).trim().toLowerCase();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesOptimization
      );
    });
  }, [
    data,
    searchTerm,
    assignmentType,
    status,
    optimization,
  ]);

  // =========================================================
  // DOWNLOAD REPORTS (PDF & EXCEL)
  // =========================================================
  const handleDownloadPdf = async (row) => {
    const targetId = row.assignmentId || row.id;

    if (!targetId) return;

    setDownloadingId(targetId);
    setDownloadingType("pdf");

    try {
      await reportService.downloadPdf(
        targetId,
        `${row.assignmentName || "Assignment"}_Report.pdf`
      );
    } finally {
      setDownloadingId(null);
      setDownloadingType(null);
    }
  };

  const handleDownloadExcel = async (row) => {
    const targetId = row.assignmentId || row.id;

    if (!targetId) return;

    setDownloadingId(targetId);
    setDownloadingType("excel");

    try {
      await reportService.downloadExcel(
        targetId,
        `${row.assignmentName || "Assignment"}_Report.xlsx`
      );
    } finally {
      setDownloadingId(null);
      setDownloadingType(null);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (row) => {
    const targetId = row.assignmentId || row.id;

    if (!targetId) return;

    const confirmed = await showConfirmDialog({
      title: "Delete Assignment?",
      text: `"${row.assignmentName || row.name}" will be deleted.`,
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      try {
        await assignmentService.delete(targetId);

        toast.success("Assignment deleted successfully.");

        setData((prev) =>
          prev.filter(
            (item) =>
              (item.assignmentId || item.id) !== targetId
          )
        );

        onDeleteSuccess?.();
      } catch (err) {
        toast.error("Failed to delete assignment.");
      }
    }
  };

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const columns = [
    {
      key: "assignmentName",
      label: "Assignment Name",
      className:
        "font-semibold text-ink-primary max-w-[220px] lg:max-w-[280px] truncate",

      render: (r) => {
        const val = r.assignmentName || r.name || "";
        return (
          <span title={val} className="block truncate">
            {val}
          </span>
        );
      },
    },

    {
      key: "assignmentTypeName",
      label: "Assignment Type",
      className:
        "text-ink-secondary font-medium max-w-[180px] lg:max-w-[220px] truncate",

      render: (r) => {
        const val = resolveAssignmentTypeName(
          r.assignmentTypeName ||
            r.assignmentType ||
            r.type
        );
        return (
          <span title={val} className="block truncate">
            {val}
          </span>
        );
      },
    },

    {
      key: "assignmentStatus",
      label: "Status",
      className: "whitespace-nowrap shrink-0",

      render: (r) => (
        <StatusBadge
          status={
            r.assignmentStatus ||
            r.status ||
            "DRAFT"
          }
        />
      ),
    },

    {
      key: "optimizationType",
      label: "Optimization Strategy",
      className:
        "font-medium text-ink-primary whitespace-nowrap shrink-0",

      render: (r) =>
        r.optimizationType === "COST_MINIMIZATION" ||
        r.optimizationType === "Cost Minimization"
          ? "Cost Minimization"
          : "Profit Maximization",
    },

    {
      key: "actions",
      label: "Actions",
      align: "right",
      className: "whitespace-nowrap w-[170px] min-w-[170px] shrink-0",
      headerClassName: "w-[170px] min-w-[170px]",

      render: (r) => {
        const rawStatus = String(
          r.assignmentStatus || r.status || ""
        ).toUpperCase();
        const isCompleted = rawStatus === "COMPLETED";
        const targetId = r.assignmentId || r.id;
        const isDownloadingThis = downloadingId === targetId;

        return (
          <ActionButtons
            onPdf={isCompleted ? () => handleDownloadPdf(r) : undefined}
            onDownload={isCompleted ? () => handleDownloadExcel(r) : undefined}
            onDelete={() => handleDelete(r)}
            pdfTitle="Download PDF Report"
            downloadTitle="Download Excel Report"
            deleteTitle="Delete Assignment"
            downloadingPdf={isDownloadingThis && downloadingType === "pdf"}
            downloadingExcel={isDownloadingThis && downloadingType === "excel"}
          />
        );
      },
    },
  ];

  // =========================================================
  // TABLE
  // =========================================================
  return (
    <DataTable
      columns={columns}
      data={filteredData}
      loading={loading}
      keyField="assignmentId"
      maxHeight={maxHeight}
      emptyTitle={emptyTitle}
      emptyDescription="There are no assignment records to display."
    />
  );
}