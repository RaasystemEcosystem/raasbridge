// src/components/RaasBridgeConnectivity.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const servicesList = [
  { name: "AWS", color: "green" },
  { name: "XDC Network", color: "green" },
  { name: "XRP Ledger", color: "green" },
  { name: "USDT", color: "green" },
  { name: "ICE Exchange", color: "green" }
];

export default function RaasBridgeConnectivity() {
  const [services, setServices] = useState(
    servicesList.map(s => ({ ...s, lastUpdate: new Date() }))
  );

  // Simulate dynamic status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev =>
        prev.map(s => {
          // Randomly toggle status
          const statusRoll = Math.random();
          let color = s.color;
          if (statusRoll < 0.05) color = "red"; // small chance of failure
          else if (statusRoll < 0.15) color = "yellow"; // minor warning
          else color = "green";

          return { ...s, color, lastUpdate: new Date() };
        })
      );
    }, 5000); // update every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] h-full w-full overflow-hidden">
      {/* Header */}
      <h3 className="text-yellow-400 font-semibold mb-2 text-xl">
        RaasBridge Cross-Chain Interoperability
      </h3>
      <p className="text-gray-300 mb-4 text-sm">
        Move Assets and Data Seamlessly Between Chains.
      </p>A
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {services.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between bg-white/5 rounded-xl p-3 shadow hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  s.color === "green"
                    ? "bg-green-500"
                    : s.color === "yellow"
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
              />
              <span className="text-yellow-400 font-semibold">{s.name}</span>
            </div>
            <div className="text-gray-300 text-sm">
              {s.lastUpdate.toLocaleTimeString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optional Animated Flow Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {services.map((s, idx) => (
          <motion.div
            key={`flow-${idx}`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + idx }}
            className="absolute bg-yellow-400 w-1.5 h-1.5 rounded-full"
            style={{
              top: `${10 + idx * 16}%`,
              left: `${20 + idx * 15}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
