import { useRef, useState } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, X, AlertTriangle } from "lucide-react";
import { read, utils } from "xlsx";
import Modal from "@/components/common/Modal.jsx";
import Button from "@/components/common/Button.jsx";

export default function TaskBulkUploadModal({
  open,
  onClose,
  onConfirmUpload,
  masterSkills = [],
  assignmentType = "",
  existingTasks = [],
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const fileRef = useRef(null);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
    });

    parseExcelFile(file);
  };

  const handleDownloadTemplate = () => {
    const headers = ["Task Name", "Estimated Days", "Required Skills"];
    const sampleRows = [
      ["Backend API Development", "5", "Java, Spring Boot"],
      ["Database Design", "3", "SQL, Database Design"],
      ["Testing & QA", "4", "Testing, QA"],
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      sampleRows.map((row) => row.map((v) => `"${v}"`).join(",")).join("\n") +
      "\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetState = () => {
    setSelectedFile(null);
    setFileDetails(null);
    setParsing(false);
    setParseResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  const parseExcelFile = (file) => {
    setParsing(true);
    setParseResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setParseResult({
            fatalError: "The uploaded Excel file contains no worksheets.",
            validTasks: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = utils.sheet_to_json(firstSheet, { header: 1, defval: "" });

        if (!rows || rows.length === 0) {
          setParseResult({
            fatalError: "The uploaded file is empty.",
            validTasks: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        // Find header row (first non-empty row)
        let headerRowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          const rowStr = rows[i].join("").trim();
          if (rowStr.length > 0) {
            headerRowIndex = i;
            break;
          }
        }

        if (headerRowIndex === -1) {
          setParseResult({
            fatalError: "File contains no data or headers.",
            validTasks: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        const headerRow = rows[headerRowIndex].map((h) => String(h).trim());

        // Header detection (tolerant to whitespace, case)
        let nameColIdx = -1;
        let daysColIdx = -1;
        let skillsColIdx = -1;

        headerRow.forEach((colHeader, idx) => {
          const norm = colHeader.toLowerCase().replace(/[\_\-\s]+/g, "");
          if (norm.includes("task") && norm.includes("name")) {
            nameColIdx = idx;
          } else if (norm.includes("day") || norm.includes("estimated")) {
            daysColIdx = idx;
          } else if (norm.includes("skill")) {
            skillsColIdx = idx;
          }
        });

        // Fallback checks if fuzzy check failed
        if (nameColIdx === -1) {
          headerRow.forEach((h, i) => {
            if (h.toLowerCase().includes("name") || h.toLowerCase().includes("task")) nameColIdx = i;
          });
        }

        const missingHeaders = [];
        if (nameColIdx === -1) missingHeaders.push("Task Name");
        if (daysColIdx === -1) missingHeaders.push("Estimated Days");
        if (skillsColIdx === -1) missingHeaders.push("Required Skills");

        if (missingHeaders.length > 0) {
          setParseResult({
            fatalError: `Missing required column header(s): ${missingHeaders.join(", ")}. File must include headers for Task Name, Estimated Days, and Required Skills.`,
            validTasks: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        // Build Master Skill Lookup Map (Case-insensitive)
        const masterSkillMap = new Map();
        (masterSkills || []).forEach((s) => {
          const sName = typeof s === "string" ? s : s.name || s.skillName || "";
          if (sName.trim()) {
            masterSkillMap.set(sName.trim().toLowerCase(), sName.trim());
          }
        });

        // Existing tasks name set for duplicate checking against draft
        const existingTaskNameSet = new Set(
          (existingTasks || []).map((t) => (t.name || t.taskName || "").trim().toLowerCase()),
        );

        const seenFileTaskNames = new Set();

        const validTasks = [];
        const invalidRows = [];

        // Validate data rows (starting after header row)
        for (let r = headerRowIndex + 1; r < rows.length; r++) {
          const rowData = rows[r];
          const excelLineNum = r + 1;

          // Skip completely empty row
          if (!rowData || rowData.every((cell) => String(cell).trim() === "")) {
            continue;
          }

          const rawName = String(rowData[nameColIdx] || "").trim();
          const rawDays = String(rowData[daysColIdx] || "").trim();
          const rawSkills = String(rowData[skillsColIdx] || "").trim();

          const rowErrors = [];

          // 1. Task Name Validation
          if (!rawName) {
            rowErrors.push("Task Name is required.");
          } else if (rawName.length > 150) {
            rowErrors.push("Task Name cannot exceed 150 characters.");
          }

          // Duplicate checking
          if (rawName) {
            const normName = rawName.toLowerCase();
            if (existingTaskNameSet.has(normName)) {
              rowErrors.push(`Task Name '${rawName}' already exists in current task list.`);
            } else if (seenFileTaskNames.has(normName)) {
              rowErrors.push(`Duplicate Task Name '${rawName}' within uploaded file.`);
            } else {
              seenFileTaskNames.add(normName);
            }
          }

          // 2. Estimated Days Validation
          if (!rawDays) {
            rowErrors.push("Estimated Days is required.");
          } else {
            const numDays = Number(rawDays.replace(/,/g, ""));
            if (
              isNaN(numDays) ||
              !Number.isFinite(numDays) ||
              !Number.isInteger(numDays) ||
              numDays < 1
            ) {
              rowErrors.push("Estimated Days must be a positive integer.");
            }
          }

          // 3. Required Skills Validation
          const resolvedSkillNames = [];
          if (!rawSkills) {
            rowErrors.push("Select at least one required skill.");
          } else {
            const rawSkillTokens = rawSkills.split(/[,;|\n]/).map((s) => s.trim()).filter(Boolean);

            if (rawSkillTokens.length === 0) {
              rowErrors.push("Select at least one required skill.");
            } else {
              rawSkillTokens.forEach((token) => {
                const normToken = token.toLowerCase();
                if (masterSkillMap.has(normToken)) {
                  const canonicalName = masterSkillMap.get(normToken);
                  if (!resolvedSkillNames.includes(canonicalName)) {
                    resolvedSkillNames.push(canonicalName);
                  }
                } else {
                  rowErrors.push(`Unknown skill '${token}' for assignment type '${assignmentType || "Current"}'.`);
                }
              });
            }
          }

          if (rowErrors.length === 0) {
            validTasks.push({
              id: "task-" + Date.now() + "-" + r,
              name: rawName,
              days: Number(rawDays.replace(/,/g, "")),
              requiredSkills: resolvedSkillNames,
            });
          } else {
            invalidRows.push({
              rowNumber: excelLineNum,
              taskName: rawName || "Unspecified",
              errors: rowErrors,
            });
          }
        }

        setParseResult({
          fatalError: null,
          validTasks,
          invalidRows,
          totalProcessed: validTasks.length + invalidRows.length,
        });
      } catch (err) {
        setParseResult({
          fatalError: "Failed to read or parse file: " + (err.message || "Invalid Excel structure."),
          validTasks: [],
          invalidRows: [],
        });
      } finally {
        setParsing(false);
      }
    };

    reader.onerror = () => {
      setParseResult({
        fatalError: "Error reading file from disk.",
        validTasks: [],
        invalidRows: [],
      });
      setParsing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    if (!parseResult || parseResult.validTasks.length === 0) return;
    onConfirmUpload?.(parseResult.validTasks);
    handleClose();
  };

  return (
    <Modal
      open={open}
      title="Bulk Upload Tasks"
      onClose={handleClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="blue"
            disabled={!parseResult || parseResult.validTasks.length === 0 || parsing}
            onClick={handleImport}
          >
            Import {parseResult?.validTasks?.length ? `(${parseResult.validTasks.length}) Tasks` : "Tasks"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-1">
        <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900 leading-relaxed font-medium">
          Required headers: <span className="font-semibold">Task Name</span>, <span className="font-semibold">Estimated Days</span>, <span className="font-semibold">Required Skills</span>.
          Skills must match master skills for <span className="font-semibold">{assignmentType || "the selected assignment type"}</span>.
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          icon={Download}
          onClick={handleDownloadTemplate}
          className="w-full justify-center text-slate-700 hover:text-slate-900 border-slate-200"
        >
          Download CSV Sample Template
        </Button>

        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 p-6 text-center transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60">
              <Upload size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Click to upload Excel or CSV file</p>
            <p className="text-xs text-slate-500">Supports .csv, .xlsx, .xls</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFilePick}
            className="hidden"
          />
        </div>

        {selectedFile && fileDetails && (
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <FileSpreadsheet size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{fileDetails.name}</p>
                <p className="text-xs text-slate-500">{fileDetails.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetState}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {parsing && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-sm font-medium text-slate-600">
            Parsing and validating Excel file...
          </div>
        )}

        {parseResult && (
          <div className="space-y-3">
            {parseResult.fatalError ? (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">File Upload Failed</span>
                  {parseResult.fatalError}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-slate-600">Processed: {parseResult.totalProcessed} rows</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Valid: {parseResult.validTasks.length}
                  </span>
                  {parseResult.invalidRows.length > 0 && (
                    <span className="text-amber-700 flex items-center gap-1">
                      <AlertTriangle size={14} /> Failed: {parseResult.invalidRows.length}
                    </span>
                  )}
                </div>

                {parseResult.invalidRows.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs space-y-2 max-h-48 overflow-y-auto">
                    <p className="font-semibold text-amber-900 flex items-center gap-1">
                      <AlertCircle size={14} /> Row-Level Validation Errors (Skipped from Import):
                    </p>
                    <ul className="space-y-1.5 pl-1">
                      {parseResult.invalidRows.map((inv, idx) => (
                        <li key={idx} className="text-amber-800 border-b border-amber-200/50 pb-1.5 last:border-0 last:pb-0">
                          <span className="font-semibold">Row {inv.rowNumber} ("{inv.taskName}"):</span>
                          <ul className="list-disc list-inside pl-2 text-amber-900 mt-0.5">
                            {inv.errors.map((err, eIdx) => (
                              <li key={eIdx}>{err}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
