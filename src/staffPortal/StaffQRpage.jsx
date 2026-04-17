import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Download, 
  FileText, 
  LogOut, 
  Lock, 
  Mail, 
  User, 
  Sun, 
  Moon, 
  ShieldCheck 
} from "lucide-react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

import staffImg from "@/assets/staff.png";
import Background from "../assets/staffQR-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

const StaffQRPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Handle Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ✅ Fetch QR data (Original Logic Maintained)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/qrCode`,
          { withCredentials: true }
        );
        setName(res.data.name);
        setEmail(res.data.email);
        setQrCode(res.data.qrCodeImage);
      } catch (error) {
        console.error("Failed to fetch QR data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Download PNG (Original Logic Maintained)
  const downloadPNG = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${name || "qr-code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Download PDF (Original Logic Maintained)
  const downloadPDF = () => {
    if (!qrCode) return;
    const pdf = new jsPDF();
    const img = new Image();
    img.src = qrCode;
    img.onload = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFontSize(18);
      pdf.text("Attendance QR Code", pageWidth / 2, 20, { align: "center" });
      if (name) {
        pdf.setFontSize(12);
        pdf.text(name, pageWidth / 2, 30, { align: "center" });
      }
      pdf.addImage(img, "PNG", pageWidth / 2 - 40, 40, 80, 80);
      pdf.save(`${name || "qr-code"}.pdf`);
    };
  };

  return (
    <div className="relative min-h-screen font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
      {/* Background Layer */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-20 transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${Background})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50/80 via-white/40 to-blue-100/60 dark:from-slate-950/90 dark:via-blue-950/80 dark:to-slate-950/90 backdrop-blur-[6px]" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-slate-800/50 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md"
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-blue-900 dark:text-blue-50">
              Attendee<span className="text-blue-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            {/* <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all border border-white/20 dark:border-slate-700 shadow-sm"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button> */}
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/resetPassword/:token" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors">
                <Lock className="w-4 h-4" /> Reset Password
              </Link>
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Profile Card */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-2">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                <ShieldCheck className="w-3 h-3" /> Staff Portal
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Welcome back, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-cyan-300">
                  {name || "Loading..."}
                </span>
              </motion.h1>
              <motion.div variants={fadeUp} custom={2} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic">
                <Mail className="w-4 h-4" />
                <p className="text-lg">{email}</p>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeUp} 
              custom={3}
              className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800"
            >
              <img
                src={staffImg}
                alt="Staff Profile"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Verified Employee</p>
                  <p className="text-xl font-semibold">{name}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: QR Card */}
          <motion.div 
            className="lg:col-span-5"
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={fadeUp} 
              custom={2}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/40 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-blue-900/20 flex flex-col items-center"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold dark:text-white">Attendance QR</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Scan for daily check-in</p>
              </div>

              {/* QR Container */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative w-64 h-64 bg-white rounded-3xl border-4 border-blue-50 dark:border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
                  {qrCode ? (
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-52 h-52 relative z-10" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <QrCode className="w-16 h-16" />
                      <p className="text-xs font-bold uppercase">Generating...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-10 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadPNG}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadPDF}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all border border-slate-200 dark:border-slate-700"
                >
                  <FileText className="w-5 h-5" />
                  Save as PDF Document
                </motion.button>
              </div>

              <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest font-medium">
                Internal Use Only • Secure Session
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StaffQRPage;