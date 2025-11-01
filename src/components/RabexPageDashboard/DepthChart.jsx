import React, { useMemo } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DepthChart({ depthData }) {
  // Separate and sort bids/asks
  const bids = useMemo(
    () => depthData.filter(d => d.bid).sort((a, b) => b.price - a.price),
    [depthData]
  );
  const asks = useMemo(
    () => depthData.filter(d => d.ask).sort((a, b) => a.price - b.price),
    [depthData]
  );

  const chartData = useMemo(() => [...bids, ...asks], [bids, asks]);

  // Custom tooltip
  const DepthTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded p-2 shadow-md text-sm">
        {data.bid && (
          <div className="text-green-600">
            <strong>Bid:</strong> {data.price} <span className="text-gray-500">({data.bid} units)</span>
          </div>
        )}
        {data.ask && (
          <div className="text-red-600">
            <strong>Ask:</strong> {data.price} <span className="text-gray-500">({data.ask} units)</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="price" tick={{ fill: "#374151", fontSize: 12 }} />
        <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
        <Tooltip content={<DepthTooltip />} />
        <Area
          type="stepAfter"
          dataKey="bid"
          stroke="#22c55e"
          fill="rgba(34,197,94,0.2)"
          className="depth-chart-area-bid"
        />
        <Area
          type="stepAfter"
          dataKey="ask"
          stroke="#ef4444"
          fill="rgba(239,68,68,0.2)"
          className="depth-chart-area-ask"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
