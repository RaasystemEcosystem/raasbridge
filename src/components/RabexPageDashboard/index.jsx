import React, { useState, useEffect } from "react";
import TradingTabs from "./TradingTabs";
import WalletBalances from "./WalletBalances";
import BuySellPanel from "./BuySellPanel";
import AIIndicators from "./AIIndicators";
import MarketChart from "./MarketChart";
import DepthChart from "./DepthChart";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import MyOrders from "./MyOrders";
import './styles.css';

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

export default function RabexPageDashboard() {
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

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-screen bg-white text-gray-900">
      {/* Left Panel */}
      <div className="lg:col-span-3 space-y-4">
        <TradingTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <BuySellPanel
          buyAmount={buyAmount}
          sellAmount={sellAmount}
          setBuyAmount={setBuyAmount}
          setSellAmount={setSellAmount}
        />
        <WalletBalances />
        <AIIndicators aiIndicators={aiIndicators} />
      </div>

      {/* Middle Panel */}
      <div className="lg:col-span-6 space-y-4">
        <MarketChart candlestickData={candlestickData} selectedInterval={selectedInterval} setSelectedInterval={setSelectedInterval} />
        <DepthChart depthData={depthData} />
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-3 space-y-4">
        <OrderBook orderBook={orderBook} />
        <RecentTrades trades={trades} />
        <MyOrders />
      </div>
    </div>
  );
}
