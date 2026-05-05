import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryApi } from "../../../api/endpoints";
import fc1 from "../../../assets/FeaturedCategoriesIcons/fc1.png";
import fc2 from "../../../assets/FeaturedCategoriesIcons/fc2.png";
import fc3 from "../../../assets/FeaturedCategoriesIcons/fc3.png";
import fc4 from "../../../assets/FeaturedCategoriesIcons/fc4.png";
import fc5 from "../../../assets/FeaturedCategoriesIcons/fc5.png";
import fc6 from "../../../assets/FeaturedCategoriesIcons/fc6.png";
import fc7 from "../../../assets/FeaturedCategoriesIcons/fc7.png";
import fc8 from "../../../assets/FeaturedCategoriesIcons/fc8.png";
import fc9 from "../../../assets/FeaturedCategoriesIcons/fc9.png";
import fc10 from "../../../assets/FeaturedCategoriesIcons/fc10.png";
import fc11 from "../../../assets/FeaturedCategoriesIcons/fc11.png";
import fc12 from "../../../assets/FeaturedCategoriesIcons/fc12.png";
import fc13 from "../../../assets/FeaturedCategoriesIcons/fc13.png";
import fc15 from "../../../assets/FeaturedCategoriesIcons/fc15.png";
import fc16 from "../../../assets/FeaturedCategoriesIcons/fc16.png";

// Map category slug → icon image
const SLUG_ICON = {
  phones: fc1,
  macbook: fc11,
  tablets: fc15,
  ipad: fc7,
  camera: fc4,
  watches: fc10,
  earbuds: fc13,
  "cases-protectors": fc5,
  "cable-adapter": fc6,
  speaker: fc3,
  drone: fc16,
  router: fc16,
  gaming: fc12,
  "power-bank": fc2,
  "car-accessories": fc9,
  // fallbacks for parent cats
  mac: fc11,
  "phone-accessories": fc6,
  "headphone-speaker": fc8,
};

const imgClass =
  "w-24 h-24 lg:w-28 lg:h-28 border border-orange-600 rounded-full p-1 border-opacity-50 bg-white shadow-lg object-contain";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi
      .featured()
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
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-8 justify-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
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
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-8 justify-items-center font-semibold text-md lg:px-0 md:px-0 px-2">
        {categories.map((cat) => (
          <Link key={cat._id} to={`/phones?category=${cat._id}`}>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
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
      </div>
    </div>
  );
};

export default FeaturedCategories;
