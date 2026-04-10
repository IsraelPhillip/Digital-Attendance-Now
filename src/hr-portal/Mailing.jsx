import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, X } from "lucide-react";
import { toast } from "sonner";

export default function Mailing() {
  const [query, setQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);

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
});     const data = await res.json();

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

  const handleSend = async () => {
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
  credentials: "include", // 🔥 THIS FIXES 401
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

      // reset ONLY logic
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

      {/* CARD  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border shadow-xl overflow-hidden p-8 space-y-6"
      >
        {/* RECIPIENT */}
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

        {/* SUBJECT  */}
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

        {/* FOOTER  */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-bold">
            Verified HR Outbound
          </span>

          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Sending..." : "Send Mail"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}