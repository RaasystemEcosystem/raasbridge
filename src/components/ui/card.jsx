// src/ui/card.jsx
import React from "react";

export function Card({ children, ...props }) {
  return <div {...props} className="p-4 bg-white rounded shadow">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="border-b p-2 font-bold">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
