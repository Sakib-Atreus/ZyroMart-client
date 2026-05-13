import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoIosArrowUp, IoIosArrowDown,
} from "react-icons/io";
import { FaFacebook, FaWhatsapp, FaLink, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FiShoppingCart, FiHeart, FiCheck, FiPackage, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { productApi, cartApi, reviewApi, questionApi, wishlistApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";
import "./PhoneDetails.css";

// ─── Color map for swatches ───────────────────────────────────────────────────
const COLOR_HEX = {
  black: "#1a1a1a", white: "#f5f5f5", blue: "#3b82f6", red: "#ef4444",
  gold: "#d4a853", silver: "#94a3b8", green: "#22c55e", purple: "#a855f7",
  pink: "#ec4899", orange: "#f97316", yellow: "#eab308", grey: "#6b7280",
  gray: "#6b7280", lavender: "#c084fc", cyan: "#06b6d4", teal: "#14b8a6",
  "space gray": "#6b7280", "space black": "#2d2d2d", midnight: "#1c1c2e",
  starlight: "#f5f0e8", "natural titanium": "#c4b5a0", "black titanium": "#374151",
  "blue titanium": "#60a5fa", "white titanium": "#f1f5f9",
  "titanium black": "#2d2d2d", "titanium gray": "#6b7280",
  "titanium violet": "#8b5cf6", "titanium yellow": "#fbbf24",
  obsidian: "#1f2937", bay: "#0ea5e9", porcelain: "#fef9f3",
  beige: "#f5e6d3", graphite: "#374151",
  "twilight blue": "#3730a3", "storm gray": "#4b5563",
  "rose gold": "#f4a7b9", coral: "#ff7f7f",
};

const getSwatchColor = (colorName) => {
  const key = colorName.toLowerCase().trim();
  for (const [k, v] of Object.entries(COLOR_HEX)) {
    if (key === k || key.includes(k)) return v;
  }
  return "#d1d5db";
};

const isLightColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
};

// ─── Star rating ─────────────────────────────────────────────────────────────
const StarRating = ({ value, max = 5, size = "sm" }) => {
  const sz = size === "lg" ? "text-lg" : "text-sm";
  return (
    <span className={`flex gap-0.5 ${sz}`}>
      {Array.from({ length: max }, (_, i) => {
        if (i + 1 <= Math.floor(value)) return <FaStar key={i} className="text-yellow-400" />;
        if (i < value) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
        return <FaRegStar key={i} className="text-gray-300" />;
      })}
    </span>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const money = (n) => `৳${Number(n ?? 0).toLocaleString("en-BD")}`;

const getOptions = (v) => {
  if (!v?.options) return {};
  if (v.options instanceof Map) return Object.fromEntries(v.options);
  return v.options;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhoneDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart, refreshWishlist } = useCartWishlist();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  // gallery
  const [mainImage, setMainImage] = useState("");
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [thumbOffset, setThumbOffset] = useState(0);
  const THUMBS = 5;

  // variant / purchase
  const [selectedOptions, setSelectedOptions] = useState({});
  const [resolvedVariant, setResolvedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [emiMonths, setEmiMonths] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [cartVariantIds, setCartVariantIds] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(false);

  // tabs
  const [activeTab, setActiveTab] = useState("specification");

  // reviews
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // questions
  const [questions, setQuestions] = useState([]);
  const [qForm, setQForm] = useState("");
  const [qLoading, setQLoading] = useState(false);

  // share
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── Load product ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setProduct(null);
    setMainImage("");
    setSelectedOptions({});
    setResolvedVariant(null);
    setSimilar([]);
    setReviews([]);
    setMyReview(null);
    setQuestions([]);
    setInWishlist(false);
    setCartVariantIds(new Set());

    productApi.getBySlug(slug)
      .then((res) => {
        const p = res.data ?? res;
        setProduct(p);
        const v = p.variants ?? [];
        setVariants(v);
        setMainImage(p.thumbnail);

        // pre-select first value per option
        const defaults = {};
        (p.variantOptions ?? []).forEach((opt) => {
          if (opt.values?.length) defaults[opt.key] = opt.values[0];
        });
        setSelectedOptions(defaults);

        // ── Render the page immediately; load secondary data in background ──
        setLoading(false);

        Promise.all([
          productApi.similar(p._id, 6).catch(() => ({ data: [] })),
          reviewApi.listByProduct(p._id).catch(() => ({ data: [] })),
          user ? reviewApi.myReviewForProduct(p._id).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
          questionApi.listByProduct(p._id).catch(() => ({ data: [] })),
          user ? wishlistApi.get().catch(() => null) : Promise.resolve(null),
          user ? cartApi.get().catch(() => null) : Promise.resolve(null),
        ]).then(([sim, rev, myRev, qs, wl, cartData]) => {
          setSimilar(sim.data ?? []);
          setReviews(rev.data?.reviews ?? rev.data ?? []);
          if (myRev?.data) { setMyReview(myRev.data); setReviewForm({ rating: myRev.data.rating, comment: myRev.data.comment }); }
          setQuestions(qs.data ?? []);
          if (wl?.data?.products) {
            setInWishlist(wl.data.products.some((i) => String(i._id ?? i) === String(p._id)));
          }
          if (cartData?.data?.items) {
            setCartVariantIds(new Set(cartData.data.items.map(i => String(i.variant?._id ?? i.variant))));
          }
        });
      })
      .catch(() => {
        toast.error("Product not found");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user]);

  // ─── Resolve variant ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!variants.length) { setResolvedVariant(null); return; }
    if (!product?.hasVariants) { setResolvedVariant(variants[0]); return; }
    const match = variants.find((v) => {
      const opts = getOptions(v);
      return Object.entries(selectedOptions).every(([k, val]) => opts[k] === val);
    });
    setResolvedVariant(match ?? null);
  }, [selectedOptions, variants, product]);

  // ─── Derived values ─────────────────────────────────────────────────────────
  const price = resolvedVariant?.price ?? product?.basePrice ?? 0;
  const comparePrice = resolvedVariant?.compareAtPrice ?? product?.compareAtPrice;
  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const available = resolvedVariant
    ? Math.max(0, (resolvedVariant.stock ?? 0) - (resolvedVariant.reservedStock ?? 0)) : 0;
  const inCart = resolvedVariant ? cartVariantIds.has(String(resolvedVariant._id)) : false;
  const emiOption = product?.emiOptions?.find((o) => o.months === emiMonths);
  const emiMonthly = emiOption
    ? Math.ceil((price * (1 + emiOption.monthlyRate * emiOption.months)) / emiOption.months) : null;

  // All images = thumbnail + product images + current variant images (deduplicated)
  const variantImages = resolvedVariant?.images?.filter(Boolean) ?? [];
  const allImages = [...new Set([
    product?.thumbnail,
    ...(product?.images ?? []),
    ...variantImages,
  ].filter(Boolean))];

  // Specifications grouped by category attribute schema
  const attrDefs = new Map(
    (product?.category?.attributeSchema ?? []).map((d) => [d.key, d])
  );
  const specGroups = {};
  const rawAttrs = product?.attributes ?? {};
  Object.entries(rawAttrs).forEach(([key, value]) => {
    const def = attrDefs.get(key);
    if (!def) return;
    const group = def.group ?? "General";
    if (!specGroups[group]) specGroups[group] = [];
    specGroups[group].push({ key, label: def.label ?? key, value, unit: def.unit ?? "" });
  });
  if (product?.warranty && !rawAttrs.warranty) {
    if (!specGroups["General"]) specGroups["General"] = [];
    specGroups["General"].push({ key: "warranty", label: "Warranty", value: product.warranty, unit: "" });
  }

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleOptionSelect = (key, val) => {
    setSelectedOptions((o) => ({ ...o, [key]: val }));
    // If variant has images, switch to first variant image
    const match = variants.find((v) => {
      const opts = getOptions(v);
      return Object.entries({ ...selectedOptions, [key]: val }).every(([k, value]) => opts[k] === value);
    });
    if (match?.images?.length) setMainImage(match.images[0]);
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    if (inCart) return navigate("/cart");
    if (product?.hasVariants && !resolvedVariant) return toast.error("Please select all options");
    if (available < 1) return toast.error("Out of stock");
    setCartLoading(true);
    try {
      await cartApi.addItem({ product: product._id, variant: resolvedVariant._id, quantity: qty });
      setCartVariantIds(prev => new Set([...prev, String(resolvedVariant._id)]));
      toast.success("Added to cart!");
      refreshCart();
    } catch (err) {
      toast.error(err.message || "Could not add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) return navigate("/login");
    if (product?.hasVariants && !resolvedVariant) return toast.error("Please select all options");
    if (available < 1) return toast.error("Out of stock");
    if (inCart) return navigate("/checkout");
    setCartLoading(true);
    try {
      await cartApi.addItem({ product: product._id, variant: resolvedVariant._id, quantity: qty });
      setCartVariantIds(prev => new Set([...prev, String(resolvedVariant._id)]));
      refreshCart();
      navigate("/checkout");
    } catch (err) {
      toast.error(err.message || "Could not add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) return navigate("/login");
    try {
      if (inWishlist) {
        await wishlistApi.remove(product._id);
        setInWishlist(false);
        toast.info("Removed from wishlist");
      } else {
        await wishlistApi.add(product._id);
        setInWishlist(true);
        toast.success("Added to wishlist!");
      }
      refreshWishlist();
    } catch (err) {
      toast.error(err.message || "Wishlist error");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setReviewLoading(true);
    try {
      if (myReview) {
        const res = await reviewApi.update(myReview._id, reviewForm);
        setMyReview(res.data);
        setReviews((prev) => prev.map((r) => (r._id === myReview._id ? res.data : r)));
      } else {
        const res = await reviewApi.create({ product: product._id, ...reviewForm });
        setMyReview(res.data);
        setReviews((prev) => [res.data, ...prev]);
      }
      toast.success("Review saved!");
      setShowReviewForm(false);
    } catch (err) {
      toast.error(err.message || "Could not save review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!qForm.trim()) return;
    setQLoading(true);
    try {
      const res = await questionApi.create({ product: product._id, question: qForm });
      setQuestions((prev) => [res.data, ...prev]);
      setQForm("");
      toast.success("Question submitted!");
    } catch (err) {
      toast.error(err.message || "Could not submit question");
    } finally {
      setQLoading(false);
    }
  };

  // ─── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-96 bg-gray-100 rounded-xl" />
          <div className="lg:col-span-4 space-y-4">
            {[100, 80, 60, 40, 60, 40].map((w, i) => (
              <div key={i} className={`h-5 bg-gray-100 rounded`} style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="lg:col-span-3 h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
        <Link to="/" className="text-primary underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        {product.category?.name && (
          <>
            <span className="text-gray-300">›</span>
            <Link to={`/phones?category=${product.category._id}`} className="hover:text-primary transition-colors capitalize">{product.category.name}</Link>
          </>
        )}
        {product.brand && (
          <>
            <span className="text-gray-300">›</span>
            <Link to={`/phones?brand=${product.brand}`} className="hover:text-primary transition-colors">{product.brand}</Link>
          </>
        )}
        <span className="text-gray-300">›</span>
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* ── TOP SECTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 mb-8 sm:mb-10">

        {/* ── Image Gallery ── */}
        <div className="md:col-span-1 lg:col-span-5">
          <div className="flex gap-3">
            {/* Vertical thumbnails — tablet/desktop only */}
            <div className="hidden md:flex flex-col gap-2 items-center">
              <button
                onClick={() => setThumbOffset((o) => Math.max(0, o - 1))}
                disabled={thumbOffset === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-25 transition"
              >
                <IoIosArrowUp size={16} />
              </button>
              {allImages.slice(thumbOffset, thumbOffset + THUMBS).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                    mainImage === img
                      ? "border-primary shadow-md ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1.5 bg-white" />
                </button>
              ))}
              <button
                onClick={() => setThumbOffset((o) => Math.min(allImages.length - THUMBS, o + 1))}
                disabled={thumbOffset >= allImages.length - THUMBS}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-25 transition"
              >
                <IoIosArrowDown size={16} />
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative">
              <div
                className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden cursor-crosshair shadow-sm"
                style={{ paddingBottom: "100%" }}
                onMouseEnter={() => setZoomImage(mainImage)}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  setZoomPos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
                }}
                onMouseLeave={() => setZoomImage(null)}
              >
                <img src={mainImage} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-6" />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    -{discount}%
                  </span>
                )}
                {product.isOnlineExclusive && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    Online Only
                  </span>
                )}
              </div>
              {zoomImage && (
                <div className="absolute left-full top-0 ml-4 w-80 h-80 border-2 border-primary rounded-2xl overflow-hidden z-30 shadow-2xl bg-white hidden lg:block">
                  <img
                    src={zoomImage}
                    className="w-full h-full object-contain"
                    style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(2.5)" }}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile thumbnail strip */}
          <div className="flex gap-2 mt-3 overflow-x-auto md:hidden pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${mainImage === img ? "border-primary shadow-sm" : "border-gray-200"}`}
              >
                <img src={img} alt="" className="w-full h-full object-contain p-1.5 bg-white" />
              </button>
            ))}
          </div>

          {/* Share row */}
          <div className="mt-4 flex items-center gap-4">
            <button onClick={() => setShowShare(!showShare)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors font-medium">
              <TiArrowForwardOutline size={17} /> Share
            </button>
            {showShare && (
              <div className="flex items-center gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                  <FaFacebook size={20} />
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(product.name + " " + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:scale-110 transition-transform">
                  <FaWhatsapp size={20} />
                </a>
                <button onClick={handleCopyLink} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${copied ? "text-green-600 border-green-300 bg-green-50" : "text-gray-500 border-gray-200 hover:border-primary hover:text-primary"}`}>
                  {copied ? <FiCheck size={13} /> : <FaLink size={13} />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="md:col-span-1 lg:col-span-4 space-y-5">
          {/* Brand badge + name */}
          <div>
            <Link to={`/phones?brand=${product.brand}`} className="inline-flex items-center bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 hover:bg-primary/20 transition">
              {product.brand}
            </Link>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StarRating value={product.averageRating} />
                <span className="text-sm font-bold text-gray-700">{product.averageRating.toFixed(1)}</span>
                <button onClick={() => setActiveTab("reviews")} className="text-sm text-primary hover:underline">
                  ({reviews.length} reviews)
                </button>
                {product.totalSold > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-400">{product.totalSold.toLocaleString()}+ sold</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Price block */}
          <div className="bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-xl font-bold text-primary tracking-tight">{money(price)}</span>
              {comparePrice && comparePrice > price && (
                <span className="text-sm text-gray-400 line-through">{money(comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
            {emiMonthly && (
              <p className="text-xs text-gray-500 mt-1">
                or <span className="font-bold text-primary">{money(emiMonthly)}/mo</span>
                <span className="ml-1">for {emiMonths} months</span>
              </p>
            )}
          </div>

          {/* EMI options */}
          {(product.emiOptions ?? []).length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">💳 EMI Options</p>
              <div className="flex flex-wrap gap-1.5">
                {product.emiOptions.map((opt) => (
                  <button
                    key={opt.months}
                    onClick={() => setEmiMonths(emiMonths === opt.months ? null : opt.months)}
                    className={`text-xs px-2.5 py-1 border rounded-full font-semibold transition-all ${
                      emiMonths === opt.months ? "border-primary bg-primary text-white shadow-sm" : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {opt.months} months
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variant Options */}
          {(product.variantOptions ?? []).map((opt) => {
            const isColor = opt.key.toLowerCase() === "color";
            return (
              <div key={opt.key}>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  {opt.label}: <span className="text-primary">{selectedOptions[opt.key]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const testOptions = { ...selectedOptions, [opt.key]: val };
                    const matchingVariants = variants.filter((v) => {
                      const vOpts = getOptions(v);
                      return Object.entries(testOptions).every(([k, value]) => vOpts[k] === value);
                    });
                    const hasStock = matchingVariants.some((v) => (v.stock ?? 0) - (v.reservedStock ?? 0) > 0);
                    const isSelected = selectedOptions[opt.key] === val;
                    if (isColor) {
                      const hex = getSwatchColor(val);
                      const light = isLightColor(hex);
                      return (
                        <button
                          key={val} title={val}
                          onClick={() => handleOptionSelect(opt.key, val)}
                          className={`relative w-9 h-9 rounded-full border-2 transition-all ${isSelected ? "border-primary scale-110 shadow-lg ring-2 ring-primary/20" : "border-transparent hover:scale-105 hover:shadow-md"} ${!hasStock ? "opacity-40" : ""}`}
                          style={{ background: hex }}
                        >
                          {isSelected && <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${light ? "text-gray-800" : "text-white"}`}>✓</span>}
                          {!hasStock && <span className="absolute inset-0 flex items-center justify-center"><span className="block w-full h-px bg-gray-400 rotate-45 absolute" /></span>}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(opt.key, val)}
                        className={`px-3.5 py-1.5 text-xs border rounded-lg font-semibold transition-all ${isSelected ? "border-primary bg-primary text-white shadow-sm" : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"} ${!hasStock ? "opacity-40 line-through" : ""}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Stock status */}
          {resolvedVariant ? (
            <div className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${available > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {available > 0 ? <><FiCheck size={14} /> In Stock{available <= 10 && <span className="font-normal ml-1">— Only {available} left!</span>}</> : "Out of Stock"}
            </div>
          ) : product.hasVariants ? (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full inline-block">Select options to check availability</p>
          ) : null}

          {/* Qty + CTA */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-semibold">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-xl font-bold border-r border-gray-300 transition">−</button>
                <span className="w-12 text-center font-bold text-gray-800">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(available || 99, q + 1))} disabled={qty >= available && available > 0} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-xl font-bold border-l border-gray-300 disabled:opacity-30 transition">+</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || (!inCart && available < 1)}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm ${inCart ? "bg-green-500 text-white border-2 border-green-500 hover:bg-green-600 shadow-md shadow-green-500/25" : "bg-white text-primary border-2 border-primary hover:bg-orange-50"}`}
              >
                <FiShoppingCart size={18} />
                {inCart ? "In Cart — View" : (cartLoading ? "Adding…" : "Add to Cart")}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={cartLoading || available < 1}
                className="flex-1 flex items-center justify-center bg-primary text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md shadow-primary/25"
              >
                Buy Now
              </button>
            </div>
            <button
              onClick={handleWishlist}
              className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 border-2 rounded-xl font-semibold transition-all ${inWishlist ? "border-red-400 text-red-500 bg-red-50 hover:bg-red-100" : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400 hover:bg-red-50"}`}
            >
              <FiHeart size={16} className={inWishlist ? "fill-red-400" : ""} />
              {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
            </div>
          )}

          {/* Warranty badge */}
          {product.warranty && (
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <FiShield size={15} className="text-green-600 flex-shrink-0" />
              <span className="font-medium">{product.warranty}</span>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Delivery info card */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-800">Delivery & Services</p>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              {[
                { icon: FiTruck, label: "Standard Delivery", sub: "3–5 business days · FREE over ৳3000" },
                { icon: FiPackage, label: "Express Delivery", sub: "1–2 business days · ৳150" },
                { icon: FiRefreshCw, label: "7-Day Returns", sub: "Hassle-free return policy" },
                { icon: FiShield, label: "Official Warranty", sub: product.warranty || "Manufacturer warranty included" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex gap-3 px-4 py-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller card */}
          {product.vendor && (
            <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sold by</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-lg flex-shrink-0">
                  {(product.vendor.shopName ?? "V").charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{product.vendor.shopName}</p>
                  {product.vendor.rating > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating value={product.vendor.rating} />
                      <span className="text-xs text-gray-500 font-medium">{product.vendor.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key specs quick-view */}
          {Object.entries(specGroups).slice(0, 1).map(([group, specs]) => (
            <div key={group} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{group}</p>
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {specs.slice(0, 5).map(({ label, value, unit }, idx) => (
                  <div key={label} className={`flex justify-between px-4 py-2.5 text-xs ${idx % 2 === 1 ? "bg-gray-50/60" : ""}`}>
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="text-gray-800 font-semibold text-right max-w-[55%] leading-snug">
                      {String(value)}{unit ? ` ${unit}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>{/* end inner sidebar grid */}
        </div>
      </div>

      {/* ── TABS SECTION ── */}
      <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-3 min-w-0 overflow-hidden">
          {/* Tab nav — pill style */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
            {[
              { key: "specification", label: "Spec" },
              { key: "description", label: "Description" },
              { key: "reviews", label: `Reviews (${reviews.length})` },
              { key: "questions", label: `Q&A (${questions.length})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 min-w-max px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeTab === t.key ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Specification tab ── */}
          {activeTab === "specification" && (
            <div className="space-y-5">
              {Object.keys(specGroups).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">No specifications available.</p>
              ) : (
                Object.entries(specGroups).map(([group, specs]) => (
                  <div key={group} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200">
                      <h3 className="text-sm font-bold text-gray-700">{group}</h3>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white">
                      {specs.map(({ key, label, value, unit }, idx) => (
                        <div key={key} className={`flex flex-col sm:grid sm:grid-cols-5 px-4 sm:px-5 py-3 gap-0.5 sm:gap-0 ${idx % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                          <span className="sm:col-span-2 text-gray-500 font-medium text-xs sm:text-sm">{label}</span>
                          <span className="sm:col-span-3 text-gray-800 font-medium text-xs sm:text-sm break-words min-w-0">{String(value)}{unit ? ` ${unit}` : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Description tab ── */}
          {activeTab === "description" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                {product.description
                  ? product.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm leading-7 text-gray-600">{para}</p>
                    ))
                  : <p className="text-sm text-gray-400">No description available.</p>}
              </div>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-gray-100">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Reviews tab ── */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="text-center flex-shrink-0">
                      <div className="text-6xl font-extrabold text-primary tracking-tight">{product.averageRating.toFixed(1)}</div>
                      <StarRating value={product.averageRating} size="lg" />
                      <p className="text-xs text-gray-400 mt-1.5">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2 justify-center flex flex-col">
                      {ratingBreakdown.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2.5 text-xs">
                          <span className="text-gray-600 font-medium w-3">{star}</span>
                          <FaStar size={11} className="text-yellow-400 flex-shrink-0" />
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                          </div>
                          <span className="text-gray-400 w-5 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!user ? (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-sm text-gray-600">Want to share your experience?</span>
                  <Link to="/login" className="text-sm font-semibold text-primary border border-primary px-4 py-1.5 rounded-lg hover:bg-orange-100 transition">
                    Login to Write a Review
                  </Link>
                </div>
              ) : (
                <div>
                  {!showReviewForm ? (
                    <button onClick={() => setShowReviewForm(true)} className="text-sm text-primary font-bold border-2 border-primary px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all">
                      {myReview ? "Edit your review" : "Write a Review"}
                    </button>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-gray-800 text-base">{myReview ? "Update Review" : "Write a Review"}</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Your Rating</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s }))} className="text-3xl transition-transform hover:scale-125">
                                {s <= reviewForm.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                          placeholder="Share your experience with this product…"
                          className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary transition bg-gray-50"
                          rows={4} required
                        />
                        <div className="flex gap-3">
                          <button type="submit" disabled={reviewLoading} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60 shadow-sm">
                            {reviewLoading ? "Saving…" : "Submit Review"}
                          </button>
                          <button type="button" onClick={() => setShowReviewForm(false)} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">{user ? "No reviews yet. Be the first!" : "No reviews yet."}</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0">
                            {(r.user?.name ?? "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{r.user?.name ?? "Anonymous"}</p>
                            <p className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : ""}</p>
                          </div>
                        </div>
                        <StarRating value={r.rating} />
                      </div>
                      {r.comment && <p className="text-sm text-gray-600 leading-relaxed mt-3">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Q&A tab ── */}
          {activeTab === "questions" && (
            <div className="space-y-5">
              {user ? (
                <form onSubmit={handleAskQuestion} className="flex gap-3">
                  <input
                    value={qForm}
                    onChange={(e) => setQForm(e.target.value)}
                    placeholder="Ask a question about this product…"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition bg-white shadow-sm"
                  />
                  <button type="submit" disabled={qLoading || !qForm.trim()} className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-60 transition shadow-sm">
                    {qLoading ? "…" : "Ask"}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-sm text-gray-600">Have a question about this product?</span>
                  <Link to="/login" className="text-sm font-semibold text-primary border border-primary px-4 py-1.5 rounded-lg hover:bg-orange-100 transition">
                    Login to Ask a Question
                  </Link>
                </div>
              )}

              {questions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">{user ? "No questions yet. Ask away!" : "No questions yet."}</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex gap-3 items-start">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-white text-xs font-extrabold flex-shrink-0 mt-0.5">Q</span>
                        <p className="text-sm font-semibold text-gray-800 pt-0.5">{q.question}</p>
                      </div>
                      {q.answer && (
                        <div className="flex gap-3 items-start ml-2 pl-3 border-l-2 border-green-300">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-green-100 text-green-700 text-xs font-extrabold flex-shrink-0 mt-0.5">A</span>
                          <p className="text-sm text-gray-600 pt-0.5">{q.answer}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 ml-10">
                        {q.user?.name ?? "User"} · {q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Similar Products ── */}
        <div className="lg:col-span-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full inline-block" />
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {similar.length === 0 ? (
              <p className="text-xs text-gray-400">No related products</p>
            ) : (
              similar.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p.slug}`}
                  className="flex gap-2 items-center p-2.5 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group overflow-hidden"
                >
                  <img src={p.thumbnail} alt={p.name} className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-primary transition line-clamp-2 leading-snug">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">{money(p.basePrice)}</p>
                    {p.averageRating > 0 && (
                      <StarRating value={p.averageRating} />
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
