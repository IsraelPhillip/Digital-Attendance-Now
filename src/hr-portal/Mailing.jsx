import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, X, Users, Check } from "lucide-react";
import { toast } from "sonner";

export default function Mailing() {
  const [query, setQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState(new Set());
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Mode states
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/staff`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setEmployees(data.staff);
        } else {
          toast.error("Failed to load staff");
        }
      } catch (error) {
        toast.error("Server error loading staff");
      }
    };

    fetchStaff();
  }, []);

  const results = useMemo(() => {
    if (!query) return [];

    const q = query.toLowerCase();

    return employees
      .filter((e) => {
        return (
          e.name?.toLowerCase().includes(q) ||
          e.id?.toString().toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query, employees]);

  // Get selected employees array from Set
  const selectedEmployeesArray = useMemo(() => {
    return employees.filter(e => selectedMultiple.has(e.id));
  }, [selectedMultiple, employees]);

  // Toggle single employee selection
  const toggleEmployeeSelection = (empId) => {
    const newSet = new Set(selectedMultiple);
    if (newSet.has(empId)) {
      newSet.delete(empId);
    } else {
      newSet.add(empId);
    }
    setSelectedMultiple(newSet);
  };

  // Toggle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMultiple(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(employees.map(e => e.id));
      setSelectedMultiple(allIds);
      setSelectAll(true);
    }
  };

  // Remove single employee from selection
  const removeFromSelection = (empId) => {
    const newSet = new Set(selectedMultiple);
    newSet.delete(empId);
    setSelectedMultiple(newSet);
    setSelectAll(false);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedMultiple(new Set());
    setSelectAll(false);
  };

  // Handle single recipient send
  const handleSendSingle = async () => {
    if (!selectedEmployee)
      return toast.error("Please select an employee");
    if (!subject.trim())
      return toast.error("Please enter a subject");
    if (!message.trim())
      return toast.error("Please enter a message");

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/mailToStaff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          staffId: selectedEmployee.id,
          subject,
          message,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send mail");
      }

      toast.success(data.message || "Mail sent successfully");

      // Reset form
      setSubject("");
      setMessage("");
      setSelectedEmployee(null);
      setQuery("");
      setShowDropdown(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle multi-select send
  const handleSendMultiple = async () => {
    if (selectedMultiple.size === 0)
      return toast.error("Please select at least one employee");
    if (!subject.trim())
      return toast.error("Please enter a subject");
    if (!message.trim())
      return toast.error("Please enter a message");

    setShowBulkConfirm(true);
  };

  // Handle bulk send (all staff)
  const handleBulkSend = async () => {
    if (!subject.trim())
      return toast.error("Please enter a subject");
    if (!message.trim())
      return toast.error("Please enter a message");

    setShowBulkConfirm(true);
  };

  // Confirm and send to selected/all
  const confirmAndSend = async () => {
    try {
      setLoading(true);
      setShowBulkConfirm(false);

      const staffIds = isBulkMode
        ? employees.map(e => e.id)
        : Array.from(selectedMultiple);

      const endpoint = isBulkMode || isMultiSelectMode
        ? `${import.meta.env.VITE_API_URL}/bulkMailToStaff`
        : `${import.meta.env.VITE_API_URL}/mailToStaff`;

      const body = isBulkMode || isMultiSelectMode
        ? {
            subject,
            message,
            staffIds,
          }
        : {
            staffId: selectedEmployee.id,
            subject,
            message,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send mail");
      }

      const recipientCount = isBulkMode
        ? employees.length
        : selectedMultiple.size;

      toast.success(
        data.message ||
        `Mail sent to ${recipientCount} staff member${recipientCount > 1 ? "s" : ""}`
      );

      // Reset form
      setSubject("");
      setMessage("");
      setSelectedEmployee(null);
      setSelectedMultiple(new Set());
      setSelectAll(false);
      setIsMultiSelectMode(false);
      setIsBulkMode(false);
      setQuery("");
      setShowDropdown(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle send based on mode
  const handleSend = () => {
    if (isBulkMode) {
      handleBulkSend();
    } else if (isMultiSelectMode) {
      handleSendMultiple();
    } else {
      handleSendSingle();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            HR Message
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Send mails to staff directly
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          {formatted}
        </div>
      </div>

      {/* MODE TOGGLE BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setIsBulkMode(false);
            setIsMultiSelectMode(false);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all ${
            !isBulkMode && !isMultiSelectMode
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Send className="w-4 h-4" />
          Single Recipient
        </button>

        <button
          onClick={() => {
            setIsMultiSelectMode(!isMultiSelectMode);
            setIsBulkMode(false);
            if (!isMultiSelectMode) {
              setSelectedEmployee(null);
            }
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all ${
            isMultiSelectMode
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Multiple Staff ({selectedMultiple.size})
        </button>

        <button
          onClick={() => {
            setIsBulkMode(!isBulkMode);
            setIsMultiSelectMode(false);
            if (!isBulkMode) {
              setSelectedEmployee(null);
              setSelectedMultiple(new Set());
              setSelectAll(false);
            }
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all ${
            isBulkMode
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Bulk Mailing ({employees.length})
        </button>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border shadow-xl overflow-hidden p-8 space-y-6"
      >
        {/* SINGLE RECIPIENT MODE */}
        {!isBulkMode && !isMultiSelectMode && (
          <div className="relative space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Recipient
            </label>

            {selectedEmployee ? (
              <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <span className="font-bold">
                    {selectedEmployee.name}
                  </span>
                </div>

                <button onClick={() => setSelectedEmployee(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Search className="absolute left-4 top-10 w-4 h-4 text-slate-400" />

                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search employee..."
                  className="pl-12 pr-4 py-4 w-full rounded-2xl border bg-slate-50"
                />

                {/* DROPDOWN */}
                <AnimatePresence>
                  {showDropdown && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full bg-white border rounded-2xl mt-2 shadow-lg max-h-64 overflow-auto"
                    >
                      {results.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setShowDropdown(false);
                            setQuery("");
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50"
                        >
                          <p className="font-bold">{emp.name}</p>
                          <p className="text-xs text-slate-400">
                            {emp.email}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}

        {/* MULTI-SELECT MODE */}
        {isMultiSelectMode && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Select Staff Members
              </label>
              <button
                onClick={handleSelectAll}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                  selectAll
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Check className="w-3 h-3 inline mr-1" />
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* SEARCH IN MULTI-SELECT */}
            <div className="relative">
              <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search employees..."
                className="pl-12 pr-4 py-3 w-full rounded-2xl border bg-slate-50"
              />
            </div>

            {/* EMPLOYEE LIST WITH CHECKBOXES */}
            <div className="max-h-64 overflow-y-auto border rounded-2xl divide-y bg-slate-50">
              {(query ? results : employees).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-4 hover:bg-white transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedMultiple.has(emp.id)}
                    onChange={() => toggleEmployeeSelection(emp.id)}
                    className="w-5 h-5 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SELECTED STAFF DISPLAY */}
            {selectedMultiple.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Selected ({selectedMultiple.size})
                  </label>
                  <button
                    onClick={clearAllSelections}
                    className="text-xs text-red-600 hover:text-red-700 font-bold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  {selectedEmployeesArray.map((emp) => (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full text-xs font-bold"
                    >
                      {emp.name}
                      <button
                        onClick={() => removeFromSelection(emp.id)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* BULK MODE INFO */}
        {isBulkMode && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-bold text-blue-900">Bulk Mode Active</p>
              <p className="text-xs text-blue-700">
                This message will be sent to all {employees.length} staff members
              </p>
            </div>
          </div>
        )}

        {/* SUBJECT */}
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-6 py-4 rounded-2xl border bg-slate-50"
        />

        {/* MESSAGE */}
        <textarea
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write message..."
          className="w-full px-6 py-5 rounded-2xl border bg-slate-50"
        />

        {/* FOOTER */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-bold">
            Verified HR Outbound
          </span>

          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 font-bold transition-all"
          >
            <Send className="w-4 h-4" />
            {loading
              ? "Sending..."
              : isBulkMode
              ? `Send to All (${employees.length})`
              : isMultiSelectMode
              ? `Send to ${selectedMultiple.size}`
              : "Send Mail"}
          </button>
        </div>
      </motion.div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showBulkConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {isBulkMode
                  ? "Send to All Staff?"
                  : "Send to Selected Staff?"}
              </h3>

              <p className="text-slate-600 mb-6">
                You are about to send this message to{" "}
                <span className="font-bold text-blue-600">
                  {isBulkMode ? employees.length : selectedMultiple.size} staff member
                  {(isBulkMode ? employees.length : selectedMultiple.size) > 1
                    ? "s"
                    : ""}
                </span>
                . This action cannot be undone.
              </p>

              {isMultiSelectMode && (
                <div className="mb-4 p-3 bg-slate-50 rounded-xl max-h-48 overflow-y-auto">
                  <p className="text-xs font-bold text-slate-600 mb-2">Recipients:</p>
                  <div className="space-y-1">
                    {selectedEmployeesArray.map((emp) => (
                      <p key={emp.id} className="text-xs text-slate-700">
                        • {emp.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={confirmAndSend}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Yes, Send Message"}
                </button>

                <button
                  onClick={() => setShowBulkConfirm(false)}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}