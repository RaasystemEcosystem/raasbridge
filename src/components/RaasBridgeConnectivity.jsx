import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const defaultServices = [
  { name: "AWS", status: true },
  { name: "XDC Network", status: true },
  { name: "XRP Ledger", status: true },
  { name: "USDT", status: true },
  { name: "ICE Exchange", status: false }
];

export default function RaasBridgeConnectivity({ servicesList = defaultServices }) {
  const [services, setServices] = useState(
    servicesList.map(s => ({ ...s }))
  );

  // Simulate dynamic status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev =>
        prev.map(s => {
          const roll = Math.random();
          let status = s.status;
          if (roll < 0.05) status = false;    // small chance of failure
          else if (roll < 0.15) status = true; // normal
          return { ...s, status };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,215,0,0.4)" }}
      className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500 min-h-[250px] flex flex-col justify-between"
    >
      <div>
        <h3 className="text-yellow-400 font-semibold mb-2 text-lg">RaasBridge Cross-Chain Interoperability</h3>
        <p className="text-gray-300 text-sm mb-4">
          Seamless blockchain connectivity enabling XDC ↔ ETH ↔ BTC ↔ RBT ↔ RAAS ↔ USDT transfers.  
          Powered by the RaasBridge Hybrid Layer.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 mt-4">
          {services.map((net, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-md">
              <span>{net.name}</span>
              <span className={`w-3 h-3 rounded-full ${net.status ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
            </div>
          ))}
        </div>
      </div>

      <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition">
        View Network Status
      </button>
    </motion.div>
  );
}
