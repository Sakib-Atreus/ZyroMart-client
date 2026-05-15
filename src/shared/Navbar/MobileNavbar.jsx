import React, { useState, useCallback } from "react";
import { Space, Badge, Dropdown, Drawer } from "antd";
import "./Navbar.css";
import { SettingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { cartApi } from "../../api/endpoints";
import { CgProfile } from "react-icons/cg";

const MobileNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount, syncCartCount } = useCartWishlist();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const res = await cartApi.get();
      const data = res.data ?? {};
      setCartItems(data.items ?? []);
      setCartSubtotal(data.subtotal ?? 0);
      syncCartCount(data.itemCount ?? data.items?.length ?? 0);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user, syncCartCount]);

  const showDrawer = () => {
    setOpen(true);
    fetchCart();
  };

  const onClose = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onMenuClick = ({ key }) => {
    if (key === "logout") handleLogout();
  };

  const profileItems = user
    ? [
        { key: "profile", label: "Profile", icon: <CgProfile /> },
        { key: "settings", label: "Settings", icon: <SettingOutlined /> },
        { type: "divider" },
        { key: "logout", label: <span className="text-primary font-medium">LogOut</span> },
      ]
    : [{ key: "login", label: <Link to="/login">Login</Link> }];
  
  return (
    <div className="sticky bottom-0 z-50">
      <div className="bg-black lg:hidden md:hidden flex w-full mx-auto justify-between p-2 border-t-2 border-gray-500">
        <Link to="/storeLocations" className="btn bg-[#FFE6C71A] text-white hover:bg-primary">
          <FaLocationDot className="text-xl" /> <p>Store Locator</p>
        </Link>
        <Link
          to="/wishlist"
          className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary"
        >
          <Badge count={wishlistCount} style={{ fontSize: 13, height: 17, minWidth: 17, lineHeight: '17px' }}>
            <FaHeart style={{ fontSize: '1.5rem' }} className="text-white" />
          </Badge>
        </Link>
        {/* Cart Drawer */}
        <button
          onClick={showDrawer}
          className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary h-10"
        >
          <Badge count={cartCount} style={{ fontSize: 13, height: 17, minWidth: 17, lineHeight: '17px' }}>
            <ShoppingCartOutlined style={{ fontSize: '1.5rem' }} className="text-white" />
          </Badge>
        </button>
        <Drawer title="My Cart" onClose={onClose} open={open}>
          {cartLoading ? (
            <div className="text-center py-12 text-gray-400">Loading…</div>
          ) : cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product ?? {};
                const variant = item.variant ?? {};
                const variantLabel = variant.options
                  ? Object.values(variant.options).join(" / ")
                  : "";
                return (
                  <div key={variant._id ?? item._id} className="flex items-center gap-3 p-2 bg-white border rounded-lg shadow-sm">
                    <img
                      src={product.thumbnail || variant.images?.[0] || "https://placehold.co/56x56?text=?"}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded flex-shrink-0"
                      onError={(e) => { e.target.src = "https://placehold.co/56x56?text=?"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                      {variantLabel && <p className="text-xs text-gray-500">{variantLabel}</p>}
                      <p className="text-orange-600 font-bold text-sm">৳{variant.price?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
              <div className="border-t pt-3 flex justify-between font-semibold text-sm">
                <span>Subtotal</span>
                <span className="text-orange-600">৳{cartSubtotal?.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {user ? "Your cart is empty." : "Please log in to view your cart."}
              </p>
              {!user && (
                <Link to="/login" onClick={onClose} className="text-orange-600 underline">
                  Log in
                </Link>
              )}
              {user && (
                <Link to="/phones" onClick={onClose} className="text-orange-600 underline">
                  Start shopping
                </Link>
              )}
            </div>
          )}
          <div className="text-center mt-6">
            <Link
              to="/cart"
              onClick={onClose}
              className="btn btn-sm bg-white text-orange-600 border border-orange-600 hover:bg-orange-600 hover:text-white"
            >
              <ShoppingCartOutlined /> View Full Cart
            </Link>
          </div>
        </Drawer>
        {/* Cart Drawer close */}

        {/* Profile dropdown menu */}
        <div className="flex justify-center items-center hover:text-primary">
            {user ? (
              <Dropdown menu={{ items: profileItems, onClick: onMenuClick }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon
                      icon={faUser}
                      className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-primary"
                    />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <Link to="/login">
                <FontAwesomeIcon
                  icon={faUser}
                  className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-primary"
                />
              </Link>
            )}
          </div>


        {/* <Link
          to="/login"
          className="btn bg-[#FFE6C71A] text-white text-xl hover:bg-primary"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link> */}


      </div>
    </div>
  );
};

export default MobileNavbar;
