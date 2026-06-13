import { useEffect, useState, useCallback, useMemo } from "react";
import { getGardenerAppointments, updateAppointmentStatus } from "../services/appointmentService";
import Navbar from "../components/Navbar";

// ========== TOAST COMPONENT (with progress bar) ==========
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgGradient =
    type === "success"
      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
      : type === "error"
      ? "bg-gradient-to-r from-rose-600 to-red-600"
      : "bg-gradient-to-r from-sky-600 to-indigo-600";

  const icon = type === "success" ? "✓" : type === "error" ? "⚠" : "ℹ";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl ${bgGradient} px-5 py-3 text-white shadow-2xl backdrop-blur-sm border border-white/20 animate-slide-up`}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
        {icon}
      </div>
      <span className="font-medium">{message}</span>
      <div className="absolute bottom-0 left-0 h-1 w-full animate-progress-shrink rounded-full bg-white/40" />
    </div>
  );
};

// ========== SKELETON CARD LOADER ==========
const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm shadow-lg">
    <div className="h-2 w-full bg-gray-200" />
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gray-200" />
          <div className="h-6 w-32 rounded-lg bg-gray-200" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-36 rounded bg-gray-200" />
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-10 flex-1 rounded-xl bg-gray-200" />
        <div className="h-10 flex-1 rounded-xl bg-gray-200" />
      </div>
    </div>
  </div>
);

// ========== MAIN DASHBOARD COMPONENT ==========
function GardenerDashboard() {
  // const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchDate, setSearchDate] = useState("");

  const gardenerId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const gardenerName = user?.name;

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!gardenerId) {
      setFeedback({ message: "Gardener ID not found. Please log in again.", type: "error" });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getGardenerAppointments(gardenerId);
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Failed to load appointments. Please refresh.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [gardenerId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update status
  const handleStatus = async (id, newStatus) => {
    const confirmMsg =
      newStatus === "ACCEPTED"
        ? "Accept this booking?"
        : newStatus === "COMPLETED"
        ? "Mark service as completed?"
        : "Reject this booking?";
    if (!window.confirm(confirmMsg)) return;

    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      setFeedback({ message: `Booking ${newStatus.toLowerCase()} successfully!`, type: "success" });
      await fetchAppointments();
    } catch (err) {
      console.error(err);
      setFeedback({ message: `Failed to ${newStatus.toLowerCase()} booking. Try again.`, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFeedback = () => setFeedback({ message: "", type: "" });

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
      if (searchDate && !app.appointmentDate.includes(searchDate)) return false;
      return true;
    });
  }, [appointments, statusFilter, searchDate]);

  // Stats
  const stats = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      accepted: appointments.filter((a) => a.status === "ACCEPTED").length,
      rejected: appointments.filter((a) => a.status === "REJECTED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
    }),
    [appointments]
  );

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "COMPLETED":
        return "bg-sky-50 text-sky-700 border border-sky-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "ACCEPTED":
        return "✅";
      case "REJECTED":
        return "❌";
      case "COMPLETED":
        return "✨";
      default:
        return "📋";
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 animate-float rounded-full bg-emerald-300/20 mix-blend-multiply blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-float-delayed rounded-full bg-teal-300/20 mix-blend-multiply blur-3xl" />
          <div className="absolute top-1/3 left-1/4 h-64 w-64 animate-pulse rounded-full bg-amber-200/10 mix-blend-multiply blur-3xl" />
          <div className="absolute bottom-10 right-10 rotate-12 text-8xl opacity-5">🌿</div>
          <div className="absolute top-20 left-10 -rotate-12 text-7xl opacity-5">🍃</div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section with Unsplash image (replaceable) */}
          <div className="group relative mb-12 overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-900/40 to-teal-800/40" />
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&auto=format"
              alt="Beautiful garden"
              className="h-64 w-full scale-100 object-cover transition-transform duration-700 group-hover:scale-105 md:h-80"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 bg-gradient-to-r from-black/50 to-transparent">
              <div className="mb-3 flex items-center gap-3">
                <span className="animate-bounce text-4xl">🌿</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold tracking-wider text-white/90 backdrop-blur-sm">
                  GARDENER PORTAL
                </span>
              </div>
              <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
                Welcome back,{" "}
                <span className="text-emerald-300">{gardenerName || "Gardener"}!</span>
              </h1>
              <p className="max-w-2xl text-lg text-white/90 drop-shadow">
                Here are your assigned bookings. Manage your service appointments with ease and care.
              </p>
            </div>
          </div>

          {/* Stats Cards - Glassmorphism */}
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { label: "Total", value: stats.total, icon: "🌿", color: "emerald" },
              { label: "Pending", value: stats.pending, icon: "⏳", color: "amber" },
              { label: "Accepted", value: stats.accepted, icon: "✅", color: "emerald" },
              { label: "Completed", value: stats.completed, icon: "✨", color: "sky" },
              { label: "Rejected", value: stats.rejected, icon: "❌", color: "rose" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-800 transition-transform group-hover:scale-110 md:text-4xl">
                    {stat.value}
                  </p>
                  <span className="text-3xl drop-shadow-md">{stat.icon}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 md:text-base">{stat.label}</p>
                <div
                  className={`mt-2 h-1 w-12 rounded-full bg-${stat.color}-400 transition-all duration-500 group-hover:w-full`}
                ></div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="mb-8 rounded-2xl border border-white/50 bg-white/40 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {["ALL", "PENDING", "ACCEPTED", "COMPLETED", "REJECTED"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                      statusFilter === filter
                        ? "scale-105 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        : "bg-white/60 text-gray-700 backdrop-blur-sm hover:scale-105 hover:bg-emerald-100"
                    }`}
                  >
                    <span>
                      {filter === "ALL"
                        ? "📋"
                        : filter === "PENDING"
                        ? "⏳"
                        : filter === "ACCEPTED"
                        ? "✅"
                        : filter === "COMPLETED"
                        ? "✨"
                        : "❌"}
                    </span>
                    <span>{filter === "ALL" ? "All" : filter}</span>
                    {filter !== "ALL" && (
                      <span className="ml-1 rounded-full bg-white/30 px-2 py-0.5 text-xs">
                        {appointments.filter((a) => a.status === filter).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="relative min-w-[180px] flex-1">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  📅
                </div>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full rounded-full border border-emerald-200 bg-white/80 py-2 pl-10 pr-4 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={fetchAppointments}
                className="rounded-full bg-white/80 p-2 shadow-md transition-colors hover:bg-emerald-100"
                title="Refresh"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAppointments.length === 0 && (
            <div className="rounded-3xl border border-white/50 bg-white/40 py-16 text-center shadow-lg backdrop-blur-sm">
              <div className="mb-4 animate-float text-8xl">🌸</div>
              <p className="text-xl font-medium text-gray-700">
                {searchDate
                  ? "No bookings on selected date."
                  : statusFilter === "ALL"
                  ? "No assigned bookings yet."
                  : `No ${statusFilter.toLowerCase()} bookings.`}
              </p>
              <p className="mt-2 text-gray-500">New bookings will appear here once assigned.</p>
              <div className="mt-8 text-6xl opacity-20">🌱</div>
            </div>
          )}

          {/* Appointments Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              filteredAppointments.map((app, idx) => (
                <div
                  key={app.id}
                  className="group animate-fade-in-up rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`h-2 w-full rounded-t-2xl ${
                      app.status === "PENDING"
                        ? "bg-gradient-to-r from-amber-400 to-amber-500"
                        : app.status === "ACCEPTED"
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        : app.status === "COMPLETED"
                        ? "bg-gradient-to-r from-sky-400 to-sky-500"
                        : "bg-gradient-to-r from-rose-400 to-rose-500"
                    }`}
                  />
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl transition-transform group-hover:scale-110">
                          🌿
                        </div>
                        <h2 className="max-w-[150px] truncate text-lg font-bold text-gray-800">
                          {app.serviceName}
                        </h2>
                      </div>
                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                          app.status
                        )}`}
                      >
                        <span>{getStatusIcon(app.status)}</span>
                        <span>{app.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <span className="w-5 text-emerald-600">📅</span>
                        {new Date(app.appointmentDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-5 text-emerald-600">📍</span>
                        <span className="truncate">{app.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-5 text-emerald-600">📞</span> {app.phone}
                      </p>
                      {app.customerName && (
                        <p className="flex items-center gap-2">
                          <span className="w-5 text-emerald-600">👤</span> {app.customerName}
                        </p>
                      )}
                      {app.notes && (
                        <p className="mt-2 flex items-start gap-1 rounded-lg bg-gray-50 p-2 text-xs italic text-gray-500">
                          <span>📝</span> {app.notes}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {app.status === "PENDING" && (
                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => handleStatus(app.id, "ACCEPTED")}
                          disabled={updatingId === app.id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                        >
                          {updatingId === app.id ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            "✓ Accept"
                          )}
                        </button>
                        <button
                          onClick={() => handleStatus(app.id, "REJECTED")}
                          disabled={updatingId === app.id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}

                    {app.status === "ACCEPTED" && (
                      <button
                        onClick={() => handleStatus(app.id, "COMPLETED")}
                        disabled={updatingId === app.id}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                      >
                        {updatingId === app.id ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          "✓ Mark Completed"
                        )}
                      </button>
                    )}

                    {app.status === "COMPLETED" && (
                      <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-sky-50 py-2 text-center text-sm font-medium text-sky-600">
                        <span>✨</span> Service Completed <span>✨</span>
                      </div>
                    )}

                    {app.status === "REJECTED" && (
                      <div className="mt-5 rounded-xl bg-rose-50 py-2 text-center text-sm font-medium text-rose-600">
                        ✖ Booking Rejected
                      </div>
                    )}

                    
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Toast */}
        {feedback.message && <Toast message={feedback.message} type={feedback.type} onClose={clearFeedback} />}
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .animate-progress-shrink { animation: progress-shrink 3s linear forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </>
  );
}

export default GardenerDashboard;