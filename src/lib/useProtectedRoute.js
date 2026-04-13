import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./authContext";

/**
 * Hook for protecting routes
 * Usage: useProtectedRoute("hr") or useProtectedRoute("staff")
 */
export function useProtectedRoute(requiredRole = null) {
  const navigate = useNavigate();
  const { isAuthenticated, token, userRole, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return; // Still loading

    // Not authenticated
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
      return;
    }

    // Role mismatch
    if (requiredRole && userRole !== requiredRole) {
      navigate("/unauthorized", { replace: true });
      return;
    }
  }, [isAuthenticated, token, userRole, loading, requiredRole, navigate]);

  return { loading, isAuthenticated, userRole };
}