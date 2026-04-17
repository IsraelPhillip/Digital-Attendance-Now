import axios from "axios"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import Background from "../assets/land-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      await axios.post(
        `${import.meta.env.VITE_API_URL}/forgotPassword`,
        { email }
      );
  
        setMessage("Reset link sent to your email");
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Something went wrong"
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
        {/* Back link */}
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
          Forgot Password
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-sm text-muted-foreground mb-8"
        >
          Enter your email to receive a reset link
        </motion.p>

        <motion.form
          variants={fadeUp}
          custom={3}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="auth-label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="auth-input pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-primary font-medium"
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
            Send Reset Link
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
