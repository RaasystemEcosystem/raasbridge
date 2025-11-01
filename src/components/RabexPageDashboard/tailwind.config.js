/* ===== Depth Chart Styles ===== */
.depth-chart-area-bid {
  fill: rgba(34, 197, 94, 0.2); /* green */
  stroke: #22c55e;
  transition: all 0.3s ease-in-out;
}

.depth-chart-area-bid:hover {
  fill: rgba(34, 197, 94, 0.3);
  stroke-width: 2;
}

.depth-chart-area-ask {
  fill: rgba(239, 68, 68, 0.2); /* red */
  stroke: #ef4444;
  transition: all 0.3s ease-in-out;
}

.depth-chart-area-ask:hover {
  fill: rgba(239, 68, 68, 0.3);
  stroke-width: 2;
}

/* Chart axis + tooltip tweaks */
.recharts-cartesian-axis-tick text {
  fill: #374151; /* Tailwind gray-700 */
  font-size: 12px;
}

.recharts-tooltip-wrapper {
  background-color: white !important;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
