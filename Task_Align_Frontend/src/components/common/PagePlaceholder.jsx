import { Sparkles } from "lucide-react";

export default function PagePlaceholder({ title, description, icon: Icon = Sparkles }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
      </div>

      <div className="ta-card flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
          <Icon size={28} />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">{description}</p>
        <p className="mt-6 text-xs uppercase tracking-wider text-ink-soft/70">
          Content coming soon
        </p>
      </div>
    </div>
  );
}
