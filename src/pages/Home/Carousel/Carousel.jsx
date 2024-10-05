import React from "react";
import { Carousel } from "antd";
import c1 from "../../../assets/HomeCarousel/slide-1.png";
import c2 from "../../../assets/HomeCarousel/slide-2.png";
import c3 from "../../../assets/HomeCarousel/slide-3.png";
import c4 from "../../../assets/HomeCarousel/slide-4.png";
import c5 from "../../../assets/HomeCarousel/slide-5.png";
import c6 from "../../../assets/HomeCarousel/slide-6.png";
import c7 from "../../../assets/HomeCarousel/slide-7.png";
import c8 from "../../../assets/HomeCarousel/slide-8.png";
import l1 from "../../../assets/TrustIcons/l1.png";
import l2 from "../../../assets/TrustIcons/l2.png";
import l3 from "../../../assets/TrustIcons/l3.png";
import l4 from "../../../assets/TrustIcons/l4.png";
import l5 from "../../../assets/TrustIcons/l5.png";
import l6 from "../../../assets/TrustIcons/l6.png";

import { FaApple, FaTruck, FaSyncAlt } from "react-icons/fa";
import { MdSecurity, MdOutlineLocalShipping } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { BsPercent } from "react-icons/bs";

// const contentStyle = {
//   height: "160px",
//   color: "#fff",
//   lineHeight: "160px",
//   textAlign: "center",
//   background: "#364d79",
// };

const HomeCarousel = () => {
  return (
    <div className="h-full">
      <Carousel autoplay>
        <div>
          <img src={c1} alt="" />
        </div>
        <div>
          <img src={c2} alt="" />
        </div>
        <div>
          <img src={c3} alt="" />
        </div>
        <div>
          <img src={c4} alt="" />
        </div>
        <div>
          <img src={c5} alt="" />
        </div>
        <div>
          <img src={c6} alt="" />
        </div>
        <div>
          <img src={c7} alt="" />
        </div>
        <div>
          <img src={c8} alt="" />
        </div>
        {/* <div>
          <h3 style={contentStyle}><img src={c3} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={c4} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={c5} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={c6} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={c7} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img src={c8} alt="" /></h3>
        </div> */}
      </Carousel>

      <div className="lg:flex md:flex hidden justify-center items-center space-x-6 py-16 text-md font-bold">
        {/* Apple Reseller */}
        <div className="flex items-center space-x-2">
          {/* <img src={l1} alt="" className="w-36 h-12"/> */}
          <FaApple className="text-4xl text-black" />
          <span className="text-black">Authorised <br /> Reseller</span>
        </div>
        <hr className="border-r-2 h-8 ms-4 my-auto" />
        {/* Official Product */}
        <div className="flex items-center space-x-2">
          <img src={l2} className="text-2xl text-purple-500" />
          <span className="text-gray-700">Official Product</span>
        </div>
        <hr className="border-r-2 h-8 ms-4 my-auto" />
        {/* 0% EMI */}
        <div className="flex items-center space-x-2">
          <img src={l3} className="text-2xl text-yellow-500" />
          <span className="text-gray-700">0% EMI</span>
        </div>
        <hr className="border-r-2 h-8 ms-4 my-auto" />
        {/* Exchange */}
        <div className="flex items-center space-x-2">
          <img src={l4} className="text-2xl text-black" />
          <span className="text-gray-700">Exchange</span>
        </div>
        <hr className="border-r-2 h-8 ms-4 my-auto" />
        {/* Fastest Delivery */}
        <div className="flex items-center space-x-2">
          <img src={l5} className="text-2xl text-red-500" />
          <span className="text-gray-700">Fastest Delivery</span>
        </div>
        <hr className="border-r-2 h-8 ms-4 my-auto" />
        {/* 100% Secure Payment */}
        <div className="flex items-center space-x-2">
          <img src={l6} className="text-2xl text-green-500" />
          <span className="text-gray-700">
            100% Secure Payment
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;
