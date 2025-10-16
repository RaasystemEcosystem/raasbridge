import React from "react";

export default function Card({ title, value, subtitle, accent }) {
  return (
    <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold">{title}</h4>
          {subtitle && <p className="text-gray-700 dark:text-gray-300 mt-1">{subtitle}</p>}
        </div>
        <div className={`px-3 py-1 rounded-md font-bold text-sm ${accent || "text-black"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}
