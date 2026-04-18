"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "../components/DataTable";
import { Users, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";


export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [entries, setEntries] = useState(20);
  const [search, setSearch] = useState("");

  // ✅ DASHBOARD STYLE SEARCH STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);

  const handleSearch = () => {
    if (searchQuery.trim()) setShowModal(true);
  };

  const fetchEmployees = useCallback(
    async (pageNumber = 1, limit = entries, searchQueryParam = search) => {
      try {
        setLoading(true);

        const res = await api.get("/employeeList", {
  params: {
    page: pageNumber,
    limit,
    search: searchQueryParam,
  },
});

        const raw = res.data.data || [];

        const formatted = raw.map((emp) => ({
          id: emp.staffId || "N/A",
          name: emp.name || "Unnamed Staff",
          unit: emp.unit || "—",
          department: emp.department || "—",
          email: emp.email || "—",
          attendanceRate: emp.attendancePercentage ?? 0,
        }));

        setEmployees(formatted);
        setTotalPages(res.data.totalPages || 1);
        setPage(pageNumber);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    },
    [entries, search]
  );

 useEffect(() => {
  const fetchAllEmployees = async () => {
    try {
      const res = await api.get("/allStaffs");

      setAllEmployees(res.data.staff || []);
    } catch (err) {
      console.error("Failed to fetch all employees", err);
    }
  };

  fetchAllEmployees();
}, []);
  useEffect(() => {
    fetchEmployees(1, entries, "");
  }, [entries]);

  // ✅ DASHBOARD STYLE FILTER
  const searchResults = useMemo(() => {
  if (!searchQuery) return [];
  const q = searchQuery.toLowerCase();

  return allEmployees.filter(
    (e) =>
      `${e.firstName || ""} ${e.lastName || ""}`
        .toLowerCase()
        .includes(q) || e.staffId?.includes(q)
  );
}, [searchQuery, allEmployees]);

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (row) => (
        <span className="font-mono text-[10px] font-bold text-slate-400">
          #{row.id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 leading-none">
              {row.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              {row.unit || "—"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Dept.",
      render: (row) => (
        <span className="inline-flex px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
          {row.department}
        </span>
      ),
    },
    {
      key: "email",
      label: "Contact Info",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-slate-600 text-xs font-medium">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      key: "attendanceRate",
      label: "Performance %",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
            <div
              style={{ width: `${row.attendanceRate}%` }}
              className={`h-full transition-all duration-1000 ${
                row.attendanceRate > 85
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />
          </div>
          <span className="font-black text-blue-600 text-sm">
            {row.attendanceRate}%
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-slate-500 font-medium">
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
            <Users className="w-4 h-4" /> Human Resources
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Employees Directory
          </h1>

          <p className="text-slate-500 font-medium italic text-sm">
            Displaying{" "}
            <span className="text-slate-900 font-bold">
              {employees.length}
            </span>{" "}
            verified personnel records
          </p>
        </div>
      </div>

      {/* SEARCH (same UI, new logic) */}
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        <div className="p-4 md:p-6 overflow-x-auto">
          <DataTable
            data={employees}
            columns={columns}
            search={search}
            setSearch={setSearch}
            entries={entries}
            setEntries={setEntries}
          />
        </div>
      </motion.div>

      {/* PAGINATION (unchanged) */}
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          onClick={() => fetchEmployees(page - 1, entries, search)}
          disabled={page === 1}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-xs font-bold text-slate-500 min-w-[90px] text-center">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => fetchEmployees(page + 1, entries, search)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* ✅ DASHBOARD STYLE MODAL */}
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