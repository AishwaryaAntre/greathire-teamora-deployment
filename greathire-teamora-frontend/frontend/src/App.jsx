import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import EmployeesListPage from "@/pages/EmployeesListPage";
import AttendanceManagement from "@/pages/AttendanceManagement";
import LeaveManagement from "@/pages/LeaveManagement";
import Report from "@/pages/Report";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage";
import MyProfilePage from "@/pages/MyProfilePage";
import NotificationsCenterPage from "@/pages/NotificationsCenterPage";
import MessagesPage from "@/pages/MessagesPage";
import LegalPage from "@/pages/LegalPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/leave" element={<LeaveManagement />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/employees" element={<EmployeesListPage />} />
      <Route path="/employees/:id" element={<EmployeeProfilePage />} />
      <Route path="/profile" element={<MyProfilePage />} />
      <Route path="/notifications" element={<NotificationsCenterPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
      <Route path="/terms-of-service" element={<LegalPage slug="terms-of-service" />} />
      <Route path="/security" element={<LegalPage slug="security" />} />
      <Route path="/support" element={<LegalPage slug="support" />} />
    </Routes>
  );
}