import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Background from "../assets/land-bg.jpg";
import api from "../api/axios";


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mismatch, setMismatch] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMismatch("Passwords do not match");
      return;
    }
    try {
      await api.put(
        `/resetPassword/${token}`,
        { newPassword: password }
      );
      setMessage("Password reset successful. Redirecting to login...");
  
      // auto-redirect after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "This link is invalid or expired"
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />

      <motion.div
        className="auth-card relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full"
        initial="hidden"
        animate="visible"
      >
        {/* Back Link */}
        <motion.div variants={fadeUp} custom={0}>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-2xl font-heading font-bold text-foreground mb-1"
        >
          Reset Password
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-sm text-muted-foreground mb-8"
        >
          Please enter a new password
        </motion.p>

        <motion.form
          variants={fadeUp}
          custom={3}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* New Password */}
          <div>
            <label className="auth-label">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="auth-input pl-10 pr-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMismatch("");
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="auth-label">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="auth-input pl-10"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setMismatch("");
                }}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="rounded border-border accent-primary"
            />
            Show password
          </label>

          {mismatch && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive">
              {mismatch}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs ${message.includes("successful") ? "text-success" : "text-destructive"}`}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity mt-2"
          >
            Reset Password
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
