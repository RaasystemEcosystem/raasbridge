import React, { useState } from "react";
import { motion } from "framer-motion";

// RaasBridge Dashboard Shell - Phase 1
// Single-file React component designed for preview inside your frontend.
// Uses Tailwind CSS utility classes. Drop into a Vite/CRA/Next app that has Tailwind configured.

export default function RaasBridgeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");

  const navItems = [
    { key: "overview", label: "Dashboard Overview" },
    { key: "raasgenai", label: "RaasGenAI Console" },
    { key: "rabex", label: "RABEX (Trading Hub)" },
    { key: "raaspay", label: "Raaspay & Settlement" },
    { key: "wallets", label: "Wallet Balances" },
    { key: "rwassets", label: "RaasFarm / RWA" },
    { key: "reports", label: "AI Reports & Insights" },
    { key: "settings", label: "Settings / Integrations" },
  ];

  const Card = ({ title, value, subtitle, accent }) => (
    <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold">{title}</h4>
          <p className="text-gray-700 dark:text-gray-300 mt-1">{subtitle}</p>
        </div>
        <div className={`px-3 py-1 rounded-md font-bold text-sm ${accent || "text-black"}`}>
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`flex flex-col bg-[#0b0b0c] border-r border-gray-800 transition-all duration-200 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-md bg-yellow-400" />
            {!collapsed && <div className="text-xl font-bold text-yellow-400">RaasBridge</div>}
          </div>

          <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-white/5 transition-colors ${
                  active === item.key ? "bg-white/5" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-yellow-400 to-yellow-300" />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && (
                  <span className="text-xs text-gray-400">{item.key === "overview" ? "•" : ""}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3">
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="w-full flex items-center gap-2 justify-center py-2 rounded-md bg-white/5 hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-yellow-300"
              >
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {!collapsed && <span className="text-sm">{collapsed ? "Expand" : "Collapse"}</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* TOPBAR */}
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
                <div className="text-sm text-gray-400">RaasGenAI: <span className="text-green-400 font-semibold">Active</span></div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">U</div>
              </div>
            </div>
          </header>

          {/* PAGE BODY */}
          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Top Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Wallet Balance" value="10,234 RAAS" subtitle="Total across connected wallets" />
                <Card title="Open Positions" value="3" subtitle="Active RABEX positions" />
                <Card title="Pending Settlements" value="₿0.12" subtitle="Raaspay settlements in flight" />
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: AI Command Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm mb-6">
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold">RaasGenAI Command Panel</h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">Quick actions to instruct the AI orchestrator.</p>

                    <div className="mt-4 flex flex-col gap-3">
                      <button className="py-2 rounded-md bg-yellow-400 text-black font-semibold">Optimize Markets</button>
                      <button className="py-2 rounded-md bg-white/5 hover:bg-white/10">Sync Liquidity</button>
                      <button className="py-2 rounded-md bg-white/5 hover:bg-white/10">Run Prediction</button>
                      <button className="py-2 rounded-md bg-white/5 hover:bg-white/10">Arbitrage Scan</button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">Last run: 2m ago</div>
                  </div>

                  <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold">Ecosystem Quick Links</h4>
                    <div className="mt-3 flex flex-col gap-2">
                      <a className="text-xs p-2 rounded-md bg-white/5">Open Raaswallet</a>
                      <a className="text-xs p-2 rounded-md bg-white/5">Launch RABEX</a>
                      <a className="text-xs p-2 rounded-md bg-white/5">Open Raaspay</a>
                    </div>
                  </div>
                </div>

                {/* Center: Globe / Visualization */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-b from-gray-900 to-black rounded-lg p-6 shadow-sm h-80 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold">Network Visual (Mock)</h4>
                      <div className="text-sm text-gray-400">Realtime: <span className="text-green-400">✔</span></div>
                    </div>

                    <div className="flex-1 mt-4 bg-black/60 rounded-md border border-white/5 flex items-center justify-center">
                      <div className="text-gray-400">[3D Globe / Map placeholder — react-globe.gl / three.js]</div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-md">Liquidity Flow: 62%</div>
                      <div className="p-3 bg-white/5 rounded-md">AI Efficiency: 89%</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom: Detailed panels */}
              <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold">Market Activity</h4>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">Placeholder for charts (Recharts / Chart.js) showing volume, spreads and cross-market flows.</p>

                    <div className="mt-6 h-48 bg-black/60 rounded-md flex items-center justify-center text-gray-400">[Charts preview]</div>
                  </div>
                </div>

                <div>
                  <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold">Recent Activity</h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Swap executed: RAAS → USDC — 2m ago</li>
                      <li>• Raaspay settlement initiated — 5m ago</li>
                      <li>• New tokenized asset minted — 12m ago</li>
                    </ul>
                  </div>
                </div>
              </section>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
