import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyOrders() {
  return (
    <Card className="bg-white border border-yellow-400 rounded-xl">
      <CardHeader>
        <CardTitle className="text-yellow-500 font-bold">My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p>No active orders</p>
      </CardContent>
    </Card>
  );
}
