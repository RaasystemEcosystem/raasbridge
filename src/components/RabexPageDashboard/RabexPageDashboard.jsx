import React, { useState, useEffect } from "react";
import TradingTabs from "./TradingTabs";
import BuySellPanel from "./BuySellPanel";
import WalletBalances from "./WalletBalances";
import AIIndicators from "./AIIndicators";
import MarketChart from "./MarketChart";
import DepthChart from "./DepthChart";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import MyOrders from "./MyOrders";
import WalletActions from "../WalletActions";  // relative path

// Corrected UI component imports
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Helpers for dummy simulation ---
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

export default function RabexPageDashboard() {
  const [selectedToken, setSelectedToken] = useState("Raaskoin");
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [candlestickData, setCandlestickData] = useState(generateRandomCandles());
  const [depthData, setDepthData] = useState([]);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);
  const [aiIndicators, setAiIndicators] = useState({ signal: "NEUTRAL", confidence: 0 });

  // --- Simulation ---
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

  return (
    <div className="w-full min-h-screen bg-gray-50 text-black p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* LEFT PANEL */}
      <div className="lg:col-span-3 space-y-4">
        <TradingTabs selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <BuySellPanel
          buyAmount={buyAmount}
          sellAmount={sellAmount}
          setBuyAmount={setBuyAmount}
          setSellAmount={setSellAmount}
        />
        <WalletBalances />
        <AIIndicators aiIndicators={aiIndicators} />
      </div>

      {/* MIDDLE PANEL */}
      <div className="lg:col-span-6 space-y-4">
        <MarketChart
          candlestickData={candlestickData}
          selectedInterval={selectedInterval}
          setSelectedInterval={setSelectedInterval}
        />
        <DepthChart depthData={depthData} />
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:col-span-3 space-y-4">
        <OrderBook orderBook={orderBook} />
        <RecentTrades trades={trades} />
        <MyOrders />
      </div>
    </div>
  );
}
