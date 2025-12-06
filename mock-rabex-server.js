// mock-rabex-server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

let ammTrades = [];
let userAiTrades = [];

// Initialize some AMM trades
for (let i = 0; i < 5; i++) {
  ammTrades.push({
    id: i + 1,
    type: "AMM",
    assetPair: "RBT/USDC",
    volume: getRandomInt(100, 1000),
    pnl: getRandomFloat(-5, 5),
    status: "executed",
    time: Date.now() - getRandomInt(0, 60000)
  });
}

// Initialize some USER-AI trades
for (let i = 0; i < 3; i++) {
  userAiTrades.push({
    id: i + 1,
    type: "USER-AI",
    assetPair: "RBT/RAAS",
    volume: getRandomInt(50, 500),
    pnl: 0,
    status: "pending",
    time: Date.now() - getRandomInt(0, 60000)
  });
}

// API: Metrics
app.get("/api/rabex/metrics", (req, res) => {
  const totalBalance = ammTrades.reduce((sum, t) => sum + t.volume, 0);
  const openPositions = userAiTrades.filter(t => t.status === "pending").length;
  const pnlToday = ammTrades.reduce((sum, t) => sum + t.pnl, 0);

  res.json([
    { title: "Total Balance", value: totalBalance },
    { title: "Open Positions", value: openPositions },
    { title: "PnL Today", value: pnlToday.toFixed(2) },
    { title: "Trading Volume", value: getRandomInt(30000, 40000) }
  ]);
});

// API: Market Chart
app.get("/api/rabex/chart", (req, res) => {
  const labels = Array.from({ length: 10 }, (_, i) => `T-${10 - i}`);
  const data = Array.from({ length: 10 }, () => getRandomFloat(95, 105));
  res.json({
    labels,
    datasets: [
      {
        label: "RBT Price",
        data,
        borderColor: "#FFD700",
        backgroundColor: "rgba(255,215,0,0.2)",
        tension: 0.3
      }
    ]
  });
});

// API: Recent Activity
app.get("/api/rabex/recent-activity", (req, res) => {
  const allTrades = [...ammTrades, ...userAiTrades].sort((a, b) => b.time - a.time);
  const activities = allTrades.map(t => ({
    text: `${t.type} Trade: ${t.assetPair} ${t.status.toUpperCase()} Vol:${t.volume} PnL:${t.pnl}`,
    minutesAgo: Math.floor((Date.now() - t.time) / 60000)
  }));
  res.json(activities.slice(0, 10));
});

// API: Trigger USER-AI trade
app.post("/api/rabex/command/:cmd", (req, res) => {
  const { cmd } = req.params;
  console.log("Received AI command:", cmd);

  // Simulate a trade triggered by AI
  const newTrade = {
    id: userAiTrades.length + 1,
    type: "USER-AI",
    assetPair: "RBT/RAAS",
    volume: getRandomInt(50, 500),
    pnl: 0,
    status: "pending",
    time: Date.now()
  };
  userAiTrades.push(newTrade);

  // Simulate execution after 5-10 seconds
  setTimeout(() => {
    newTrade.status = "executed";
    newTrade.pnl = getRandomFloat(-5, 5);
    newTrade.time = Date.now();
  }, getRandomInt(5000, 10000));

  res.json({ status: "accepted", trade: newTrade });
});

// Periodic AMM trades update
setInterval(() => {
  const newAmmTrade = {
    id: ammTrades.length + 1,
    type: "AMM",
    assetPair: "RBT/USDC",
    volume: getRandomInt(100, 1000),
    pnl: getRandomFloat(-5, 5),
    status: "executed",
    time: Date.now()
  };
  ammTrades.push(newAmmTrade);

  // Keep last 20 trades only
  if (ammTrades.length > 20) ammTrades.shift();
}, 7000);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mock RABEX server with AMM & USER-AI running on http://localhost:${PORT}`);
});
