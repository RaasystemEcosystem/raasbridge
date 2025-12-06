// src/components/RaasBridgeAssetsConnectivity.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const assetsList = [
  { name: "Crypto", color: "green" },
  { name: "Stocks", color: "green" },
  { name: "Commodities", color: "green" },
  { name: "Tokenized Gold", color: "green" },
  { name: "RWA", color: "green" }
];

export default function RaasBridgeAssetsConnectivity() {
  const [assets, setAssets] = useState(
    assetsList.map(a => ({ ...a, lastUpdate: new Date() }))
  );

  // Simulate dynamic status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev =>
        prev.map(a => {
          const statusRoll = Math.random();
          let color = a.color;
          if (statusRoll < 0.05) color = "red";      // small chance of failure
          else if (statusRoll < 0.15) color = "yellow"; // minor warning
          else color = "green";

          return { ...a, color, lastUpdate: new Date() };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] h-full w-full overflow-hidden">
      {/* Header */}
      <h3 className="text-yellow-400 font-semibold mb-2 text-lg">
        RaasBridge Cross-Assets Connectivity
      </h3>
      <p className="text-gray-300 mb-4 text-sm">
        Unified asset mapping across crypto, tokenized gold, and RWAs.  
        Bridges Raas, RBT, and other tokenized assets in real-time.
      </p>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 gap-3 relative z-10">
        {assets.map((a, idx) => (
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
                  a.color === "green"
                    ? "bg-green-500 animate-pulse"
                    : a.color === "yellow"
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
              />
              <span className="text-yellow-400 font-semibold">{a.name}</span>
            </div>
            <div className="text-gray-300 text-sm">
              {a.lastUpdate.toLocaleTimeString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optional Animated Flow Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {assets.map((a, idx) => (
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
