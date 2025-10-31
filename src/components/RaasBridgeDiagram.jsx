// src/components/RaasBridgeDiagram.jsx
import React from "react";
import { motion } from "framer-motion";

export default function RaasBridgeDiagram({ raasValue = 0.001, rbtValue = 0.0001 }) {
  return (
    <div className="relative w-full h-64 bg-black/80 border border-yellow-400 rounded-xl p-6 flex items-center justify-center overflow-hidden">
      {/* RAAS Token */}
      <div className="absolute left-16 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
          RAAS
        </div>
        <div className="mt-2 text-white text-sm">{raasValue.toFixed(6)} g</div>
      </div>

      {/* RBT Token */}
      <div className="absolute right-16 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300 to-yellow-100 flex items-center justify-center text-black font-bold text-lg">
          RBT
        </div>
        <div className="mt-2 text-white text-sm">{rbtValue.toFixed(6)} g</div>
      </div>

      {/* Animated Flow Arrows */}
      <motion.div
        className="absolute w-1/2 h-1 flex items-center justify-between top-1/2 left-1/4"
        initial={{ x: -50 }}
        animate={{ x: 50 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
      >
        <svg className="w-full h-2 text-yellow-400" viewBox="0 0 100 10">
          <line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" strokeWidth="2" />
          <polygon points="95,0 100,5 95,10" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute w-1/2 h-1 flex items-center justify-between top-1/2 right-1/4 rotate-180"
        initial={{ x: 50 }}
        animate={{ x: -50 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
      >
        <svg className="w-full h-2 text-yellow-300" viewBox="0 0 100 10">
          <line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" strokeWidth="2" />
          <polygon points="95,0 100,5 95,10" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 text-white font-semibold">
        Token Swap & Conversion Flow
      </div>
    </div>
  );
}
