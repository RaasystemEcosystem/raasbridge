// src/components/RaasSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const menuItems = [
  { name: "📡 RaasBridge Unified Hub", path: "/dashboard" },
  { name: "🔍 AI Command Console", path: "/raasgenai" },
  { name: "📈 RABEX (Trading Hub)", path: "/rabex" },
  { name: "💳 Raaspay & Settlement", path: "/raaspay" },
  { name: "🌉 Cross-Chain Routing", path: "/crosschain" },
  { name: "🌐 Cross-Assets Hub", path: "/assets" },
  { name: "🪙 Raas Token Economy", path: "/token" },
  { name: "🌾 RWA / RaasFarm", path: "/rwa" },
  { name: "📡 RaasMatrix (GIS / Heatmaps)", path: "/matrix" },
  { name: "🧭 RaasExplorer / Raascan", path: "/raascan" },
  { name: "⚙️ Settings", path: "/settings" }
];

export default function RaasSidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">RaasBridge</h1>

      <nav className="space-y-2">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="rounded-lg p-2 hover:bg-gray-700 transition-all"
          >
            <Link to={item.path} className="block text-sm font-medium">
              {item.name}
            </Link>
          </motion.div>
        ))}
      </nav>
    </div>
  );
}

