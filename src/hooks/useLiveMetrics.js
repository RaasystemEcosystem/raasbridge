import { useState, useEffect } from "react";

const initialMetrics = [
  { title: "Total Balance", value: "125,340 $RKN" },
  { title: "Open Positions", value: "5" },
  { title: "PnL Today", value: "+2,430 $RKN" },
  { title: "Trading Volume", value: "37,500 $RKN" }
];

export default function useLiveMetrics() {
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(m => {
          if (m.title.includes("PnL")) {
            const change = (Math.random() * 100 - 50).toFixed(0);
            return { ...m, value: `+${change} $RKN` };
          }
          return m;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
