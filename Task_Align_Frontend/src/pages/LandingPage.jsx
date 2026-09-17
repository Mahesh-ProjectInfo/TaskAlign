import LandingNavbar from "@/components/landing/LandingNavbar.jsx";
import HeroSection from "@/components/landing/HeroSection.jsx";
import WorkflowSection from "@/components/landing/WorkflowSection.jsx";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection.jsx";
import OptimizationPreviewSection from "@/components/landing/OptimizationPreviewSection.jsx";
import CTASection from "@/components/landing/CTASection.jsx";
import LandingFooter from "@/components/landing/LandingFooter.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#19211C] selection:bg-sky-200 selection:text-[#0284C7]">
      {/* Floating Public Navigation Bar */}
      <LandingNavbar />

      {/* Main Page Sections */}
      <main>
        <HeroSection />
        <WorkflowSection />
        <CapabilitiesSection />
        <OptimizationPreviewSection />
        <CTASection />
      </main>

      {/* Public Footer */}
      <LandingFooter />
    </div>
  );
}

