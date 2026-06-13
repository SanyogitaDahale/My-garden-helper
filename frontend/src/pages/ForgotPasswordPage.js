import { useState } from "react";
import axios from "axios";

function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    console.log("BUTTON WORKING");
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // STRONG PASSWORD VALIDATION
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain 1 uppercase letter");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError("Password must contain 1 lowercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain 1 number");
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      setError("Password must contain 1 special character");
      return;
    }

    try {

      await axios.put(
        "http://my-garden-helper-backend.onrender.comocalhost:8081/auth/change-password",
        {
          email,
          newPassword
        }
      );

      setMessage("Password changed successfully");

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

    }
    catch (err) {

      console.log(err);

      if (err.response && err.response.data) {

        // If backend sends string
        if (typeof err.response.data === "string") {

          setError(err.response.data);

        }

        // If backend sends object
        else if (err.response.data.message) {

          setError(err.response.data.message);

        }

        else {

          setError("Something went wrong");
        }

      } else {

        setError("Server error");
      }
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Change Password 🔒
        </h2>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form
          onSubmit={handleChangePassword}
          className="space-y-4"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* NEW PASSWORD */}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* PASSWORD RULES */}
          <p className="text-xs text-gray-500 leading-6">

            Password must contain:

            <br />• Minimum 8 characters
            <br />• 1 uppercase letter
            <br />• 1 lowercase letter
            <br />• 1 number
            <br />• 1 special character (!@#$%^&*)

          </p>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-700 text-white p-3 rounded-lg transition"
          >
            Change Password
          </button>
          <p className="text-center mt-4 text-sm underline">
          <a href="/login" className="text-green-700 font-semibold">
            Go To Login Page
          </a>
        </p>

        </form>

      </div>

    </div>

  );
}

export default ForgotPasswordPage;