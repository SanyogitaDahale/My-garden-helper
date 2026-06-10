import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  assignGardener,
} from "../services/appointmentService";
import {
  getGardeners,
  addGardener,
  updateGardener,
  deleteGardener,
} from "../services/gardenerService";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../services/serviceService";
import { getAllFeedback }
  from "../services/feedbackService";


const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
        ? "bg-rose-600"
        : "bg-blue-600";

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-xl shadow-lg z-50 backdrop-blur-sm animate-in slide-in-from-right-5 duration-300`}
    >
      {message}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [feedbacks, setFeedbacks] = useState([]);
  // Data states
  const [appointments, setAppointments] = useState([]);
  const [gardeners, setGardeners] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    appointments: true,
    gardeners: true,
    services: true,
  });
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // Form states for modals
  const [showGardenerModal, setShowGardenerModal] = useState(false);
  const [editingGardener, setEditingGardener] = useState(null);
  const [gardenerForm, setGardenerForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Fetch all data
  const fetchData = async () => {

    try {

      setLoading({
        appointments: true,
        gardeners: true,
        services: true,
      });

      const [appRes, garRes, serRes, feedRes] =
        await Promise.all([

          getAllAppointments(),
          getGardeners(),
          getServices(),
          getAllFeedback()

        ]);

      console.log("Bookings:", appRes.data);
      console.log("Gardeners:", garRes.data);
      console.log("Services:", serRes.data);
      console.log("FIRST SERVICE:", serRes.data[0]);
      console.log("Feedback:", feedRes.data);

      setAppointments(appRes.data || []);
      setGardeners(garRes.data || []);
      setServices(serRes.data || []);
      setFeedbacks(feedRes.data || []);

    }

    catch (error) {

      console.error("FETCH ERROR:", error);

      setAppointments([]);
      setGardeners([]);
      setServices([]);
      setFeedbacks([]);

    }

    finally {
      setLoading({
        appointments: false,
        gardeners: false,
        services: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Appointment actions
  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setFeedback({ message: `Appointment ${status}`, type: "success" });
      fetchData();
    } catch (err) {
      setFeedback({ message: "Failed to update", type: "error" });
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setFeedback({ message: "Appointment deleted", type: "success" });
      fetchData();
    } catch (err) {
      setFeedback({ message: "Delete failed", type: "error" });
    }
  };

  const handleAssignGardener = async (appointmentId, gardenerId) => {
    try {
      await assignGardener(appointmentId, gardenerId);
      setFeedback({ message: "Gardener assigned", type: "success" });
      fetchData();
    } catch (err) {
      setFeedback({ message: "Assignment failed", type: "error" });
    }
  };

  // Gardener CRUD
  const openGardenerModal = (gardener = null) => {
    if (gardener) {
      setEditingGardener(gardener);
      setGardenerForm({
        name: gardener.name,
        email: gardener.email,
        phone: gardener.phone,
        specialty: gardener.specialty,
      });
    } else {
      setEditingGardener(null);
      setGardenerForm({ name: "", email: "", phone: "", specialty: "" });
    }
    setShowGardenerModal(true);
  };

  const saveGardener = async () => {
    try {
      if (editingGardener) {
        await updateGardener(editingGardener.id, gardenerForm);
        setFeedback({ message: "Gardener updated", type: "success" });
      } else {
        await addGardener(gardenerForm);
        setFeedback({ message: "Gardener added", type: "success" });
      }
      setShowGardenerModal(false);
      fetchData();
    } catch (err) {
      setFeedback({ message: "Operation failed", type: "error" });
    }
  };

  const deleteGardenerHandler = async (id) => {
    if (!window.confirm("Remove this gardener?")) return;
    try {
      await deleteGardener(id);
      setFeedback({ message: "Gardener removed", type: "success" });
      fetchData();
    } catch (err) {
      setFeedback({ message: "Delete failed", type: "error" });
    }
  };

  // Service CRUD
  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      });
    } else {
      setEditingService(null);
      setServiceForm({ name: "", description: "", price: "", duration: "" });
    }
    setShowServiceModal(true);
  };

  const saveService = async () => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceForm);
        setFeedback({ message: "Service updated", type: "success" });
      } else {
        await addService(serviceForm);
        setFeedback({ message: "Service added", type: "success" });
      }
      setShowServiceModal(false);
      fetchData();
    } catch (err) {
      setFeedback({ message: "Operation failed", type: "error" });
    }
  };

  const deleteServiceHandler = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setFeedback({ message: "Service deleted", type: "success" });
      fetchData();
    } catch (err) {
      setFeedback({ message: "Delete failed", type: "error" });
    }
  };

  const clearFeedback = () => setFeedback({ message: "", type: "" });

  // Stats
  const stats = {
    totalBookings: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    accepted: appointments.filter((a) => a.status === "ACCEPTED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    rejected: appointments.filter((a) => a.status === "REJECTED").length,
    totalGardeners: gardeners.length,
    totalServices: services.length,
    revenue:
      appointments
        .filter((a) => a.status === "COMPLETED")
        .reduce(
          (sum, a) => sum + (a.serviceNames?.length || 0) * 500,
          0
        ),
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-amber-100 text-amber-700 ring-amber-600/20",
      ACCEPTED: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
      REJECTED: "bg-rose-100 text-rose-700 ring-rose-600/20",
      COMPLETED: "bg-sky-100 text-sky-700 ring-sky-600/20",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${styles[status] || styles.PENDING
          }`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage bookings, gardeners & services</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-emerald-200 mb-8 pb-0">
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "bookings", label: "📅 Bookings" },
              { id: "gardeners", label: "👨‍🌾 Gardeners" },
              { id: "services", label: "🌿 Services" },
              { id: "feedback", label: "⭐ Feedback" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-t-xl font-medium transition-all duration-200 ${activeTab === tab.id
                  ? "bg-white text-emerald-700 shadow-sm border-x border-t border-emerald-200"
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/50"
                  }`}
              >
                {tab.label}
              </button>

            ))}
          </div>

          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Cards */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      📅
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 text-xs">
                    <span className="text-amber-600">⬤ {stats.pending} pending</span>
                    <span className="text-emerald-600">⬤ {stats.accepted} accepted</span>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Gardeners</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalGardeners}</p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      👨‍🌾
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Services Offered</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      🌿
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Revenue (₹)</p>
                      <p className="text-3xl font-bold text-emerald-700 mt-1">
                        ₹{stats.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition">
                      💰
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-lg text-gray-800">📋 Recent Bookings</h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-medium text-emerald-800">
                          {app.serviceName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{app.serviceName}</p>
                          <p className="text-xs text-gray-500">
                            {app.appointmentDate} • {app.customerName || "Guest"}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <p className="text-center text-gray-400 py-6">No bookings yet</p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ==================== BOOKINGS TAB ==================== */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading.appointments ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12">
                          <div className="flex justify-center">
                            <div className="animate-pulse text-gray-400">Loading bookings...</div>
                          </div>
                        </td>
                      </tr>
                    ) : appointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-400">
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      appointments.map((app) => (
                        <tr key={app.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-gray-500">#{app.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.serviceName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.customerName || "Guest"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{app.appointmentDate}</td>
                          <td className="px-6 py-4">
                            <select
                              value={app.status}
                              onChange={(e) =>
                                handleUpdateAppointmentStatus(app.id, e.target.value)
                              }
                              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="ACCEPTED">Accepted</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                              <select
                                onChange={(e) =>
                                  handleAssignGardener(app.id, e.target.value)
                                }
                                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-emerald-500"
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Assign Gardener
                                </option>
                                {gardeners.map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleDeleteAppointment(app.id)}
                                className="text-rose-600 hover:text-rose-800 text-xs font-medium transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== GARDENERS TAB ==================== */}
          {activeTab === "gardeners" && (
            <div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading.gardeners ? (
                  <div className="col-span-full text-center py-12 text-gray-400">Loading gardeners...</div>
                ) : gardeners.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">No gardeners added yet</div>
                ) : (
                  gardeners.map((gardener) => (
                    <div
                      key={gardener.id}
                      className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                          👨‍🌾
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openGardenerModal(gardener)}
                            className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteGardenerHandler(gardener.id)}
                            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mt-3 text-gray-800">{gardener.name}</h3>
                      <p className="text-gray-500 text-sm truncate">{gardener.email}</p>
                      <p className="text-gray-500 text-sm mt-1">📞 {gardener.phone}</p>
                      <div className="mt-3 inline-block bg-emerald-50 px-3 py-1 rounded-full">
                        <p className="text-emerald-700 text-xs font-medium">🌿 {gardener.specialty}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== SERVICES TAB ==================== */}
          {activeTab === "services" && (
            <div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading.services ? (
                  <div className="col-span-full text-center py-12 text-gray-400">Loading services...</div>
                ) : services.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">No services added yet</div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                          🌱
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openServiceModal(service)}
                            className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteServiceHandler(service.id)}
                            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mt-3 text-gray-800">
                        {service.name || service.serviceName}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {service.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <span className="text-emerald-700 font-bold text-lg">
                          ₹{service.price || 0}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          ⏱️ {service.duration || "N/A"} min
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== FEEDBACK TAB ==================== */}

      {activeTab === "feedback" && (

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">

          <h2 className="text-2xl font-bold mb-6">
            ⭐ Customer Feedback
          </h2>

          {!feedbacks || feedbacks.length === 0 ? (

            <div className="text-gray-500">
              No feedback available
            </div>

          ) : (

            <div className="space-y-4">

              {feedbacks.map((fb) => (

                <div
                  key={fb.id}
                  className="border border-emerald-100 rounded-xl p-5 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="font-bold text-lg">

                      {fb.customer?.name || "Unknown Customer"}

                    </h3>

                    <div className="text-yellow-500 text-xl">

                      {"⭐".repeat(fb.rating || 0)}

                    </div>

                  </div>

                  <p className="text-sm text-gray-700">

                    Gardener:
                    <strong>
                      {" "}
                      {fb.gardener?.name || "Unknown Gardener"}
                    </strong>

                  </p>

                  <p className="mt-3 text-gray-800">

                    "{fb.comment || "No comment"}"

                  </p>

                  <p className="mt-3 text-sm text-gray-500">

                    Appointment Date:
                    {" "}
                    {fb.appointment?.appointmentDate
                      ? new Date(
                        fb.appointment.appointmentDate
                      ).toLocaleDateString()
                      : "N/A"}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

      {/* Gardener Modal */}
      {showGardenerModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-5 text-gray-800">
              {editingGardener ? "✏️ Edit Gardener" : "👨‍🌾 Add Gardener"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={gardenerForm.name}
                onChange={(e) => setGardenerForm({ ...gardenerForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={gardenerForm.email}
                onChange={(e) => setGardenerForm({ ...gardenerForm, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={gardenerForm.phone}
                onChange={(e) => setGardenerForm({ ...gardenerForm, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <input
                type="text"
                placeholder="Specialty (e.g., Lawn Care, Pruning)"
                value={gardenerForm.specialty}
                onChange={(e) => setGardenerForm({ ...gardenerForm, specialty: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveGardener}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowGardenerModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-5 text-gray-800">
              {editingService ? "✏️ Edit Service" : "🌿 Add Service"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Service Name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <textarea
                placeholder="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows="3"
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
              <input
                type="text"
                placeholder="Duration (minutes)"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveService}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowServiceModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback.message && (
        <Toast message={feedback.message} type={feedback.type} onClose={clearFeedback} />
      )}
    </>
  );
};

export default AdminDashboard;