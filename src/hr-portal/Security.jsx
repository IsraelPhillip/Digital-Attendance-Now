import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Shield,
  Fingerprint,
  Lock,
  Cpu,
} from "lucide-react";

export default function Security() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        const res = await axios.get(`${API}/getAllSecurity`);
        setCards(res.data.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurity();
  }, []);

  const createNew = async () => {
    try {
      const password = `PX-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      const res = await axios.post(`${API}/createSecurity`, {
        password,
      });

      const newCard = {
        securityId: res.data.data.securityId,
        createdAt: new Date().toISOString(),
        password,
      };

      setCards((prev) => [newCard, ...prev]);
    } catch (err) {
      console.error("Create error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* --- Cyber Header --- */}
      <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500/80">
                Protocol
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              Security <span className="text-slate-500">Access</span>
            </h1>

            <p className="text-slate-400 max-w-md font-medium leading-relaxed">
              Monitoring and deploying encrypted hardware modules for security access control.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
                Systems Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Node Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {cards.map((card, i) => (
            <motion.div
              key={card.securityId}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.05,
              }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

              <div className="relative bg-white rounded-[2rem] border border-slate-200 p-7 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-slate-900 rounded-2xl group-hover:bg-blue-600 transition-colors duration-500">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <Lock className="w-5 h-5 text-slate-200 group-hover:text-blue-200 transition-colors" />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">
                        Security ID
                      </span>
                      <p className="text-xs font-mono font-bold text-blue-600">
                        {card.securityId}
                      </p>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">
                        Created
                      </span>
                      <p className="text-xs font-bold text-slate-600">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                        Hash Sequence
                      </span>
                      <Fingerprint className="w-3 h-3 text-slate-300" />
                    </div>

                    <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-center text-blue-400 border border-slate-800 shadow-inner group-hover:border-blue-500/30 transition-colors">
                      {card.password || "••••••"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Initialize Button */}
        <motion.button
          onClick={createNew}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative min-h-[340px] rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-5 hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative p-5 rounded-full bg-slate-100 group-hover:bg-blue-600 transition-colors duration-500">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="text-center">
            <span className="block text-sm font-black text-slate-900 uppercase tracking-widest">
              Initialize Node
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block">
              Deploy Access Protocol
            </span>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 py-10 opacity-30 select-none pointer-events-none">
        <div className="h-[1px] w-20 bg-slate-300"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          Encrypted Terminal End
        </span>
        <div className="h-[1px] w-20 bg-slate-300"></div>
      </div>
    </div>
  );
}