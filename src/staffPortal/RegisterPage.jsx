import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, User, Mail, Lock, Eye, EyeOff, Briefcase, Hash, ChevronDown } from "lucide-react";
import Background from "../assets/register-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

// Departments data
const departments = {
  HR: ["Recruitment", "Payroll", "Training", "Welfare", "Compliance"],
  ITIDD: ["Software", "Database", "Biometrics", "ISRM", "Data center"],
  Finance: ["Accounts", "Audit", "Budgeting", "Tax", "Procurement"],
  Admin: ["Operations", "Logistics", "Facilities", "Records", "Security"],
  Networking: ["Digital", "Brand", "Content", "SEO", "Ads"],
  Operations: ["Field Ops", "Maintenance", "Dispatch", "Monitoring", "Control"],
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [unit, setUnit] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setUnit("");
  };

  const passwordStrength = () => {
    if (password.length < 6) return "Weak";
    if (!/[A-Z]/.test(password)) return "Weak";
    if (!/[0-9]/.test(password)) return "Weak";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Weak";
    return "Strong";
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};

    if (!acceptedTerms) newErrors.terms = "You must accept the terms of use";
    if (!firstName || !lastName || !staffId || !email) newErrors.form = "All fields are required";
    if (passwordStrength() !== "Strong")
      newErrors.password =
        "Password must be at least 6 characters, include uppercase, number, and special character";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      setLoading(true);
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/registerStaff`,
        {
          firstName,
          lastName,
          email,
          password,
          staffId,
          department: selectedDepartment,
          unit,
        }
      );
  
      // ✅ ONLY navigate if backend confirms success
      if (response.status === 200 || response.status === 201) {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }


  };

  const strength = password ? passwordStrength() : "";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      />

      {/* Optional overlay for better readability */}
      <div className="absolute inset-0 -z-10 bg-black/20 backdrop-blur-sm" />

      <motion.div
        className="auth-card relative z-10 !max-w-[440px] bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg"
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-4 h-4 text-primary-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-heading font-bold text-foreground mb-1">
          Register Now
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="text-secondary font-semibold text-sm mb-6">
          And generate your QR Code
        </motion.p>

        {/* Terms */}
        <motion.label
          variants={fadeUp}
          custom={3}
          className="flex items-center gap-2 text-xs text-muted-foreground mb-1 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary/30"
          />
          I agree with <span className="text-primary font-medium hover:underline">Terms of use</span>
        </motion.label>
        {errors.terms && <p className="text-xs text-destructive mb-2">{errors.terms}</p>}
        {errors.form && <p className="text-xs text-destructive mb-2">{errors.form}</p>}

        {/* Form */}
        <motion.form variants={fadeUp} custom={4} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="First name"
                className="auth-input pl-10"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Last name"
                className="auth-input pl-10"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Staff ID */}
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Staff ID"
              className="auth-input pl-10"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
 
          {/* Department & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                className="auth-input pl-10 pr-8 appearance-none cursor-pointer"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                <option value="">Department</option>
                {Object.keys(departments).map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                className="auth-input pl-10 pr-8 appearance-none cursor-pointer disabled:opacity-50"
                disabled={!selectedDepartment}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="">Unit</option>
                {(departments[selectedDepartment] || []).map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="example@gmail.com"
              className="auth-input pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
  {/* Input wrapper (fixed height) */}
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      className="auth-input pl-10 pr-10"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-muted-foreground hover:text-foreground transition-colors"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>

  {/* Messages OUTSIDE the input wrapper */}
  {strength && (
    <p className="text-xs mt-1">
      Strength:{" "}
      <strong className={strength === "Strong" ? "text-success" : "text-destructive"}>
        {strength}
      </strong>
    </p>
  )}

  {errors.password && (
    <p className="text-xs text-destructive mt-1">
      {errors.password}
    </p>
  )}
</div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="auth-input pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </motion.form>

        <motion.p variants={fadeUp} custom={5} className="text-xs text-muted-foreground mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
