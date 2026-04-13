import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Background from "../assets/login-bg.jpg";
import { useAuthContext } from "../lib/AuthContext";



// ✅ Ensure cookies are always sent
axios.defaults.withCredentials = true;


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");

  const { setAuthState } = useAuthContext();


 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccessfulMessage("");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/loginStaff`,
      { email, password }
    );

    const data = response.data;

    console.log("✅ LOGIN RESPONSE:", data);

    // ✅ Handle different token formats
    const token =
      data.token ||
      data.accessToken ||
      data.access_token ||
      data.jwt;

   if (!data.success) {
  setError(data.message || "Login failed");
  return;
}

    // ✅ Extract backend user safely FIRST
    const backendUser = data.user || data.staff || {};

    // ✅ Build clean user object
    const userData = {
      email: backendUser.email || email,
      name: backendUser.name || "Staff Member",
      staffId: backendUser.staffId || null,
    };

    // ✅ Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "staff");
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ Token stored:", token);

    // 🔥 FIX (this is what you were missing)
    setAuthState({
  isAuthenticated: true,
  token: null, // 🔥 no token needed
  userRole: "staff",
  user: {
    email,
    name: "Staff Member",
  },
  loading: false,
});

    setSuccessfulMessage(
      data.message || "Login successful! Redirecting..."
    );

    setTimeout(() => {
      navigate("/staffQR", { replace: true });
    }, 1200);

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);

    // ✅ KEEP YOUR FULL ERROR HANDLING
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Login failed. Please try again.";

    setError(message);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      />

      <motion.div
        className="auth-card relative z-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-lg"
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          variants={fadeUp}
          custom={0}
          className="flex items-center gap-2 mb-6"
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-4 h-4 text-primary-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-2xl font-heading font-bold text-foreground mb-1"
        >
          Welcome Back 👋
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-secondary font-semibold text-sm mb-6"
        >
          Attendee
        </motion.p>

        {/* Form */}
        <motion.form
          variants={fadeUp}
          custom={3}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="Email address"
              className="auth-input pl-10"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="auth-input pl-10 pr-10"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="text-xs text-primary font-medium self-end hover:underline"
          >
            Forgot Password?
          </Link>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90"
          >
            Login
          </motion.button>

          {/* Success */}
          {successfulMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600"
            >
              {successfulMessage}
            </motion.p>
          )}

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500"
            >
              {error}
            </motion.p>
          )}

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                or
              </span>
            </div>
          </div>
        </motion.form>

        {/* Register */}
        <motion.p
          variants={fadeUp}
          custom={5}
          className="text-xs text-muted-foreground mt-6 text-center"
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Register now
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;