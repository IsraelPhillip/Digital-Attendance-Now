import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const [weeklyRes, monthlyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/weeklyReport`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/monthlyReport`, config),
        ]);

        setWeeklyData(weeklyRes?.data?.data || []);
        setMonthlyData(monthlyRes?.data?.data || []);
      } catch (err) {
        console.log(err?.response?.data || err.message);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const weeklyReport = useMemo(() => {
  return (weeklyData || []).map((r) => ({
    // id: r.staffId ?? r.id ?? r._id ?? "N/A",
    name: r.name || "Unknown Staff",
    days: dayLabels.map((d) => r[d] || "A"),
    rate: parseFloat(r.rate) || 0,
  }));
}, [weeklyData]);

  const monthlyReport = useMemo(() => {
  return (monthlyData || []).map((r) => ({
    // id: r.staffId ?? r.id ?? r._id ?? "N/A",
    name: r.name || "Unknown Staff",
    present: r.daysPresent ?? r.presentDays ?? 0,
    absent: r.daysAbsent ?? r.absentDays ?? 0,
    rate: parseFloat(r.rate) || 0,
  }));
}, [monthlyData]);


const getWeekNumber = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const currentWeek = getWeekNumber();

  const downloadWeeklyPDF = () => {
    const doc = new jsPDF();
    doc.text("Weekly Attendance Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Name", ...dayLabels, "Rate"]],
      body: weeklyReport.map((r) => [r.name,  ...r.days, `${r.rate}%`]),
    });

    doc.save("weekly-report.pdf");
    toast.success("Weekly report downloaded");
  };

  const downloadMonthlyPDF = () => {
    const doc = new jsPDF();
    doc.text("Monthly Attendance Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Name",  "Present", "Absent", "Rate"]],
      body: monthlyReport.map((r) => [
        r.name,
        // r.staffId,
        r.present,
        r.absent,
        `${r.rate}%`,
      ]),
    });

    doc.save("monthly-report.pdf");
    toast.success("Monthly report downloaded");
  };

  if (loading) {
    return (
      <div className="p-10 text-slate-500 font-bold">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Export high-fidelity attendance data for your records.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Calendar className="w-3 h-3" /> Week {currentWeek}
        </div>
      </div>

      {/* Weekly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Weekly Performance
            </h2>
          </div>

          <button
            onClick={downloadWeeklyPDF}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Employees
                </th>
                {dayLabels.map((d) => (
                  <th
                    key={d}
                    className="px-3 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400"
                  >
                    {d}
                  </th>
                ))}
                <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Avg Rate
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {weeklyReport.slice(0, 10).map((row) => (
                <tr
                  // key={row.staffId}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{row.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">
                      {/* Staff ID: {row.staffId} */}
                    </p>
                  </td>

                  {row.days.map((d, i) => (
                    <td key={i} className="px-3 py-5 text-center">
                      <span
                        className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-[10px] font-black ${
                          d === "P"
                            ? "bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50"
                            : "bg-rose-100 text-rose-700 ring-4 ring-rose-50"
                        }`}
                      >
                        {d}
                      </span>
                    </td>
                  ))}

                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {row.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Monthly */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-100">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none">
                Monthly Summary
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Live Monthly Records
              </p>
            </div>
          </div>

          <button
            onClick={downloadMonthlyPDF}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Employees
                </th>
                <th className="px-8 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Present
                </th>
                <th className="px-8 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Absent
                </th>
                <th className="px-8 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Completion
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {monthlyReport.slice(0, 10).map((row) => (
                <tr key={row.staffId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{row.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {/* Staff ID: {row.staffId} */}
                    </p>
                  </td>

                  <td className="px-8 py-5 text-center font-bold text-slate-700">
                    {row.present}
                  </td>

                  <td className="px-8 py-5 text-center font-bold text-rose-500">
                    {row.absent}
                  </td>

                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          style={{ width: `${row.rate}%` }}
                          className={`h-full ${
                            row.rate > 80
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {row.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}