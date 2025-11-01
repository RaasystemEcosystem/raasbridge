import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WalletBalances() {
  return (
    <Card className="bg-white border border-yellow-400 rounded-xl">
      <CardHeader>
        <CardTitle className="text-yellow-500 font-bold">Wallet Balances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p>Raaskoin: 500.00</p>
        <p>Raastoken: 200.00</p>
      </CardContent>
    </Card>
  );
}
