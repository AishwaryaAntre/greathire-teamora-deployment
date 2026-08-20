import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import EmployeesListPage from "@/pages/EmployeesListPage";
import ProjectManagement from "@/pages/ProjectManagement";
import MyProjects from "@/pages/MyProjects";
import AttendanceManagement from "@/pages/AttendanceManagement";
import LeaveManagement from "@/pages/LeaveManagement";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage";
import MyProfilePage from "@/pages/MyProfilePage";
import NotificationsCenterPage from "@/pages/NotificationsCenterPage";
import LegalPage from "@/pages/LegalPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import PublicOnlyRoute from "@/components/routing/PublicOnlyRoute";
import PageLoading from "@/components/routing/PageLoading";
import { useAuth } from "@/lib/AuthContext";

// Renders the admin project management UI or the employee's read-only "My
// Projects" view based on role, so a single /projects route works for both
// sides (same pattern the sidebar/nav already assumes for e.g. /attendance,
// /leave).
function ProjectsRoute() {
  const { user } = useAuth();
  return user?.role === "admin" ? <ProjectManagement /> : <MyProjects />;
}

// Code-split the two heaviest pages: Report pulls in the recharts library,
// and Messages is one of the larger standalone views. Both are lazy-loaded
// so their code (and recharts, in Report's case) isn't in the initial bundle
// that every user downloads just to log in.
const Report = lazy(() => import("@/pages/Report"));
const MessagesPage = lazy(() => import("@/pages/MessagesPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />

        {/* Admin-only */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute adminOnly><Report /></ProtectedRoute>} />

        {/* Any authenticated user */}
        <Route path="/projects" element={<ProtectedRoute><ProjectsRoute /></ProtectedRoute>} />
        <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboardPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute adminOnly><AttendanceManagement /></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeesListPage /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfilePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsCenterPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

        {/* Public */}
        <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
        <Route path="/terms-of-service" element={<LegalPage slug="terms-of-service" />} />
        <Route path="/security" element={<LegalPage slug="security" />} />
        <Route path="/support" element={<LegalPage slug="support" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
