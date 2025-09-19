// src/pages/RaaspayDashboard.jsx
import React, { useEffect, useState } from 'react';
import { healthCheck, listPayments, createPayment } from '@/api/raaspay';

export default function RaaspayDashboard() {
  const [status, setStatus] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Load on mount
    healthCheck().then(res => setStatus(res.data.status));
    listPayments().then(res => setPayments(res.data));
  }, []);

  const handleSend = async () => {
    const newPayment = {
      from: "0xYourWalletAddress",
      to: "0xRecipientAddress",
      amount: 10,
      currency: "RAASKOIN"
    };
    const res = await createPayment(newPayment);
    console.log('Created payment:', res.data);
    setPayments(prev => [res.data, ...prev]);
  };

  return (
    <div className="p-4">
      <h1 className="text-yellow-400 text-xl">RaasPay Dashboard</h1>
      <p>Backend status: {status}</p>
      <button onClick={handleSend} className="mt-2 bg-yellow-500 px-4 py-2 rounded">
        Send Test Payment
      </button>

      <h2 className="mt-4 text-lg">Payments:</h2>
      <ul className="space-y-1">
        {payments.map((p, i) => (
          <li key={i}>{p.from} → {p.to} : {p.amount} {p.currency || 'RAASKOIN'}</li>
        ))}
      </ul>
    </div>
  );
}
