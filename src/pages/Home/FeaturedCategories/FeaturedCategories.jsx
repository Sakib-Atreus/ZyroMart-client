import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../../api/endpoints";
import fc1 from "../../../assets/FeaturedCategoriesIcons/fc1.png";
import fc4 from "../../../assets/FeaturedCategoriesIcons/fc4.png";
import fc6 from "../../../assets/FeaturedCategoriesIcons/fc6.png";
import fc8 from "../../../assets/FeaturedCategoriesIcons/fc8.png";
import fc10 from "../../../assets/FeaturedCategoriesIcons/fc10.png";
import fc11 from "../../../assets/FeaturedCategoriesIcons/fc11.png";
import fc12 from "../../../assets/FeaturedCategoriesIcons/fc12.png";
import fc15 from "../../../assets/FeaturedCategoriesIcons/fc15.png";
import fc16 from "../../../assets/FeaturedCategoriesIcons/fc16.png";

const SLUG_ICON = {
  smartphones: fc1,
  laptops: fc11,
  tablets: fc15,
  "earphones-headphones": fc8,
  "smart-watches": fc10,
  cameras: fc4,
  gaming: fc12,
  accessories: fc6,
};

const imgClass =
  "w-24 h-24 lg:w-28 lg:h-28 border border-orange-600 rounded-full p-1 border-opacity-50 bg-white shadow-lg object-contain";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi
      .list()
      .then((res) => setCategories(res.data ?? res ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-center pb-12 mt-8 lg:mt-0">
          Featured Categories
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 items-center">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center pb-12 lg:mt-0 md:mt-0 mt-8">
        Featured Categories
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center font-semibold text-md lg:px-0 md:px-0 px-2">
        {categories.map((cat) => (
          <Link key={cat._id} to={`/phones?category=${cat._id}`}>
            <div className="grid grid-cols-1 gap-4 group">
              <img
                src={SLUG_ICON[cat.slug] ?? fc16}
                alt={cat.name}
                className={`${imgClass} group-hover:border-orange-500 transition-all`}
              />
              <p className="text-[#454457] text-center text-sm group-hover:text-orange-600 transition-colors">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
        <Link to="/phones">
          <div className="grid grid-cols-1 gap-4 group">
            <img
              src={fc16}
              alt="All Categories"
              className={`${imgClass} group-hover:border-orange-500 transition-all`}
            />
            <p className="text-[#454457] text-center text-sm group-hover:text-orange-600 transition-colors">
              All Products
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCategories;
