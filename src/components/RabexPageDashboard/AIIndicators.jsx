import React from "react";

export default function AIIndicators({ aiIndicators }) {
  const { signal, confidence } = aiIndicators;

  let signalClass = "text-gray-500 font-semibold"; // default NEUTRAL
  if (signal === "BUY") signalClass = "text-green-500 font-bold";
  if (signal === "SELL") signalClass = "text-red-500 font-bold";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h2 className="text-gray-700 font-bold text-lg">AI Indicators</h2>
      </div>
      <div className="p-3 flex flex-col space-y-2">
        <p className="text-sm text-gray-600">Signal:</p>
        <p className={`text-xl ${signalClass}`}>{signal}</p>
        <p className="text-sm text-gray-600">Confidence: <span className="font-bold">{confidence}%</span></p>
      </div>
    </div>
  );
}
