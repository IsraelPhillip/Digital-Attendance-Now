import { Routes, Route, Navigate } from "react-router-dom";

// STAFF
import LandingPage from "./staffPortal/LandingPage";
import RegisterPage from "./staffPortal/RegisterPage";
import StaffQRpage from "./staffPortal/StaffQRpage";
import ForgotPassword from "./staffPortal/ForgotPassword";
import ResetPassword from "./staffPortal/ResetPassword";
import LoginPage from "./staffPortal/LoginPage";

// SECURITY
import ClockinFailed from "./SecurityPortal/ClockinFailed";
import ScanPage from "./SecurityPortal/ScanPage";
import ClockinSuccess from "./SecurityPortal/ClockInSuccess";
import LoginS from "./SecurityPortal/LoginS";
import ChangePassword from "./SecurityPortal/changePassword";

// HR
import Dashboard from "./hr-portal/Dashboard";
import Employees from "./hr-portal/Employees";
import Attendance from "./hr-portal/Attendance";
import Security from "./hr-portal/Security";
import Mailing from "./hr-portal/Mailing";
import Reports from "./hr-portal/Reports";
import Landing from "./hr-portal/Landing";
import Login from "./hr-portal/Login";
import AppLayout from "./components/AppLayout";

// ✅ IMPORT ONLY
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />

      <Route path="/security-login" element={<LoginS />} />
      <Route path="/landingHr" element={<Landing />} />
      <Route path="/loginHr" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* STAFF */}
      <Route
        path="/staffQR"
        element={
          <ProtectedRoute requiredRole="staff">
            <StaffQRpage />
          </ProtectedRoute>
        }
      />

      {/* SECURITY */}
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

      {/* HR */}
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;