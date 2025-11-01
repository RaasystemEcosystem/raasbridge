import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecentTrades({ trades }) {
  // Memoize to prevent unnecessary re-renders
  const recentTrades = useMemo(() => trades.slice(0, 10), [trades]);

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-700">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <ul>
          {recentTrades.map((trade, index) => (
            <li
              key={index}
              className={`flex justify-between px-2 py-1 rounded hover:bg-gray-100 transition-colors`}
            >
              <span className={trade.price > 1000 ? "text-green-600" : "text-red-600"}>
                {trade.amount} @ {trade.price}
              </span>
              <span className="text-gray-500">{trade.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
