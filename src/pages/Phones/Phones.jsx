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
  Badge,
  Tag,
  Input,
  InputNumber,
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronDown } from "react-icons/fa";
import { productApi, categoryApi } from "../../api/endpoints";
import { toast } from "react-toastify";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "-createdAt", label: "New Arrivals" },
  { value: "basePrice", label: "Price: Low to High" },
  { value: "-basePrice", label: "Price: High to Low" },
  { value: "-averageRating", label: "Top Rated" },
  { value: "-totalSold", label: "Best Selling" },
];

// Brands shown in the sidebar filter and quick-pill row, keyed by category slug.
// Falls back to `default` when no category is selected or slug not listed.
const CATEGORY_BRANDS = {
  default: ["Samsung", "Apple", "Google", "Dell", "Sony", "Xiaomi", "OnePlus", "Oppo", "Huawei", "Realme", "Vivo", "Nokia"],
  phones: ["Samsung", "Apple", "Google", "Xiaomi", "OnePlus", "Oppo", "Realme", "Vivo", "Nokia", "Huawei", "Nothing", "Tecno"],
  mac: ["Apple"],
  macbook: ["Apple"],
  tablets: ["Apple", "Samsung", "Xiaomi", "Huawei"],
  ipad: ["Apple"],
  watches: ["Apple", "Samsung", "Garmin", "Xiaomi", "Huawei"],
  "headphone-speaker": ["Apple", "Sony", "JBL", "Bose", "Marshall", "Samsung", "Xiaomi"],
  earbuds: ["Apple", "Samsung", "Sony", "JBL", "Bose", "Xiaomi"],
  speaker: ["JBL", "Bose", "Marshall", "Sony", "Xiaomi"],
  "pc-accessories": ["Apple", "Logitech", "Razer", "Microsoft"],
  gaming: ["Logitech", "Razer", "Corsair", "SteelSeries", "Microsoft", "Sony"],
  camera: ["DJI", "GoPro", "Insta360", "Sony", "Canon", "Nikon"],
  drone: ["DJI"],
  "cases-protectors": ["Spigen", "Pitaka", "UAG", "TORRAS", "Apple"],
  networking: ["TP-Link", "Asus", "Netgear", "D-Link"],
  router: ["TP-Link", "Asus", "Netgear"],
  "power-bank": ["Belkin", "Skross", "Meko", "Anker"],
  "phone-accessories": ["Apple", "Samsung", "Belkin", "Anker", "Spigen"],
  gadget: ["DJI", "Xiaomi", "Amazon"],
};

// ─── URL attrs helpers ────────────────────────────────────────────────────────

// "color:Black|Blue,ram:8GB" → { color: ['Black','Blue'], ram: ['8GB'] }
const parseUrlAttrs = (str) => {
  if (!str) return {};
  const result = {};
  for (const pair of str.split(",")) {
    const idx = pair.indexOf(":");
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const vals = pair.slice(idx + 1).trim().split("|").filter(Boolean);
    if (key && vals.length) result[key] = vals;
  }
  return result;
};

// { color: ['Black','Blue'], ram: ['8GB'] } → "color:Black|Blue,ram:8GB"
const serializeAttrs = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v && v.length > 0)
    .map(([k, v]) => `${k}:${v.join("|")}`)
    .join(",");

// ─── Sub-components ───────────────────────────────────────────────────────────

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
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.basePrice
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

/** Collapsible filter section with animated chevron. */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2 text-xs uppercase tracking-widest hover:text-orange-600 transition-colors"
      >
        <span>{title}</span>
        <FaChevronDown
          className={`text-xs text-gray-400 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
};

/** Checkbox list that collapses to MAX_VISIBLE items with a toggle. */
const MAX_VISIBLE = 6;
const CheckboxList = ({ items, isChecked, onChange, getLabel }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, MAX_VISIBLE);
  const hidden = items.length - MAX_VISIBLE;
  return (
    <>
      <div className="space-y-1.5">
        {visible.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <Checkbox checked={isChecked(item)} onChange={() => onChange(item)} />
            <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
              {getLabel ? getLabel(item) : item}
            </span>
          </label>
        ))}
      </div>
      {items.length > MAX_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          {showAll ? "Show Less ↑" : `+ ${hidden} More`}
        </button>
      )}
    </>
  );
};

// ─── Main page component ──────────────────────────────────────────────────────

const Phones = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [searchInput, setSearchInput] = useState(searchParams.get("searchTerm") || "");
  const debounceRef = useRef(null);

  // ── Read URL state ──────────────────────────────────────────────────────────
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "-createdAt";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const searchTerm = searchParams.get("searchTerm") || "";
  const isOnlineExclusive = searchParams.get("isOnlineExclusive") || "";
  const attrsStr = searchParams.get("attrs") || "";
  const attrFiltersStr = searchParams.get("attrFilters") || "";
  const page = Number(searchParams.get("page") || 1);

  const selectedAttrs = parseUrlAttrs(attrsStr);
  const selectedAttrFilters = parseUrlAttrs(attrFiltersStr);

  // ── Derived state ───────────────────────────────────────────────────────────
  const selectedCategory = categories.find((c) => c._id === category);
  const categorySlug = selectedCategory?.slug || "";

  // Filterable attributes for the selected category (enum/multiselect/string with options + boolean)
  const filterableAttrs = (selectedCategory?.attributeSchema ?? []).filter(
    (attr) =>
      attr.filterable &&
      (attr.type === "boolean" ||
        (["enum", "multiselect", "string"].includes(attr.type) && attr.options?.length > 0)),
  );

  // Category-aware brand list (sidebar + pills)
  const brandList = CATEGORY_BRANDS[categorySlug] || CATEGORY_BRANDS.default;

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) { next.set(key, value); } else { next.delete(key); }
    next.delete("page");
    setSearchParams(next);
  };

  // Switching category clears all attribute filters (they're category-specific)
  const setCategory = (catId) => {
    const next = new URLSearchParams(searchParams);
    if (catId) { next.set("category", catId); } else { next.delete("category"); }
    next.delete("attrs");
    next.delete("attrFilters");
    next.delete("page");
    setSearchParams(next);
  };

  // Multi-select attribute toggle.
  // isVariantOption=true attrs (color, storage) → ?attrs (variant lookup).
  // isVariantOption=false attrs (os, ram, nfc, network) → ?attrFilters (product.attributes match).
  const toggleAttrValue = (attrKey, value, isVariantOption = true) => {
    const paramKey = isVariantOption ? "attrs" : "attrFilters";
    const currentMap = isVariantOption ? selectedAttrs : selectedAttrFilters;
    const current = currentMap[attrKey] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const nextMap = { ...currentMap };
    if (next.length === 0) { delete nextMap[attrKey]; } else { nextMap[attrKey] = next; }

    const nextStr = serializeAttrs(nextMap);
    const nextParams = new URLSearchParams(searchParams);
    if (nextStr) { nextParams.set(paramKey, nextStr); } else { nextParams.delete(paramKey); }
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const applyPriceRange = ([min, max]) => {
    const next = new URLSearchParams(searchParams);
    if (min > 0) { next.set("minPrice", min); } else { next.delete("minPrice"); }
    if (max < 300000) { next.set("maxPrice", max); } else { next.delete("maxPrice"); }
    next.delete("page");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 300000]);
    setSearchInput("");
    setSearchParams({});
    // setSearchParams({}) clears everything including attrs and attrFilters
  };

  // ── Data fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    setPriceRange([
      minPrice ? Number(minPrice) : 0,
      maxPrice ? Number(maxPrice) : 300000,
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    categoryApi
      .list()
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
    if (attrsStr) params.attrs = attrsStr;
    if (attrFiltersStr) params.attrFilters = attrFiltersStr;

    productApi
      .list(params)
      .then((res) => {
        setProducts(res.data ?? []);
        setMeta(res.meta ?? { total: 0, page: 1, totalPages: 1 });
      })
      .catch(() => { setProducts([]); toast.error("Failed to load products"); })
      .finally(() => setLoading(false));
  }, [category, brand, sort, minPrice, maxPrice, searchTerm, isOnlineExclusive, attrsStr, attrFiltersStr, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Derived display values ──────────────────────────────────────────────────
  const activeCategoryName = selectedCategory?.name || "";
  const hasFilters = !!(category || brand || minPrice || maxPrice || searchTerm || isOnlineExclusive || attrsStr || attrFiltersStr);
  const activeFilterCount = [category, brand, minPrice, isOnlineExclusive, attrsStr, attrFiltersStr].filter(Boolean).length;

  const breadcrumbItems = [
    { title: <Link to="/" className="font-semibold">Home</Link> },
    ...(activeCategoryName
      ? [{ title: <span className="text-orange-600 font-semibold">{activeCategoryName}</span> }]
      : [{ title: <span className="text-orange-600 font-semibold">All Products</span> }]),
  ];

  // ── Filter panel (shared between sidebar & drawer) ──────────────────────────
  const filterContent = (
    <div className="space-y-5">

      {/* 1. Categories */}
      <FilterSection title="Categories">
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
              !category ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setCategory(cat._id)}
              className={`block w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                category === cat._id ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <div className="border-t border-gray-100" />

      {/* 2. Price Range */}
      <FilterSection title="Price Range">
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
            parser={(v) => v.replace(/৳/g, "")}
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
            parser={(v) => v.replace(/৳/g, "")}
            size="small"
            className="w-full"
            placeholder="Max"
          />
        </div>
      </FilterSection>

      {/* 3. Category-specific attribute filters — only when a category is selected */}
      {filterableAttrs.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          {filterableAttrs.map((attr) => {
            const isVariant = !!attr.isVariantOption;
            const activeMap = isVariant ? selectedAttrs : selectedAttrFilters;
            return (
              <FilterSection
                key={attr.key}
                title={attr.unit ? `${attr.label} (${attr.unit})` : attr.label}
              >
                {attr.type === "boolean" ? (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      checked={(activeMap[attr.key] || []).includes("true")}
                      onChange={() => toggleAttrValue(attr.key, "true", isVariant)}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                      {attr.label}
                    </span>
                  </label>
                ) : (
                  <CheckboxList
                    items={attr.options || []}
                    isChecked={(opt) => (activeMap[attr.key] || []).includes(opt)}
                    onChange={(opt) => toggleAttrValue(attr.key, opt, isVariant)}
                    getLabel={(opt) => (attr.unit ? `${opt} ${attr.unit}` : opt)}
                  />
                )}
              </FilterSection>
            );
          })}
        </>
      )}

      <div className="border-t border-gray-100" />

      {/* 4. Brand — category-aware */}
      <FilterSection title="Brand">
        <CheckboxList
          items={brandList}
          isChecked={(b) => brand === b}
          onChange={(b) => setParam("brand", brand === b ? "" : b)}
        />
      </FilterSection>

      <div className="border-t border-gray-100" />

      {/* 5. Online Exclusive */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={isOnlineExclusive === "true"}
            onChange={(e) => setParam("isOnlineExclusive", e.target.checked ? "true" : "")}
          />
          <span className="text-sm text-gray-600 font-medium">Online Exclusive Only</span>
        </label>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full text-center text-sm text-red-500 hover:text-red-700 font-medium py-2 border border-red-200 rounded hover:bg-red-50 transition"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 my-8">
      <Breadcrumb className="mb-6" separator=">" items={breadcrumbItems} />

      {/* Brand quick-filter pills — category-aware */}
      <div className="flex flex-wrap gap-2 mb-6">
        {brandList.map((b) => (
          <button
            key={b}
            type="button"
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
        <div className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-xl border p-4 sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                {activeFilterCount > 0 && <Badge count={activeFilterCount} className="ml-1" />}
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

          {/* Active filter tags */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeCategoryName && (
                <Tag closable onClose={() => setCategory("")} color="orange">
                  {activeCategoryName}
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
                    next.delete("minPrice");
                    next.delete("maxPrice");
                    setSearchParams(next);
                  }}
                  color="green"
                >
                  ৳{Number(minPrice || 0).toLocaleString()} – ৳{Number(maxPrice || 300000).toLocaleString()}
                </Tag>
              )}
              {isOnlineExclusive && (
                <Tag closable onClose={() => setParam("isOnlineExclusive", "")} color="purple">
                  Online Exclusive
                </Tag>
              )}
              {/* One tag per selected variant attribute value */}
              {Object.entries(selectedAttrs).map(([key, values]) => {
                const attrDef = filterableAttrs.find((a) => a.key === key);
                const label = attrDef?.label || key;
                return values.map((val) => (
                  <Tag
                    key={`attrs:${key}:${val}`}
                    closable
                    onClose={() => toggleAttrValue(key, val, true)}
                    color="cyan"
                  >
                    {label}: {val}{attrDef?.unit ? ` ${attrDef.unit}` : ""}
                  </Tag>
                ));
              })}
              {/* One tag per selected product-level attribute value */}
              {Object.entries(selectedAttrFilters).map(([key, values]) => {
                const attrDef = filterableAttrs.find((a) => a.key === key);
                const label = attrDef?.label || key;
                return values.map((val) => (
                  <Tag
                    key={`attrFilters:${key}:${val}`}
                    closable
                    onClose={() => toggleAttrValue(key, val, false)}
                    color="cyan"
                  >
                    {label}: {val}{attrDef?.unit ? ` ${attrDef.unit}` : ""}
                  </Tag>
                ));
              })}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border py-20">
              <Empty
                description={
                  <div className="text-center">
                    <p className="text-gray-500 mb-3">No products found</p>
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                }
              />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
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
        width={300}
        extra={
          hasFilters && (
            <button
              type="button"
              onClick={() => { clearAllFilters(); setDrawerOpen(false); }}
              className="text-red-500 text-sm"
            >
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
