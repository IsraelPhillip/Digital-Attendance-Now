"use client";

import DataTable from "../components/DataTable";
import {
  Clock,
  CalendarCheck,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ NEW (controlled)
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const fetchAttendance = useCallback(
    async (pageNumber = 1, limit = entries, searchQuery = search) => {
      try {
        setLoading(true);

       const res = await api.get("/getAttendance", {
  params: {
    page: pageNumber,
    limit,
    search: searchQuery,
  },
});

        setAttendanceRecords(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNumber);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [entries, search]
  );

  // ✅ debounce (search + entries)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAttendance(1, entries, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [entries, search, fetchAttendance]);

  const columns = [
    {
      key: "employeeId",
      label: "ID",
      render: (row) => (
        <span className="font-mono text-[10px] font-bold text-slate-400">
          #{row.employeeId}
        </span>
      ),
    },
    {
  key: "employeeName",
  label: "Employee",
  render: (row) => (
    <div className="flex flex-col">
      <span className="font-bold text-slate-800 leading-none">
        {row.employeeName}
      </span>
      <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
        {row.unit }
      </span>
    </div>
  ),
},
    {
      key: "timeIn",
      label: "Clock-In",
      render: (row) => (
        <span className="text-slate-600 text-xs font-medium">
          {row.timeIn || "--:--"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
            row.status === "Present"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-slate-500 font-medium">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
            <Clock className="w-4 h-4" /> Workforce Activity
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Attendance Overview
          </h1>

          <p className="text-slate-500 font-medium italic text-sm">
            Monitoring daily employee clock-ins & performance
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"> <Calendar className="w-3 h-3 text-blue-800 " /> {Date.now() ? new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", }) : "-- -- ----"} </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        <div className="p-4 md:p-6 overflow-x-auto">
          <DataTable
            data={attendanceRecords}
            columns={columns}
            search={search}
            setSearch={setSearch}
            entries={entries}
            setEntries={setEntries}
          />
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          onClick={() => fetchAttendance(page - 1, entries, search)}
          disabled={page === 1}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-xs font-bold text-slate-500 min-w-[90px] text-center">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => fetchAttendance(page + 1, entries, search)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Present
        </span>

        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          Absent / Late
        </span>
      </div>
    </div>
  );
}