import React, { useState } from "react";

export default function RunbookTimeline() {
  const initialPhases = [
    {
      id: "preflight",
      title: "Phase 1 — Pre-Flight Checks",
      description: "DNS, HTTPS, SSO, and API smoke tests. Sign-off required before integration testing.",
      items: [
        { id: "dns", text: "Confirm subdomains resolve & SSL Labs grade A", done: false },
        { id: "sso", text: "SSO login/logout across subdomains", done: false },
        { id: "api", text: "Run API smoke tests (<300ms, no 5xx)", done: false }
      ]
    },
    {
      id: "integration",
      title: "Phase 2 — Controlled Integration",
      description: "End-to-end flows, error handling, and ledger verification with test accounts.",
      items: [
        { id: "e2e", text: "Full E2E: wallet + trade + payment + AI", done: false },
        { id: "errors", text: "Trigger and verify clean error UX", done: false }
      ]
    },
    {
      id: "stress",
      title: "Phase 3 — Stress & Load",
      description: "Synthetic traffic, spike tests, and autoscaling validation.",
      items: [
        { id: "synthetic", text: "Simulate 500-1,000 concurrent logins", done: false },
        { id: "trades", text: "10k+ trade requests/hour spike test", done: false }
      ]
    },
    {
      id: "security",
      title: "Phase 4 — Security Hardening",
      description: "IAM review, WAF, rate-limiting, and secrets management.",
      items: [
        { id: "iam", text: "IAM least-privilege audit", done: false },
        { id: "waf", text: "WAF + rate-limiting enabled", done: false }
      ]
    },
    {
      id: "beta",
      title: "Phase 5 — Soft Launch / Beta",
      description: "Invite-only onboarding, support channels, feedback collection.",
      items: [
        { id: "invite", text: "Invite 20-50 testers", done: false },
        { id: "support", text: "Support channels live (chat/ticket)", done: false }
      ]
    },
    {
      id: "public",
      title: "Phase 6 — Public Launch",
      description: "Open signup, marketing push, and war-room monitoring.",
      items: [
        { id: "open", text: "Open public signup on raasystem.net", done: false },
        { id: "monitor", text: "War-room dashboards live (48h)", done: false }
      ]
    }
  ];

  const [phases, setPhases] = useState(initialPhases);
  const [collapsed, setCollapsed] = useState({});

  const toggleItem = (phaseId, itemId) => {
    setPhases(prev =>
      prev.map(phase =>
        phase.id === phaseId
          ? { ...phase, items: phase.items.map(it => (it.id === itemId ? { ...it, done: !it.done } : it)) }
          : phase
      )
    );
  };

  const markPhaseComplete = phaseId => {
    setPhases(prev =>
      prev.map(phase =>
        phase.id === phaseId ? { ...phase, items: phase.items.map(it => ({ ...it, done: true })) } : phase
      )
    );
  };

  const resetAll = () => setPhases(initialPhases);

  const toggleCollapse = phaseId => {
    setCollapsed(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const calculateProgress = items => {
    if (!items.length) return 0;
    const doneCount = items.filter(i => i.done).length;
    return Math.round((doneCount / items.length) * 100);
  };

  const calculateOverallProgress = () => {
    const allItems = phases.flatMap(p => p.items);
    if (!allItems.length) return 0;
    const doneCount = allItems.filter(i => i.done).length;
    return Math.round((doneCount / allItems.length) * 100);
  };

  const overallProgress = calculateOverallProgress();

  const getPhaseColor = progress => {
    if (progress === 0) return "border-blue-600";
    if (progress === 100) return "border-green-600";
    return "border-yellow-500";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Raasystem Launch Runbook</h1>
        <p className="mt-2 text-sm text-gray-700">
          Phased checklist for a safe, staged go-live. Track each item as your team completes it.
        </p>

        {/* Overall progress bar */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Completion</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-600 h-3 rounded transition-all"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Phase summary table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phase</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Completion</th>
              </tr>
            </thead>
            <tbody>
              {phases.map(phase => {
                const progress = calculateProgress(phase.items);
                const bgColor =
                  progress === 100 ? "bg-green-100" : progress === 0 ? "bg-blue-100" : "bg-yellow-100";
                return (
                  <tr key={phase.id} className={bgColor}>
                    <td className="px-4 py-2">{phase.title}</td>
                    <td className="px-4 py-2">{progress}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </header>

      <div className="grid gap-6">
        {phases.map((phase, idx) => {
          const progress = calculateProgress(phase.items);
          const phaseBorderColor = getPhaseColor(progress);

          return (
            <section
              key={phase.id}
              className={`bg-white rounded-xl shadow p-5 border-l-4 transition-all ${phaseBorderColor}`}
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleCollapse(phase.id)}
              >
                <div className="flex flex-col w-full">
                  <h2 className="text-xl font-semibold text-blue-800">
                    {idx + 1}. {phase.title} ({progress}%)
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{phase.description}</p>

                  {/* Phase progress bar */}
                  <div className="mt-2 w-full bg-gray-200 h-2 rounded">
                    <div
                      className="h-2 rounded transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress === 100 ? "#16a34a" : progress === 0 ? "#2563eb" : "#facc15"
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      markPhaseComplete(phase.id);
                    }}
                    className="px-3 py-1 rounded-lg border text-sm bg-blue-100 hover:bg-blue-200"
                  >
                    Mark phase complete
                  </button>
                  <span className="text-gray-500 text-sm">{collapsed[phase.id] ? "▼" : "▲"}</span>
                </div>
              </div>

              {!collapsed[phase.id] && (
                <ul className="mt-4 space-y-2">
                  {phase.items.map(item => (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between border rounded p-3 ${
                        item.done ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          id={`${phase.id}-${item.id}`}
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleItem(phase.id, item.id)}
                          className="w-4 h-4"
                        />
                        <label
                          htmlFor={`${phase.id}-${item.id}`}
                          className={`select-none ${item.done ? "line-through text-gray-500" : "text-gray-800"}`}
                        >
                          {item.text}
                        </label>
                      </div>
                      <div className="text-xs font-medium text-gray-500">{item.done ? "Done" : "Pending"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <footer className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Runbook version: 1.5 • Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="flex gap-3">
          <button onClick={resetAll} className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200">
            Reset all
          </button>
        </div>
      </footer>
    </div>
  );
}
