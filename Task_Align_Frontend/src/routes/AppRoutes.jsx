import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout.jsx";
import AuthLayout from "@/components/auth/AuthLayout.jsx";
import ProtectedRoute from "@/components/auth/ProtectedRoute.jsx";

import LandingPage from "@/pages/LandingPage.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import ForgotPassword from "@/pages/auth/ForgotPassword.jsx";
import Dashboard from "@/pages/dashboard/Dashboard.jsx";
import CreateAssignment from "@/pages/assignment/CreateAssignment.jsx";
import AssignmentResults from "@/pages/assignment/AssignmentResults.jsx";
import ProcessingAssignment from "@/pages/assignment/ProcessingAssignment.jsx";
import AssignmentHistory from "@/pages/history/AssignmentHistory.jsx";
import Settings from "@/pages/settings/Settings.jsx";
import HelpGuide from "@/pages/help-guide/HelpGuide.jsx";
import RoleMaster from "@/pages/master-data/RoleMaster.jsx";
import SkillMaster from "@/pages/master-data/SkillMaster.jsx";
import ResourceManagement from "@/pages/master-data/ResourceManagement.jsx";
import NotFound from "@/pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/master-data" element={<Navigate to="/master-data/resources" replace />} />
          <Route path="/master-data/roles" element={<RoleMaster />} />
          <Route path="/master-data/skills" element={<SkillMaster />} />
          <Route path="/master-data/resources" element={<ResourceManagement />} />

          <Route path="/create-assignment" element={<CreateAssignment />} />
          <Route path="/assignment-processing" element={<ProcessingAssignment />} />
          <Route path="/assignment-results" element={<AssignmentResults />} />
          <Route path="/assignment-history" element={<AssignmentHistory />} />
          <Route path="/activity-logs" element={<AssignmentHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Settings />} />
          <Route path="/help-guide" element={<HelpGuide />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
