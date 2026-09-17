import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, ArrowRight, Menu, X, Sparkles } from "lucide-react";
import Button from "@/components/common/Button.jsx";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants.js";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", href: "#hero" },
    { label: "Workflow", href: "#workflow" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Hungarian Matrix", href: "#optimization" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <nav
          className={`flex items-center justify-between px-5 py-3 transition-all duration-300 rounded-full border ${scrolled
            ? "bg-white/95 backdrop-blur-md border-[#E2E8E4] shadow-md"
            : "bg-white/80 backdrop-blur-sm border-[#E2E8E4] shadow-xs"
            }`}
        >
          {/* Logo & Emblem */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0284C7] text-white shadow-xs group-hover:scale-105 transition-transform">
              <CheckSquare size={18} />
            </div>
            <div>
              <span className="text-base font-bold text-[#19211C] tracking-tight block leading-none">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block leading-tight mt-0.5">
                {APP_TAGLINE}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-[#E2E8E4]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-full transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/register")}
              className="text-xs font-semibold border-[#E2E8E4] text-slate-700 hover:bg-slate-50"
            >
              Sign Up
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate("/login")}
              className="text-xs font-semibold bg-[#0284C7] hover:bg-[#0369A1] text-white"
            >
              Login
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E2E8E4] shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#E2E8E4] flex flex-col gap-2 mt-1">
                <Button
                  variant="outline"
                  size="full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="full"
                  icon={ArrowRight}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  Launch App
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
