import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import GardenerDashboard from "./pages/GardenerDashboard";

import AdminServices from "./pages/AdminServices";
import ServicesPage from "./pages/ServicesPage";

import BookAppointment from "./pages/BookAppointment";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";

import AppointmentDetails from "./pages/AppointmentDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer Route */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Gardener Route */}
        <Route
          path="/gardener"
          element={
            <ProtectedRoute allowedRole="GARDENER">
              <GardenerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Services */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admin/services" element={<AdminServices />} />

        {/* Booking */}
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Appointment Details */}
        <Route
          path="/appointment/:id"
          element={<AppointmentDetails />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;