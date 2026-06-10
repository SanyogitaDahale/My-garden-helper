import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // if using React Router

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);


  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const total = subtotal;

  // Proceed to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
          <Link
            to="/book"
            className="mt-6 inline-flex items-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 flex items-center gap-2">
          🛒 Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center border border-green-100"
              >

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                  <p className="text-green-700 font-medium">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                {/* <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>

                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div> */}

                {/* Item Total & Remove */}
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold text-gray-800">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 mt-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Items
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6 border border-green-100">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} services)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-gray-800 text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/book"
                className="block text-center mt-4 text-green-600 hover:text-green-800 text-sm"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;