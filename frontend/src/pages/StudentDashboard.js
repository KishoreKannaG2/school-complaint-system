// =============================================
// pages/StudentDashboard.js
// =============================================

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintCard from "../components/ComplaintCard";
import StatsCard from "../components/StatsCard";
import api from "../utils/api";

const TABS = [
  { id: "overview",  icon: "🏠", label: "Overview" },
  { id: "submit",    icon: "✍️",  label: "Submit Complaint" },
  { id: "my",        icon: "📋", label: "My Complaints" },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch this student's complaints
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Compute quick stats from complaints array
  const stats = {
    total:      complaints.length,
    pending:    complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved:   complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top navbar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-display font-bold text-slate-800 text-lg">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-600 font-medium">{user?.name}</span>
          </div>
        </header>

        <div className="p-8">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-slate-800 text-2xl mb-1">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-slate-500">Here's a summary of your complaints.</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total Submitted" value={stats.total}      icon="📊" color="indigo" />
                <StatsCard label="Pending"          value={stats.pending}    icon="⏳" color="amber" />
                <StatsCard label="In Progress"      value={stats.inProgress} icon="🔧" color="blue" />
                <StatsCard label="Resolved"         value={stats.resolved}   icon="✅" color="emerald" />
              </div>

              {/* Recent complaints */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-slate-700">Recent Complaints</h3>
                  <button
                    onClick={() => setActiveTab("my")}
                    className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    View all →
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : complaints.length === 0 ? (
                  <EmptyState onSubmit={() => setActiveTab("submit")} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {complaints.slice(0, 3).map((c) => (
                      <ComplaintCard key={c._id} complaint={c} isAdmin={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SUBMIT TAB ── */}
          {activeTab === "submit" && (
            <div className="max-w-2xl">
              <ComplaintForm onSuccess={() => { fetchComplaints(); setActiveTab("my"); }} />
            </div>
          )}

          {/* ── MY COMPLAINTS TAB ── */}
          {activeTab === "my" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} found</p>
                <button
                  onClick={fetchComplaints}
                  className="text-sm text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                >
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : complaints.length === 0 ? (
                <EmptyState onSubmit={() => setActiveTab("submit")} />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {complaints.map((c) => (
                    <ComplaintCard key={c._id} complaint={c} isAdmin={false} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Shown when there are no complaints yet
const EmptyState = ({ onSubmit }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
    <div className="text-5xl mb-3">📭</div>
    <h3 className="font-display font-semibold text-slate-700 mb-1">No complaints yet</h3>
    <p className="text-slate-500 text-sm mb-4">Submit your first complaint to get started.</p>
    <button
      onClick={onSubmit}
      className="px-5 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition"
    >
      Submit Complaint
    </button>
  </div>
);

export default StudentDashboard;
