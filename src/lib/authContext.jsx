import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    userRole: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check auth on mount
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const user = localStorage.getItem("user");

    if (token && userRole) {
      setAuthState({
        isAuthenticated: true,
        token,
        userRole,
        user: user ? JSON.parse(user) : null,
        loading: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        token: null,
        userRole: null,
        user: null,
        loading: false,
      });
    }

    // Monitor storage changes (logout from other tabs)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (!newToken && authState.isAuthenticated) {
        setAuthState({
          isAuthenticated: false,
          token: null,
          userRole: null,
          user: null,
          loading: false,
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}