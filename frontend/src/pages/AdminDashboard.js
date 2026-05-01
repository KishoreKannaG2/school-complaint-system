// =============================================
// pages/AdminDashboard.js
// =============================================

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ComplaintCard from "../components/ComplaintCard";
import StatsCard from "../components/StatsCard";
import api from "../utils/api";

const TABS = [
  { id: "overview",   icon: "📊", label: "Overview" },
  { id: "complaints", icon: "📋", label: "All Complaints" },
];

const CATEGORIES = ["", "Water", "Electricity", "WiFi", "Cleanliness", "Other"];
const STATUSES   = ["", "Pending", "In Progress", "Resolved"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus]     = useState("");
  const [toast, setToast] = useState("");

  // Show a temporary success message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/complaints/stats");
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  }, []);

  // Fetch all complaints (with optional filters)
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      if (filterStatus)   params.append("status", filterStatus);

      const { data } = await api.get(`/complaints/all?${params.toString()}`);
      setComplaints(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Admin updates complaint status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}`, { status: newStatus });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      fetchStats(); // refresh stat counts
      showToast("✅ Status updated!");
    } catch (err) {
      showToast("❌ Failed to update status");
    }
  };

  // Admin deletes a complaint
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      fetchStats();
      showToast("🗑️ Complaint deleted");
    } catch (err) {
      showToast("❌ Failed to delete");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />

      <main className="flex-1 overflow-auto">
        {/* Navbar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-display font-bold text-slate-800 text-lg">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">ADMIN</span>
            <span className="text-sm text-slate-600 font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Toast notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 px-4 py-3 bg-slate-800 text-white text-sm rounded-xl shadow-lg animate-fade-in">
            {toast}
          </div>
        )}

        <div className="p-8">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-slate-800 text-2xl mb-1">
                  Admin Dashboard
                </h2>
                <p className="text-slate-500">Monitor and manage all campus complaints.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total Complaints" value={stats?.total}      icon="📊" color="indigo" />
                <StatsCard label="Pending"           value={stats?.pending}    icon="⏳" color="amber" />
                <StatsCard label="In Progress"       value={stats?.inProgress} icon="🔧" color="blue" />
                <StatsCard label="Resolved"          value={stats?.resolved}   icon="✅" color="emerald" />
              </div>

              {/* Recent complaints */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-slate-700">Recent Complaints</h3>
                  <button
                    onClick={() => setActiveTab("complaints")}
                    className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {complaints.slice(0, 3).map((c) => (
                    <ComplaintCard
                      key={c._id}
                      complaint={c}
                      isAdmin
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ALL COMPLAINTS TAB ── */}
          {activeTab === "complaints" && (
            <div className="space-y-5">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-600">Filter by:</span>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.filter(Boolean).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.filter(Boolean).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {(filterCategory || filterStatus) && (
                  <button
                    onClick={() => { setFilterCategory(""); setFilterStatus(""); }}
                    className="text-xs text-red-400 hover:text-red-500 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition"
                  >
                    ✕ Clear filters
                  </button>
                )}

                <span className="ml-auto text-xs text-slate-400">
                  {complaints.length} result{complaints.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Complaint grid */}
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="font-display font-semibold text-slate-700 mb-1">No complaints found</h3>
                  <p className="text-slate-500 text-sm">Try changing your filters.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {complaints.map((c) => (
                    <ComplaintCard
                      key={c._id}
                      complaint={c}
                      isAdmin
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
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

export default AdminDashboard;
