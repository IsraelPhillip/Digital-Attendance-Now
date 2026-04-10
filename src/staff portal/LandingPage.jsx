import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import scanPhone from "@/assets/scan-phone.png";
import Background from "../assets/land-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-5">
      {/* Background */}
      <img
        src={Background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Content */}
      <motion.div
        className="max-w-sm w-full text-center flex flex-col items-center gap-6"
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <QrCode className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            Attendee
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="text-3xl font-heading font-bold text-foreground">
          Hello Attendee
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="text-base text-muted-foreground">
          Generate your unique{" "}
          <span className="text-primary font-semibold">QR code</span>
        </motion.p>

        <motion.img
          variants={fadeUp}
          custom={3}
          src={scanPhone}
          alt="Scan QR code"
          className="w-64 animate-float"
        />

        <motion.div variants={fadeUp} custom={4} className="w-full flex flex-col gap-3">
          <Link
            to="/login"
            className="block w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            LOGIN
          </Link>

          <Link
            to="/register"
            className="text-sm text-primary font-medium hover:underline transition-all"
          >
            Register now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
