// =============================================
// components/StatusBadge.js
// Color-coded status pill
// =============================================

import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending:     "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    "In Progress": "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    Resolved:    "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
  };

  const dots = {
    Pending:     "bg-amber-400",
    "In Progress": "bg-blue-400",
    Resolved:    "bg-emerald-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || "bg-slate-400"}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
