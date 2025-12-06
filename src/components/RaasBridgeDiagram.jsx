// src/components/RaasBridgeDiagram.jsx
import React from "react";

const modules = [
  { name: "RaasWallet", color: "from-green-400 to-green-200" },
  { name: "RABEX", color: "from-blue-400 to-blue-200" },
  { name: "Raaspay", color: "from-purple-400 to-purple-200" },
  { name: "RaasGenAI", color: "from-pink-400 to-pink-200" }
];

export default function RaasBridgeDiagram() {
  const raasValue = 0.001;
  const rbtValue = 0.0001;

  return (
    <div className="relative w-full h-64 bg-black/80 border border-yellow-400 rounded-xl p-6 flex items-center justify-between">

      {/* RAAS Token */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
          RAAS
        </div>
        <div className="mt-2 text-white text-sm">{raasValue} g Gold</div>
      </div>

      {/* Modules Block */}
      <div className="flex flex-1 justify-evenly items-center mx-6">

        {/* Arrow from RAAS → first module */}
        <span className="mx-3 text-yellow-300 text-2xl font-bold">⇄</span>

        {modules.map((mod, index) => (
          <React.Fragment key={mod.name}>
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-tr ${mod.color} flex items-center justify-center text-black font-semibold text-sm text-center`}
            >
              {mod.name}
            </div>

            {/* Arrows between modules */}
            {index < modules.length - 1 && (
              <span className="mx-3 text-yellow-300 text-2xl font-bold">⇄</span>
            )}
          </React.Fragment>
        ))}

        {/* Arrow from last module → RBT */}
        <span className="mx-3 text-yellow-300 text-2xl font-bold">⇄</span>

      </div>

      {/* RBT Token */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-100 flex items-center justify-center text-black font-bold text-lg">
          RBT
        </div>
        <div className="mt-2 text-white text-sm">{rbtValue} g Gold</div>
      </div>

    </div>
  );
}
