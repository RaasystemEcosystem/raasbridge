// src/pages/RaasBridgeDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moduleLinks = [
  { name: "Raaswallet", url: "/raaswallet" },
  { name: "RABEX", url: "/rabex" },
  { name: "Raaspay", url: "/raaspay" },
  { name: "RaasGenAI", url: "/raasgenai" }
];

const initialMetrics = [
  { title: "Total Balance", value: "125,340 $RBT" },
  { title: "Open Positions", value: "5" },
  { title: "PnL Today", value: "+36 $RBT" },
  { title: "Trading Volume", value: "37,500 $RBT" }
];

const mockChartData = {
  labels: Array.from({ length: 10 }, (_, i) => `T-${10 - i}`),
  datasets: [
    {
      label: "RBT Price",
      data: [100, 102, 101, 105, 107, 110, 108, 112, 115, 118],
      borderColor: "#FFD700",
      backgroundColor: "rgba(255, 215, 0, 0.2)",
      tension: 0.3
    }
  ]
};

const chartOptions = {
  animation: { duration: 1000, easing: "easeOutQuart" },
  plugins: {
    legend: { labels: { color: "#FFD700" } },
    tooltip: { enabled: true }
  },
  scales: {
    x: { ticks: { color: "#FFD700" }, grid: { color: "#333" } },
    y: { ticks: { color: "#FFD700" }, grid: { color: "#333" } }
  }
};

export default function RaasBridgeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(m => {
          if (m.title.includes("PnL")) {
            const change = (Math.random() * 100 - 50).toFixed(0);
            return { ...m, value: `+${change} $RKN` };
          }
          return m;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { key: "overview", label: "Dashboard Overview" },
    { key: "raasgenai", label: "RaasGenAI Console" },
    { key: "rabex", label: "RABEX (Trading Hub)" },
    { key: "raaspay", label: "Raaspay & Settlement" },
    { key: "wallets", label: "Wallet Balances" },
    { key: "rwassets", label: "RaasFarm / RWA" },
    { key: "reports", label: "AI Reports & Insights" },
    { key: "settings", label: "Settings / Integrations" }
  ];

  const Card = ({ title, value }) => (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,215,0,0.5)" }}
      className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-yellow-400 font-semibold">{title}</h4>
        <div className="text-white font-bold text-lg">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white antialiased flex">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#0b0b0c] border-r border-gray-800 transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 rounded-md bg-yellow-400" />
          {!collapsed && <div className="text-xl font-bold text-yellow-400">RaasBridge</div>}
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-white/5 transition-colors ${
                active === item.key ? "bg-white/5" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-yellow-400 to-yellow-300" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2 justify-center py-2 rounded-md bg-white/5 hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-300">
              <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!collapsed && <span className="text-sm">{collapsed ? "Expand" : "Collapse"}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gradient-to-b from-transparent to-black">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-yellow-400">RaasBridge</div>
            <div className="text-sm text-gray-400">Unified Dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white/5 rounded-md px-3 py-2 gap-2">
              <input
                className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
                placeholder="Search assets, txns, users..."
              />
              <button className="text-sm px-2 py-1 rounded-md bg-yellow-400 text-black font-semibold">Search</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                RaasGenAI: <span className="text-green-400 font-semibold">Active</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">U</div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 flex-1 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {/* Top Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {metrics.map(m => <Card key={m.title} title={m.title} value={m.value} />)}
            </section>

            {/* Modules & AI Panel */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <h3 className="text-yellow-400 font-semibold">RaasGenAI Command Panel</h3>
                  <p className="text-gray-300 mt-2">Quick actions to instruct the AI orchestrator.</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {["Optimize Markets","Sync Liquidity","Run Prediction","Arbitrage Scan"].map((action, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.7)" }}
                        whileTap={{ scale: 0.95 }}
                        className="py-2 rounded-md bg-yellow-400 text-black font-semibold"
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Modules */}
                <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <h3 className="text-yellow-400 font-semibold">Modules</h3>
                  <div className="mt-4 flex flex-col gap-2">
                    {moduleLinks.map(m => (
                      <a key={m.name} href={m.url} className="py-2 px-3 rounded-md bg-white/5 hover:bg-white/10 text-yellow-400 font-semibold block">
                        {m.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts & Network Visual */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <h3 className="text-yellow-400 font-semibold mb-4">Market Activity</h3>
                  <Line data={mockChartData} options={chartOptions} />
                </div>

                <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 h-96 flex items-center justify-center text-gray-400">
                  [3D Globe / Map placeholder — react-globe.gl / three.js]
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <h3 className="text-yellow-400 font-semibold mb-2">Recent Activity</h3>
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                <li>Swap executed: RAAS → USDC — 2m ago</li>
                <li>Raaspay settlement initiated — 5m ago</li>
                <li>New tokenized asset minted — 12m ago</li>
              </ul>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
