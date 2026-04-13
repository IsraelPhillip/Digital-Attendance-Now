import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useProtectedRoute } from "../lib/useProtectedRoute";

export function ProtectedRoute({ children, role = null }) {
  const { loading, isAuthenticated } = useProtectedRoute(role);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // ✅ REDIRECT instead of null
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}