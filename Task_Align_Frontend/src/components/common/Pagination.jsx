import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, totalPages = 1, onChange, className = "" }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onChange?.(p);
  };

  const btn =
    "inline-flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring";

  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className={`${btn} text-ink-primary bg-surface-card border border-border-default hover:bg-secondary-soft/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shadow-2xs`}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} /> <span className="ml-1 hidden sm:inline">Previous</span>
      </button>
      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => go(p)}
          className={`${btn} ${
            p === page
              ? "bg-primary-500 text-white font-semibold shadow-2xs border border-primary-500"
              : "text-ink-primary bg-surface-card border border-border-default hover:bg-secondary-soft/50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className={`${btn} text-ink-primary bg-surface-card border border-border-default hover:bg-secondary-soft/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shadow-2xs`}
        aria-label="Next Page"
      >
        <span className="mr-1 hidden sm:inline">Next</span> <ChevronRight size={16} />
      </button>
    </div>
  );

}

