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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/employees/:id" element={<EmployeeProfilePage />} />
<Route path="/profile" element={<MyProfilePage />} />
<Route path="/notifications" element={<NotificationsCenterPage />} />
<Route path="/messages" element={<MessagesPage />} />
    </Routes>
  );
}