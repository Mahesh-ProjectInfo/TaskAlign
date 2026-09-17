import { Link } from "react-router-dom";
import { CheckSquare, ArrowUpRight } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants.js";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0F172A] via-[#0B132B] to-[#020617] text-slate-300 pt-16 pb-8 text-xs border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#0284C7]/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none rounded-full -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#0284C7] text-white font-bold shadow-md shadow-[#0284C7]/30">
                <CheckSquare size={18} />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {APP_TAGLINE} — Optimized resource-to-task assignment web application.
            </p>
          </div>

          {/* Product Modules */}
          <div>
            <h4 className="font-extrabold text-[#38BDF8] uppercase text-[11px] tracking-wider mb-4">
              Product Modules
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Authentication & Users
                </Link>
              </li>
              <li>
                <Link to="/master-data/resources" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Master Data Management
                </Link>
              </li>
              <li>
                <Link to="/create-assignment" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Assignment Management
                </Link>
              </li>
              <li>
                <Link to="/assignment-results" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Hungarian Optimization
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Resources */}
          <div>
            <h4 className="font-extrabold text-[#38BDF8] uppercase text-[11px] tracking-wider mb-4">
              Documentation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/help-guide" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  User Help Guide
                </Link>
              </li>
              <li>
                <a href="#workflow" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Optimization Workflow
                </a>
              </li>
              <li>
                <a href="#optimization" className="hover:text-[#38BDF8] transition-colors font-medium text-slate-300">
                  Matrix Preview Mode
                </a>
              </li>
            </ul>
          </div>

          {/* Engine Architecture */}
          <div>
            <h4 className="font-extrabold text-[#38BDF8] uppercase text-[11px] tracking-wider mb-4">
              Engine Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3 font-medium">
              Spring Boot + React Architecture powered by the Hungarian Algorithm.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-950/80 text-sky-200 font-bold text-[11px] border border-sky-700/50 shadow-xs">
              <span>Matrix Engine v2.0</span>
              <ArrowUpRight size={14} className="text-[#38BDF8]" />
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 font-medium text-slate-400">
          <p>© {currentYear} {APP_NAME}. All rights preserved.</p>
          <p className="text-slate-400">Built with React & Hungarian Algorithm Optimization</p>
        </div>
      </div>
    </footer>

  );
}

