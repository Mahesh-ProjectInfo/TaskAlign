import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";

export default function SkillMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select skills...",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase())),
    [options, q],
  );

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  const remove = (opt) => onChange(value.filter((v) => v !== opt));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-[40px] flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
      >
        <div className="flex flex-wrap gap-1.5 flex-1 text-left">
          {value.length === 0 ? (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          ) : (
            value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 border border-blue-100/80"
              >
                {v}
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X size={12} />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg bg-white shadow-md border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 bg-slate-50/50">
            <Search size={14} className="text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-500">No matching skills found.</p>
            ) : (
              filtered.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                        checked
                          ? "bg-primary-600 border-primary-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <Check size={12} />}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt)}
                      className="hidden"
                    />
                    <span className="text-slate-800 font-medium">{opt}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

