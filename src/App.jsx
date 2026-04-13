import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ❌ removed BrowserRouter
import { Loader2 } from "lucide-react";

// ========== STAFF PORTAL ==========
import LandingPage from "./staff portal/LandingPage";
import RegisterPage from "./staff portal/RegisterPage";
import StaffQRpage from "./staff portal/StaffQRpage";
import ForgotPassword from "./staff portal/ForgotPassword";
import ResetPassword from "./staff portal/ResetPassword";
import LoginPage from "./staff portal/LoginPage";

// ========== SECURITY PORTAL ==========
import ClockinFailed from "./Security portal/ClockinFailed";
import ScanPage from "./Security portal/ScanPage";
import ClockinSuccess from "./Security portal/ClockinSuccess";
import LoginS from "./Security portal/LoginS";
import ChangePassword from "./Security portal/changePassword";

// ========== HR PORTAL ==========
import Dashboard from "./hr-portal/Dashboard";
import Employees from "./hr-portal/Employees";
import Attendance from "./hr-portal/Attendance";
import Security from "./hr-portal/Security";
import Mailing from "./hr-portal/Mailing";
import Reports from "./hr-portal/Reports";
import Landing from "./hr-portal/Landing";
import Login from "./hr-portal/Login";
import AppLayout from "./components/AppLayout";


// ... all your imports remain the same

// ========== PROTECTED ROUTE COMPONENT ==========
function ProtectedRoute({ children, requiredRole }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      if (!token || !userRole) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      if (requiredRole && userRole !== requiredRole) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-semibold">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const App = () => {
  return (
    <Routes> {/* ✅ NO BrowserRouter here */}
      {/* ALL YOUR ROUTES STAY EXACTLY THE SAME */}

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />

      <Route path="/security-login" element={<LoginS />} />
      <Route path="/landingHr" element={<Landing />} />
      <Route path="/loginHr" element={<Login />} />

      <Route
        path="/staffQR"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffQRpage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/password-change"
        element={
          <ProtectedRoute requiredRole="security">
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan-page"
        element={
          <ProtectedRoute requiredRole="security">
            <ScanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clock"
        element={
          <ProtectedRoute requiredRole="security">
            <ClockinSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clock-in-failed"
        element={
          <ProtectedRoute requiredRole="security">
            <ClockinFailed />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute requiredRole="hr">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/sec" element={<Security />} />
        <Route path="/mailing" element={<Mailing />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;