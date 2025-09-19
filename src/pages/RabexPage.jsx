import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// --- Helpers for fallback simulation ---
const randomPrice = (base = 1000, variance = 50) =>
  (base + Math.random() * variance - variance / 2).toFixed(2);

const generateRandomCandles = (count = 20) => {
  let data = [];
  let price = 1000;
  for (let i = 0; i < count; i++) {
    let open = price;
    let close = parseFloat(randomPrice(price, 20));
    let high = Math.max(open, close) + Math.random() * 10;
    let low = Math.min(open, close) - Math.random() * 10;
    data.push({
      time: `T${i}`,
      open,
      close,
      high,
      low,
      volume: Math.floor(Math.random() * 1000),
    });
    price = close;
  }
  return data;
};

export default function RabexPage() {
  const [selectedToken, setSelectedToken] = useState("Raaskoin");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);
  const [candlestickData, setCandlestickData] = useState(generateRandomCandles());
  const [aiIndicators, setAiIndicators] = useState({ signal: "NEUTRAL", confidence: 0 });
  const [depthData, setDepthData] = useState([]);

  // WebSocket connection + fallback simulation
  useEffect(() => {
    let ws;
    let simulationInterval;

    try {
      ws = new WebSocket("wss://raasystem.net/rabex-feed");

      ws.onopen = () => {
        console.log("Connected to Rabex feed");
        ws.send(JSON.stringify({ action: "subscribe", token: selectedToken }));
      };

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "orderBook") {
          setOrderBook(data.payload);
          updateDepthChart(data.payload);
        }
        if (data.type === "trade")
          setTrades((prev) => [data.payload, ...prev.slice(0, 19)]);
        if (data.type === "candlestick")
          setCandlestickData((prev) => [...prev.slice(-19), data.payload]);
        if (data.type === "aiSignal") setAiIndicators(data.payload);
      };

      ws.onerror = () => {
        console.warn("Rabex feed unavailable, falling back to simulation.");
        fallbackSim();
      };

      ws.onclose = () => {
        console.log("Rabex feed closed, switching to simulation.");
        fallbackSim();
      };
    } catch (err) {
      console.error("WebSocket error:", err);
      fallbackSim();
    }

    // --- Fallback Simulation ---
    function fallbackSim() {
      simulationInterval = setInterval(() => {
        const newCandle = {
          time: new Date().toLocaleTimeString(),
          open: parseFloat(randomPrice(1000, 20)),
          close: parseFloat(randomPrice(1000, 20)),
          high: parseFloat(randomPrice(1020, 20)),
          low: parseFloat(randomPrice(980, 20)),
          volume: Math.floor(Math.random() * 1000),
        };
        setCandlestickData((prev) => [...prev.slice(-19), newCandle]);

        const newTrade = {
          price: randomPrice(1000, 20),
          amount: (Math.random() * 5).toFixed(2),
          time: new Date().toLocaleTimeString(),
        };
        setTrades((prev) => [newTrade, ...prev.slice(0, 19)]);

        const newOrderBook = {
          bids: Array.from({ length: 5 }, () => randomPrice(1000, 20)),
          asks: Array.from({ length: 5 }, () => randomPrice(1005, 20)),
        };
        setOrderBook(newOrderBook);
        updateDepthChart(newOrderBook);

        setAiIndicators({
          signal: Math.random() > 0.5 ? "BUY" : "SELL",
          confidence: (Math.random() * 100).toFixed(1),
        });
      }, 2000);
    }

    // Depth chart update helper
    function updateDepthChart(book) {
      let bids = book.bids.map((price, i) => ({
        price: parseFloat(price),
        bid: (i + 1) * 10,
      }));
      let asks = book.asks.map((price, i) => ({
        price: parseFloat(price),
        ask: (i + 1) * 10,
      }));
      setDepthData([...bids, ...asks]);
    }

    return () => {
      if (ws) ws.close();
      if (simulationInterval) clearInterval(simulationInterval);
    };
  }, [selectedToken]);

  // Quick % buttons for Buy/Sell
  const setPercent = (percent, type) => {
    if (type === "buy") setBuyAmount(((percent / 100) * 1000).toFixed(2)); // Example balance
    else setSellAmount(((percent / 100) * 1000).toFixed(2));
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Left Panel - Trading Actions */}
      <div className="lg:col-span-1 space-y-6">
        {/* Token Selector */}
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Select Token</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-700 text-gray-100"
            >
              <option>Raaskoin</option>
              <option>Raastoken</option>
              <option>BTC</option>
              <option>ETH</option>
            </select>
          </CardContent>
        </Card>

        {/* Buy/Sell */}
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Buy / Sell</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="number"
              placeholder="Buy Amount"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-700 text-gray-100"
            />
            <div className="flex space-x-2 mb-2">
              {[25, 50, 75, 100].map((p) => (
                <Button
                  key={p}
                  onClick={() => setPercent(p, "buy")}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {p}%
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">Buy</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700">Sell</Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Indicators */}
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>AI Trading Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Signal:{" "}
              <span
                className={`font-bold ${
                  aiIndicators.signal === "BUY"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {aiIndicators.signal}
              </span>
            </p>
            <p>Confidence: {aiIndicators.confidence}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Panel - Charts */}
      <div className="lg:col-span-2 space-y-6">
        {/* Candlestick Chart */}
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Market Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={candlestickData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis domain={["auto", "auto"]} stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Depth Chart */}
        <Card className="bg-gray-800 text-gray-100">
          <CardHeader>
            <CardTitle>Depth Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={depthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="price" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                <Line
                  type="stepAfter"
                  dataKey="bid"
                  stroke="#22c55e"
                  dot={false}
                />
                <Line
                  type="stepAfter"
                  dataKey="ask"
                  stroke="#ef4444"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Book + Trades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Book */}
          <Card className="bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div>
                <h4 className="font-semibold">Bids</h4>
                {orderBook.bids.map((b, i) => (
                  <p key={i} className="text-green-400">{b}</p>
                ))}
              </div>
              <div>
                <h4 className="font-semibold">Asks</h4>
                {orderBook.asks.map((a, i) => (
                  <p key={i} className="text-red-400">{a}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="bg-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.map((t, i) => (
                <p key={i}>
                  {t.amount} @ {t.price} ({t.time})
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
