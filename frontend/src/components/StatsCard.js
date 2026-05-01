// =============================================
// components/StatsCard.js
// Shows a stat number with label and icon
// =============================================

import React from "react";

const StatsCard = ({ label, value, icon, color }) => {
  const colorMap = {
    indigo:  "bg-indigo-50 text-indigo-600",
    amber:   "bg-amber-50 text-amber-600",
    blue:    "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorMap[color] || "bg-slate-50 text-slate-600"}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-slate-800">{value ?? "—"}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
