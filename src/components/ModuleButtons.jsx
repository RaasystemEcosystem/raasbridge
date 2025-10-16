import React from "react";

export default function ModuleButtons({ modules }) {
  return (
    <div className="bg-white/95 dark:bg-gray-900 rounded-lg p-5 shadow-sm">
      <h4 className="text-gray-900 dark:text-gray-100 font-semibold">Modules</h4>
      <div className="mt-3 flex flex-col gap-2">
        {modules.map(mod => (
          <a
            key={mod.name}
            href={mod.url}
            className="text-xs p-2 rounded-md bg-white/5 hover:bg-white/10"
          >
            {mod.name}
          </a>
        ))}
      </div>
    </div>
  );
}
