import api from "../api/axios";
import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Info, Maximize } from "lucide-react";

const TECH_BG =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

const ScanPage = () => {
  const navigate = useNavigate();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [processing, setProcessing] = useState(false); // ✅ NEW

  useEffect(() => {
    let scanner;
    let isRunning = false;
    let hasScanned = false; // ✅ prevent duplicate scans
    let timeoutId;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode("qr-reader");

        await scanner.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 350, height: 350 } },
          async (decodedText) => {
            if (hasScanned) return;
            hasScanned = true;

            setScanSuccess(true);
            setProcessing(true); // ✅ show processing UI

            isRunning = false;
            await scanner.stop().catch(() => {});
            clearTimeout(timeoutId);

            try {
              await api.post(
                "/qrScan",
                { qrData: decodedText },
              );

              navigate("/clock");

            } catch (err) {
              let errorMessage = "Unable to clock in. Please try again.";

              if (err.response?.data?.message) {
                errorMessage = err.response.data.message;

              } else if (err.request) {
                errorMessage =
                  "Network error: Please check your internet connection.";
              }

              navigate("/clock-in-failed", {
                state: { error: errorMessage },
              });
            }
          }
        );

        isRunning = true;
        setIsCameraActive(true);

        timeoutId = setTimeout(() => {
          if (isRunning) {
            isRunning = false;
            scanner.stop().catch(() => {});
            navigate("/clock-in-failed", {
              state: { error: "Scan timed out. Please try again." },
            });
          }
        }, 120000);

      } catch (err) {
        console.error("Camera error:", err);

        let errorMessage = "Unable to access camera.";

        if (err?.name === "NotAllowedError") {
          errorMessage = "Camera permission denied.";
        }

        navigate("/clock-in-failed", {
          state: { error: errorMessage },
        });
      }
    };

    const timer = setTimeout(startScanner, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutId);

      if (scanner && isRunning) {
        scanner.stop().catch(() => {});
      }
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={TECH_BG}
          alt="bg"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 text-center z-20"
      >
        <h1 className="text-4xl font-bold text-white">
          QR <span className="text-blue-500">Scanner</span>
        </h1>
      </motion.div>

      {/* Scanner */}
      <div className="relative w-[400px] h-[500px] flex items-center justify-center">
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-xl">

          {/* Camera */}
          <div id="qr-reader" className="w-full h-full" />

          {/* Scan Area */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-[370px] h-[320px]">
              <div className="absolute inset-0 border border-white/10 rounded-xl" />

              {/* Scan Line */}
              <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.9)]"
              />
            </div>
          </div>

          {/* Loading */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400 z-30">
              <Maximize className="w-14 h-14 animate-ping opacity-20 absolute" />
              <Camera className="w-14 h-14 mb-4" />
              <p className="text-xs tracking-widest uppercase">
                Initializing Scanner
              </p>
            </div>
          )}

          {/* ✅ Processing Overlay */}
          {processing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 text-white text-sm tracking-wide">
              Processing scan...
            </div>
          )}
        </div>
      </div>

      {/* Instruction */}
      <div className="mt-6 flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
        <Info className="w-4 h-4 text-blue-400" />
        <p className="text-sm text-white">
          Align QR code inside the frame
        </p>
      </div>
    </div>
  );
};

export default ScanPage;