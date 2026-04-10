import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, QrCode, Lock, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [success, setSuccess] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/hrLogin`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setSuccess(res.data.message || "Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setError(res.data.message || "Login failed");
    }
  } catch (err) {
    if (err.response) {
      setError(err.response.data.message || "Login failed");
    } else if (err.request) {
      setError("Network error. Check server connection.");
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 overflow-hidden font-sans">
      
      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://shared.jasonet.co/grid.svg')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/landingHr" className="group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4"
            >
              <QrCode className="w-7 h-7 text-white" />
            </motion.div>
          </Link>

          <p className="text-slate-400 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        {/* Glassmorphic Login Card */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2rem] overflow-hidden">
          <CardHeader className="pt-8 pb-4 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>

            <CardTitle className="text-xl font-bold text-white">
              Admin Login
            </CardTitle>

            <CardDescription className="text-slate-400">
              Enter your secure credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1">
                  Work Email
                </Label>

                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@attendx.com"
                    className="pl-11 bg-slate-950/40 border-white/10 text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-xl py-6 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 bg-slate-950/40 border-white/10 text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50 rounded-xl py-6 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="button" className="text-xs text-blue-400 hover:underline">
                Forgot Password?
              </button>
{error && (
  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
    {error}
  </p>
)}

{success && (
  <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
    {success}
  </p>
)}
              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </motion.div>
                  ) : (
                    <motion.span key="text">Sign In</motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>

            {/* Back */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link
                to="/landingHr"
                className="text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors inline-flex items-center gap-2 tracking-widest uppercase"
              >
                <ArrowLeft className="w-3 h-3" /> Back Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
          Protected by AES-256 Encryption • Attendee Security
        </p>
      </motion.div>
    </div>
  );
}