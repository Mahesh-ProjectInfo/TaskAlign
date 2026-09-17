import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import Button from "@/components/common/Button.jsx";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-sky-50/50 to-blue-50/40 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0284C7] via-sky-700 to-[#0369A1] p-8 sm:p-12 shadow-2xl shadow-[#0284C7]/25 text-center overflow-hidden text-white border border-sky-400/30">
          {/* Ambient Glows */}
          <div 
            aria-hidden="true" 
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-tr from-sky-400/30 via-blue-300/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none" 
          />
          <div 
            aria-hidden="true" 
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-bl from-blue-300/30 via-sky-300/30 to-slate-400/30 rounded-full blur-3xl pointer-events-none" 
          />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-extrabold text-white mb-6 shadow-xs">
            <Sparkles size={14} className="text-amber-300" />
            <span>Ready for Production Optimization</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Streamline Resource Allocations Today
          </h2>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg text-sky-100 max-w-xl mx-auto font-medium">
            Eliminate scheduling conflicts and optimize project costs using the Task Align Hungarian engine.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="white"
              size="hero"
              icon={ArrowRight}
              onClick={() => navigate("/login")}
              className="text-sm font-extrabold hover:-translate-y-0.5 rounded-full px-7"
            >
              Sign In to Task Align
            </Button>
            <Button
              variant="outline"
              size="hero"
              icon={HelpCircle}
              onClick={() => navigate("/help-guide")}
              className="text-white border-white/60 bg-white/10 hover:bg-white/20 text-sm font-bold shadow-xs transition-all duration-200 rounded-full px-7"
            >
              Explore User Guide
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}


