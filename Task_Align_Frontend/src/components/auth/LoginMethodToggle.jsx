export default function LoginMethodToggle({ activeTab = "email", onChange }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-border-subtle bg-surface-muted p-1">
      <button
        type="button"
        onClick={() => onChange?.("email")}
        className={`rounded-full px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring ${
          activeTab === "email"
            ? "bg-primary-500 text-ink-inverse shadow-xs"
            : "text-ink-secondary hover:bg-surface-card hover:text-ink-primary"
        }`}
      >
        Email Login
      </button>

      <button
        type="button"
        onClick={() => onChange?.("mobile")}
        className={`rounded-full px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring ${
          activeTab === "mobile"
            ? "bg-primary-500 text-ink-inverse shadow-xs"
            : "text-ink-secondary hover:bg-surface-card hover:text-ink-primary"
        }`}
      >
        Mobile Login
      </button>
    </div>
  );
}