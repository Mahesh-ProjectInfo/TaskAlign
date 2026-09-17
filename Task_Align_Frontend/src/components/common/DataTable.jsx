import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import EmptyState from "./EmptyState.jsx";

export default function DataTable({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  emptyTitle = "No records found.",
  emptyDescription,
  emptyIcon,
  maxHeight = "max-h-[560px]",
  sortKey,
  sortDir,
  onSort,
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName,
}) {
  return (
    <div
      className={`bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden ${className}`}
    >
      <div className={`overflow-auto ${maxHeight}`}>
        <table className={`min-w-full text-sm ${tableClassName}`}>
          <thead className={`sticky top-0 z-10 bg-secondary-soft/80 backdrop-blur-md border-b border-border-default text-ink-secondary ${headerClassName}`}>
            <tr>
              {columns.map((col) => {
                const alignClass =
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                      ? "text-center"
                      : "text-left";
                const isSortable = col.sortable && onSort;
                const isSorted = sortKey === col.key;

                return (
                  <th
                    key={col.key || col.label}
                    className={`font-bold text-[11px] uppercase tracking-wider px-4 py-3.5 ${alignClass} ${col.headerClassName || ""} ${
                      isSortable ? "cursor-pointer select-none hover:text-ink-primary transition-colors" : ""
                    }`}
                    onClick={() => isSortable && onSort(col.key)}
                  >
                    {isSortable ? (
                      <span className={`inline-flex items-center gap-1.5 ${alignClass === "text-right" ? "justify-end" : alignClass === "text-center" ? "justify-center" : "justify-start"}`}>
                        {col.label}
                        {isSorted ? (
                          sortDir === "desc" ? (
                            <ArrowDown size={13} className="text-primary-500 shrink-0" />
                          ) : (
                            <ArrowUp size={13} className="text-primary-500 shrink-0" />
                          )
                        ) : (
                          <ArrowUpDown
                            size={13}
                            className="text-ink-muted/60 shrink-0"
                          />
                        )}
                      </span>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/60 bg-surface-card">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <LoadingSpinner text="Loading data..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const rowKey =
                  typeof keyField === "function"
                    ? keyField(row, idx)
                    : row[keyField] !== undefined
                      ? row[keyField]
                      : idx;
                const customRowClass =
                  typeof rowClassName === "function" ? rowClassName(row, idx) : rowClassName || "";

                return (
                  <tr
                    key={rowKey}
                    className={`hover:bg-surface-app/70 transition-colors ${customRowClass}`}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left";
                      const val = row[col.key];

                      return (
                        <td
                          key={col.key || col.label}
                          className={`px-4 py-3.5 text-ink-primary ${alignClass} ${col.className || ""}`}
                        >
                          {col.render
                            ? col.render(row, idx)
                            : val !== undefined
                              ? String(val)
                              : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}


