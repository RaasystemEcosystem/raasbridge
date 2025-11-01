import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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
    data.push({ time: `T${i}`, open, close, high, low, volume: Math.floor(Math.random() * 1000) });
    price = close;
  }
  return data;
};

export default function RabexPage() {
  const [selectedToken, setSelectedToken] = useState("Raaskoin");
  const [selectedTab, setSelectedTab] = useState("Market");
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);
  const [candlestickData, setCandlestickData] = useState(generateRandomCandles());
  const [aiIndicators, setAiIndicators] = useState({ signal: "NEUTRAL", confidence: 0 });
  const [depthData, setDepthData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
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
      const bids = newOrderBook.bids.map((p, i) => ({ price: parseFloat(p), bid: (i + 1) * 10 }));
      const asks = newOrderBook.asks.map((p, i) => ({ price: parseFloat(p), ask: (i + 1) * 10 }));
      setDepthData([...bids, ...asks]);

      setAiIndicators({
        signal: Math.random() > 0.5 ? "BUY" : "SELL",
        confidence: (Math.random() * 100).toFixed(1),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const setPercent = (percent, type) => {
    if (type === "buy") setBuyAmount(((percent / 100) * 1000).toFixed(2));
    else setSellAmount(((percent / 100) * 1000).toFixed(2));
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 font-sans min-h-screen bg-gray-900 text-white">
      {/* Left Panel */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Select Token</CardTitle></CardHeader>
          <CardContent>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-400"
            >
              <option>Raaskoin</option>
              <option>Raastoken</option>
              <option>BTC</option>
              <option>ETH</option>
            </select>
          </CardContent>
        </Card>

        {/* Trading Tabs */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Trading Type</CardTitle></CardHeader>
          <CardContent className="flex space-x-2">
            {["Market", "Limit", "Stop-Limit"].map((t) => (
              <Button
                key={t}
                onClick={() => setSelectedTab(t)}
                className={`flex-1 rounded ${selectedTab === t ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"} hover:shadow-lg transition-all`}
              >
                {t}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Buy/Sell Panel */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Buy / Sell</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <input
              type="number"
              placeholder="Buy Amount"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex space-x-1">
              {[25, 50, 75, 100].map((p) => (
                <Button key={p} onClick={() => setPercent(p, "buy")} className="flex-1 bg-yellow-500 text-black rounded hover:shadow-md">{p}%</Button>
              ))}
            </div>
            <div className="flex space-x-1">
              <Button className="flex-1 bg-green-500 text-black rounded hover:shadow-lg transition-all">Buy</Button>
              <Button className="flex-1 bg-red-500 text-white rounded hover:shadow-lg transition-all">Sell</Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Balances */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Wallet Balances</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <p>Raaskoin: 500.00</p>
            <p>Raastoken: 200.00</p>
          </CardContent>
        </Card>

        {/* AI Indicators */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">AI Trading Indicators</CardTitle></CardHeader>
          <CardContent>
            <p>Signal: <span className={aiIndicators.signal === "BUY" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{aiIndicators.signal}</span></p>
            <p>Confidence: {aiIndicators.confidence}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Panel */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex space-x-1 mb-2">
          {["1m","5m","15m","1h","1d"].map((intv) => (
            <Button
              key={intv}
              onClick={() => setSelectedInterval(intv)}
              className={`flex-1 rounded ${selectedInterval===intv?"bg-yellow-400 text-black":"bg-gray-700 text-white"} hover:shadow-md transition-all`}
            >
              {intv}
            </Button>
          ))}
        </div>

        {/* Candlestick Chart */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Market Chart</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={candlestickData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#FFD700" tick={{ fill: "#fff" }} />
                <YAxis domain={["auto","auto"]} stroke="#FFD700" tick={{ fill: "#fff" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700" }} labelStyle={{ color:"#FFD700" }} itemStyle={{ color:"#fff" }}/>
                <Area type="monotone" dataKey="close" stroke="#FFD700" fillOpacity={1} fill="url(#goldGradient)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Depth Chart */}
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Depth Chart</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={depthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="price" stroke="#FFD700" tick={{ fill: "#fff" }} />
                <YAxis stroke="#FFD700" tick={{ fill: "#fff" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700" }} labelStyle={{ color:"#FFD700" }} itemStyle={{ color:"#fff" }}/>
                <Area type="stepAfter" dataKey="bid" stroke="#22c55e" fill="rgba(34,197,94,0.2)" />
                <Area type="stepAfter" dataKey="ask" stroke="#ef4444" fill="rgba(239,68,68,0.2)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Order Book</CardTitle></CardHeader>
          <CardContent className="flex justify-between">
            <div className="space-y-1">
              <h4 className="text-yellow-400 font-semibold">Bids</h4>
              {orderBook.bids.map((b,i)=><p key={i} className="text-green-400 hover:bg-gray-700 px-1 rounded">{b}</p>)}
            </div>
            <div className="space-y-1">
              <h4 className="text-yellow-400 font-semibold">Asks</h4>
              {orderBook.asks.map((a,i)=><p key={i} className="text-red-400 hover:bg-gray-700 px-1 rounded">{a}</p>)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">Recent Trades</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {trades.map((t,i)=><p key={i} className="hover:bg-gray-700 px-1 rounded">{t.amount} @ {t.price} ({t.time})</p>)}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border border-yellow-400 rounded-xl shadow-md">
          <CardHeader><CardTitle className="text-yellow-400 font-bold">My Orders</CardTitle></CardHeader>
          <CardContent><p>No active orders</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
