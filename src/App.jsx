import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./staff portal/LandingPage";
import RegisterPage from "./staff portal/RegisterPage";
import StaffQRpage from "./staff portal/StaffQRpage";
import ForgotPassword from "./staff portal/ForgotPassword";
import ResetPassword from "./staff portal/ResetPassword";
import ClockinFailed from "./Security portal/ClockinFailed";
import ScanPage from "./Security portal/ScanPage";
import ClockinSuccess from "./Security portal/ClockinSuccess";
import LoginS from "./Security portal/LoginS";
import ChangePassword from "./Security portal/changePassword";
import LoginPage from "./staff portal/LoginPage";
import Dashboard from "./hr-portal/Dashboard";
import Employees from "./hr-portal/Employees";
import Attendance from "./hr-portal/Attendance";
import Security from "./hr-portal/Security";
import Mailing from "./hr-portal/Mailing";
import Reports from "./hr-portal/Reports";
import Landing from "./hr-portal/Landing";
import Login from "./hr-portal/Login";
import AppLayout from "./components/AppLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staffQR" element={<StaffQRpage/>}/>
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/clock-in-failed" element={<ClockinFailed/>}/>
        <Route path="/clock" element={<ClockinSuccess/>}/>
        <Route path="/scan-page" element={<ScanPage/>}/>
        <Route path="/security-login" element={<LoginS/>}/>
        <Route path="/password-change" element={<ChangePassword />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/sec" element={<Security />} />
          <Route path="/mailing" element={<Mailing />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
         
        <Route path="/landingHr" element={<Landing />} /> 
        <Route path="/loginHr" element={<Login />} /> 


      </Routes>
    </BrowserRouter>
  );
};

export default App;