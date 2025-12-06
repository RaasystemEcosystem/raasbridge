// src/components/MarketActivityChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MarketActivityChart({ filteredChartData, assetToggles }) {
  const [tradingViewLoaded, setTradingViewLoaded] = useState(false);

  const chartOptions = {
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: { 
      legend: { labels: { color: "#FFD700" } }, 
      tooltip: { enabled: true }
    },
    scales: {
      x: { ticks: { color: "#FFD700" }, grid: { color: "#333" } },
      y: { ticks: { color: "#FFD700" }, grid: { color: "#333" } }
    }
  };

  useEffect(() => {
    const convertToTradingViewSeries = () => {
      if (!filteredChartData.datasets.length) return [];
      return filteredChartData.datasets.map(ds => ({
        name: ds.asset,
        data: ds.data.map((y, i) => ({
          time: filteredChartData.labels[i],
          value: y
        }))
      }));
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview-widget",
          width: "100%",
          height: 400,
          symbol: "RAASUSD",
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#000000",
          enable_publishing: false,
          allow_symbol_change: true,
          datafeed: {
            onReady: cb => cb({ supports_marks: false, supports_timescale_marks: false, supports_time: true }),
            getBars: (symbolInfo, resolution, from, to, onHistoryCallback) => {
              const series = convertToTradingViewSeries().find(s => s.name === symbolInfo.name);
              if (!series) { onHistoryCallback([], { noData: true }); return; }
              const bars = series.data.map(d => ({
                time: new Date(d.time).getTime(),
                close: d.value,
                open: d.value,
                high: d.value,
                low: d.value
              }));
              onHistoryCallback(bars, { noData: bars.length === 0 });
            }
          }
        });
        setTradingViewLoaded(true);
      }
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [filteredChartData]);

  return (
    <div className="relative w-full">
      {!tradingViewLoaded && filteredChartData.datasets.length > 0 ? (
        <Line data={filteredChartData} options={chartOptions} />
      ) : (
        <div id="tradingview-widget" className="w-full h-[400px]" />
      )}
    </div>
  );
}
