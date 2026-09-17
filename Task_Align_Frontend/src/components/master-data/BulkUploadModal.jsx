import { useRef, useState } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, X, AlertTriangle } from "lucide-react";
import { read, utils } from "xlsx";
import Modal from "@/components/common/Modal.jsx";
import Button from "@/components/common/Button.jsx";
import { useMasterData } from "@/context/MasterDataContext.jsx";

export default function BulkUploadModal({ open, onClose, onConfirmUpload, entityType = "resource" }) {
  const { assignmentTypesList, rolesByType, skillsByType, resources, roles, skills } = useMasterData();

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const isRole = entityType === "role";
  const isSkill = entityType === "skill";

  const modalTitle = isRole
    ? "Bulk Upload Roles"
    : isSkill
      ? "Bulk Upload Skills"
      : "Bulk Upload Resources";

  const templateFileName = isRole
    ? "roles-template.csv"
    : isSkill
      ? "skills-template.csv"
      : "resources-template.csv";

  const importLabel = isRole ? "Roles" : isSkill ? "Skills" : "Resources";

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
    let headers = [];
    let sample = [];

    if (isRole) {
      headers = ["Assignment Type", "Role Name"];
      sample = ["Software Project Assignment", "Backend Developer"];
    } else if (isSkill) {
      headers = ["Assignment Type", "Skill Name"];
      sample = ["Software Project Assignment", "Java"];
    } else {
      headers = [
        "Assignment Type",
        "Resource Name",
        "Role",
        "Monthly Salary",
        "Performance Rating",
        "Skills",
      ];
      sample = [
        "Software Project Assignment",
        "John Doe",
        "Backend Developer",
        "80000",
        "85",
        "Java, Spring Boot, REST API",
      ];
    }

    const csv = headers.join(",") + "\n" + sample.map((v) => `"${v}"`).join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = templateFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetState = () => {
    setSelectedFile(null);
    setFileDetails(null);
    setParsing(false);
    setParseResult(null);
    setUploading(false);
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
            validResources: [],
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
            validResources: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        // Find header row
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
            validResources: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        const headerRow = rows[headerRowIndex].map((h) => String(h).trim());

        if (isRole || isSkill) {
          let typeColIdx = -1;
          let nameColIdx = -1;

          headerRow.forEach((colHeader, idx) => {
            const norm = colHeader.toLowerCase().replace(/[\_\-\s]+/g, "");
            if (norm.includes("assignmenttype") || norm.includes("type")) {
              typeColIdx = idx;
            } else if (isRole && (norm.includes("rolename") || norm.includes("role") || norm.includes("name"))) {
              nameColIdx = idx;
            } else if (isSkill && (norm.includes("skillname") || norm.includes("skill") || norm.includes("name"))) {
              nameColIdx = idx;
            }
          });

          const missingHeaders = [];
          if (typeColIdx === -1) missingHeaders.push("Assignment Type");
          if (nameColIdx === -1) missingHeaders.push(isRole ? "Role Name" : "Skill Name");

          if (missingHeaders.length > 0) {
            setParseResult({
              fatalError: `Missing required column header(s): ${missingHeaders.join(", ")}. File must include headers for Assignment Type and ${isRole ? "Role Name" : "Skill Name"}.`,
              validResources: [],
              invalidRows: [],
            });
            setParsing(false);
            return;
          }

          const existingItemsMap = new Set(
            (isRole ? roles : skills || []).map(
              (item) => `${(item.type || "").trim().toLowerCase()}::${(item.name || "").trim().toLowerCase()}`,
            ),
          );
          const seenFileItemKeys = new Set();

          const validResources = [];
          const invalidRows = [];

          for (let r = headerRowIndex + 1; r < rows.length; r++) {
            const rowData = rows[r];
            const excelLineNum = r + 1;

            if (!rowData || rowData.every((cell) => String(cell).trim() === "")) {
              continue;
            }

            const rawType = String(rowData[typeColIdx] || "").trim();
            const rawName = String(rowData[nameColIdx] || "").trim();
            const rowErrors = [];

            // 1. Assignment Type Validation
            let resolvedType = "";
            if (!rawType) {
              rowErrors.push("Assignment Type is required.");
            } else {
              const normType = rawType.toLowerCase();
              const canonicalType = (assignmentTypesList || []).find((t) => t.toLowerCase() === normType);
              if (canonicalType) {
                resolvedType = canonicalType;
              } else {
                rowErrors.push(`Unknown Assignment Type '${rawType}'.`);
              }
            }

            // 2. Role / Skill Name Validation
            const entityLabel = isRole ? "Role Name" : "Skill Name";
            if (!rawName) {
              rowErrors.push(`${entityLabel} is required.`);
            } else if (rawName.length > 100) {
              rowErrors.push(`${entityLabel} cannot exceed 100 characters.`);
            } else if (resolvedType) {
              const key = `${resolvedType.toLowerCase()}::${rawName.toLowerCase()}`;
              if (existingItemsMap.has(key)) {
                rowErrors.push(`${entityLabel} '${rawName}' already exists under '${resolvedType}'.`);
              } else if (seenFileItemKeys.has(key)) {
                rowErrors.push(`Duplicate ${entityLabel} '${rawName}' in file.`);
              } else {
                seenFileItemKeys.add(key);
              }
            }

            if (rowErrors.length === 0) {
              validResources.push({
                type: resolvedType,
                name: rawName,
              });
            } else {
              invalidRows.push({
                rowNumber: excelLineNum,
                resourceName: rawName || "Unspecified",
                errors: rowErrors,
              });
            }
          }

          setParseResult({
            fatalError: null,
            validResources,
            invalidRows,
            totalProcessed: validResources.length + invalidRows.length,
          });
          setParsing(false);
          return;
        }

        // Header detection (tolerant to case, whitespace, underscores)
        let typeColIdx = -1;
        let nameColIdx = -1;
        let roleColIdx = -1;
        let salaryColIdx = -1;
        let ratingColIdx = -1;
        let skillsColIdx = -1;

        headerRow.forEach((colHeader, idx) => {
          const norm = colHeader.toLowerCase().replace(/[\_\-\s]+/g, "");
          if (norm.includes("assignmenttype") || norm.includes("type")) {
            typeColIdx = idx;
          } else if (norm.includes("resourcename") || norm.includes("name") || norm.includes("resource")) {
            nameColIdx = idx;
          } else if (norm.includes("role")) {
            roleColIdx = idx;
          } else if (norm.includes("salary") || norm.includes("monthlysalary")) {
            salaryColIdx = idx;
          } else if (norm.includes("rating") || norm.includes("performance")) {
            ratingColIdx = idx;
          } else if (norm.includes("skill")) {
            skillsColIdx = idx;
          }
        });

        // Fallback checks
        if (nameColIdx === -1) {
          headerRow.forEach((h, i) => {
            if (h.toLowerCase().includes("name")) nameColIdx = i;
          });
        }

        const missingHeaders = [];
        if (typeColIdx === -1) missingHeaders.push("Assignment Type");
        if (nameColIdx === -1) missingHeaders.push("Resource Name");
        if (roleColIdx === -1) missingHeaders.push("Role");
        if (salaryColIdx === -1) missingHeaders.push("Monthly Salary");
        if (ratingColIdx === -1) missingHeaders.push("Performance Rating");
        if (skillsColIdx === -1) missingHeaders.push("Skills");

        if (missingHeaders.length > 0) {
          setParseResult({
            fatalError: `Missing required column header(s): ${missingHeaders.join(", ")}. File must include headers for Assignment Type, Resource Name, Role, Monthly Salary, Performance Rating, and Skills.`,
            validResources: [],
            invalidRows: [],
          });
          setParsing(false);
          return;
        }

        // Duplicate tracking
        const existingResourceNames = new Set((resources || []).map((r) => (r.name || "").trim().toLowerCase()));
        const seenFileResourceNames = new Set();

        const validResources = [];
        const invalidRows = [];

        // Validate data rows
        for (let r = headerRowIndex + 1; r < rows.length; r++) {
          const rowData = rows[r];
          const excelLineNum = r + 1;

          if (!rowData || rowData.every((cell) => String(cell).trim() === "")) {
            continue;
          }

          const rawType = String(rowData[typeColIdx] || "").trim();
          const rawName = String(rowData[nameColIdx] || "").trim();
          const rawRole = String(rowData[roleColIdx] || "").trim();
          const rawSalary = String(rowData[salaryColIdx] || "").trim();
          const rawRating = String(rowData[ratingColIdx] || "").trim();
          const rawSkills = String(rowData[skillsColIdx] || "").trim();

          const rowErrors = [];

          // 1. Assignment Type Validation
          let resolvedType = "";
          if (!rawType) {
            rowErrors.push("Assignment Type is required.");
          } else {
            const normType = rawType.toLowerCase();
            const canonicalType = (assignmentTypesList || []).find((t) => t.toLowerCase() === normType);
            if (canonicalType) {
              resolvedType = canonicalType;
            } else {
              rowErrors.push(`Unknown Assignment Type '${rawType}'.`);
            }
          }

          // 2. Resource Name Validation
          if (!rawName) {
            rowErrors.push("Resource Name is required.");
          } else if (rawName.length > 150) {
            rowErrors.push("Resource Name cannot exceed 150 characters.");
          } else {
            const normName = rawName.toLowerCase();
            if (existingResourceNames.has(normName)) {
              rowErrors.push(`Resource Name '${rawName}' already exists.`);
            } else if (seenFileResourceNames.has(normName)) {
              rowErrors.push(`Duplicate Resource Name '${rawName}' in file.`);
            } else {
              seenFileResourceNames.add(normName);
            }
          }

          // 3. Role Validation
          if (!rawRole) {
            rowErrors.push("Role is required.");
          } else if (resolvedType) {
            const masterRoles = rolesByType(resolvedType).map((r) => r.name);
            const masterRoleMap = new Set(masterRoles.map((r) => r.toLowerCase()));
            if (!masterRoleMap.has(rawRole.toLowerCase())) {
              rowErrors.push(`Unknown role '${rawRole}' for assignment type '${resolvedType}'.`);
            }
          }

          // 4. Monthly Salary Validation
          if (!rawSalary) {
            rowErrors.push("Monthly Salary is required.");
          } else {
            const numSalary = Number(rawSalary.replace(/[^0-9.]/g, ""));
            if (isNaN(numSalary) || !Number.isFinite(numSalary) || numSalary <= 0) {
              rowErrors.push("Monthly Salary must be a positive number.");
            }
          }

          // 5. Performance Rating Validation
          if (!rawRating) {
            rowErrors.push("Performance Rating is required.");
          } else {
            const numRating = Number(rawRating.replace(/[^0-9.]/g, ""));
            if (isNaN(numRating) || !Number.isFinite(numRating) || numRating < 0 || numRating > 100) {
              rowErrors.push("Performance Rating must be a number between 0 and 100.");
            }
          }

          // 6. Skills Validation
          if (!rawSkills) {
            rowErrors.push("Select at least one skill.");
          } else if (resolvedType) {
            const masterSkillObjs = skillsByType(resolvedType);
            const masterSkillMap = new Map(masterSkillObjs.map((s) => [s.name.toLowerCase(), s.name]));

            const rawSkillTokens = rawSkills.split(/[,;|\n]/).map((s) => s.trim()).filter(Boolean);
            if (rawSkillTokens.length === 0) {
              rowErrors.push("Select at least one skill.");
            } else {
              rawSkillTokens.forEach((token) => {
                const normToken = token.toLowerCase();
                if (!masterSkillMap.has(normToken)) {
                  rowErrors.push(`Unknown skill '${token}' for assignment type '${resolvedType}'.`);
                }
              });
            }
          }

          if (rowErrors.length === 0) {
            validResources.push({
              type: resolvedType,
              name: rawName,
              role: rawRole,
              salary: Number(rawSalary.replace(/[^0-9.]/g, "")),
              rating: Number(rawRating.replace(/[^0-9.]/g, "")),
              skills: rawSkills.split(/[,;|\n]/).map((s) => s.trim()).filter(Boolean),
            });
          } else {
            invalidRows.push({
              rowNumber: excelLineNum,
              resourceName: rawName || "Unspecified",
              errors: rowErrors,
            });
          }
        }

        setParseResult({
          fatalError: null,
          validResources,
          invalidRows,
          totalProcessed: validResources.length + invalidRows.length,
        });
      } catch (err) {
        setParseResult({
          fatalError: "Failed to read or parse file: " + (err.message || "Invalid Excel structure."),
          validResources: [],
          invalidRows: [],
        });
      } finally {
        setParsing(false);
      }
    };

    reader.onerror = () => {
      setParseResult({
        fatalError: "Error reading file from disk.",
        validResources: [],
        invalidRows: [],
      });
      setParsing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!selectedFile || !parseResult || parseResult.validResources.length === 0) return;
    setUploading(true);
    try {
      await onConfirmUpload?.(selectedFile, parseResult.validResources);
      handleClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={modalTitle}
      onClose={handleClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="blue"
            disabled={!parseResult || parseResult.validResources.length === 0 || parsing || uploading}
            loading={uploading}
            onClick={handleImport}
          >
            Import {parseResult?.validResources?.length ? `(${parseResult.validResources.length}) ${importLabel}` : importLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-1">
        <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900 leading-relaxed font-medium">
          Required headers:{" "}
          {isRole ? (
            <>
              <span className="font-semibold">Assignment Type</span>, <span className="font-semibold">Role Name</span>.
            </>
          ) : isSkill ? (
            <>
              <span className="font-semibold">Assignment Type</span>, <span className="font-semibold">Skill Name</span>.
            </>
          ) : (
            <>
              <span className="font-semibold">Assignment Type</span>, <span className="font-semibold">Resource Name</span>, <span className="font-semibold">Role</span>, <span className="font-semibold">Monthly Salary</span>, <span className="font-semibold">Performance Rating</span>, <span className="font-semibold">Skills</span>.
            </>
          )}
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
            <p className="text-xs text-slate-500">Supports .csv, .xlsx, .xls up to 5MB</p>
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
                    <CheckCircle2 size={14} /> Valid: {parseResult.validResources.length}
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
                          <span className="font-semibold">Row {inv.rowNumber} ("{inv.resourceName}"):</span>
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
