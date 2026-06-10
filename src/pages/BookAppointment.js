import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingCart,
  Trash2,
  Leaf,
  Scissors,
  Flower2,
  Bug,
  Sprout,
  Droplets,
  Stethoscope,
  CalendarDays,
  Plus,
  TrendingUp
} from "lucide-react";

const services = [
  {
    name: "Garden Design",
    desc: "Professional design for your garden layout",
    price: 1000,
    icon: <Sparkles className="w-6 h-6 text-green-600" />,
    popular: true
  },
  {
    name: "Lawn Maintenance",
    desc: "Regular cutting and trimming",
    price: 500,
    icon: <Scissors className="w-6 h-6 text-green-600" />,
    popular: false
  },
  {
    name: "Plant Installation",
    desc: "Planting flowers and trees",
    price: 500,
    icon: <Flower2 className="w-6 h-6 text-green-600" />,
    popular: true
  },
  {
    name: "Pest Control",
    desc: "Safe pest removal for plants",
    price: 700,
    icon: <Bug className="w-6 h-6 text-green-600" />,
    popular: false
  },
  {
    name: "Soil Preparation",
    desc: "Soil mixing and fertilization",
    price: 500,
    icon: <Sprout className="w-6 h-6 text-green-600" />,
    popular: false
  },
  {
    name: "Garden Cleaning",
    desc: "Remove weeds and dry leaves",
    price: 500,
    icon: <Leaf className="w-6 h-6 text-green-600" />,
    popular: false
  },
  {
    name: "Watering Setup",
    desc: "Install irrigation system",
    price: 2000,
    icon: <Droplets className="w-6 h-6 text-green-600" />,
    popular: true
  },
  {
    name: "Plant Health Check",
    desc: "Check plant diseases",
    price: 500,
    icon: <Stethoscope className="w-6 h-6 text-green-600" />,
    popular: false
  },
  {
    name: "Seasonal Maintenance",
    desc: "Season-based plant care",
    price: 500,
    icon: <CalendarDays className="w-6 h-6 text-green-600" />,
    popular: false
  },
];

function BookAppointment() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const addToCart = (service) => {
    let updatedCart = [...cart];

    const existingItem = updatedCart.find(
      item => item.name === service.name
    );

    if (!existingItem) {
      updatedCart.push({
        id: service.name,
        name: service.name,
        price: service.price,
      });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const removeFromCart = (name) => {
    const updatedCart = cart.filter(item => item.name !== name);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularServices = services.filter(service => service.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar cartCount={cart.length} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10" />
              Book Your Garden Service
              <Sparkles className="w-10 h-10" />
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Choose from our wide range of professional gardening services.
              Transform your garden into a paradise with expert care.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: SERVICES SECTION */}
          <div className="lg:col-span-2">

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Popular Services Badge */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-700">Popular Services</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularServices.map((service, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {service.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Services</h2>

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Leaf className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredServices.map((service, index) => {

                  const isAdded = cart.some(
                    item => item.name === service.name
                  );

                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1"></div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 rounded-xl p-2 group-hover:bg-green-200 transition-colors">
                              {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                              {service.name}
                            </h3>
                          </div>
                          {service.popular && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                              Popular
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4">
                          {service.desc}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              ₹ {service.price}
                            </span>
                            <span className="text-gray-500 text-sm ml-1">/service</span>
                          </div>


                          <button
                            onClick={() => addToCart(service)}
                            disabled={isAdded}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1
    ${isAdded
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
                              }`}
                          >
                            <Plus className="w-4 h-4" />
                            {isAdded ? "Added" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: CART SECTION */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart
                    {cart.length > 0 && (
                      <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-sm ml-2">
                        {cart.length}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <p className="text-sm text-gray-400 mt-1">Add some services to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                        {cart.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-sm text-green-600 font-semibold">₹ {item.price}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.name)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>


                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-800">₹ {total}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 pt-2 border-t border-gray-200">
                          <span className="text-lg font-bold text-gray-800">Total</span>
                          <span className="text-2xl font-bold text-green-600">₹ {total}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (cart.length > 0) {
                              navigate("/cart");
                            }
                          }}
                          disabled={cart.length === 0}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${cart.length > 0
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          Proceed to Cart
                        </button>

                        {cart.length === 0 && (
                          <p className="text-xs text-gray-400 text-center mt-3">
                            Add services to enable checkout
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Why choose us?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Professional & certified gardeners</li>
                      <li>✓ Eco-friendly products</li>
                      <li>✓ Free consultation</li>
                      <li>✓ 100% satisfaction guaranteed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;