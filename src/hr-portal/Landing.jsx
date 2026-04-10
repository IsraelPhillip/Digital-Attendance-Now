import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  QrCode, 
  CalendarCheck, 
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function Landing() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* 🌌 Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://shared.jasonet.co/grid.svg')] opacity-20 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>

      {/* 🧭 Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 backdrop-blur-md border-b border-white/5 bg-slate-950/50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Attendee<span className="text-blue-500"></span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/loginHr">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
              Admin Portal
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* 🚀 Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 lg:px-12 py-20">
        <div className="max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Now Live</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight"
          >
            Digital Attendance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
             Records
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
             Workforce Management With Real-Time Attendance Tracking, Advanced Analytics, and Secure Access Control
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/loginHr">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-base px-10 py-7 rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
                Login <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />get started in seconds. 
            </div>
          </motion.div>

          {/* 🧩 Feature Cards (Glassmorphism) */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: CalendarCheck, 
                title: "Live Monitoring", 
                desc: "Real-time sync of clock-in  with geo-fencing support.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              { 
                icon: Users, 
                title: "Smart Management", 
                desc: "Advanced department analytics and detailed employee profiles.",
                color: "text-indigo-400",
                bg: "bg-indigo-400/10"
              },
              { 
                icon: Shield, 
                title: "Security", 
                desc: "End-to-end encryption with role-based permissions and audit logs.",
                color: "text-cyan-400",
                bg: "bg-cyan-400/10"
              },
            ].map((f, i) => (
              <motion.div 
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4 + i}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 text-left backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/20"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* 🏁 Footer */}
      <footer className="relative z-10 py-10 px-6 text-center border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Attendee Global. Engineered for efficiency.
          </p>
          <div className="flex gap-8 text-slate-500 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}