import { useState } from "react";
import { registerUser } from "../services/authService";

function RegisterPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Sending data:", form); // 🔥 DEBUG

    // VALIDATION
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least 1 uppercase letter");
      return;
    }

    if (!/[a-z]/.test(form.password)) {
      setError("Password must contain at least 1 lowercase letter");
      return;
    }

    if (!/[0-9]/.test(form.password)) {
      setError("Password must contain at least 1 number");
      return;
    }

    if (!/[!@#$%^&*]/.test(form.password)) {
      setError("Password must contain at least 1 special character");
      return;
    }

    try {
      await registerUser(form);

      setError("");
      alert("Registration Successful");
      window.location.href = "/login";

    } catch (err) {
      console.error("Backend error:", err.response);
      setError(err.response?.data || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 px-4">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Create Account 🌿
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={form.password}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 ml-2">
            Password must contain:
            <br />
            • Minimum 8 characters
            <br />
            • 1 uppercase letter
            <br />
            • 1 lowercase letter
            <br />
            • 1 number
            <br />
            • 1 special character (!@#$%^&*)
          </p>

          <select
            name="role"
            className="w-full p-3 border rounded-lg"
            value={form.role}
            onChange={handleChange}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="GARDENER">Gardener</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-900 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            REGISTER
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-green-700 font-semibold">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;