import { ClipboardList, Users, ShieldAlert, Cpu } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: "Task & Skill Specification",
      description:
        "Define project tasks, estimated completion durations, and required skill criteria for each task item.",
      cardBg: "bg-white border-[#E2E8E4] hover:border-[#0284C7] shadow-xs hover:shadow-md",
      iconBg: "bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20",
      numColor: "text-sky-200 group-hover:text-[#0284C7]",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      stageColor: "text-[#0284C7]",
      dotBg: "bg-[#0284C7]",
    },
    {
      number: "02",
      icon: Users,
      title: "Resource & Role Alignment",
      description:
        "Select candidate resources, register monthly salary metrics, role classifications, and registered skillsets.",
      cardBg: "bg-white border-[#E2E8E4] hover:border-sky-400 shadow-xs hover:shadow-md",
      iconBg: "bg-sky-600 text-white shadow-md shadow-sky-600/20",
      numColor: "text-sky-200 group-hover:text-sky-600",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      stageColor: "text-sky-700",
      dotBg: "bg-sky-600",
    },
    {
      number: "03",
      icon: ShieldAlert,
      title: "Business Rule Evaluation",
      description:
        "Business Rule Engine evaluates skill matching and constraint validation to identify eligible resources.",
      cardBg: "bg-white border-[#E2E8E4] hover:border-amber-400 shadow-xs hover:shadow-md",
      iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
      numColor: "text-amber-200 group-hover:text-amber-600",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      stageColor: "text-amber-700",
      dotBg: "bg-amber-500",
    },
    {
      number: "04",
      icon: Cpu,
      title: "Hungarian Matrix Optimization",
      description:
        "Construct Cost & Profit Matrices and execute Hungarian Algorithm reduction for optimal zero-conflict assignments.",
      cardBg: "bg-white border-[#E2E8E4] hover:border-emerald-400 shadow-xs hover:shadow-md",
      iconBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
      numColor: "text-emerald-200 group-hover:text-emerald-600",
      titleColor: "text-[#19211C]",
      descColor: "text-slate-600",
      stageColor: "text-emerald-700",
      dotBg: "bg-emerald-600",
    },
  ];

  return (
    <section id="workflow" className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-50 border-y border-[#E2E8E4] relative overflow-hidden">
      {/* Background Subtle Ambient Glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-sky-200/20 via-blue-200/25 to-slate-200/20 blur-3xl pointer-events-none rounded-full -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 right-0 w-[450px] h-[250px] bg-gradient-to-l from-blue-200/20 via-sky-200/20 to-slate-200/20 blur-3xl pointer-events-none rounded-full -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284C7] px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 inline-block mb-3 shadow-2xs">
            Workflow Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#19211C]">
            4-Step Optimization Pipeline
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            From raw project requirements to mathematically proven resource assignments.
          </p>
        </div>

        {/* Workflow Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative rounded-3xl border ${step.cardBg} p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${step.iconBg} shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <span className={`text-3xl font-extrabold ${step.numColor} transition-colors`}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold ${step.titleColor} mb-2`}>{step.title}</h3>
                  <p className={`text-xs sm:text-sm ${step.descColor} leading-relaxed font-medium`}>
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${step.stageColor}`}>Stage {idx + 1} of 4</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${step.dotBg} shadow-xs`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


