import { Eye, Pencil, Trash2, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function ActionButtons({
  onView,
  onEdit,
  onPdf,
  onDownload,
  onDelete,
  viewTitle = "View",
  editTitle = "Edit",
  pdfTitle = "Download PDF Report",
  downloadTitle = "Download Excel Report",
  deleteTitle = "Delete Assignment",
  className = "",
  downloadingPdf = false,
  downloadingExcel = false,
}) {
  return (
    <div className={`flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap ${className}`}>
      {onView && (
        <IconButton icon={Eye} onClick={onView} title={viewTitle} variant="blue" size="md" />
      )}
      {onEdit && (
        <IconButton icon={Pencil} onClick={onEdit} title={editTitle} variant="slate" size="md" />
      )}
      {onPdf && (
        <button
          type="button"
          onClick={onPdf}
          title={pdfTitle}
          aria-label={pdfTitle}
          disabled={downloadingPdf}
          className="inline-flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0 whitespace-nowrap"
        >
          {downloadingPdf ? (
            <Loader2 size={13} className="animate-spin text-rose-600 shrink-0" />
          ) : (
            <FileText size={13} className="text-rose-600 shrink-0" />
          )}
          <span>PDF</span>
        </button>
      )}
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          title={downloadTitle}
          aria-label={downloadTitle}
          disabled={downloadingExcel}
          className="inline-flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0 whitespace-nowrap"
        >
          {downloadingExcel ? (
            <Loader2 size={13} className="animate-spin text-emerald-600 shrink-0" />
          ) : (
            <FileSpreadsheet size={13} className="text-emerald-600 shrink-0" />
          )}
          <span>XLSX</span>
        </button>
      )}
      {onDelete && (
        <IconButton
          icon={Trash2}
          onClick={onDelete}
          title={deleteTitle}
          variant="red"
          size="md"
        />
      )}
    </div>
  );
}
