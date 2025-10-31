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
import RaasBridgeDiagram from "../components/RaasBridgeDiagram.jsx";
import RaasBridgeConnectivity from "../components/RaasBridgeConnectivity.jsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moduleLinks = [
  { name: "Raaswallet", url: "/raaswallet" },
  { name: "RABEX", url: "/rabex" },
  { name: "Raaspay", url: "/raaspay" },
  { name: "RaasGenAI", url: "/raasgenai" }
];

const initialMetrics = [
  { title: "Total Balance", value: 125_340 }, // $RBT
  { title: "Open Positions", value: 5 },
  { title: "PnL Today", value: 5 }, // $RKN
  { title: "Trading Volume", value: 37_500 }
];

const initialActivities = [
  { text: "Swap executed: RAAS → USDC", minutesAgo: 2 },
  { text: "Raaspay settlement initiated", minutesAgo: 5 },
  { text: "New tokenized asset minted", minutesAgo: 12 }
];

export default function RaasBridgeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  const [metrics, setMetrics] = useState(initialMetrics);
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 10 }, (_, i) => `T-${10 - i}`),
    datasets: [
      {
        label: "RBT Price",
        data: Array(10).fill(100),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        tension: 0.3
      }
    ]
  });
  const [activities, setActivities] = useState(initialActivities);
  const [flows, setFlows] = useState([]);
  const [aiStatus, setAiStatus] = useState("Active"); // RaasGenAI status

  // Dynamic updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Metrics
      setMetrics(prev =>
        prev.map(m => {
          if (m.title === "PnL Today") {
            const change = (Math.random() * 10 - 5).toFixed(2);
            return { ...m, value: parseFloat(change) };
          }
          if (m.title === "Total Balance") {
            const change = (Math.random() * 500 + 125_000).toFixed(0);
            return { ...m, value: parseFloat(change) };
          }
          return m;
        })
      );

      // Chart
      setChartData(prev => {
        const newData = [...prev.datasets[0].data];
        newData.push(newData[newData.length - 1] + (Math.random() * 4 - 2));
        if (newData.length > 10) newData.shift();

        const newLabels = [...prev.labels];
        newLabels.push(`T-${newLabels.length}`);
        if (newLabels.length > 10) newLabels.shift();

        return {
          ...prev,
          labels: newLabels,
          datasets: [{ ...prev.datasets[0], data: newData }]
        };
      });

      // Token flows
      setFlows([
        {
          startLat: Math.random() * 80 - 40,
          startLng: Math.random() * 180 - 90,
          endLat: Math.random() * 80 - 40,
          endLng: Math.random() * 180 - 90,
          color: "yellow"
        },
        {
          startLat: Math.random() * 80 - 40,
          startLng: Math.random() * 180 - 90,
          endLat: Math.random() * 80 - 40,
          endLng: Math.random() * 180 - 90,
          color: "goldenrod"
        },
        {
          startLat: Math.random() * 80 - 40,
          startLng: Math.random() * 180 - 90,
          endLat: Math.random() * 80 - 40,
          endLng: Math.random() * 180 - 90,
          color: "orange"
        }
      ]);

      // Activities
      const actions = [
        "Swap executed: RAAS → RBT",
        "RBT → USDC executed",
        "New tokenized asset minted",
        "Liquidity synced",
        "RaasGenAI prediction run"
      ];
      const newActivity = { text: actions[Math.floor(Math.random() * actions.length)], minutesAgo: 0 };

      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, 6);
        return updated.map(a => ({ ...a, minutesAgo: a.minutesAgo + 1 }));
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

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

  const chartOptions = {
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: { labels: { color: "#FFD700" } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `RBT: ${context.raw.toFixed(2)} | $RBT: ${raasValue.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: "#FFD700" }, grid: { color: "#333" } },
      y: { ticks: { color: "#FFD700" }, grid: { color: "#333" } }
    }
  };

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
              className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-white/5 transition-colors ${active === item.key ? "bg-white/5" : ""}`}
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
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/5 rounded-md px-3 py-2 gap-2">
              <input className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500" placeholder="Search assets, txns, users..." />
              <button className="text-sm px-2 py-1 rounded-md bg-yellow-400 text-black font-semibold">Search</button>
            </div>
            {/* RaasGenAI Status */}
            <div className="flex items-center gap-2 bg-green-600/80 px-3 py-1 rounded-md text-white font-semibold text-sm">
              RaasGenAI: {aiStatus}
            </div>
            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400" />
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-auto space-y-6">
          {/* Top Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map(m => <Card key={m.title} title={m.title} value={m.value} />)}
          </section>

          {/* RaasGenAI Command Panel */}
<section className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)] mb-6">
  <h3 className="text-yellow-400 font-semibold mb-2 text-lg">RaasGenAI Command Panel</h3>
  <p className="text-gray-900 mb-4 text-sm">Quick actions to instruct the AI orchestrator.</p>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {["Optimize Markets", "Sync Liquidity", "Run Prediction", "Arbitrage Scan"].map(cmd => (
      <motion.button
        key={cmd}
        whileHover={{ scale: 1.03 }}
        className="bg-yellow-400 text-black font-semibold rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:bg-yellow-300 transition-colors"
      >
        {cmd}
      </motion.button>
    ))}
  </div>
</section>

          {/* Modules & Market + Globe */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              {moduleLinks.map(link => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  whileHover={{ scale: 1.02 }}
                  className="block bg-black/80 border border-yellow-400 rounded-xl p-4 text-yellow-400 font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Market Chart */}
              <div className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <h3 className="text-yellow-400 font-semibold mb-4">Market Activity</h3>
                <Line data={chartData} options={chartOptions} />
              </div>

              <div className="lg:col-span-2">
                <RaasBridgeConnectivity />
              </div>


            </div>
          </section>

          {/* Token Economy Diagram */}
          <section className="mt-10">
            <h3 className="text-yellow-400 font-semibold mb-4 text-xl">RaasBridge Token Economy</h3>
            <RaasBridgeDiagram raasValue={raasValue} rbtValue={rbtValue} />
          </section>

          {/* Recent Activity */}
          <section className="bg-black/80 border border-yellow-400 rounded-xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <h3 className="text-yellow-400 font-semibold mb-2">Recent Activity</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              {activities.map((act, idx) => (
                <li key={idx}>{`${act.text} — ${act.minutesAgo}m ago`}</li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
