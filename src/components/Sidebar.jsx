import React from "react";

export default function Sidebar({ collapsed, setCollapsed, navItems, active, setActive }) {
  return (
    <aside
      className={`flex flex-col bg-[#0b0b0c] border-r border-gray-800 transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="w-8 h-8 rounded-md bg-yellow-400" />
        {!collapsed && <div className="text-xl font-bold text-yellow-400">RaasBridge</div>}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-white/5 transition-colors ${
              active === item.key ? "bg-white/5" : ""
            }`}
          >
            <div className="w-6 h-6 rounded-sm bg-gradient-to-tr from-yellow-400 to-yellow-300" />
            {!collapsed && <span className="flex-1">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-2 justify-center py-2 rounded-md bg-white/5 hover:bg-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-yellow-300"
          >
            <path
              d="M12 4v16m8-8H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {!collapsed && <span className="text-sm">{collapsed ? "Expand" : "Collapse"}</span>}
        </button>
      </div>
    </aside>
  );
}

