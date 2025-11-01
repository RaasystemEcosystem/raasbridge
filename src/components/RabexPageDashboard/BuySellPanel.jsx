import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BuySellPanel({ 
  buyAmount, 
  sellAmount, 
  setBuyAmount, 
  setSellAmount, 
  balances = { Raaskoin: 120.5, Raastoken: 85000, USDT: 2340.75 } 
}) {
  // Calculate percentage amounts for Buy/Sell
  const handlePercentClick = (percent, type) => {
    const balance = balances.USDT; // Assuming buy with USDT
    const value = ((balance * percent) / 100).toFixed(2);
    if (type === "buy") setBuyAmount(value);
    else setSellAmount(value);
  };

  return (
    <Card className="bg-white border border-yellow-400 rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-yellow-500 font-bold">Buy / Sell</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Buy Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">Buy Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="flex justify-between mt-2 text-xs">
            {[25, 50, 75, 100].map((p) => (
              <Button
                key={p}
                className="flex-1 bg-gray-100 text-gray-700 rounded hover:bg-yellow-200 transition-all"
                onClick={() => handlePercentClick(p, "buy")}
              >
                {p}%
              </Button>
            ))}
          </div>
          <Button className="w-full mt-2 bg-green-500 text-white hover:bg-green-600">
            Buy
          </Button>
        </div>

        {/* Sell Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">Sell Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="flex justify-between mt-2 text-xs">
            {[25, 50, 75, 100].map((p) => (
              <Button
                key={p}
                className="flex-1 bg-gray-100 text-gray-700 rounded hover:bg-yellow-200 transition-all"
                onClick={() => handlePercentClick(p, "sell")}
              >
                {p}%
              </Button>
            ))}
          </div>
          <Button className="w-full mt-2 bg-red-500 text-white hover:bg-red-600">
            Sell
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
