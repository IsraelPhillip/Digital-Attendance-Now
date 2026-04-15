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
  const syncAuth = () => {
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
  };

  syncAuth();

  window.addEventListener("storage", syncAuth);
  return () => window.removeEventListener("storage", syncAuth);
}, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}