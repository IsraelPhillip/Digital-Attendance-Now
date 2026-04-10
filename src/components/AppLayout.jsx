import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Shield,
  Mail,
  QrCode,
  FileText,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/attendance", label: "Attendance", icon: CalendarCheck },
  { path: "/sec", label: "Security", icon: Shield },
  { path: "/mailing", label: "Mailing", icon: Mail },
  { path: "/reports", label: "Reports", icon: FileText },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      {/* 🌑 Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 🧊 Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-full w-72 bg-[#0f172a] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Branding Container */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/landingHr" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Attendee<span className="text-blue-500"></span>
            </span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Main Menu</p>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  active 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Logout */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
               <User className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/landingHr")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 🚀 Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 lg:px-10 justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Contextual Search
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl w-full max-w-md border border-transparent focus-within:border-blue-500/20 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics, records..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <button className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button> */}
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-tighter">HR Controller</p>
                <p className="text-[10px] text-emerald-500 font-bold">Online</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform">
                A
              </div>
            </div>
          </div>
        </header>

        {/* 📄 Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8fafc] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}