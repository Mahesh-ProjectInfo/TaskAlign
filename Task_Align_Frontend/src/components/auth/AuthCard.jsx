export default function AuthCard({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-[#E2E8E4] bg-white p-6 sm:p-8 shadow-xl ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold tracking-tight text-[#1E2421]">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-[#525E57]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}


