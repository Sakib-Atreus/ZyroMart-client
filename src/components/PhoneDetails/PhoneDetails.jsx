import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoIosArrowUp, IoIosArrowDown, IoIosArrowBack, IoIosArrowForward,
} from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaStar, FaRegStar } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FiThumbsUp } from "react-icons/fi";
import { CiCircleQuestion } from "react-icons/ci";
import { productApi, cartApi, reviewApi, questionApi, wishlistApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import SocialShare from "../../utils/SocialShare";
import "./PhoneDetails.css";

const StarRating = ({ value, max = 5 }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: max }, (_, i) =>
      i < Math.round(value)
        ? <FaStar key={i} className="text-yellow-400 text-sm" />
        : <FaRegStar key={i} className="text-gray-300 text-sm" />
    )}
  </span>
);

const money = (n) => `৳${Number(n ?? 0).toLocaleString()}`;

export default function PhoneDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  // image gallery
  const [mainImage, setMainImage] = useState("");
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [thumbOffset, setThumbOffset] = useState(0);
  const thumbsToShow = 4;

  // variant / purchase
  const [selectedOptions, setSelectedOptions] = useState({});
  const [resolvedVariant, setResolvedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [emiMonths, setEmiMonths] = useState(null);
  const [isGift, setIsGift] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // tabs
  const [activeTab, setActiveTab] = useState("specification");

  // reviews
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // questions
  const [questions, setQuestions] = useState([]);
  const [qForm, setQForm] = useState("");
  const [qLoading, setQLoading] = useState(false);

  // ── Load product ──────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productApi.getBySlug(slug)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        setVariants(p.variants ?? []);
        setMainImage(p.thumbnail);
        // pre-select first value for each variant option
        const defaults = {};
        (p.variantOptions ?? []).forEach((opt) => {
          if (opt.values?.length) defaults[opt.key] = opt.values[0];
        });
        setSelectedOptions(defaults);
        return Promise.all([
          productApi.similar(p._id, 8).catch(() => ({ data: [] })),
          reviewApi.listByProduct(p._id).catch(() => ({ data: [], meta: {} })),
          user
            ? reviewApi.myReviewForProduct(p._id).catch(() => ({ data: null }))
            : Promise.resolve({ data: null }),
          questionApi.listByProduct(p._id).catch(() => ({ data: [] })),
        ]);
      })
      .then(([sim, rev, myRev, qs]) => {
        setSimilar(sim.data ?? []);
        setReviews(rev.data ?? []);
        setReviewSummary(rev.meta ?? null);
        setMyReview(myRev.data ?? null);
        setQuestions(qs.data ?? []);
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug, user]);

  // ── Resolve variant from selected options ─────────────────────────
  useEffect(() => {
    if (!variants.length || !product?.hasVariants) {
      setResolvedVariant(variants[0] ?? null);
      return;
    }
    const match = variants.find((v) =>
      Object.entries(selectedOptions).every(
        ([k, val]) => v.options?.[k] === val || (v.options instanceof Map && v.options.get(k) === val)
      )
    );
    setResolvedVariant(match ?? null);
  }, [selectedOptions, variants, product]);

  // ── Image helpers ─────────────────────────────────────────────────
  const allImages = product
    ? [product.thumbnail, ...(product.images ?? []).filter((i) => i !== product.thumbnail)]
    : [];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  // ── Cart / wishlist ───────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    if (!resolvedVariant) return toast.error("Please select all options");
    const available = (resolvedVariant.stock ?? 0) - (resolvedVariant.reservedStock ?? 0);
    if (available < 1) return toast.error("Out of stock");
    setCartLoading(true);
    try {
      await cartApi.addItem({ product: product._id, variant: resolvedVariant._id, quantity: qty });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.message || "Could not add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
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
    } catch (err) {
      toast.error(err.message || "Wishlist error");
    }
  };

  // ── Reviews ───────────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setReviewLoading(true);
    try {
      if (myReview) {
        const res = await reviewApi.update(myReview._id, reviewForm);
        setMyReview(res.data);
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

  // ── Questions ─────────────────────────────────────────────────────
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

  // ── EMI calc ──────────────────────────────────────────────────────
  const price = resolvedVariant?.price ?? product?.basePrice ?? 0;
  const comparePrice = resolvedVariant?.compareAtPrice ?? product?.compareAtPrice;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const emiOption = product?.emiOptions?.find((o) => o.months === emiMonths);
  const emiMonthly = emiOption
    ? Math.ceil((price * (1 + emiOption.monthlyRate * emiOption.months)) / emiOption.months)
    : null;
  const available = resolvedVariant
    ? (resolvedVariant.stock ?? 0) - (resolvedVariant.reservedStock ?? 0)
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-pulse">
          <div className="lg:col-span-2 h-96 bg-gray-100 rounded-lg" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}
          </div>
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
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4 flex gap-1 flex-wrap">
        <Link to="/" className="text-primary hover:underline">Home</Link>
        <span>/</span>
        {product.category?.name && (
          <>
            <Link to={`/phones?category=${product.category._id}`} className="text-primary hover:underline">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Image Gallery ── */}
        <div className="lg:col-span-2">
          <div className="flex lg:flex-row flex-col-reverse gap-3">
            {/* Thumbnails */}
            <div className="flex lg:flex-col flex-row gap-2 items-center">
              <button
                onClick={() => setThumbOffset((o) => Math.max(0, o - 1))}
                disabled={thumbOffset === 0}
                className="text-gray-400 disabled:opacity-30"
              >
                {window.innerWidth < 768 ? <IoIosArrowBack size={20} /> : <IoIosArrowUp size={20} />}
              </button>
              {allImages.slice(thumbOffset, thumbOffset + thumbsToShow).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setMainImage(img)}
                  className={`w-14 h-14 object-cover border-2 cursor-pointer rounded ${mainImage === img ? "border-primary" : "border-gray-200"}`}
                />
              ))}
              <button
                onClick={() => setThumbOffset((o) => Math.min(allImages.length - thumbsToShow, o + 1))}
                disabled={thumbOffset >= allImages.length - thumbsToShow}
                className="text-gray-400 disabled:opacity-30"
              >
                {window.innerWidth < 768 ? <IoIosArrowForward size={20} /> : <IoIosArrowDown size={20} />}
              </button>
            </div>

            {/* Main image + zoom */}
            <div className="relative flex-1">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-80 object-contain border rounded-lg"
                onMouseEnter={() => setZoomImage(mainImage)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomImage(null)}
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
              {product.isOnlineExclusive && (
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Online Only
                </span>
              )}
              {zoomImage && (
                <div className="absolute left-full top-0 ml-4 w-80 h-80 border overflow-hidden z-20 hidden lg:block rounded-lg shadow-xl">
                  <img
                    src={zoomImage}
                    className="w-full h-full object-cover"
                    style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(2.5)" }}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product Info & Purchase ── */}
        <div className="space-y-5 lg:-mx-4">
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{product.brand}</p>
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h1>
              <button
                onClick={() => document.getElementById("share-modal").showModal()}
                className="text-gray-500 hover:text-primary flex items-center gap-1 text-xs shrink-0 mt-2"
              >
                <TiArrowForwardOutline size={16} /> Share
              </button>
            </div>
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={product.averageRating} />
                <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">{money(price)}</span>
            {comparePrice && (
              <span className="text-base text-gray-400 line-through">{money(comparePrice)}</span>
            )}
            {discount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${available > 0 ? "text-green-600" : "text-red-500"}`}>
            {available > 0 ? `In Stock (${available} left)` : "Out of Stock"}
          </p>

          {/* Variant Options */}
          {(product.variantOptions ?? []).map((opt) => (
            <div key={opt.key}>
              <p className="text-sm font-semibold text-gray-700 mb-1 capitalize">
                {opt.label}: <span className="text-primary">{selectedOptions[opt.key]}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const matches = variants.filter((v) =>
                    Object.entries({ ...selectedOptions, [opt.key]: val }).every(
                      ([k, v2]) => (v.options?.[k] ?? (v.options instanceof Map && v.options.get(k))) === v2
                    )
                  );
                  const inStock = matches.some((v) => (v.stock ?? 0) - (v.reservedStock ?? 0) > 0);
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedOptions((o) => ({ ...o, [opt.key]: val }))}
                      className={`px-3 py-1 text-sm border rounded-full transition
                        ${selectedOptions[opt.key] === val
                          ? "border-primary bg-orange-50 text-primary font-semibold"
                          : "border-gray-300 text-gray-600 hover:border-primary"
                        }
                        ${!inStock ? "opacity-40 line-through" : ""}
                      `}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1 hover:bg-gray-100 text-lg font-bold border-r"
              >−</button>
              <span className="px-4 py-1 font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(available, q + 1))}
                disabled={qty >= available}
                className="px-3 py-1 hover:bg-gray-100 text-lg font-bold border-l disabled:opacity-30"
              >+</button>
            </div>
          </div>

          {/* EMI */}
          {(product.emiOptions ?? []).length > 0 && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-2">EMI Options</p>
              <div className="flex flex-wrap gap-2">
                {product.emiOptions.map((opt) => (
                  <button
                    key={opt.months}
                    onClick={() => { setEmiMonths(emiMonths === opt.months ? null : opt.months); setPaymentMethod("stripe"); }}
                    className={`text-xs px-3 py-1.5 border rounded-full transition ${emiMonths === opt.months ? "border-primary bg-orange-50 text-primary font-semibold" : "border-gray-300 text-gray-600 hover:border-primary"}`}
                  >
                    {opt.months}m
                  </button>
                ))}
              </div>
              {emiMonthly && (
                <p className="text-sm text-primary font-semibold mt-2">
                  ≈ {money(emiMonthly)}/month for {emiMonths} months
                </p>
              )}
            </div>
          )}

          {/* Gift */}
          {product.isGift && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => { setIsGift(e.target.checked); setShowGiftModal(e.target.checked); }}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-700">Add Gift Wrapping</span>
            </label>
          )}

          {/* Payment method */}
          <div className="flex gap-3">
            {["cod", "stripe"].map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`flex-1 py-2 px-3 border rounded-lg text-sm font-medium transition ${paymentMethod === m ? "border-primary bg-orange-50 text-primary" : "border-gray-300 text-gray-600 hover:border-primary"}`}
              >
                {m === "cod" ? "Cash on Delivery" : "Online Payment"}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || available < 1}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              {cartLoading ? "Adding…" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={cartLoading || available < 1}
              className="flex-1 bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={handleWishlist}
            className={`w-full text-sm py-2 border rounded-lg transition ${inWishlist ? "border-red-400 text-red-500 bg-red-50" : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"}`}
          >
            {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
          </button>

          {product.warranty && (
            <p className="text-xs text-gray-500 flex gap-1 items-center">
              <span className="text-green-500">✓</span> Warranty: {product.warranty}
            </p>
          )}
        </div>

        {/* ── Sidebar: Similar & Related ── */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Similar Products</h2>
            <div className="space-y-3">
              {similar.length === 0 && <p className="text-sm text-gray-400">No similar products</p>}
              {similar.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="flex gap-3 items-center p-2 border rounded-lg hover:border-primary hover:shadow-sm transition">
                  <img src={p.thumbnail} alt={p.name} className="w-14 h-14 object-contain rounded border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{p.name}</p>
                    <p className="text-sm font-bold text-primary">{money(p.basePrice)}</p>
                    {p.averageRating > 0 && <StarRating value={p.averageRating} />}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <dialog id="share-modal" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-semibold text-sm mb-3">Share this product</h3>
          <SocialShare />
          <div className="flex items-center gap-2 mt-4">
            <input readOnly value={window.location.href} className="input input-bordered input-sm flex-1 bg-white text-xs" />
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
              className="btn btn-sm"
            >Copy</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Gift Wrapping</h2>
            <textarea
              value={giftMsg}
              onChange={(e) => setGiftMsg(e.target.value)}
              placeholder="Add a gift message (optional)"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-primary resize-none bg-white"
              rows={3}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowGiftModal(false)} className="flex-1 bg-primary text-white py-2 rounded-lg font-medium">Confirm</button>
              <button onClick={() => { setIsGift(false); setShowGiftModal(false); }} className="flex-1 border py-2 rounded-lg text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <hr className="my-10" />

      {/* ── Tabs: Spec / Description / Reviews / Q&A ── */}
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex overflow-x-auto gap-1 border-b mb-6">
            {[
              { key: "specification", label: "Specification" },
              { key: "description", label: "Description" },
              { key: "reviews", label: `Reviews (${product.reviewCount ?? 0})` },
              { key: "questions", label: `Q&A (${product.questionCount ?? 0})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition ${activeTab === t.key ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-primary"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Specification */}
          {activeTab === "specification" && (
            <div>
              {product.attributes && Object.entries(
                product.attributes instanceof Map
                  ? Object.fromEntries(product.attributes)
                  : product.attributes
              ).length > 0 ? (
                Object.entries(
                  product.attributes instanceof Map
                    ? Object.fromEntries(product.attributes)
                    : product.attributes
                ).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 py-2.5 px-4 border-b text-sm">
                    <span className="text-gray-500 capitalize">{key}</span>
                    <span className="col-span-2 font-medium text-gray-800">{String(val)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No specifications listed.</p>
              )}
              {product.warranty && (
                <div className="grid grid-cols-3 py-2.5 px-4 border-b text-sm">
                  <span className="text-gray-500">Warranty</span>
                  <span className="col-span-2 font-medium">{product.warranty}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {activeTab === "description" && (
            <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
              {product.description
                ? product.description.split("\n").map((p, i) => <p key={i}>{p}</p>)
                : <p>No description available.</p>}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Rating summary */}
              {product.averageRating > 0 && (
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{product.averageRating.toFixed(1)}</p>
                    <StarRating value={product.averageRating} />
                    <p className="text-xs text-gray-400 mt-1">{product.reviewCount} reviews</p>
                  </div>
                </div>
              )}

              {/* Write / edit review */}
              <div>
                <button
                  onClick={() => { if (!user) navigate("/login"); else setShowReviewForm((s) => !s); }}
                  className="bg-orange-100 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-200 transition"
                >
                  {myReview ? "Edit My Review" : "Write a Review"}
                </button>
              </div>
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="border rounded-xl p-4 space-y-3 bg-gray-50">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button type="button" key={s} onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}>
                        {s <= reviewForm.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Write your review…"
                    className="w-full border rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-primary resize-none"
                    rows={3}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={reviewLoading} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                      {reviewLoading ? "Saving…" : "Submit"}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="border px-4 py-2 rounded-lg text-sm text-gray-600">Cancel</button>
                  </div>
                </form>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
                  <FiThumbsUp className="text-5xl" />
                  <p>No reviews yet — be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="border rounded-xl p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{r.user?.name ?? "Anonymous"}</p>
                          <StarRating value={r.rating} />
                        </div>
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Q&A */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              <form onSubmit={handleAskQuestion} className="flex gap-2">
                <input
                  value={qForm}
                  onChange={(e) => setQForm(e.target.value)}
                  placeholder="Ask a question about this product…"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                />
                <button type="submit" disabled={qLoading} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                  {qLoading ? "…" : "Ask"}
                </button>
              </form>
              {questions.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
                  <CiCircleQuestion className="text-6xl" />
                  <p>No questions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q._id} className="border rounded-xl p-4 bg-white">
                      <p className="font-medium text-sm text-gray-800">Q: {q.question}</p>
                      {q.answer && (
                        <p className="text-sm text-primary mt-2 pl-3 border-l-2 border-primary">A: {q.answer}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {q.user?.name} · {new Date(q.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar repeat for desktop */}
        <div className="hidden lg:block space-y-4">
          <h2 className="text-lg font-semibold">Top Picks</h2>
          {similar.slice(0, 4).map((p) => (
            <Link key={p._id} to={`/products/${p.slug}`} className="flex gap-3 items-center p-2 border rounded-lg hover:border-primary transition">
              <img src={p.thumbnail} alt={p.name} className="w-12 h-12 object-contain rounded border" />
              <div>
                <p className="text-xs font-medium line-clamp-2">{p.name}</p>
                <p className="text-xs font-bold text-primary">{money(p.basePrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
