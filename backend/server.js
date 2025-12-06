// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// --- Mock data generators ---
const randomNumber = (min = 0, max = 100) => Math.random() * (max - min) + min;

// Metrics
const metrics = [
  { title: "Total Balance", value: randomNumber(1000, 5000).toFixed(2) },
  { title: "PnL Today", value: randomNumber(-500, 500).toFixed(2) },
  { title: "Active Trades", value: Math.floor(randomNumber(5, 20)) },
  { title: "Liquidity Pools", value: randomNumber(5000, 20000).toFixed(2) }
];

// Chart Data
const chartData = {
  labels: Array.from({ length: 12 }, (_, i) => `H${i}`),
  datasets: [
    {
      label: "RBT Price",
      data: Array.from({ length: 12 }, () => randomNumber(0.01, 0.05)),
      borderColor: "#FFD700",
      backgroundColor: "rgba(255,215,0,0.2)",
      tension: 0.3
    }
  ]
};

// Recent Activities
const recentActivity = [
  { text: "User executed AI trade", type: "user-ai", status: "completed", minutesAgo: 5 },
  { text: "AMM pool adjusted liquidity", type: "amm", status: "completed", minutesAgo: 10 },
  { text: "User submitted AI prediction", type: "user-ai", status: "pending", minutesAgo: 2 }
];

// AMM Trades
const ammTrades = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  pair: `RBT/RAAS`,
  amount: randomNumber(10, 100).toFixed(2),
  price: randomNumber(0.01, 0.05).toFixed(4),
  status: "executed"
}));

// USER-AI Trades
const userAiTrades = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  user: `User${i + 1}`,
  action: "BUY",
  pair: "RBT/RAAS",
  amount: randomNumber(5, 50).toFixed(2),
  status: ["pending", "executed"][Math.floor(Math.random() * 2)]
}));

// --- API Endpoints ---
app.get("/api/rabex/metrics", (req, res) => res.json(metrics));

app.get("/api/rabex/chart", (req, res) => res.json(chartData));

app.get("/api/rabex/recent-activity", (req, res) => res.json(recentActivity));

app.get("/api/rabex/amm-trades", (req, res) => res.json(ammTrades));

app.get("/api/rabex/user-ai-trades", (req, res) => res.json(userAiTrades));

// Run AI Command
app.post("/api/rabex/command/:cmd", (req, res) => {
  const { cmd } = req.params;
  console.log(`Executing AI Command: ${cmd}`);
  res.json({ status: "success", command: cmd });
});

// Start server
app.listen(PORT, () => {
  console.log(`RaasBridge local backend running on http://localhost:${PORT}`);
});
