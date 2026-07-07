import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EmployeeDashboardPage from "@/pages/EmployeeDashboardPage";
import AttendanceManagement from "@/pages/AttendanceManagement";
import Report from "@/pages/Report";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/reports" element={<Report />} />
    </Routes>
  );
}