import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Cpu, CheckCircle2, ShieldCheck, BarChart3, TrendingDown, Check } from "lucide-react";
import Button from "@/components/common/Button.jsx";
import StatusBadge from "@/components/common/StatusBadge.jsx";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-sky-50/80 via-slate-50 to-blue-50/30">
      {/* Rich Corporate Accent Ambient Glows */}
      <div 
        aria-hidden="true" 
        className="absolute -top-12 left-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/20 via-[#0284C7]/20 to-blue-400/15 blur-3xl pointer-events-none rounded-full -z-10 animate-pulse duration-10000" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-gradient-to-bl from-blue-400/20 via-sky-300/20 to-slate-200/30 blur-3xl pointer-events-none rounded-full -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Corporate Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sky-200 shadow-xs mb-6 text-xs font-semibold text-slate-800 transition-all">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0284C7]" />
          </span>
          <span className="text-[#0284C7] font-medium">Engine Active:</span>
          <span className="font-bold text-slate-900">Hungarian Matrix v2.0 Live</span>
          <Sparkles size={14} className="text-[#0284C7] shrink-0" />
        </div>

        {/* Display Headline with Corporate Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#19211C] leading-[1.12] max-w-4xl mx-auto">
          Optimize Resource Allocation with{" "}
          <span className="relative inline-block bg-gradient-to-r from-[#0284C7] via-sky-600 to-[#0369A1] bg-clip-text text-transparent pb-1">
            Mathematical Precision
            <svg
              className="absolute -bottom-1 left-0 w-full h-3 text-[#0284C7]/30"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M0,15 Q50,3 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
        </h1>

        {/* Lead Subtext */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Automate resource-to-task assignment using Hungarian Algorithm matrix optimization.
          Seamlessly balance skills, monthly resource costs, task durations, and operational business rules.
        </p>

        {/* Action Button Group */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="hero"
            icon={ArrowRight}
            onClick={() => navigate("/login")}
            className="text-sm font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white border-none shadow-lg shadow-[#0284C7]/25 hover:shadow-xl hover:shadow-[#0284C7]/35 transition-all duration-200 hover:-translate-y-0.5 rounded-full px-7"
          >
            Start Optimization Engine
          </Button>

          <Button
            variant="outline"
            size="hero"
            onClick={() => {
              const el = document.querySelector("#optimization");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm font-bold border-sky-200 bg-white/90 hover:bg-sky-50/70 text-[#0284C7] shadow-xs transition-all duration-200 rounded-full px-7"
          >
            Explore Matrix Preview
          </Button>
        </div>

        {/* Feature Highlights Pills */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-900 shadow-2xs">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>Skill Matching Verification</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50/90 border border-sky-200 text-sky-900 shadow-2xs">
            <ShieldCheck size={15} className="text-[#0284C7] shrink-0" />
            <span>Business Rule Engine</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 shadow-2xs">
            <BarChart3 size={15} className="text-amber-600 shrink-0" />
            <span>Cost & Profit Scoring</span>
          </div>
        </div>

        {/* Hero Interactive Card Mockup */}
        <div className="mt-12 sm:mt-14 relative max-w-4xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl border border-[#E2E8E4] bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 text-left">
            {/* Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E2E8E4]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20 shrink-0">
                  <Cpu size={22} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#19211C] leading-snug">
                    Assignment Run #1042 — Active Preview
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Hungarian Algorithm • Minimum Cost Allocation Strategy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="Completed" tone="green">
                  Optimal Match Found
                </StatusBadge>
              </div>
            </div>

            {/* Matrix Quick Grid KPI Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Allocated Resources KPI */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-[#E2E8E4] hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Allocated Resources
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#19211C] mt-2 tracking-tight">
                  12 / 12
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-1.5">
                  <Check size={14} className="shrink-0 text-emerald-600" />
                  <span>100% Skill Satisfied</span>
                </div>
              </div>

              {/* Total Estimated Cost KPI */}
              <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 hover:border-sky-300 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">
                    Total Estimated Cost
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7] shadow-xs" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-950 mt-2 tracking-tight">
                  $42,800
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#0284C7] font-bold mt-1.5">
                  <TrendingDown size={14} className="shrink-0 text-[#0284C7]" />
                  <span>↓ 18.4% Cost Reduction</span>
                </div>
              </div>

              {/* Optimization Score KPI */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 hover:border-amber-300 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Optimization Score
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-2 tracking-tight">
                  98.6 / 100
                </p>
                <p className="text-xs text-amber-800 font-semibold mt-1.5">
                  Zero Constraint Violations
                </p>
              </div>
            </div>

            {/* Pairings Preview Badges */}
            <div className="mt-6 pt-5 border-t border-[#E2E8E4] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-700">Optimal Resource-Task Pairings:</span>
              <div className="flex flex-wrap gap-2.5">
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-800 font-medium">Res-01 → Auth Module</span>
                  <span className="text-emerald-950 font-bold">($3,200)</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-950 font-semibold border border-sky-200 flex items-center gap-2">
                  <span className="text-[#0284C7] font-medium">Res-02 → Matrix Solver</span>
                  <span className="text-sky-950 font-bold">($4,500)</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-950 font-semibold border border-amber-200 flex items-center gap-2">
                  <span className="text-amber-800 font-medium">Res-03 → UI Redesign</span>
                  <span className="text-amber-950 font-bold">($2,800)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}


