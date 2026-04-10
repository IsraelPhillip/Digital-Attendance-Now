import axios from "axios"
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import Background from "../assets/land-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

const ChangePassword = () => {
  const navigate = useNavigate()


  const [securityId, setSecurityId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMissMatch, setPasswordMissMatch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (password !== confirmPassword) {
        setPasswordMissMatch("Passwords do not match");
        return;
      }
    
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/changePassword`,
          {
            securityId,
            temporaryPassword,
            newPassword: password,
          }
        );
    
        setMessage(data.message);
    
        setTimeout(() => navigate("/security-login"), 3000);
    
      } catch (error) {
        setMessage(error?.response?.data?.message || "Something went wrong");
      }
    };
  
      

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      />

      <motion.div className="auth-card relative z-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-lg" initial="hidden" animate="visible">
        {/* Back button */}
        <motion.div variants={fadeUp} custom={0}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-heading font-bold text-foreground mb-1">
          Change Password
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground mb-8">
          Please enter a new password
        </motion.p>

        {/* Form */}
        <motion.form variants={fadeUp} custom={3} onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Security ID */}
          <div>
            <label className="auth-label">Security ID</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="Enter your Security ID"
                className="auth-input pl-10"
                value={securityId}
                onChange={(e) => setSecurityId(e.target.value)}
              />
            </div>
          </div>

          <div>
              <label className="auth-label">Temporary Password</label>
              <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input
                 type="password"
                 required
                 placeholder="Enter temporary password"
                 className="auth-input pl-10"
                 value={temporaryPassword}
                 onChange={(e) => setTemporaryPassword(e.target.value)}
      />
    </div>
  </div>

          {/* Password */}
          <div>
            <label className="auth-label">Reset Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="auth-input pl-10 pr-10"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordMissMatch(""); }}
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
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMissMatch(""); }}
              />
            </div>
          </div>

          {/* Error/Message */}
          {passwordMissMatch && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive">
              {passwordMissMatch}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs font-medium ${message.includes("successful") ? "text-success" : "text-destructive"}`}
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
            Send
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;


