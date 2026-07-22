import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import AttendanceManagement from "@/pages/AttendanceManagement";
import Report from "@/pages/Report";
import EmployeeProfilePage from "@/pages/EmployeeProfilePage";
import MyProfilePage from "@/pages/MyProfilePage";
import NotificationsCenterPage from "@/pages/NotificationsCenterPage";
import MessagesPage from "@/pages/MessagesPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboardPage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendanceManagement /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute><EmployeeProfilePage /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
<Route path="/notifications" element={<ProtectedRoute><NotificationsCenterPage /></ProtectedRoute>} />
<Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
    </Routes>
  );
}