import { ShoppingCart, Leaf } from "lucide-react";
import logoImg from "../assets/logo.jpg";
import { Link } from "react-router-dom";

function Navbar({ cartCount }) {
  // Get user + role properly
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const dashboardPath =
  role === "ADMIN"
    ? "/admin"
    : role === "GARDENER"
    ? "/gardener"
    : "/customer";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">


          <Link
            to={dashboardPath}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative">
              <img
                src={logoImg}
                alt="Logo"
                className="h-8 md:h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
              <Leaf size={12} className="absolute -top-1 -right-1 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent hidden sm:inline-block">
              Home
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Cart ONLY for CUSTOMER - with cute badge animation */}
            {role === "CUSTOMER" && (
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-110 group"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile - Cute avatar with pill shape */}
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-gray-50/80 hover:bg-emerald-50 rounded-full pl-1 pr-3 py-1 transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-all">
                {userInitial}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">
                  {userName}
                </p>
                {role && (
                  <p className="text-[10px] text-gray-400 capitalize leading-tight">
                    {role.toLowerCase()} 🌱
                  </p>
                )}
              </div>
            </Link>

            {/* Logout Button - Cute rounded pill */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 font-medium px-4 py-1.5 rounded-full transition-all duration-300 text-sm shadow-sm hover:shadow-md active:scale-95"
            >
              Logout 🚪
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;