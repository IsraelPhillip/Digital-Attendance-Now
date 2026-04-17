import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// Lucide icons are often used with Tailwind, feel free to remove/add as needed.
// If you don't have lucide-react, install it: npm i lucide-react
import { CheckCircle2, RotateCcw } from "lucide-react"; 
import Background from "../assets/bg.jpg"; // Using the bg.jpg provided in Success component

const ClockInSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 font-sans overflow-hidden">
      {/* Background Image with Dimming Overlay - Mirrored from Failed */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <img
          src={Background}
          alt="background"
          className="w-full h-full object-cover scale-105"
        />
        {/* Dimming Overlay: using black/60 like the failed component for consistency */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Main Glassmorphic Card - Style mirrored from Failed, color changed to Green */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 p-10 md:p-14 w-full max-w-[480px] flex flex-col items-center z-10 text-center"
      >
        {/* Header Section */}
        <div className="space-y-2 mb-8">
          {/* Subtle label, similar to the pattern used in modern dashboards */}
         
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            // text-emerald-500 offers good contrast on the dark dim overlay
            className="text-3xl md:text-4xl font-extrabold text-emerald-500 tracking-tight"
          >
            Clock-In Successful
          </motion.h1>
        </div>

        {/* 🟢 SUCCESS VISUAL AREA - Replaces Error Message Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
          // mirroring the structure of the failed message block, but for an icon/visual
          className="w-full bg-emerald-950/30 border border-emerald-500/20 p-8 rounded-2xl flex flex-col items-center gap-4"
        >
          {/* A soft glow behind the icon */}
          {/* <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-150" />
            <CheckCircle2 className="w-16 h-16 text-emerald-400 relative z-10" strokeWidth={1.5} />
          </div> */}
          <p className="text-sm md:text-base text-emerald-100 font-medium leading-relaxed">
            Clock-in success!
          </p>
        </motion.div>

        {/* Reset Button - Style mirrored from Failed (bg-emerald), but width matched (w-40) */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03, translateY: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/scan-page")}
          className="mt-10 w-40 bg-emerald-600 hover:bg-emerald-500/90 text-white py-4 px-8 rounded-2xl font-bold text-sm md:text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" /> {/* Added icon for extra polish */}
          RESET
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ClockInSuccess;