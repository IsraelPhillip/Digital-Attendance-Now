import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Background from "../assets/pp.jpg";
import { CheckCircle2, RotateCcw } from "lucide-react"; 

const ClockInFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const errorMessage =
    location.state?.error || "Clock-in failed. Please try again.";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 font-sans">
      {/* Background Image with Dimming Overlay */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <img
          src={Background}
          alt="background"
          className="w-full h-full object-cover scale-105"
        />
        {/* Dimming Overlay: darkens the background and adds a soft blur for focus */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Glassmorphic Card (Updated Style) */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-10 md:p-14 w-full max-w-[480px] flex flex-col items-center z-10 text-center"
      >
        {/* Header Section */}
        <div className="space-y-2 mb-6">
         
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-extrabold text-red-600 tracking-tight"
          >
            Clock-In Failed
          </motion.h1>
        </div>

        {/* 🔴 ERROR MESSAGE AREA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-red-950/30 border border-red-500/20 p-5 rounded-2xl"
        >
          <p className="text-sm md:text-base text-red-200 font-medium leading-relaxed">
            {errorMessage}
          </p>
        </motion.div>

        {/* Reset Button (Updated Style: White with Red Text) */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03, translateY: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/scan-page")}
          className="mt-10 w-40 bg-red-600 hover:bg-red-500/90 text-white py-4 px-8 rounded-2xl font-bold text-sm md:text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)] transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" /> {/* Added icon for extra polish */}
          RESET
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ClockInFailed;