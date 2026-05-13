import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { productApi } from "../../../api/endpoints";

const Stars = ({ value }) => (
  <span className="flex gap-0.5 justify-center">
    {Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(value)) return <FaStar key={i} className="text-yellow-400 text-xs" />;
      if (i < value) return <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />;
      return <FaRegStar key={i} className="text-gray-300 text-xs" />;
    })}
  </span>
);

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .topSelling(8)
      .then((res) => setProducts(res.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between pt-12 pb-8 pe-2 lg:pe-0 md:pe-0">
        <h1 className="text-2xl text-center font-semibold px-2">Best Sellers</h1>
        <Link
          to="/phones?sort=-totalSold"
          className="flex text-center items-center gap-2 text-sm text-primary"
        >
          Show All <IoIosArrowForward />
        </Link>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-1 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No products yet.</p>
      ) : (
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-1 gap-3 p-3 lg:p-0 md:p-0">
          {products.map((product) => {
            const discount = product.compareAtPrice && product.compareAtPrice > product.basePrice
              ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
              : 0;
            return (
              <Link key={product._id} to={`/products/${product.slug}`}>
                <div className="rounded-lg shadow border p-3 bg-white hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative">
                    <img
                      className="w-full h-44 object-contain"
                      src={product.thumbnail}
                      alt={product.name}
                      onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
                    />
                    {discount > 0 && (
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-semibold text-center mt-3 line-clamp-2 flex-1">
                    {product.name}
                  </h2>
                  <p className="text-center text-xs text-gray-400 mt-1">{product.brand}</p>
                  <p className="text-center text-orange-600 text-sm font-bold mt-2">
                    ৳{product.basePrice?.toLocaleString()}
                  </p>
                  {product.averageRating > 0 && (
                    <div className="flex justify-center items-center gap-1 mt-1">
                      <Stars value={product.averageRating} />
                      <span className="text-gray-500 text-xs">({product.reviewCount})</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Accessories;
