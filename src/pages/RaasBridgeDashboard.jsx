// src/pages/RaasBridgeDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
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

import RaasBridgeDiagram from "../components/RaasBridgeDiagram.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const navItems = [
  { key: "overview", label: "Dashboard Overview" },
  { key: "raasgenai", label: "RaasGenAI Console" },
  { key: "rabex", label: "RABEX (Trading Hub)" },
  { key: "raaspay", label: "Raaspay & Settlement" },
  { key: "wallets", label: "Wallet Balances" },
  { key: "rwassets", label: "RaasTrade / RWA" },
  { key: "docs", label: "RaasDocs / API", external: true, url: "http://raasystem-docs.s3-website-us-west-2.amazonaws.com" },
  { key: "reports", label: "AI Reports & Insights" },
  { key: "settings", label: "Settings / Integrations" }
];

const moduleLinks = [
  { name: "Raaswallet", url: "http://raaswallet-ui.s3-website-us-west-2.amazonaws.com" },
  { name: "RABEX", url: "http://rabex-ui-724772066825.s3-website-us-west-2.amazonaws.com/#/dashboard" },
  { name: "Raaspay", url: "http://raaspay-ui.s3-website-us-west-2.amazonaws.com/" },
  { name: "RaasGenAI", url: "http://raasgenai-ui.s3-website-us-west-2.amazonaws.com/" },
  { name: "RaasExplorer", url: "http://raascan-ui.s3-website-us-east-1.amazonaws.com/" }
];

export default function RaasBridgeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [activities, setActivities] = useState([]);
  const [ammTrades, setAmmTrades] = useState([]);
  const [userAiTrades, setUserAiTrades] = useState([]);
  const [aiStatus, setAiStatus] = useState("Active");
  const REFRESH_MS = 7000;

  const [assetToggles, setAssetToggles] = useState({
    Crypto: true,
    Stocks: true,
    Commodities: true,
  });

  const fetchRABEXData = useCallback(async () => {
    try {
      const metricsRes = await fetch("/api/rabex/metrics");
      if (metricsRes.ok) setMetrics(await metricsRes.json());

      const chartRes = await fetch("/api/rabex/chart");
      if (chartRes.ok) setChartData(await chartRes.json());

      const activitiesRes = await fetch("/api/rabex/recent-activity");
      if (activitiesRes.ok) setActivities(await activitiesRes.json());

      const ammRes = await fetch("/api/rabex/amm-trades");
      if (ammRes.ok) setAmmTrades(await ammRes.json());

      const userAiRes = await fetch("/api/rabex/user-ai-trades");
      if (userAiRes.ok) setUserAiTrades(await userAiRes.json());
    } catch (err) {
      console.error("Error fetching RABEX data:", err);
    }
  }, []);

  useEffect(() => {
    fetchRABEXData();
    const interval = setInterval(fetchRABEXData, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchRABEXData]);

  const raasValue = metrics.find(m => m.title === "Total Balance")?.value || 0;
  const rbtValue = metrics.find(m => m.title === "PnL Today")?.value || 0;

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

  const filteredChartData = {
    ...chartData,
    datasets: chartData.datasets
      .filter(ds => assetToggles[ds.asset])
      .map(ds => ({
        ...ds,
        borderColor: ds.asset === "Crypto" ? "#00ffcc" :
                     ds.asset === "Stocks" ? "#ff9900" :
                     ds.asset === "Commodities" ? "#ff33aa" : "#FFD700",
        backgroundColor: "transparent",
        tension: 0.3
      }))
  };

  const chartOptions = {
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart) =>
            chart.data.datasets.map((ds, i) => ({
              text: ds.asset,
              fillStyle: ds.borderColor,
              strokeStyle: ds.borderColor,
              lineWidth: 2,
              hidden: !assetToggles[ds.asset],
              index: i
            })),
          color: "#FFD700"
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const raw = typeof context.raw === "number" ? context.raw : (context.raw?.y ?? 0);
            return `${context.dataset.asset}: ${raw.toFixed(2)} | $RBT: ${raasValue.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: "#FFD700" }, grid: { color: "#333" } },
      y: { ticks: { color: "#FFD700" }, grid: { color: "#333" } }
    }
  };

  const runAICommand = async (cmdKey) => {
    try {
      setAiStatus("Running...");
      const endpoint = cmdKey.replace(/\s+/g, "").toLowerCase();
      await fetch(`/api/rabex/command/${endpoint}`, { method: "POST" });
      await fetchRABEXData();
      setAiStatus("Active");
    } catch (err) {
      console.error("AI command failed:", err);
      setAiStatus("Error");
      setTimeout(() => setAiStatus("Active"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white antialiased">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#0b0b0c] border-r border-gray-800 transition-width duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 rounded-md bg-yellow-400" />
          {!collapsed && <div className="text-xl font-bold text-yellow-400">Raasystem</div>}
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => {
                if (item.external && item.url) window.open(item.url, "_blank");
                else setActive(item.key);
              }}
              className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-white/5 transition-colors ${active === item.key ? "bg-white/5" : ""}`}
            >
              <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-yellow-400 to-yellow-300" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center gap-2 justify-center py-2 rounded-md bg-white/5 hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-300">
              <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!collapsed && <span className="text-sm">{collapsed ? "Expand" : "Collapse"}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/90 sticky top-0 z-50 backdrop-blur-sm">
          <div className="text-2xl font-bold text-yellow-400">RaasBridge Dashboard</div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search assets, txns, users..."
              className="bg-white/10 placeholder-gray-400 text-white rounded-md px-3 py-1 outline-none text-sm"
            />
            <button className="bg-yellow-400 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-300 transition">
              Search
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/80 to-green-600/80 px-3 py-1 rounded-md text-white font-semibold text-sm">
              RaasGenAI: {aiStatus}
            </div>
            <div className="w-8 h-8 rounded-full bg-yellow-400" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-6 min-h-0">
          {/* Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.length ? metrics.map(m => <Card key={m.title} title={m.title} value={m.value} />) : (
              <div className="col-span-1 md:col-span-4 text-gray-400">Loading metrics…</div>
            )}
          </section>

          {/* RaasGenAI Command Panel */}
          <section className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <h3 className="text-yellow-400 font-semibold mb-2 text-lg">RaasGenAI Command Panel</h3>
            <p className="text-gray-300 mb-4 text-sm">Quick actions to instruct the AI orchestrator (these may trigger USER-AI trades).</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Optimize Markets", "Sync Liquidity", "Run Prediction", "Arbitrage Scan"].map(cmd => (
                <motion.button
                  key={cmd}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => runAICommand(cmd)}
                  className="bg-yellow-400 text-black font-semibold rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:bg-yellow-300 transition-colors"
                >
                  {cmd}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Module Links + Market Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              {moduleLinks.map(link => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className={`block border rounded-xl p-4 font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-colors
                    ${active === link.name
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-black/80 text-yellow-400 border-yellow-400 hover:bg-white/5"}`
                  }
                  onClick={() => setActive(link.name)}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <h3 className="text-yellow-400 font-semibold mb-4">Market Activity</h3>
                {filteredChartData.datasets.length > 0 ? (
                  <Line data={filteredChartData} options={chartOptions} />
                ) : (
                  <div className="text-gray-400 text-center py-20 text-lg">
                    Waiting for Live Rabex Data…
                  </div>
                )}
              </div>
            </div>
          </section>

                    {/* AMM + USER-AI + Cross-Chain + Cross-Assets */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* AMM */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,215,0,0.4)" }}
              className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500 min-h-[250px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2 text-lg">AMM — Autonomous Trading</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Live autonomous market-making managed entirely by the AI Trading Engine.  
                  Liquidity pools adjust automatically to global price flows.
                </p>
              </div>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition">
                View AMM Analytics
              </button>
            </motion.div>

            {/* USER-AI Guided Trading */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,215,0,0.4)" }}
              className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500 min-h-[250px] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2 text-lg">USER-AI Guided Trading</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Hybrid mode allowing users to collaborate with RaasGenAI.  
                  Execute trades with AI-optimized precision and dynamic risk controls.
                </p>
              </div>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition">
                Launch USER-AI Console
              </button>
            </motion.div>

            {/* Cross-Chain */}
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
                  {[{ name: "AWS", status: true }, { name: "XDC Network", status: true }, { name: "XRP Ledger", status: true }, { name: "USDT", status: true }, { name: "ICE Exchange", status: false }].map((net, idx) => (
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

{/* Cross-Assets */}
<motion.div
  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,215,0,0.4)" }}
  className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500 min-h-[250px] flex flex-col justify-between"
>
  <div>
    <h3 className="text-yellow-400 font-semibold mb-2 text-lg">
      RaasBridge Cross-Assets Connectivity
    </h3>
    <p className="text-gray-300 text-sm mb-4">
      Unified asset mapping across crypto, tokenized gold, and RWAs.
      Bridges Raas, RBT, and other tokenized assets in real-time.
    </p>

    <div className="grid grid-cols-1 gap-3 text-sm text-gray-300 mt-4">
      {Object.entries(assetToggles).map(([asset, enabled]) => (
        <div
          key={asset}
          className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-md"
        >
          <span>{asset}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={() =>
                setAssetToggles((prev) => ({ ...prev, [asset]: !prev[asset] }))
              }
            />
            <div className="w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer-checked:bg-green-500 transition-all duration-300"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-black rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
          </label>
        </div>
      ))}
    </div>
  </div>

  <button className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition">
    Explore Cross-Assets
  </button>
</motion.div>

          </section>

          {/* Token Economy Diagram */}
          <section className="mt-6">
            <h3 className="text-yellow-400 font-semibold mb-4 text-xl">RaasBridge Token Economy</h3>
            <RaasBridgeDiagram raasValue={raasValue} rbtValue={rbtValue} />
          </section>

          {/* Recent Activity */}
          <section className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <h3 className="text-yellow-400 font-semibold mb-2">Recent Activity</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              {activities.length === 0 ? <li className="text-gray-500">No recent activity</li> :
                activities.map((act, idx) => (
                  <li key={idx} className={act.type === "user-ai" && act.status === "pending" ? "text-yellow-300 font-semibold" : ""}>
                    {`${act.text} — ${act.minutesAgo}m ago`}
                  </li>
                ))
              }
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
