import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= LOGIN =================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      // Clear old storage
      localStorage.clear();

      const res = await axios.post(
        "http://localhost:8081/auth/login",
        {
          email: form.email,
          password: form.password
        }
      );

      console.log("FULL RESPONSE:", res.data);

      const user = res.data;

      // ================= SAVE DATA =================

      localStorage.setItem("token", user.token);

      localStorage.setItem("userId", user.userId);

      localStorage.setItem("role", user.role);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          userId: user.userId,
          role: user.role
        })
      );

      alert("Login Successful ✅");

      // ================= ROLE BASED NAVIGATION =================

      const role = user.role?.toUpperCase();

      if (role === "ADMIN") {

        navigate("/admin");

      } else if (role === "GARDENER") {

        navigate("/gardener");

      } else {

        navigate("/customer");
      }

    } catch (err) {

      console.error(err);

      alert("Login Failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: "#dcfce7" }}
    >

      <div className="text-center mb-6">

        <h1 className="text-2xl font-semibold text-green-700">
          Hello! Welcome to
        </h1>

        <h2 className="text-4xl font-bold text-green-900">
          My Garden Helper App
        </h2>

        <p className="text-gray-600 mt-1">
          Making gardening easy for everyone
        </p>

      </div>

      <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">

        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Welcome Back 🌿
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-800 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            LOGIN
          </button>
          <p className="text-right mt-3">
            <a
              href="/forgot-password"
              className="text-sm text-green-700 hover:underline font-medium"
            >
              Forgot Password?
            </a>
          </p>


        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-green-700 font-semibold"
          >
            Register
          </a>
        </p>

        <p className="text-gray-400 mt-1 text-center">
          Grow your garden with ease
        </p>

      </div>
    </div>
  );
}

export default LoginPage;