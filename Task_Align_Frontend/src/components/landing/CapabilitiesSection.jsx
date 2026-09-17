import { CheckSquare, DollarSign, ShieldCheck, Grid, Layers, FileSpreadsheet, Sparkles } from "lucide-react";

export default function CapabilitiesSection() {
  const capabilities = [
    {
      icon: CheckSquare,
      title: "Skill Matching Engine",
      description:
        "Automatically compares required skills against resource competencies to eliminate unqualified assignments prior to matrix generation.",
      badge: "Automated",
      cardBg: "bg-white border-[#E2E8E4] hover:border-emerald-400 shadow-xs hover:shadow-md",
      iconBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
      badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-emerald-700",
    },
    {
      icon: DollarSign,
      title: "Cost & Profit Optimization",
      description:
        "Evaluates resource monthly salaries, estimated task durations, and internal scoring to balance cost minimization or profit maximization.",
      badge: "Dual Scoring",
      cardBg: "bg-white border-[#E2E8E4] hover:border-[#0284C7] shadow-xs hover:shadow-md",
      iconBg: "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20",
      badgeColor: "bg-sky-50 text-[#0284C7] border-sky-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-[#0284C7]",
    },
    {
      icon: ShieldCheck,
      title: "Business Rule Engine",
      description:
        "Enforces operational constraints, resource availability criteria, and project boundaries before forwarding data to Hungarian matrix execution.",
      badge: "Rule Validation",
      cardBg: "bg-white border-[#E2E8E4] hover:border-amber-400 shadow-xs hover:shadow-md",
      iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-amber-700",
    },
    {
      icon: Grid,
      title: "Hungarian Matrix Solver",
      description:
        "Structures Cost and Profit matrices and applies matrix reduction for mathematically optimal, 1-to-1 zero-conflict pairings.",
      badge: "Mathematical",
      cardBg: "bg-white border-[#E2E8E4] hover:border-violet-400 shadow-xs hover:shadow-md",
      iconBg: "bg-violet-600 text-white shadow-md shadow-violet-600/20",
      badgeColor: "bg-violet-50 text-violet-900 border-violet-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-violet-700",
    },
    {
      icon: Layers,
      title: "Master Data Management",
      description:
        "Maintain standardized repositories for Roles, Skills, Resources, and Assignment Types to streamline recurring project allocation.",
      badge: "Registry",
      cardBg: "bg-white border-[#E2E8E4] hover:border-indigo-400 shadow-xs hover:shadow-md",
      iconBg: "bg-indigo-600 text-white shadow-md shadow-indigo-600/20",
      badgeColor: "bg-indigo-50 text-indigo-900 border-indigo-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-indigo-700",
    },
    {
      icon: FileSpreadsheet,
      title: "Audit Reports & Analytics",
      description:
        "Generate comprehensive assignment summaries, workload distribution metrics, execution logs, and exportable reports.",
      badge: "Analytics",
      cardBg: "bg-white border-[#E2E8E4] hover:border-[#0284C7] shadow-xs hover:shadow-md",
      iconBg: "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20",
      badgeColor: "bg-sky-50 text-[#0284C7] border-sky-200",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      footerColor: "border-slate-100 text-[#0284C7]",
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-50 border-b border-[#E2E8E4] relative overflow-hidden">
      {/* Ambient Glow Backdrop */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 right-1/4 w-[600px] h-[350px] bg-gradient-to-bl from-sky-200/20 via-blue-200/25 to-slate-200/20 blur-3xl pointer-events-none rounded-full -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-gradient-to-tr from-slate-200/20 via-sky-200/20 to-blue-200/20 blur-3xl pointer-events-none rounded-full -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7] px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 inline-block mb-3 shadow-2xs">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#19211C]">
            Engineered for Precision Resource Allocation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Comprehensive toolset designed to solve complex multi-resource project allocation challenges.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className={`relative rounded-3xl border ${cap.cardBg} p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${cap.iconBg} shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${cap.badgeColor} shadow-2xs`}>
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold ${cap.titleColor} mb-2`}>{cap.title}</h3>
                  <p className={`text-sm ${cap.descColor} leading-relaxed font-medium`}>
                    {cap.description}
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t ${cap.footerColor} flex items-center gap-1.5 text-xs font-bold`}>
                  <Sparkles size={13} className="shrink-0" />
                  <span>Supported by System Engine</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


