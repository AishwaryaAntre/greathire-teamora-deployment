import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

/** Wraps the login page: signed-in users are bounced straight to their dashboard. */
export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/employee-dashboard"} replace />;
  }
  return children;
}
