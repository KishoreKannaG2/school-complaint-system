// =============================================
// components/CategoryBadge.js
// =============================================

import React from "react";

const categoryConfig = {
  Water:       { icon: "💧", color: "bg-cyan-400/10 text-cyan-400" },
  Electricity: { icon: "⚡", color: "bg-yellow-400/10 text-yellow-400" },
  WiFi:        { icon: "📶", color: "bg-indigo-400/10 text-indigo-400" },
  Cleanliness: { icon: "🧹", color: "bg-green-400/10 text-green-400" },
  Other:       { icon: "📌", color: "bg-slate-400/10 text-slate-400" },
};

const CategoryBadge = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig.Other;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.icon} {category}
    </span>
  );
};

export default CategoryBadge;
