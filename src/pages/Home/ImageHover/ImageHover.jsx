import React from "react";
import "./ImageHover.css";
import { Link } from "react-router-dom";
import img1 from "../../../assets/HomeImageHover/imgHovSec1.jpg";
import img2 from "../../../assets/HomeImageHover/imgHovSec2.jpeg";
import img3 from "../../../assets/HomeImageHover/imgHovSec3.jpg";
import img4 from "../../../assets/HomeImageHover/imgHovSec4.jpg";
import img5 from "../../../assets/HomeImageHover/imgHovSec5.jpg";
import img6 from "../../../assets/HomeImageHover/imgHovSec6.webp";

const ImageHover = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-5 md:grid-cols-5 grid-cols-1 my-4">
        <img
          className="box lg:col-span-3 md:col-span-3 w-full h-full"
          src={img4}
          alt="gadget"
        />
        <img
          className="box lg:col-span-2 md:col-span-2 w-full h-full"
          src={img2}
          alt="gadget"
        />
        <img
          className="box lg:col-span-2 md:col-span-2 w-full h-full"
          src={img3}
          alt="gadget"
        />
        <img
          className="box lg:col-span-3 md:col-span-3 w-full h-full"
          src={img1}
          alt="gadget"
        />
        <img
          className="box lg:col-span-3 md:col-span-3 w-full h-full object-cover"
          src={img5}
          alt="gadget"
        />
        <img
          className="box lg:col-span-2 md:col-span-2 w-full h-full object-cover"
          src={img6}
          alt="gadget"
        />
      </div>
      {/* text description about the website products */}
      <div className="my-8 lg:mx-0 md:mx-4 mx-1/3 text-justify px-3 lg:px-0 md:px-0">
        <div className="my-6">
          <h2 className="text-xl font-bold my-2">
            The ZyroMart Experience - Official Apple Products, Premium Brands,
            and Exceptional Service in Bangladesh
          </h2>
          <p className="text-md">
            Gadget & Gear stands as the top Apple Authorised Reseller in
            Bangladesh. Since 2011, we have been a reliable source in Bangladesh
            for all official Apple products such as{" "}
            <Link to="/" className="text-primary underline">
              iPhone
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              AirPods
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              MacBook
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              Mac mini
            </Link>
            , and more. We also have a premium selection of official
            smartphones, unique gadgets, and authentic accessories. The brand
            has earned the trust of hundreds of thousands of customers and
            continues to maintain high standards with 21 premium outlets all
            across Dhaka.
          </p>
        </div>
        <div className="my-6">
          <h2 className="text-xl font-bold my-2">
            Is There an Apple Store in Bangladesh?
          </h2>
          <p>
            Gadget Studio by G&G is the first ever Apple Mono-store in
            Bangladesh, providing the Apple Authorised Experience to our
            customers. Being the only Apple Authorised Reseller in Bangladesh,
            we are proudly listed on
            {" "}
            <Link to="/" className="text-primary underline">
              Apple Store Locator
            </Link>
            , Gadget Studio mirrors the exceptional service standards of an
            Apple Store, ensuring a seamless and unparalleled customer
            experience. As your reliable destination for all original Apple
            products, we offer exceptional buying experiences and after-sales
            service for official iPhone, MacBook, AirPods,
            {" "}
            <Link to="/" className="text-primary underline">
              Apple
            </Link>
            <Link to="/" className="text-primary underline">
              Watch
            </Link>
            <Link to="/" className="text-primary underline">
              iPad
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              iMac
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              Mac Studio
            </Link>
            , and more. We also have a premium selection of official
            smartphones, unique gadgets, and authentic accessories. The brand
            has earned the trust of hundreds of thousands of customers and
            continues to maintain high standards with 21 premium outlets all
            across Dhaka.
          </p>
        </div>
        <div className="my-6">
          <h2 className="text-xl font-bold my-2">
            What is the Best Online Gadget Shop in Bangladesh?
          </h2>
          <p>
            Gadget & Gear is the most premium and multi-branded omnichannel
            retailer in Bangladesh. Our services are not only limited to the
            physical outlets. With our fully operational e-commerce platform,
            our valued customers can now enjoy the same dependable and
            time-tested services we have consistently provided, conveniently and
            seamlessly online. <br /> <br />
            Gadget & Gear has a vast selection of high-end gadgets and
            accessories from some of the most reputable global brands. This
            impressive lineup includes Apple,{" "}
            <Link to="/" className="text-primary underline">
              Samsung
            </Link>
            ,{" "}
            <Link to="/" className="text-primary underline">
              OnePlus
            </Link>
            , Xiaomi, Vivo, Oppo, Huawei, HONOR, Realme, Tecno, Meta, Amazon,
            SanDisk, Baseus, Anker, Tucano, JBL, Bose, Edifier, Marshall, Beats,
            Sony, MEKO, Harman Kardon, DJI, GoPro, Amazfit, Belkin, UAG, Spigen,
            SwitchEasy, and many more.
          </p>
        </div>
        <div className="my-6">
          <h2 className="text-xl font-bold my-2">
            Which Gadget Shop in Bangladesh Offers Warranty and EMI?
          </h2>
          <p>
            What sets Gadget and Gear apart is our commitment to delivering
            products of the highest quality with guaranteed authenticity,
            official warranty, attractive discount offers, convenient EMI
            financing, and thoughtful gifts with select purchases. At Gadget &
            Gear, we strive to ensure that our valued customers have a seamless
            and enjoyable tech shopping experience. We hold pride in delivering
            genuine products and an exceptional customer experience. Our
            unwavering commitment is to surpass expectations, consistently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageHover;
