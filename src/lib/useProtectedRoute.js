import { useAuthContext } from "./authContext";

export function useProtectedRoute(requiredRole = null) {
  const { isAuthenticated, userRole, loading } = useAuthContext();

  const authorized =
    isAuthenticated === true &&
    (!requiredRole || userRole === requiredRole);

  return { loading, isAuthenticated: authorized, userRole };
}