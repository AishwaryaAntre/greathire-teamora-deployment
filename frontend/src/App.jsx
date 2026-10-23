import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import HolidaysPage from "@/pages/HolidaysPage";
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
import GlobalNotificationListener from "@/components/notifications/GlobalNotificationListener";
import SystemNotificationsPage from "@/pages/SystemNotificationsPage";
import AttendanceHistoryPage from "@/pages/AttendanceHistoryPage";

// Render admin project management or the employee's My Projects view.
function ProjectsRoute() {
  const { user } = useAuth();

  return user?.role === "admin" ? <ProjectManagement /> : <MyProjects />;
}

// Lazy-load heavier pages.
const Report = lazy(() => import("@/pages/Report"));
const MessagesPage = lazy(() => import("@/pages/MessagesPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <GlobalNotificationListener />

      <Routes>
        {/* Public authentication routes */}
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />

        
<Route
  path="/reset-password"
  element={<ResetPasswordPage />}
/>


        {/* Admin-only routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/system-notifications"
          element={
            <ProtectedRoute adminOnly>
              <SystemNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute adminOnly>
              <Report />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute adminOnly>
              <AttendanceManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeesListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Routes available to authenticated users */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsRoute />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/holidays"
          element={
            <ProtectedRoute>
              <HolidaysPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-history"
          element={
            <ProtectedRoute>
              <AttendanceHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsCenterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Public informational pages */}
        <Route
          path="/privacy-policy"
          element={<LegalPage slug="privacy-policy" />}
        />

        <Route
          path="/terms-of-service"
          element={<LegalPage slug="terms-of-service" />}
        />

        <Route
          path="/security"
          element={<LegalPage slug="security" />}
        />

        <Route
          path="/support"
          element={<LegalPage slug="support" />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}