import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Background from "../assets/login-bg.jpg";
// import { useGoogleLogin } from "@react-oauth/google";

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

  
  // const googleLogin = useGoogleLogin({
  // flow: "auth-code",

  //  onSuccess: async (tokenResponse) => {
  // console.log("Google token response:", tokenResponse);
  //     try {
  //       await axios.post(
  //         `${import.meta.env.VITE_API_URL}/googleLogin`,
  //         { token: tokenResponse.id_token }
  //       ); 

  //       setErrorMessage("");
  //       setSuccessfulMessage("Google login successful! Redirecting...");

  //       setTimeout(() => {
  //         navigate("/staffQR");
  //       }, 1500);
  //     } catch (error) {
  //       setSuccessfulMessage("");
  //       setErrorMessage(
  //         error.response?.data?.message || "Google login failed"
  //       );
  //     }
  //   },
  //   onError: () => {
  //     setErrorMessage("Google login failed");
  //   },
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();

console.log("API:", import.meta.env.VITE_API_URL);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/loginStaff`,
        { email, password },
        { withCredentials: true }
      );

      setError("");
      setSuccessfulMessage(
        data?.message || "Login successful! Redirecting..."
      );

      setTimeout(() => {
        navigate("/staffQR");
      }, 1500);
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
        <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-6">
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
        <motion.form variants={fadeUp} custom={3} onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="text-xs text-primary font-medium self-end hover:underline"
          >
            Forgot Password?
          </Link>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Login
          </motion.button>

          {successfulMessage && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-success">
              {successfulMessage}
            </motion.p>
          )}

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-destructive">
              {error}
            </motion.p>
          )}

          {/* OR divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Google login
          <motion.button
            type="button"
            onClick={googleLogin}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border border-border bg-card text-foreground py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button> */}
        </motion.form>

        <motion.p variants={fadeUp} custom={5} className="text-xs text-muted-foreground mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register now
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
