export default function StepCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}
