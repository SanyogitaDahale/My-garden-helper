import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { submitFeedback } from "../services/feedbackService";
import { Calendar, MapPin, Phone, Clock, ChevronRight, CalendarDays, Sparkles, Leaf, User, TrendingUp, CheckCircle, Clock as ClockIcon, XCircle, Star, MessageCircle, Shield, Droplets } from "lucide-react";

import Navbar from "../components/Navbar";
import { getCustomerAppointments } from "../services/appointmentService";
import bgImg from "../assets/bg.jpg";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});

  useEffect(() => {
    console.log("Dashboard mounted");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("USER:", user);
    if (user?.userId) {
      console.log("Calling API...");
      fetchAppointments(user.userId);
    }
  }, []);

  const fetchAppointments = async (userId) => {
    try {
      console.log("FETCHING USER:", userId);
      const res = await getCustomerAppointments(userId);
      console.log("API RESPONSE:", res.data);
      setAppointments(res.data || []);
    } catch (err) {
      console.error("FULL ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (appt) => {
    const feedbackId = appt.id;
    if (submittingFeedback[feedbackId]) return;

    try {
      setSubmittingFeedback(prev => ({ ...prev, [feedbackId]: true }));
      
      await submitFeedback({
        rating: Number(feedbackData[appt.id]?.rating || 5),
        comment: feedbackData[appt.id]?.comment || "",
        appointment: {
          id: Number(appt.id || appt.appointmentId)
        },
        customer: {
          id: Number(user.userId)
        },
        gardener: {
          id: Number(appt.gardener?.id)
        }
      });

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-up';
      successMsg.innerText = '✨ Feedback submitted successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      setFeedbackData((prev) => ({
        ...prev,
        [appt.id]: {
          rating: 5,
          comment: ""
        }
      }));
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("BACKEND RESPONSE:", err.response);
      console.log("BACKEND DATA:", err.response?.data);
      
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-up';
      errorMsg.innerText = `❌ Error: ${err.response?.data?.message || 'Failed to submit feedback'}`;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [feedbackId]: false }));
    }
  };

  const updateRating = (apptId, rating) => {
    setFeedbackData((prev) => ({
      ...prev,
      [apptId]: {
        ...(prev[apptId] || {}),
        rating: rating
      }
    }));
  };

  const filteredAppointments = selectedStatus === "all"
    ? appointments
    : appointments.filter(app => app.status?.toLowerCase() === selectedStatus.toLowerCase());

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status?.toLowerCase() === "pending").length,
    accepted: appointments.filter(a => a.status?.toLowerCase() === "accepted").length,
    completed: appointments.filter(a => a.status?.toLowerCase() === "completed").length
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <ClockIcon size={14} className="text-amber-600" />;
      case "confirmed": return <CheckCircle size={14} className="text-blue-600" />;
      case "completed": return <CheckCircle size={14} className="text-emerald-600" />;
      case "rejected": return <XCircle size={14} className="text-rose-600" />;
      default: return <ClockIcon size={14} className="text-gray-600" />;
    }
  };

  const StarRating = ({ rating, onChange, disabled }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={`transition-all duration-200 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              size={20}
              className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/50">
      <Navbar cartCount={appointments.length} />

      {/* Hero Section */}
      <div className="relative h-[85vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bgImg}
            alt="Lush Garden"
            className="w-full h-full object-cover scale-105 transition-transform duration-[25s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">Welcome Back!</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Hello,{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {user?.name?.split(' ')[0] || "Gardener"}!
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Your garden journey continues here. Book services, track appointments, and watch your outdoor space flourish.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => navigate("/book")}
              className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              <Sparkles className="w-5 h-5" />
              Book New Service
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => document.getElementById("appointments")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View My Bookings
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Total Bookings", value: stats.total, icon: CalendarDays, color: "emerald", gradient: "from-emerald-500 to-teal-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "amber", gradient: "from-amber-500 to-orange-500" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "blue", gradient: "from-blue-500 to-indigo-500" },
            { label: "Completed", value: stats.completed, icon: TrendingUp, color: "green", gradient: "from-green-500 to-emerald-500" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments Section */}
      <div id="appointments" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              My Bookings
            </h2>
            <p className="text-gray-600 mt-2 ml-2">Track and manage all your gardening appointments</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-lg border border-gray-100">
            {["all", "pending", "accepted", "completed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-5 py-2.5 rounded-lg capitalize transition-all duration-300 font-medium text-sm ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-3 border-green-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No appointments found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Ready to transform your garden? Book your first service today and watch your outdoor space flourish!
            </p>
            <button
              onClick={() => navigate("/book")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Book Your First Service
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredAppointments.map((appt, index) => (
              <div
                key={appt.id}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-1.5 w-0 group-hover:w-full transition-all duration-700"></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Calendar size={14} className="text-green-600" />
                        <span>{new Date(appt.appointmentDate).toLocaleDateString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric"
                        })}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {new Date(appt.appointmentDate).toLocaleDateString([], {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(appt.status)}`}
                    >
                      {getStatusIcon(appt.status)}
                      {appt.status || "Pending"}
                    </span>
                  </div>

                  {/* Services */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Droplets size={12} />
                      Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appt.serviceNames?.map((service, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-gray-700 px-3 py-1.5 rounded-xl border border-green-100 shadow-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{new Date(appt.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}</span>
                    </div>
                    {appt.address && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <span className="text-sm line-clamp-2">{appt.address}</span>
                      </div>
                    )}
                    {appt.gardener && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Gardener: {appt.gardener.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => setSelectedBooking(appt)}
                      className="text-green-700 hover:text-green-800 font-semibold text-sm flex items-center gap-1.5 transition-colors group/btn"
                    >
                      <Calendar size={14} />
                      View Details
                      <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Feedback Section */}
                  {appt.status?.toLowerCase() === "completed" && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <MessageCircle size={14} className="text-yellow-600" />
                        Share Your Experience
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Your Rating</span>
                          <StarRating
                            rating={feedbackData[appt.id]?.rating || 5}
                            onChange={(rating) => updateRating(appt.id, rating)}
                            disabled={submittingFeedback[appt.id]}
                          />
                        </div>
                        <textarea
                          placeholder="Write your feedback here..."
                          value={feedbackData[appt.id]?.comment || ""}
                          onChange={(e) =>
                            setFeedbackData((prev) => ({
                              ...prev,
                              [appt.id]: {
                                ...(prev[appt.id] || {}),
                                comment: e.target.value
                              }
                            }))
                          }
                          disabled={submittingFeedback[appt.id]}
                          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-gray-50"
                          rows="2"
                        />
                        <button
                          onClick={() => handleFeedback(appt)}
                          disabled={submittingFeedback[appt.id]}
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingFeedback[appt.id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Star size={16} />
                              Submit Feedback
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Tips Section */}
        <div className="mt-20 rounded-3xl overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium">Expert Insights</span>
              </div>
              <h2 className="text-3xl font-bold mb-3">Gardening Tips & Insights</h2>
              <p className="text-green-200">Professional advice to keep your garden thriving all year round</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Droplets, title: "Water Wisely", description: "Water your plants early morning or late evening to reduce evaporation and prevent fungal diseases.", color: "blue" },
                { icon: Calendar, title: "Seasonal Care", description: "Different seasons require different care routines. Adjust your gardening schedule accordingly.", color: "amber" },
                { icon: User, title: "Professional Help", description: "Regular professional maintenance can extend your garden's life and boost plant health.", color: "emerald" }
              ].map((tip, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group">
                  <div className={`w-12 h-12 bg-${tip.color}-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                  <p className="text-green-200 text-sm leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex justify-between items-center sticky top-0">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Booking Details
                </h2>
                <p className="text-green-100 text-sm mt-1">Complete appointment information</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-white/80 hover:text-white text-3xl hover:scale-110 transition-transform w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Booking Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="grid gap-5">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Appointment Date</p>
                    <p className="text-gray-600">{new Date(selectedBooking.appointmentDate).toLocaleDateString([], {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Appointment Time</p>
                    <p className="text-gray-600">{new Date(selectedBooking.appointmentDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600">{selectedBooking.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone Number</p>
                    <p className="text-gray-600">{selectedBooking.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Services
                </h3>
                <div className="space-y-3">
                  {selectedBooking.serviceNames?.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{service}</span>
                      <span className="text-green-700 font-bold">₹500</span>
                    </div>
                  ))}
                  <div className="border-t border-green-200 pt-3 mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Price</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{selectedBooking.serviceNames?.length * 500}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default CustomerDashboard;