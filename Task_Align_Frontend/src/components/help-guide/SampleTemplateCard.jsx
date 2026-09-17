import { Download, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button.jsx";
import { downloadResourceTemplateCsv, RESOURCE_TEMPLATE_HEADERS, RESOURCE_TEMPLATE_SAMPLE_ROW } from "@/utils/templateUtils.js";

export default function SampleTemplateCard() {
  return (
    <div className="rounded-xl border border-border-default bg-secondary-soft/30 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-surface-card border border-border-default text-primary-500 shadow-xs">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink-primary">
              Resource Bulk Upload Template
            </h3>
            <p className="text-xs text-ink-secondary">
              Download the official sample CSV file to structure your resource data before bulk importing.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          icon={Download}
          onClick={downloadResourceTemplateCsv}
          className="shrink-0"
        >
          Download Sample Template
        </Button>
      </div>

      {/* Expected Headers Badges */}
      <div className="space-y-2 pt-2 border-t border-border-subtle">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-500">
          Required CSV Headers
        </span>
        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_TEMPLATE_HEADERS.map((header, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full bg-surface-card border border-border-subtle text-xs font-semibold text-ink-primary shadow-xs"
            >
              {header}
            </span>
          ))}
        </div>
      </div>

      {/* Sample Row Preview Table */}
      <div className="rounded-xl bg-surface-card border border-border-subtle p-3 text-xs overflow-x-auto">
        <span className="text-[11px] font-bold text-ink-muted block mb-1">Sample Row Reference</span>
        <div className="font-mono text-ink-secondary whitespace-nowrap bg-surface-app p-2 rounded-lg border border-border-subtle">
          {RESOURCE_TEMPLATE_SAMPLE_ROW.map((val) => `"${val}"`).join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-status-success-text font-medium">
        <CheckCircle2 size={14} className="text-status-success-text shrink-0" />
        <span>100% compatible with Task Align Master Data Bulk Resource Upload.</span>
      </div>
    </div>
  );
}

