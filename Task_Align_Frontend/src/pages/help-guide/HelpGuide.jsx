import { useState, useMemo } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Database,
  Download,
  PlusCircle,
  ShieldCheck,
  FileSpreadsheet,
  UserCheck,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Search,
  X,
  LogIn,
  Users,
  TrendingUp,
} from "lucide-react";
import SampleTemplateCard from "@/components/help-guide/SampleTemplateCard.jsx";
import HelpGuideAccordionItem from "@/components/help-guide/HelpGuideAccordionItem.jsx";
import HelpGuideIllustration from "@/components/help-guide/HelpGuideIllustration.jsx";

const SECTIONS = [
  {
    id: "getting-started",
    title: "1. Getting Started",
    icon: BookOpen,
    badgeText: "Overview",
    summary: "System overview, key benefits, and how Task Align works.",
  },
  {
    id: "dashboard-guide",
    title: "2. Dashboard Guide",
    icon: LayoutDashboard,
    badgeText: "Analytics",
    summary: "Understand your dashboard and key insights at a glance.",
  },
  {
    id: "master-data-guide",
    title: "3. Master Data Guide",
    icon: Database,
    badgeText: "Core Setup",
    summary: "Manage roles, skills, resources and other master data efficiently.",
  },
  {
    id: "sample-template",
    title: "4. Resource Upload Template",
    icon: Download,
    badgeText: "Bulk Upload CSV",
    summary: "Download the template and upload resource data in bulk.",
  },
  {
    id: "create-assignment-guide",
    title: "5. Create Assignment Guide",
    icon: PlusCircle,
    badgeText: "5-Step Wizard",
    summary: "Step-by-step guide to create assignments and define requirements.",
  },
  {
    id: "business-rules-guide",
    title: "6. Business Rule & Skill Matching",
    icon: ShieldCheck,
    badgeText: "Matching Engine",
    summary: "Understand skill matching matrix and business rules validation.",
  },
  {
    id: "reports-guide",
    title: "7. Reports & Excel Export",
    icon: FileSpreadsheet,
    badgeText: "Exports",
    summary: "Generate optimized reports and export data to Excel.",
  },
  {
    id: "account-auth-guide",
    title: "8. Account & Authentication",
    icon: UserCheck,
    badgeText: "Access",
    summary: "Manage your profile, change password and authentication settings.",
  },
  {
    id: "settings-guide",
    title: "9. Settings Guide",
    icon: SettingsIcon,
    badgeText: "Profile & Security",
    summary: "Configure system settings and preferences.",
  },
  {
    id: "troubleshooting-guide",
    title: "10. Troubleshooting & FAQs",
    icon: HelpCircle,
    badgeText: "Support",
    summary: "Find solutions to common issues and frequently asked questions.",
  },
];

export default function HelpGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSectionIds, setExpandedSectionIds] = useState(new Set());
  const [openTroubleshoot, setOpenTroubleshoot] = useState({
    login: true,
    save: false,
    eligible: false,
    excel: false,
  });

  // Filter sections based on live search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.badgeText.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleSection = (id) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleTroubleshoot = (key) => {
    setOpenTroubleshoot((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine if a section should be open (either toggled by user, or active search)
  const isSectionOpen = (id) => {
    if (searchQuery.trim().length > 0) return true;
    return expandedSectionIds.has(id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-surface-card border border-border-subtle p-6 sm:p-10 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="md:col-span-7 space-y-5 z-10">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight">
                Help & Guide
              </h1>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
                Learn how to navigate Task Align, manage master data, build assignments, and generate optimized allocations.
              </p>
            </div>

            {/* Search Input Field */}
            <div className="relative max-w-lg">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for topics..."
                className="w-full rounded-full border border-border-default bg-surface-card py-3.5 pl-11 pr-10 text-sm text-ink-primary placeholder:text-ink-muted focus:border-accent-main focus:outline-none focus:ring-2 focus:ring-accent-ring transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary transition-colors p-1 rounded-full hover:bg-secondary-soft/50"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Hero Right Visual Illustration */}
          <div className="md:col-span-5 flex justify-center md:justify-end z-10">
            <HelpGuideIllustration className="w-full max-w-[260px] sm:max-w-[290px] h-auto drop-shadow-xs" />
          </div>
        </div>
      </section>

      {/* QUICK START SECTION ("GET STARTED") */}
      <section className="space-y-4">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-secondary">
          GET STARTED
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Card 1: Login */}
          <div className="relative rounded-2xl border border-border-subtle bg-surface-card p-5 space-y-3 shadow-xs hover:border-border-strong hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary-soft text-xs font-bold text-primary-500 border border-border-default">
                1
              </span>
              <div className="p-2 rounded-xl bg-secondary-soft text-primary-500 border border-border-default">
                <LogIn size={20} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#163C3B]">Login</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Sign in with your email or mobile credentials.
              </p>
            </div>
          </div>

          {/* Card 2: Master Data Setup */}
          <div className="relative rounded-2xl border border-[#E2E8E4] bg-white p-5 space-y-3 shadow-xs hover:border-[#99CDD8]/70 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#DAEBE3] text-xs font-bold text-[#163C3B]">
                2
              </span>
              <div className="p-2 rounded-xl bg-[#DAEBE3]/50 text-[#163C3B]">
                <Users size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163C3B]">Master Data Setup</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Configure roles, skills, resources and more.
              </p>
            </div>
          </div>

          {/* Card 3: Create Assignment */}
          <div className="relative rounded-2xl border border-[#E2E8E4] bg-white p-5 space-y-3 shadow-xs hover:border-[#99CDD8]/70 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#DAEBE3] text-xs font-bold text-[#163C3B]">
                3
              </span>
              <div className="p-2 rounded-xl bg-[#DAEBE3]/50 text-[#163C3B]">
                <PlusCircle size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163C3B]">Create Assignment</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Define assignment details and required skills.
              </p>
            </div>
          </div>

          {/* Card 4: Optimization & Report */}
          <div className="relative rounded-2xl border border-[#E2E8E4] bg-white p-5 space-y-3 shadow-xs hover:border-[#99CDD8]/70 hover:shadow-sm transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#DAEBE3] text-xs font-bold text-[#163C3B]">
                4
              </span>
              <div className="p-2 rounded-xl bg-[#DAEBE3]/50 text-[#163C3B]">
                <TrendingUp size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163C3B]">Optimization & Report</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Run optimization and download Excel reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USER GUIDES SECTION */}
      <section className="space-y-4">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
          USER GUIDES
        </h2>

        <div className="space-y-3.5">
          {/* SECTION 1: GETTING STARTED */}
          {filteredSections.some((s) => s.id === "getting-started") && (
            <HelpGuideAccordionItem
              id="getting-started"
              title="1. Getting Started"
              summary="System overview, key benefits, and how Task Align works."
              icon={BookOpen}
              badgeText="Overview"
              isOpen={isSectionOpen("getting-started")}
              onToggle={() => toggleSection("getting-started")}
              steps={[
                {
                  title: "1. Login",
                  description: "Sign in with your email or registered mobile credentials.",
                },
                {
                  title: "2. Master Data Setup",
                  description: "Configure Assignment Types, Roles, Skills, and Resources.",
                },
                {
                  title: "3. Create Assignment",
                  description: "Define assignment title, select resources, tasks & required skills.",
                },
                {
                  title: "4. Optimization & Report",
                  description: "Run Hungarian v2.0 optimization engine and export formatted Excel report.",
                },
              ]}
              importantNotes="Always ensure Master Data (Roles, Skills, Resources) is set up first before launching the Create Assignment wizard."
            >
              {/* End-to-End Visual Workflow Node Banner */}
              <div className="rounded-xl bg-[#F7FAFA] border border-[#E2E8E4] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#163C3B] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#99CDD8]" />
                  Complete Operational Flow
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1E2421]">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">Login</span>
                  <ArrowRight size={12} className="text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">Dashboard</span>
                  <ArrowRight size={12} className="text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">Master Data</span>
                  <ArrowRight size={12} className="text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-[#DAEBE3] border border-[#99CDD8] text-[#163C3B]">
                    Create Assignment
                  </span>
                  <ArrowRight size={12} className="text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">Optimization Engine</span>
                  <ArrowRight size={12} className="text-slate-400" />
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">Excel Report</span>
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 2: DASHBOARD GUIDE */}
          {filteredSections.some((s) => s.id === "dashboard-guide") && (
            <HelpGuideAccordionItem
              id="dashboard-guide"
              title="2. Dashboard Guide"
              summary="Understand your dashboard and key insights at a glance."
              icon={LayoutDashboard}
              badgeText="Analytics"
              isOpen={isSectionOpen("dashboard-guide")}
              onToggle={() => toggleSection("dashboard-guide")}
              steps={[
                {
                  title: "1. View Stat Cards",
                  description: "Monitor total assignments, active resources, and total project costs.",
                },
                {
                  title: "2. Check Status Chart",
                  description: "Review assignment distribution (Draft, Processing, Completed).",
                },
                {
                  title: "3. Type Distribution",
                  description: "Analyze assignment types across different project domains.",
                },
                {
                  title: "4. Quick Actions",
                  description: "Jump straight into Create Assignment or Master Data management.",
                },
              ]}
              importantNotes="Stat cards automatically refresh as you create new assignments or update resource records."
            />
          )}

          {/* SECTION 3: MASTER DATA GUIDE */}
          {filteredSections.some((s) => s.id === "master-data-guide") && (
            <HelpGuideAccordionItem
              id="master-data-guide"
              title="3. Master Data Guide"
              summary="Manage roles, skills, resources and other master data efficiently."
              icon={Database}
              badgeText="Core Setup"
              isOpen={isSectionOpen("master-data-guide")}
              onToggle={() => toggleSection("master-data-guide")}
              importantNotes="Verify that every resource has at least one skill tagged so they can be matched during assignment creation."
            >
              {/* Master Data Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-[#E2E8E4] p-3.5 bg-white space-y-1.5">
                  <span className="text-xs font-bold text-[#163C3B] block">Assignment Types</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Categorizes assignments (e.g. Software Development, Maintenance, Research). Used for grouping and reporting.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8E4] p-3.5 bg-white space-y-1.5">
                  <span className="text-xs font-bold text-[#163C3B] block">Roles</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Defines job titles (e.g. Backend Developer, UI/UX Designer, QA Engineer) associated with resources.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8E4] p-3.5 bg-white space-y-1.5">
                  <span className="text-xs font-bold text-[#163C3B] block">Skills</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Specific technical/functional abilities (e.g. Java, React, SQL). Crucial for resource-to-task matching.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8E4] p-3.5 bg-white space-y-1.5">
                  <span className="text-xs font-bold text-[#163C3B] block">Resources</span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Team members with assigned roles, monthly salaries, performance ratings, and skill sets.
                  </p>
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 4: RESOURCE UPLOAD TEMPLATE */}
          {filteredSections.some((s) => s.id === "sample-template") && (
            <HelpGuideAccordionItem
              id="sample-template"
              title="4. Resource Upload Template"
              summary="Download the template and upload resource data in bulk."
              icon={Download}
              badgeText="Bulk Upload CSV"
              isOpen={isSectionOpen("sample-template")}
              onToggle={() => toggleSection("sample-template")}
              importantNotes="Do not change the header column names in the downloaded file. Skills should be separated by semicolons (;) in the CSV."
            >
              <SampleTemplateCard />
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 5: CREATE ASSIGNMENT GUIDE */}
          {filteredSections.some((s) => s.id === "create-assignment-guide") && (
            <HelpGuideAccordionItem
              id="create-assignment-guide"
              title="5. Create Assignment Guide"
              summary="Step-by-step guide to create assignments and define requirements."
              icon={PlusCircle}
              badgeText="5-Step Wizard"
              isOpen={isSectionOpen("create-assignment-guide")}
              onToggle={() => toggleSection("create-assignment-guide")}
              steps={[
                {
                  title: "Step 1: Details",
                  description: "Enter title, description, select assignment type, budget & timeline.",
                },
                {
                  title: "Step 2: Resources",
                  description: "Select available resources from master data for this project.",
                },
                {
                  title: "Step 3: Tasks",
                  description: "Add individual project tasks with expected workloads.",
                },
                {
                  title: "Step 4: Task Skills",
                  description: "Define required skill competencies for each task.",
                },
                {
                  title: "Step 5: Constraints",
                  description: "Set cost bounds, timeline limits, and strategy focus.",
                },
              ]}
              importantNotes="The final stage evaluates business rules, matches eligible resources, and prepares the matrix input handoff for optimization."
            />
          )}

          {/* SECTION 6: BUSINESS RULES & SKILL MATCHING */}
          {filteredSections.some((s) => s.id === "business-rules-guide") && (
            <HelpGuideAccordionItem
              id="business-rules-guide"
              title="6. Business Rule & Skill Matching"
              summary="Understand skill matching matrix and business rules validation."
              icon={ShieldCheck}
              badgeText="Matching Engine"
              isOpen={isSectionOpen("business-rules-guide")}
              onToggle={() => toggleSection("business-rules-guide")}
              importantNotes="A resource is considered 'Eligible' when they possess all required skills for a given task."
            >
              {/* Visual Skill Matching Process Flow */}
              <div className="rounded-xl border border-[#E2E8E4] bg-[#F7FAFA] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#163C3B] block">
                  Skill Matching Concept
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8E4] flex-1 w-full">
                    <span className="text-xs font-bold text-slate-700 block">Task Required Skills</span>
                    <span className="text-[11px] text-slate-500">e.g. Java, Spring Boot</span>
                  </div>
                  <ArrowRight size={18} className="text-[#99CDD8] shrink-0 rotate-90 sm:rotate-0" />
                  <div className="p-3 rounded-xl bg-white border border-[#E2E8E4] flex-1 w-full">
                    <span className="text-xs font-bold text-slate-700 block">Resource Skills</span>
                    <span className="text-[11px] text-slate-500">e.g. Java, Spring Boot, SQL</span>
                  </div>
                  <ArrowRight size={18} className="text-[#99CDD8] shrink-0 rotate-90 sm:rotate-0" />
                  <div className="p-3 rounded-xl bg-[#DAEBE3] border border-[#99CDD8] flex-1 w-full">
                    <span className="text-xs font-bold text-[#163C3B] block">Eligible Resource</span>
                    <span className="text-[11px] text-emerald-800 font-semibold">Matched & Ready</span>
                  </div>
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 7: REPORTS & EXCEL EXPORT */}
          {filteredSections.some((s) => s.id === "reports-guide") && (
            <HelpGuideAccordionItem
              id="reports-guide"
              title="7. Reports & Excel Export"
              summary="Generate optimized reports and export data to Excel."
              icon={FileSpreadsheet}
              badgeText="Exports"
              isOpen={isSectionOpen("reports-guide")}
              onToggle={() => toggleSection("reports-guide")}
              steps={[
                {
                  title: "1. Open Assignment",
                  description: "Go to Assignment Results or select an item in Assignment History.",
                },
                {
                  title: "2. Select Export Excel",
                  description: "Click the 'Export Excel' button in the result action bar.",
                },
                {
                  title: "3. Save File",
                  description: "Browser will download the formatted .xlsx report immediately.",
                },
                {
                  title: "4. Review Report",
                  description: "Open in Excel to view cost breakdowns and resource allocations.",
                },
              ]}
              importantNotes="Ensure the assignment optimization has completed before requesting an Excel download."
            />
          )}

          {/* SECTION 8: ACCOUNT & AUTHENTICATION */}
          {filteredSections.some((s) => s.id === "account-auth-guide") && (
            <HelpGuideAccordionItem
              id="account-auth-guide"
              title="8. Account & Authentication"
              summary="Manage your profile, change password and authentication settings."
              icon={UserCheck}
              badgeText="Access"
              isOpen={isSectionOpen("account-auth-guide")}
              onToggle={() => toggleSection("account-auth-guide")}
              importantNotes="Task Align supports both Email/Password login and registered Mobile Number authentication."
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E2421]">
                    <Mail size={14} className="text-[#99CDD8]" />
                    1. Login
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enter registered email or mobile number along with your account password.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E2421]">
                    <UserCheck size={14} className="text-[#99CDD8]" />
                    2. Registration
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Provide full name, email, mobile, gender, state, and country details.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E2421]">
                    <Lock size={14} className="text-[#99CDD8]" />
                    3. Forgot Password
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Enter email → Receive OTP → Verify OTP → Set your new password.
                  </p>
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 9: SETTINGS GUIDE */}
          {filteredSections.some((s) => s.id === "settings-guide") && (
            <HelpGuideAccordionItem
              id="settings-guide"
              title="9. Settings Guide"
              summary="Configure system settings and preferences."
              icon={SettingsIcon}
              badgeText="Profile & Security"
              isOpen={isSectionOpen("settings-guide")}
              onToggle={() => toggleSection("settings-guide")}
              importantNotes="Only features currently implemented in the frontend (Profile & Password) are active."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <span className="text-xs font-bold text-[#163C3B] block">My Profile & Edit Profile</span>
                  <p className="text-[11px] text-slate-500">
                    View current authenticated user details. Edit Full Name, Gender, State, Country, and local avatar preview.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8E4] space-y-1">
                  <span className="text-xs font-bold text-[#163C3B] block">Change Password</span>
                  <p className="text-[11px] text-slate-500">
                    Update login credentials by supplying current password, new password, and confirmation.
                  </p>
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* SECTION 10: TROUBLESHOOTING & FAQS */}
          {filteredSections.some((s) => s.id === "troubleshooting-guide") && (
            <HelpGuideAccordionItem
              id="troubleshooting-guide"
              title="10. Troubleshooting & FAQs"
              summary="Find solutions to common issues and frequently asked questions."
              icon={HelpCircle}
              badgeText="Support"
              isOpen={isSectionOpen("troubleshooting-guide")}
              onToggle={() => toggleSection("troubleshooting-guide")}
            >
              {/* Troubleshooting Accordions */}
              <div className="space-y-3 pt-1">
                {/* FAQ 1: Cannot Log In */}
                <div className="rounded-xl border border-[#E2E8E4] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleTroubleshoot("login")}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-[#1E2421] bg-[#F7FAFA] hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      "I cannot log in to my account"
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${openTroubleshoot.login ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openTroubleshoot.login && (
                    <div className="p-4 border-t border-[#E2E8E4] text-xs text-slate-600 space-y-2 bg-white">
                      <p className="font-semibold text-slate-800">Checklist:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Verify email address or mobile number spelling.</li>
                        <li>Ensure Caps Lock is turned off when entering your password.</li>
                        <li>Check internet connectivity and server availability.</li>
                        <li>If password is forgotten, use the "Forgot Password" OTP recovery flow.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* FAQ 2: Cannot Save Data */}
                <div className="rounded-xl border border-[#E2E8E4] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleTroubleshoot("save")}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-[#1E2421] bg-[#F7FAFA] hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      "I cannot save Master Data or Assignment details"
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${openTroubleshoot.save ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openTroubleshoot.save && (
                    <div className="p-4 border-t border-[#E2E8E4] text-xs text-slate-600 space-y-2 bg-white">
                      <p className="font-semibold text-slate-800">Checklist:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Verify that all required fields marked with an asterisk (*) are filled.</li>
                        <li>Ensure valid relationships are selected (e.g. valid Role and Skills for Resources).</li>
                        <li>Check for inline field validation messages.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* FAQ 3: No Eligible Resources */}
                <div className="rounded-xl border border-[#E2E8E4] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleTroubleshoot("eligible")}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-[#1E2421] bg-[#F7FAFA] hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      "No eligible resources are displayed for a task"
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${openTroubleshoot.eligible ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openTroubleshoot.eligible && (
                    <div className="p-4 border-t border-[#E2E8E4] text-xs text-slate-600 space-y-2 bg-white">
                      <p className="font-semibold text-slate-800">Checklist:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Confirm that resources have been added under Master Data → Resources.</li>
                        <li>Ensure resources have skills tagged that match the required task skills.</li>
                        <li>Check if tasks have specified required skills in Step 4 of the wizard.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* FAQ 4: Excel Report Download */}
                <div className="rounded-xl border border-[#E2E8E4] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleTroubleshoot("excel")}
                    className="flex w-full items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-[#1E2421] bg-[#F7FAFA] hover:bg-slate-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      "Excel report does not download"
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${openTroubleshoot.excel ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openTroubleshoot.excel && (
                    <div className="p-4 border-t border-[#E2E8E4] text-xs text-slate-600 space-y-2 bg-white">
                      <p className="font-semibold text-slate-800">Checklist:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Verify an assignment has completed optimization before exporting.</li>
                        <li>Check if your web browser pop-up blocker is preventing file downloads.</li>
                        <li>Refresh the page and try clicking 'Export Excel' again.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </HelpGuideAccordionItem>
          )}

          {/* EMPTY SEARCH STATE */}
          {filteredSections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center space-y-3 shadow-xs">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#DAEBE3]/50 text-[#163C3B] mx-auto">
                <Search size={22} />
              </div>
              <h3 className="text-base font-bold text-[#1E2421]">No guides found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Try searching for another topic or clear your search query to view all guide sections.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#163C3B] hover:underline cursor-pointer"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>
      </section>

      {/* STILL NEED HELP SUPPORT BANNER
      <section className="rounded-3xl bg-[#F0F7F4] border border-[#DAEBE3] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#DAEBE3] text-[#163C3B]">
            <HelpCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#163C3B]">
              Still need help?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
        </div>

        <a
          href="mailto:kannamsrujan16@gmail.com"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#163C3B] hover:bg-[#0E2A29] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Mail size={16} />
          <span>Contact Support</span>
        </a>
      </section> */}

      {/* FOOTER */}
      <footer className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-medium">
          © 2025 Task Align. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
