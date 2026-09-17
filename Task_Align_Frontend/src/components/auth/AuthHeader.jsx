export default function AuthHeader({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-6 ${className}`}>
      {title && <h1 className="text-2xl font-bold tracking-tight text-[#1E2421]">{title}</h1>}
      {subtitle && <p className="mt-1 text-sm text-[#525E57]">{subtitle}</p>}
    </div>
  );
}


