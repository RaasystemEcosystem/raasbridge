import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OrderBook({ orderBook }) {
  // Memoize bids and asks for performance
  const bids = useMemo(() => orderBook.bids?.slice().sort((a, b) => b.price - a.price) || [], [orderBook.bids]);
  const asks = useMemo(() => orderBook.asks?.slice().sort((a, b) => a.price - b.price) || [], [orderBook.asks]);

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-700">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 text-sm gap-2">
        {/* Bids */}
        <div className="order-book bids">
          <h4 className="font-bold text-green-600">Bids</h4>
          <ul>
            {bids.map((b, i) => (
              <li key={i} className="px-1 py-0.5 hover:bg-gray-100 rounded transition-colors">
                {b.price} <span className="text-gray-500">({b.bid} units)</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Asks */}
        <div className="order-book asks">
          <h4 className="font-bold text-red-600">Asks</h4>
          <ul>
            {asks.map((a, i) => (
              <li key={i} className="px-1 py-0.5 hover:bg-gray-100 rounded transition-colors">
                {a.price} <span className="text-gray-500">({a.ask} units)</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
