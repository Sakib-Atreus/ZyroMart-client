import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  Pagination,
  Select,
  Slider,
  Checkbox,
  Drawer,
  Button,
  Empty,
  Spin,
  Badge,
  Tag,
  Input,
  InputNumber,
} from "antd";
import { FilterOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { productApi, categoryApi } from "../../api/endpoints";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "New Arrivals" },
  { value: "basePrice", label: "Price: Low to High" },
  { value: "-basePrice", label: "Price: High to Low" },
  { value: "-averageRating", label: "Top Rated" },
  { value: "-totalSold", label: "Best Selling" },
];

const POPULAR_BRANDS = [
  "Samsung", "Apple", "Google", "Dell", "Sony", "Xiaomi",
  "OnePlus", "Oppo", "Huawei", "Realme", "Vivo", "Nokia",
];

const Stars = ({ value }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(value)) return <FaStar key={i} className="text-yellow-400 text-xs" />;
      if (i < value) return <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />;
      return <FaRegStar key={i} className="text-gray-300 text-xs" />;
    })}
  </span>
);

const ProductCard = ({ product }) => {
  const discount = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-44 object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.isOnlineExclusive && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              Online Only
            </span>
          )}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Stars value={product.averageRating} />
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="text-orange-600 font-bold text-base">
            ৳{product.basePrice?.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>
        <Link
          to={`/products/${product.slug}`}
          className="block text-center bg-orange-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-orange-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg border overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded mt-2" />
    </div>
  </div>
);

const Phones = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // local price state (only applied on slider change-complete)
  const [priceRange, setPriceRange] = useState([0, 300000]);

  // local search input — debounced before being written to the URL
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");
  const debounceRef = useRef(null);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) { next.set("searchTerm", value.trim()); } else { next.delete("searchTerm"); }
      next.delete("page");
      setSearchParams(next, { replace: true });
    }, 500);
  };

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const searchTerm = searchParams.get("searchTerm") || "";
  const isOnlineExclusive = searchParams.get("isOnlineExclusive") || "";
  const page = Number(searchParams.get("page") || 1);

  // Sync slider from URL on mount
  useEffect(() => {
    setPriceRange([
      minPrice ? Number(minPrice) : 0,
      maxPrice ? Number(maxPrice) : 300000,
    ]);
  }, []);

  useEffect(() => {
    categoryApi.list()
      .then((res) => setCategories(res.data ?? res ?? []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (searchTerm) params.searchTerm = searchTerm;
    if (isOnlineExclusive) params.isOnlineExclusive = true;

    productApi.list(params)
      .then((res) => {
        setProducts(res.data ?? []);
        setMeta(res.meta ?? { total: 0, page: 1, totalPages: 1 });
      })
      .catch(() => { setProducts([]); toast.error("Failed to load products"); })
      .finally(() => setLoading(false));
  }, [category, brand, sort, minPrice, maxPrice, searchTerm, isOnlineExclusive, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) { next.set(key, value); } else { next.delete(key); }
    next.delete("page");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 300000]);
    setSearchInput("");
    setSearchParams({});
  };

  const activeCategoryName = categories.find((c) => c._id === category)?.name || "";
  const hasFilters = category || brand || minPrice || maxPrice || searchTerm || isOnlineExclusive;

  const applyPriceRange = ([min, max]) => {
    const next = new URLSearchParams(searchParams);
    if (min > 0) { next.set("minPrice", min); } else { next.delete("minPrice"); }
    if (max < 300000) { next.set("maxPrice", max); } else { next.delete("maxPrice"); }
    next.delete("page");
    setSearchParams(next);
  };

  const breadcrumbItems = [
    { title: <Link to="/" className="font-semibold">Home</Link> },
    ...(activeCategoryName ? [{ title: <span className="text-orange-600 font-semibold">{activeCategoryName}</span> }] : []),
    ...(!activeCategoryName ? [{ title: <span className="text-orange-600 font-semibold">All Products</span> }] : []),
  ];

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => setParam("category", "")}
            className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${!category ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setParam("category", cat._id)}
              className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${category === cat._id ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <Slider
          range
          min={0}
          max={300000}
          value={priceRange}
          onChange={setPriceRange}
          onChangeComplete={applyPriceRange}
          tooltip={{ formatter: (v) => `৳${v.toLocaleString()}` }}
        />
        <div className="flex gap-2 mt-2">
          <InputNumber
            min={0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(val) => val !== null && setPriceRange([val, priceRange[1]])}
            onBlur={() => applyPriceRange(priceRange)}
            onPressEnter={() => applyPriceRange(priceRange)}
            formatter={(v) => `৳${v}`}
            parser={(v) => v.replace(/৳/g, '')}
            size="small"
            className="w-full"
            placeholder="Min"
          />
          <InputNumber
            min={priceRange[0]}
            max={300000}
            value={priceRange[1]}
            onChange={(val) => val !== null && setPriceRange([priceRange[0], val])}
            onBlur={() => applyPriceRange(priceRange)}
            onPressEnter={() => applyPriceRange(priceRange)}
            formatter={(v) => `৳${v}`}
            parser={(v) => v.replace(/৳/g, '')}
            size="small"
            className="w-full"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Brand</h3>
        <div className="space-y-1.5">
          {POPULAR_BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={brand === b}
                onChange={(e) => setParam("brand", e.target.checked ? b : "")}
              />
              <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Online Exclusive */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={isOnlineExclusive === "true"}
            onChange={(e) => setParam("isOnlineExclusive", e.target.checked ? "true" : "")}
          />
          <span className="text-sm text-gray-600 font-medium">Online Exclusive Only</span>
        </label>
      </div>

      {hasFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-center text-sm text-red-500 hover:text-red-700 font-medium py-2 border border-red-200 rounded hover:bg-red-50 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 my-8">
      <Breadcrumb className="mb-6" separator=">" items={breadcrumbItems} />

      {/* Brand quick-filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {POPULAR_BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setParam("brand", brand === b ? "" : b)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              brand === b
                ? "bg-orange-600 text-white border-orange-600"
                : "text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-600"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border p-4 sticky top-4">
            {filterContent}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white rounded-xl border px-4 py-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                icon={<FilterOutlined />}
                className="md:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                Filters
                {hasFilters && <Badge count={[category, brand, minPrice, isOnlineExclusive].filter(Boolean).length} className="ml-1" />}
              </Button>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="max-w-xs"
                allowClear
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {loading ? "Loading…" : `${meta.total} product${meta.total !== 1 ? "s" : ""}`}
              </span>
              <Select
                value={sort}
                onChange={(v) => setParam("sort", v)}
                style={{ width: 190 }}
                options={SORT_OPTIONS}
              />
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeCategoryName && (
                <Tag closable onClose={() => setParam("category", "")} color="orange">
                  Category: {activeCategoryName}
                </Tag>
              )}
              {brand && (
                <Tag closable onClose={() => setParam("brand", "")} color="blue">
                  Brand: {brand}
                </Tag>
              )}
              {(minPrice || maxPrice) && (
                <Tag
                  closable
                  onClose={() => {
                    setPriceRange([0, 300000]);
                    const next = new URLSearchParams(searchParams);
                    next.delete("minPrice"); next.delete("maxPrice");
                    setSearchParams(next);
                  }}
                  color="green"
                >
                  Price: ৳{(minPrice || 0).toLocaleString()} – ৳{(maxPrice || 300000).toLocaleString()}
                </Tag>
              )}
              {isOnlineExclusive && (
                <Tag closable onClose={() => setParam("isOnlineExclusive", "")} color="purple">
                  Online Exclusive
                </Tag>
              )}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border py-20">
              <Empty
                description={
                  <div className="text-center">
                    <p className="text-gray-500 mb-3">No products found</p>
                    {hasFilters && (
                      <button onClick={clearAllFilters} className="text-orange-600 hover:underline text-sm">
                        Clear filters
                      </button>
                    )}
                  </div>
                }
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && meta.total > 12 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                total={meta.total}
                pageSize={12}
                onChange={(p) => {
                  const next = new URLSearchParams(searchParams);
                  next.set("page", p);
                  setSearchParams(next);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} products`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        extra={
          hasFilters && (
            <button onClick={() => { clearAllFilters(); setDrawerOpen(false); }} className="text-red-500 text-sm">
              Clear All
            </button>
          )
        }
      >
        {filterContent}
      </Drawer>
    </div>
  );
};

export default Phones;
