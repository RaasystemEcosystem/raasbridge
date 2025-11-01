import React from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

export default function MarketChart({ candlestickData, selectedInterval, setSelectedInterval }) {
  const intervals = ["1m", "5m", "15m", "1h", "1d"];

  // Custom Tooltip
  const CandleTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded p-2 shadow-md text-sm">
          <div>Time: {data.time}</div>
          <div>Open: {data.open}</div>
          <div>Close: {data.close}</div>
          <div>High: {data.high}</div>
          <div>Low: {data.low}</div>
          <div>Volume: {data.volume}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md">
      {/* Header with interval buttons */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-gray-700 font-bold">Market Chart</h3>
        <div className="flex space-x-2">
          {intervals.map((i) => (
            <Button
              key={i}
              onClick={() => setSelectedInterval(i)}
              className={`px-3 py-1 text-sm rounded ${
                selectedInterval === i
                  ? "bg-yellow-400 text-black font-bold"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-200"
              }`}
            >
              {i}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-3">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={candlestickData}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fill: "#374151", fontSize: 12 }} />
            <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
            <Tooltip content={<CandleTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#FFD700"
              fill="url(#goldGradient)"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
