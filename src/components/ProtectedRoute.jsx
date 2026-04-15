import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useProtectedRoute } from "../lib/useProtectedRoute";

export function ProtectedRoute({ children, requiredRole = null }) {
  const { loading, isAuthenticated } = useProtectedRoute(requiredRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}