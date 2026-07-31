import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/employee-dashboard" replace />;
  }
  return children;
}
