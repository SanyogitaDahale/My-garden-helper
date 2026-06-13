import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";



function CheckoutPage() {

  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const [flatNo, setFlatNo] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const appointmentDateTime = `${date}T${time}`;

  const handleBooking = async () => {
    if (!flatNo || !address || !city || !stateName || !pincode || !phone || !date || !time) {
      alert("Please fill all details ");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty ");
      return;
    }
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    if (!address || !phone) {
      alert("Please fill address and phone");
      return;
    }

    if (phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (pincode.length !== 6) {
      alert("Pincode must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        "http://my-garden-helper-backend.onrender.com/appointments/book",
        {
          serviceNames: cart.map((item) => item.name),
          appointmentDate: appointmentDateTime,
          userId: user.userId,
          address: `${flatNo}, ${address}, ${city}, ${stateName} - ${pincode}`,
          phone,
        },
        {
          auth: {
            username: "user",
            password: "3f4cb0f9-730a-4193-a679-f5611e1e0708",
          },
        }
      );

      console.log("Booking Response:", response.data);

      alert("Booking Successful ");
      localStorage.removeItem("cart");

      setAddress("");
      setPhone("");
      setDate("");

      navigate("/customer");

    } catch (err) {
      console.error("Booking Error:", err);
      alert("Booking Failed ");
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="min-h-screen bg-green-50">

      <Navbar cartCount={cart.length} />

      <div className="max-w-4xl mx-auto p-6">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🧾 Checkout
        </h1>

        {/* CART */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>₹ {item.price}</span>
              </div>
            ))
          )}

          <div className="border-t mt-3 pt-3 font-semibold text-lg">
            Total: ₹ {total}
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">

          {/* Flat / Plot No */}
          <input
            type="text"
            placeholder="Flat / Plot No"
            className="w-full border p-3 rounded-lg"
            value={flatNo}
            onChange={(e) => setFlatNo(e.target.value)}
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Area / Street / Locality"
            className="w-full border p-3 rounded-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* City */}
          <input
            type="text"
            placeholder="City"
            className="w-full border p-3 rounded-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* State */}
          <input
            type="text"
            placeholder="State"
            className="w-full border p-3 rounded-lg"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          {/* Pincode */}
          <input
            type="text"
            placeholder="Pincode"
            className="w-full border p-3 rounded-lg"
            value={pincode}
            maxLength={6}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPincode(value);
            }}
          />

          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full border p-3 rounded-lg"
            value={phone}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // only numbers
              setPhone(value);
            }}
          />

          <input
            type="date"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />



          <button
            onClick={handleBooking}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition 
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md"
              }`}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;