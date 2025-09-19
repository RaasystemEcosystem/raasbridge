import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Send, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import WalletModalContent from "./components/modals/WalletModalContent";

const tokens = [
  {
    name: "Raaskoin",
    symbol: "RAAS",
    balance: 1224,
    goldEquivalent: 1224 * 0.075,
  },
  {
    name: "Raastoken",
    symbol: "RAAK",
    balance: 512,
    goldEquivalent: 512 * 0.075,
  },
  {
    name: "Tether USD (XDC)",
    symbol: "USDT-XDC",
    balance: 1000,
    goldEquivalent: 1000 * 0.075,
  },
];

export default function Dashboard() {
  const [modalType, setModalType] = useState<"send" | "receive" | "swap" | null>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const openModal = (type: "send" | "receive" | "swap") => setModalType(type);
  const closeModal = () => setModalType(null);

  useEffect(() => {
    axios.get("/api/run-ai-engine")
      .then((res) => setAiData(res.data.data))
      .catch(() => setAiError("Failed to load AI engine data"));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {tokens.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {token.name} ({token.symbol})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-mono">{token.balance} {token.symbol}</p>
                <p className="text-sm text-gray-500">
                  ≈ ${(token.goldEquivalent).toFixed(2)} USD (0.001g gold unit)
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Wallet Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around">
              <Button onClick={() => openModal("send")} className="flex gap-2 px-6 py-4 text-lg">
                <Send size={20} /> Send
              </Button>
              <Button onClick={() => openModal("receive")} className="flex gap-2 px-6 py-4 text-lg">
                <Wallet size={20} /> Receive
              </Button>
              <Button onClick={() => openModal("swap")} className="flex gap-2 px-6 py-4 text-lg">
                <Coins size={20} /> Swap
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {aiData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 md:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>📈 AI Engine Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Predicted Price:</strong> ${aiData.predicted_price}</p>
                <p><strong>Spread:</strong> {aiData.spread}</p>
                <p><strong>Volatility:</strong> {aiData.volatility}</p>
                <div className="mt-2">
                  <p><strong>Order Book:</strong></p>
                  <p>Bid → {aiData.order_book.bid.type} @ ${aiData.order_book.bid.price} × {aiData.order_book.bid.quantity}</p>
                  <p>Ask → {aiData.order_book.ask.type} @ ${aiData.order_book.ask.price} × {aiData.order_book.ask.quantity}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {aiError && (
          <motion.div className="col-span-1 md:col-span-3 text-red-500 text-center mt-4">
            {aiError}
          </motion.div>
        )}
      </div>

      <WalletModalContent modalType={modalType} closeModal={closeModal} />
    </>
  );
}
