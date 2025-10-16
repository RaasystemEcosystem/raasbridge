import React from "react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gradient-to-b from-transparent to-black">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-yellow-400">RaasBridge</div>
        <div className="text-sm text-gray-400">Unified Dashboard</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-white/5 rounded-md px-3 py-2 gap-2">
          <input
            className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            placeholder="Search assets, txns, users..."
          />
          <button className="text-sm px-2 py-1 rounded-md bg-yellow-400 text-black font-semibold">Search</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            RaasGenAI: <span className="text-green-400 font-semibold">Active</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">U</div>
        </div>
      </div>
    </header>
  );
}
