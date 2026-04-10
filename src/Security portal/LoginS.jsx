import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, QrCode } from "lucide-react";
import securityBg from "@/assets/security-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const SecurityLogin = () => {
  const navigate = useNavigate();

  const [securityId, setSecurityId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    
    if (!securityId || !password) {
  setError("Security ID and password are required");
  return;
}
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/securityLogin`,
        { securityId, password },
        { withCredentials: true }
      );

      if (data.changePassword) {
        setSuccess(data.message);
        setTimeout(() => navigate("/password-change"), 1200);
        return;
      }

      if (data.success === true) {
        setSuccess(data.message || "Login successful");
        setTimeout(() => navigate("/scan-page"), 1000);
      }
   } catch (err) {
  if (err.response?.data?.message) {
    // Server responded with error
    setError(err.response.data.message);

  } else if (err.request) {
    // Request made but no response (Network issue)
    setError("Network error! Please check your internet connection.");

  } else if (err.message) {
    // Other errors
    setError(err.message);

  } else {
    setError("Login failed. Please try again.");
  }
}
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <img
        src={securityBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-[420px] px-6"
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-7 h-7 text-white" />
            </div>
          </Link>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-3xl font-heading font-bold text-white tracking-wider mb-6"
        >
          SECURITY LOGIN
        </motion.h1>

        {/* 🔴 Error Message 
        {error && (
          <motion.p
            variants={fadeUp}
            custom={1.5}
            className="mb-3 text-sm text-red-400 text-center font-medium"
          >
            {error}
          </motion.p>
        )}
*/}
        {/* 🟢 Success Message 
        {success && (
          <motion.p
            variants={fadeUp}
            custom={1.5}
            className="mb-3 text-sm text-green-400 text-center font-medium"
          >
            {success}
          </motion.p>
        )}*/}

        <motion.form
          variants={fadeUp}
          custom={2}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5"
        >
          <div className="relative">
            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="SECURITY ID"
              className="w-full h-14 rounded-full bg-white text-foreground pl-14 pr-6 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={securityId}
              onChange={(e) => setSecurityId(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              className="w-full h-14 rounded-full bg-white text-foreground pl-14 pr-6 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
{error && <p className="text-red-500">{error}</p>}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 mt-2 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-primary/40"
          >
            SUBMIT
          </motion.button>
        </motion.form>

        <motion.p
          variants={fadeUp}
          custom={3}
          className="text-xs text-white/60 mt-8"
        >
          <Link
            to="/password-change"
            className="text-white/80 hover:text-white hover:underline transition-colors"
          >
            Change Password
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SecurityLogin;