import { useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useCartWishlist } from "../../context/CartWishlistContext";

const Cart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const { syncCartCount } = useCartWishlist();

  const applyCart = (data) => {
    setCart(data ?? { items: [], subtotal: 0, itemCount: 0 });
    syncCartCount(data?.itemCount ?? data?.items?.length ?? 0);
  };

  const fetchCart = async () => {
    try {
      const res = await cartApi.get();
      applyCart(res.data);
    } catch {
      applyCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleQuantityChange = async (variantId, operator, currentQty) => {
    const newQty = operator === "increase" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return;
    try {
      const res = await cartApi.updateItem(variantId, { quantity: newQty });
      applyCart(res.data);
    } catch (err) {
      toast.error(err.message || "Could not update quantity");
    }
  };

  const handleRemove = async (variantId) => {
    try {
      const res = await cartApi.removeItem(variantId);
      applyCart(res.data);
    } catch (err) {
      toast.error(err.message || "Could not remove item");
    }
  };

  const handleClear = async () => {
    try {
      const res = await cartApi.clear();
      applyCart(res.data);
    } catch (err) {
      toast.error(err.message || "Could not clear cart");
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading cart…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Link to="/" className="btn bg-primary text-white px-6 py-2 rounded-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="space-y-6 col-span-2">
            {cart.items.map((item) => {
              const product = item.product;
              const variant = item.variant;
              const variantLabel = variant?.options
                ? Object.values(variant.options).join(" / ")
                : "";

              return (
                <div
                  key={variant?._id ?? item._id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product?.thumbnail || variant?.images?.[0] || ""}
                      alt={product?.name}
                      className="w-20 h-20 object-cover rounded-md shadow-sm"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                        {product?.name}
                      </h3>
                      {variantLabel && (
                        <p className="text-sm text-gray-500">{variantLabel}</p>
                      )}
                      <p className="text-lg font-semibold text-primary">
                        ৳{variant?.price?.toLocaleString()}
                      </p>
                      {item.availableStock < 5 && (
                        <p className="text-xs text-red-500">
                          Only {item.availableStock} left!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(variant._id, "decrease", item.quantity)}
                      className="text-2xl hover:text-primary"
                    >
                      <FaCircleMinus />
                    </button>
                    <span className="w-8 text-center text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(variant._id, "increase", item.quantity)}
                      className="text-2xl hover:text-primary"
                      disabled={item.quantity >= item.availableStock}
                    >
                      <FaCirclePlus />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-700 hidden md:block">
                      ৳{item.lineTotal?.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(variant._id)}
                      className="text-red-500 text-xl hover:text-red-700"
                    >
                      <RiDeleteBin5Line />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:underline"
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white border rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-primary pb-4 opacity-80">
              Order Summary
            </h2>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Subtotal ({cart.itemCount} items):</span>
              <span className="font-semibold text-gray-800">
                ৳{cart.subtotal?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-6 text-sm text-gray-500">
              <span>Shipping fee:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-6 font-bold text-xl border-t pt-4">
              <span>Total:</span>
              <span className="text-primary">৳{cart.subtotal?.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center py-3 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="block w-full text-center py-2 mt-3 text-primary text-sm hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
