import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productApi } from "../../../api/endpoints";
import oep1 from "../../../assets/OnlineExclusiveProducts/oep1.png";
import oep2 from "../../../assets/OnlineExclusiveProducts/oep2.png";
import oep3 from "../../../assets/OnlineExclusiveProducts/oep3.png";
import oep4 from "../../../assets/OnlineExclusiveProducts/oep4.png";
import oe from "../../../assets/exclusive.png";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const ProductCard = ({ product }) => {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="mx-2">
      <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
        <Link to={`/products/${product.slug}`}>
          <div className="relative">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-48 object-contain p-2"
            />
            <div className="absolute top-2 right-2">
              <img
                src={oe}
                className="w-14 h-14"
                alt="Online Only"
              />
            </div>
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
        </Link>
        <div className="p-3 flex flex-col flex-1">
          <Link to={`/products/${product.slug}`}>
            <h3 className="h-10 text-sm font-semibold text-gray-800 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">৳{product.basePrice?.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.compareAtPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-auto pt-3">
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 text-center bg-orange-100 text-primary px-3 py-1.5 rounded text-sm font-semibold hover:bg-primary hover:text-white transition"
            >
              Buy Now
            </Link>
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 text-center bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-700 hover:text-white transition"
            >
              Add to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

let _exclusiveCache = null;

const ExclusiveProducts = () => {
  const [products, setProducts] = useState(_exclusiveCache ?? []);
  const [loading, setLoading] = useState(!_exclusiveCache);

  useEffect(() => {
    if (_exclusiveCache) return;
    productApi
      .onlineExclusive(12)
      .then((res) => {
        _exclusiveCache = res.data ?? [];
        setProducts(_exclusiveCache);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center pb-6 px-2">
        <h1 className="text-2xl font-semibold">Online Exclusive Products</h1>
        <Link
          to="/phones?isOnlineExclusive=true"
          className="flex items-center gap-1 text-sm text-primary"
        >
          Show All <IoIosArrowForward />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-400 py-8">No exclusive products yet.</p>
      )}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 mt-8">
        <img src={oep1} alt="" className="mx-auto rounded-lg" />
        <img src={oep2} alt="" className="mx-auto rounded-lg" />
        <img src={oep3} alt="" className="mx-auto rounded-lg" />
        <img src={oep4} alt="" className="mx-auto rounded-lg" />
      </div>
    </div>
  );
};

export default ExclusiveProducts;
