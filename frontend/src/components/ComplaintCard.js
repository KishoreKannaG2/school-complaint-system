// =============================================
// components/ComplaintCard.js
// Shows a single complaint in a card
// =============================================

import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";

const ComplaintCard = ({ complaint, isAdmin, onStatusChange, onDelete }) => {
  const [showImage, setShowImage] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Format date nicely: "Jan 15, 2024"
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(complaint._id, newStatus);
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-slate-800 text-base leading-tight flex-1">
            {complaint.title}
          </h3>
          <StatusBadge status={complaint.status} />
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
          {complaint.description}
        </p>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={complaint.category} />
          <span className="text-slate-400 text-xs flex items-center gap-1">
            📍 {complaint.location}
          </span>
        </div>
      </div>

      {/* Image thumbnail */}
      {complaint.image && (
        <div className="px-5 pb-3">
          <button
            onClick={() => setShowImage(!showImage)}
            className="text-xs text-indigo-500 hover:text-indigo-600 font-medium transition"
          >
            {showImage ? "▲ Hide image" : "🖼 View attached image"}
          </button>
          {showImage && (
            <img
              src={`https://school-complaint-system.onrender.com/${complaint.image}`}
              alt="Complaint"
              className="mt-2 rounded-xl w-full max-h-48 object-cover border border-slate-100"
            />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400">
          {isAdmin && (
            <span className="text-slate-600 font-medium mr-1">{complaint.userName}</span>
          )}
          {formattedDate}
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <select
              value={complaint.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              onClick={() => onDelete(complaint._id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Delete complaint"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
