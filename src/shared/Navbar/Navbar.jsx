import { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { Input, Avatar, Badge, Dropdown, Space } from "antd";
import "./Navbar.css";
import { ShoppingCartOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaPhoneAlt, FaHeart, FaChevronDown } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { Button, Drawer } from "antd";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";
import { categoryApi, cartApi } from "../../api/endpoints";

const { Search } = Input;

// ─── Sub-menu config (brand filters per category slug) ────────────────────────
const BRAND_SHORTCUTS = {
  phones: [
    { label: "iPhone", brand: "Apple" },
    { label: "Samsung", brand: "Samsung" },
    { label: "Xiaomi", brand: "Xiaomi" },
    { label: "Oppo", brand: "Oppo" },
    { label: "Realme", brand: "Realme" },
    { label: "OnePlus", brand: "OnePlus" },
    { label: "Vivo", brand: "Vivo" },
    { label: "Nokia", brand: "Nokia" },
    { label: "Google Pixel", brand: "Google" },
    { label: "Huawei", brand: "Huawei" },
    { label: "Nothing", brand: "Nothing" },
    { label: "Tecno", brand: "Tecno" },
  ],
  mac: [
    { label: "MacBook Air", brand: "Apple" },
    { label: "MacBook Pro", brand: "Apple" },
  ],
  tablets: [
    { label: "iPad", brand: "Apple" },
    { label: "Samsung Tab", brand: "Samsung" },
    { label: "Xiaomi Pad", brand: "Xiaomi" },
    { label: "Huawei MatePad", brand: "Huawei" },
  ],
  camera: [
    { label: "DJI", brand: "DJI" },
    { label: "GoPro", brand: "GoPro" },
    { label: "Insta360", brand: "Insta360" },
    { label: "Sony", brand: "Sony" },
    { label: "Canon", brand: "Canon" },
    { label: "Nikon", brand: "Nikon" },
  ],
  drone: [
    { label: "DJI Mini", brand: "DJI" },
    { label: "DJI Neo", brand: "DJI" },
    { label: "DJI Flip", brand: "DJI" },
  ],
  gaming: [
    { label: "Logitech", brand: "Logitech" },
    { label: "Razer", brand: "Razer" },
    { label: "Corsair", brand: "Corsair" },
    { label: "SteelSeries", brand: "SteelSeries" },
  ],
  watches: [
    { label: "Apple Watch", brand: "Apple" },
    { label: "Samsung Watch", brand: "Samsung" },
    { label: "Xiaomi Watch", brand: "Xiaomi" },
    { label: "Garmin", brand: "Garmin" },
    { label: "Huawei Watch", brand: "Huawei" },
  ],
  "headphone-speaker": [
    { label: "AirPods", brand: "Apple" },
    { label: "Galaxy Buds", brand: "Samsung" },
    { label: "Sony", brand: "Sony" },
    { label: "JBL", brand: "JBL" },
    { label: "Bose", brand: "Bose" },
    { label: "Marshall", brand: "Marshall" },
  ],
  "pc-accessories": [
    { label: "Apple", brand: "Apple" },
    { label: "Logitech", brand: "Logitech" },
    { label: "Razer", brand: "Razer" },
  ],
  networking: [
    { label: "TP-Link", brand: "TP-Link" },
    { label: "Asus", brand: "Asus" },
    { label: "Netgear", brand: "Netgear" },
  ],
  "phone-accessories": [
    { label: "Belkin", brand: "Belkin" },
    { label: "Skross", brand: "Skross" },
    { label: "Anker", brand: "Anker" },
  ],
};

// ─── Mega Menu Dropdown ───────────────────────────────────────────────────────
const MegaMenu = ({ category, subCats, onClose }) => {
  const navigate = useNavigate();
  const brands = BRAND_SHORTCUTS[category.slug] || [];
  const hasContent = subCats.length > 0 || brands.length > 0;

  if (!hasContent) return null;

  const goTo = (url) => { navigate(url); onClose(); };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 min-w-[280px] max-w-[500px]">
      <div className="mb-3 pb-2 border-b border-gray-100">
        <button
          onClick={() => goTo(`/phones?category=${category._id}`)}
          className="text-base font-bold text-gray-800 hover:text-orange-600 transition-colors"
        >
          All {category.name} →
        </button>
      </div>

      {/* Sub-categories from DB */}
      {subCats.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Categories</p>
          <div className="grid grid-cols-2 gap-1">
            {subCats.map((sub) => (
              <button
                key={sub._id}
                onClick={() => goTo(`/phones?category=${sub._id}`)}
                className="text-left text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded px-2 py-1.5 transition-colors"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand shortcuts */}
      {brands.length > 0 && (
        <div>
          {subCats.length > 0 && <div className="border-t border-gray-100 my-3" />}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Brands</p>
          <div className="grid grid-cols-2 gap-1">
            {brands.map((b) => (
              <button
                key={b.brand}
                onClick={() => goTo(`/phones?category=${category._id}&brand=${encodeURIComponent(b.brand)}`)}
                className="text-left text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded px-2 py-1.5 transition-colors"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Category Nav Item ────────────────────────────────────────────────────────
const CategoryItem = ({ category, subCats }) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const hasSub = subCats.length > 0 || (BRAND_SHORTCUTS[category.slug] || []).length > 0;
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom, left: rect.left });
    }
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={buttonRef}
        onClick={() => navigate(`/phones?category=${category._id}`)}
        className="flex items-center gap-1 px-3 py-2 text-white text-sm font-medium hover:text-orange-400 transition-colors whitespace-nowrap"
      >
        {category.name}
        {hasSub && <FaChevronDown className="text-xs opacity-60" />}
      </button>

      {hasSub && open && ReactDOM.createPortal(
        <div
          style={{ position: "fixed", top: dropPos.top, left: dropPos.left, zIndex: 9999, paddingTop: 4 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MegaMenu
            category={category}
            subCats={subCats}
            onClose={() => setOpen(false)}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount, syncCartCount } = useCartWishlist();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [childMap, setChildMap] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const openCart = () => {
    setCartOpen(true);
    fetchCart();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const onMenuClick = ({ key }) => {
    const routes = {
      profile: "/profile?tab=profile",
      orders: "/profile?tab=orders",
      password: "/profile?tab=password",
      vendor: "/profile?tab=vendor",
      vendorDashboard: "/vendor",
      admin: "/admin",
    };
    if (key === "logout") { handleLogout(); return; }
    if (routes[key]) navigate(routes[key]);
  };

  // Fetch all categories and build parent → children map
  useEffect(() => {
    categoryApi.list().then((res) => {
      const all = res.data ?? res ?? [];
      const parents = all.filter((c) => !c.parent);
      const map = {};
      all.forEach((c) => {
        if (c.parent) {
          const pid = c.parent._id?.toString() || c.parent?.toString();
          if (!map[pid]) map[pid] = [];
          map[pid].push(c);
        }
      });
      setCategories(parents);
      setChildMap(map);
    }).catch(() => {});
  }, []);

  const handleSearch = (value) => {
    if (value.trim()) navigate(`/phones?searchTerm=${encodeURIComponent(value.trim())}`);
    setSearchValue("");
  };

  const profileItems = user
    ? [
        {
          key: "greeting",
          label: (
            <div className="py-1">
              <div className="text-xs text-gray-500">Signed in as</div>
              <div className="font-medium truncate max-w-[180px]">{user.name || user.email}</div>
            </div>
          ),
          disabled: true,
        },
        { type: "divider" },
        { key: "profile", label: "My Profile", icon: <CgProfile /> },
        { key: "orders", label: "My Orders", icon: <ShoppingCartOutlined /> },
        ...(user.role === "vendor"
          ? [{ key: "vendorDashboard", label: <span className="font-medium text-purple-600">Seller Dashboard</span>, icon: <SettingOutlined /> }]
          : [{ key: "vendor", label: "Become a Vendor", icon: <SettingOutlined /> }]),
        { key: "password", label: "Change Password", icon: <SettingOutlined /> },
        ...(user.role === "admin"
          ? [{ type: "divider" }, { key: "admin", label: "Admin Dashboard", icon: <SettingOutlined /> }]
          : []),
        { type: "divider" },
        { key: "logout", label: <span className="text-orange-600 font-medium">LogOut</span> },
      ]
    : [{ key: "login", label: <Link to="/login">Login</Link> }];

  return (
    <nav className="bg-[#191A20] sticky top-0 z-50">
      {/* ─── Top bar ─────────────────────────────────────────── */}
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost lg:hidden md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <Link to="/" className="lg:text-3xl md:text-3xl text-2xl font-bold ps-2 text-white">
            Zyro<span className="text-orange-500">Mart</span>
          </Link>
        </div>

        {/* Search — desktop */}
        <div className="navbar-center hidden lg:flex md:flex justify-center lg:w-[50%] md:w-[30%] lg:-ms-8 md:me-20">
          <Search
            className="custom-search"
            placeholder="Search products..."
            allowClear
            enterButton="Search"
            size="medium"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        {/* Right actions */}
        <div className="navbar-end lg:flex md:flex gap-4 hidden">
          <Link to="/storeLocations" className="btn btn-sm bg-[#FFE6C71A] text-white hover:bg-orange-600 h-10">
            <FaLocationDot className="text-xl" /> <p>Store Locator</p>
          </Link>
          <Link to="/wishlist" className="btn btn-sm bg-[#FFE6C71A] text-white text-2xl hover:bg-orange-600 h-10">
            <Badge count={wishlistCount} style={{ fontSize: 13, height: 17, minWidth: 17, lineHeight: '17px' }}>
              <FaHeart style={{ fontSize: '1.5rem' }} className="text-white" />
            </Badge>
          </Link>

          {/* Cart Drawer */}
          <button onClick={openCart} className="btn btn-sm bg-[#FFE6C71A] text-white text-2xl hover:bg-orange-600 h-10">
            <Badge count={cartCount} style={{ fontSize: 13, height: 17, minWidth: 17, lineHeight: '17px' }}>
              <ShoppingCartOutlined style={{ fontSize: '1.5rem' }} className="text-white" />
            </Badge>
          </button>
          <Drawer title="My Cart" onClose={() => setCartOpen(false)} open={cartOpen}>
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
                    <div key={variant._id ?? item._id} className="flex items-center justify-between p-2 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail || variant.images?.[0] || "https://placehold.co/56x56?text=?"}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded"
                          onError={(e) => { e.target.src = "https://placehold.co/56x56?text=?"; }}
                        />
                        <div>
                          <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                          {variantLabel && <p className="text-xs text-gray-500">{variantLabel}</p>}
                          <p className="text-orange-600 font-bold text-sm">৳{variant.price?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
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
                <p className="text-gray-500 mb-4">{user ? "Your cart is empty." : "Please log in to view your cart."}</p>
                {!user && (
                  <Link to="/login" onClick={() => setCartOpen(false)} className="text-orange-600 underline">
                    Log in
                  </Link>
                )}
                {user && (
                  <Link to="/phones" onClick={() => setCartOpen(false)} className="text-orange-600 underline">
                    Start shopping
                  </Link>
                )}
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn btn-sm bg-white text-orange-600 border border-orange-600 hover:bg-orange-600 hover:text-white">
                <ShoppingCartOutlined /> View Full Cart
              </Link>
            </div>
          </Drawer>

          {/* Mobile menu Drawer */}
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            width={280}
          >
            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 mb-5 pb-4 border-b">
                <FontAwesomeIcon icon={faUser} className="bg-gray-100 px-3 py-2 rounded-lg h-5 text-gray-600" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Cart + Wishlist quick actions */}
            <div className="flex gap-2 mb-5">
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm font-medium"
              >
                <FaHeart className="text-red-400" /> Wishlist
                {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{wishlistCount}</span>}
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); openCart(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm font-medium"
              >
                <ShoppingCartOutlined /> Cart
                {cartCount > 0 && <span className="bg-orange-500 text-white text-xs rounded-full px-1.5">{cartCount}</span>}
              </button>
            </div>

            {/* Categories */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Categories</p>
            <div className="space-y-0.5 mb-5">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/phones?category=${cat._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Other links */}
            <div className="border-t pt-4 space-y-0.5 mb-4">
              <Link
                to="/storeLocations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FaLocationDot className="text-orange-500" /> Store Locator
              </Link>
              <a
                href="tel:09727070118"
                className="flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FaPhoneAlt className="text-orange-500" /> 09727-070118
              </a>
            </div>

            {/* Profile / Auth */}
            <div className="border-t pt-4 space-y-0.5">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <CgProfile /> My Profile
                  </Link>
                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <ShoppingCartOutlined /> My Orders
                  </Link>
                  {user.role === "vendor" && (
                    <Link
                      to="/vendor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
                    >
                      <SettingOutlined /> Seller Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                    >
                      <SettingOutlined /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 py-2 px-3 text-orange-600 hover:bg-orange-50 rounded-lg font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-orange-600 font-semibold hover:bg-orange-50 rounded-lg"
                >
                  <FontAwesomeIcon icon={faUser} /> Login / Register
                </Link>
              )}
            </div>
          </Drawer>

          {/* Profile */}
          <div className="flex justify-center items-center">
            {user ? (
              <Dropdown menu={{ items: profileItems, onClick: onMenuClick }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon icon={faUser} className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-orange-600" />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <Link to="/login">
                <FontAwesomeIcon icon={faUser} className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-orange-600" />
              </Link>
            )}
          </div>
        </div>

        {/* Search — mobile */}
        <Search
          className="lg:hidden md:hidden flex w-full px-4 py-2 custom-search"
          placeholder="Search"
          allowClear
          enterButton
          size="medium"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ width: "100%" }}
        />
      </div>

      {/* ─── Category bar ────────────────────────────────────── */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto hidden lg:flex items-center px-4">
          <div className="flex items-center flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center mx-auto">
              {categories.map((cat) => (
                <CategoryItem
                  key={cat._id}
                  category={cat}
                  subCats={childMap[cat._id?.toString()] || []}
                />
              ))}
            </div>
          </div>

          {/* Online Exclusive badge — fixed right */}
          <div className="flex-shrink-0 ml-4">
            <Link
              to="/phones?isOnlineExclusive=true"
              className="text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent whitespace-nowrap"
            >
              🔥 Online Exclusive
            </Link>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-white ml-6 whitespace-nowrap">
            <FaPhoneAlt />
            <a href="tel:09727070118" className="hover:text-orange-400">09727-070118</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
