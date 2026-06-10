<button
                          onClick={() => {
                            if (cart.length > 0) {
                              const cleanCart = cart.map(({ name, desc, price }) => ({
                                name,
                                desc,
                                price,
                              }));

                              navigate("/checkout", { state: { cart: cleanCart } });
                            }
                          }}
                          disabled={cart.length === 0}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${cart.length > 0
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                          <CreditCard className="w-5 h-5" />
                          Proceed to Checkout
                          <ChevronRight className="w-5 h-5" />
                        </button>