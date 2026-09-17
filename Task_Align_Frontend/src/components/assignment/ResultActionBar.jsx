import { ArrowLeft, Save, FileText, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button.jsx";

export default function ResultActionBar({
  onPrevious,
  onGoToCreateAssignment,
  onSave,
  onPdf,
  onExcel,
  onFinish,
  className = "",
}) {
  return (
    <div className={`sticky bottom-0 ${className}`}>
      <div className="bg-white/90 backdrop-blur rounded-xl ring-1 ring-slate-100 shadow-sm px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <Button variant="neutral" icon={ArrowLeft} onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="blue" icon={Save} onClick={onGoToCreateAssignment || onSave}>
            Go to Create Assignment
          </Button>
          <Button variant="red" icon={FileText} onClick={onPdf}>
            Generate PDF
          </Button>
          <Button variant="green" icon={FileSpreadsheet} onClick={onExcel}>
            Generate Excel
          </Button>
          <Button variant="darkTeal" icon={CheckCircle2} onClick={onFinish}>
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
