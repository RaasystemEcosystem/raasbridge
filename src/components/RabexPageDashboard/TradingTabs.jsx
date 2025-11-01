import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TradingTabs({ selectedToken, setSelectedToken }) {
  const [activeTab, setActiveTab] = useState("Market");
  const tradingTypes = ["Market", "Limit", "Stop-Limit"];

  // Dummy wallet balances
  const walletBalances = {
    Raaskoin: 120.5,
    Raastoken: 85000,
    USDT: 2340.75,
  };

  return (
    <Card className="bg-white border border-yellow-400 rounded-xl shadow-md">
      <CardHeader>
        <CardTitle className="text-yellow-500 font-bold">
          Select Token & Trading Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selector */}
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full p-2 border border-yellow-400 rounded text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {Object.keys(walletBalances).map((token) => (
            <option key={token}>{token}</option>
          ))}
        </select>

        {/* Trading Tabs */}
        <div className="flex gap-2">
          {tradingTypes.map((type) => (
            <Button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-1 rounded ${
                activeTab === type
                  ? "bg-yellow-400 text-black font-bold"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-200"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Wallet Balances */}
        <div className="mt-4 border-t pt-2">
          <h3 className="text-sm font-bold text-gray-700">Wallet Balances</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(walletBalances).map(([token, balance]) => (
              <li key={token}>
                <span className="font-medium">{token}:</span>{" "}
                <span className="text-green-600">{balance.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
