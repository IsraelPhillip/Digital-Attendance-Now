"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  X,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from "recharts";
import StatCard from "../components/StatCard";
import api from "../api/axios";


export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentClockIns, setRecentClockIns] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

 // FETCH DATA
useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.allSettled so one failure doesn't kill the whole dashboard
        const results = await Promise.allSettled([
          api.get("/allStaffs"),
          api.get("/dailyReports"),
          api.get("/weeklyAttendance"),
          api.get("/attendanceRate"),
          api.get("/recentClockIns")
        ]);

        // Helper to extract data safely
        const getData = (index) => (results[index].status === 'fulfilled' ? results[index].value.data : null);

        // 1. Staff Data
        const staffData = getData(0);
        if (staffData) setEmployees(staffData.staff || []);

        // 2. Daily Records
        const dailyData = getData(1);
        if (dailyData) setAttendanceRecords(dailyData.attendance || []);

        // 3. Weekly Data
        const weeklyDataRes = getData(2);
        if (weeklyDataRes) {
          const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          setWeeklyData(
            daysOrder.map((day) => ({
              day,
              present: weeklyDataRes.data?.[day] ?? 0
            }))
          );
        }

        // 4. Rate
        const rateData = getData(3);
        if (rateData) setAttendanceRate(rateData.attendanceRate || 0);

        // 5. Recent Clock-ins (with Safari Fix)
        const recentData = getData(4);
        if (recentData) {
          setRecentClockIns(
            (recentData.data || []).map((item, index) => {
              // Safari-friendly date replacement (replaces space with T for ISO format)
              const dateString = item.timeIn?.replace(/\s/, 'T') || "";
              const date = new Date(dateString);
              const valid = !isNaN(date.getTime());

              // Get Hour in Lagos Time
              const hour = valid 
                ? parseInt(new Intl.DateTimeFormat('en-GB', { 
                    hour: 'numeric', 
                    hour12: false, 
                    timeZone: 'Africa/Lagos' 
                  }).format(date))
                : null;

              let status = "—";
              if (hour !== null) {
                status = hour >= 9 ? "Late" : "Early";
              }

              const formattedTime = valid
                ? date.toLocaleTimeString("en-NG", {
                    timeZone: "Africa/Lagos",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })
                : "--:--";

              return {
                employeeId: item.employeeId || item.record || index,
                employeeName: item.employeeName || item.name || "Unknown",
                timeIn: formattedTime,
                status
              };
            })
          );
        }
      } catch (err) {
        console.error("Dashboard Global Error:", err);
      }
    };

    fetchData();
  }, []);

  // Update todayRecords memo to handle the staff object safely
  const todayRecords = useMemo(() => {
    if (!Array.isArray(attendanceRecords)) return [];

    return attendanceRecords.map((r) => {
      // Fix for potential Safari Date issue
      const date = new Date(r.timeIn?.replace(/\s/, 'T'));
      const valid = !isNaN(date.getTime());

      const hour = valid
        ? parseInt(new Intl.DateTimeFormat('en-GB', { 
            hour: 'numeric', 
            hour12: false, 
            timeZone: 'Africa/Lagos' 
          }).format(date))
        : null;

      return {
        employeeId: r.staff?.staffId,
        employeeName: `${r.staff?.firstName || ""} ${r.staff?.lastName || ""}`,
        status: hour !== null ? (hour >= 9 ? "Late" : "Early") : "Absent"
      };
    });
  }, [attendanceRecords]);

  const presentToday = todayRecords.filter((r) => r.status !== "Absent").length;
  const absentToday = Math.max(employees.length - presentToday, 0);
  const lateToday = todayRecords.filter((r) => r.status === "Late").length;

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();

    return employees.filter(
      (e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.staffId?.includes(q)
    );
  }, [searchQuery, employees]);

  const handleSearch = () => {
    if (searchQuery.trim()) setShowModal(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search employee by name or ID..."
            className="pl-12 pr-4 py-3 w-full rounded-2xl border-none bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          Search
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={employees.length} icon={Users} delay={0} />
        <StatCard title="Present Today" value={presentToday} icon={UserCheck} delay={0.1} />
        <StatCard title="Absent Today" value={absentToday} icon={UserX} delay={0.2} />
        <StatCard title="Late Clock-ins" value={lateToday} icon={Clock} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Recent Activity
            </h2>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-4 text-left">ID</th>
                  <th className="px-8 py-4 text-left">Name</th>
                  <th className="px-8 py-4 text-left">Time In</th>
                  <th className="px-8 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {recentClockIns.map((r, i) => (
                  <tr
                    key={`${r.employeeId}-${i}`}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                      {r.employeeId}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-800">
                      {r.employeeName}
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600 font-mono">
                      {r.timeIn}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          r.status === "Late"
                            ? "bg-amber-100 text-amber-700"
                            : r.status === "Early"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Weekly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1e4296] rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-slate-50 uppercase tracking-widest">
                Attendance
              </h2>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>

            <div className="h-56 ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#ffffff",
                      fontWeight: 700
                    }}
                    dy={10}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  />
                  <Bar dataKey="present" radius={[6, 6, 6, 6]} barSize={12}>
                    {weeklyData.map((_, i) => (
                      <Cell key={i} fill="#ffffff" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 p-8 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10">
              Daily Rate
            </p>
            <div className="relative z-10">
              <p className="text-6xl font-black text-slate-900 tracking-tighter">
                {attendanceRate}
                <span className="text-blue-500 text-3xl"> %</span>
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                <ArrowUpRight className="w-4 h-4" /> Attendance
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 lg:inset-x-[25%] lg:inset-y-[15%] z-[60] bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Found {searchResults.length} Results
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Employee Directory Matching "{searchQuery}"
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {searchResults.map((emp) => (
                  <div
                    key={emp.staffId}
                    className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                        {emp.firstName?.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {emp.staffId}
                        </p>
                      </div>
                    </div>

                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}