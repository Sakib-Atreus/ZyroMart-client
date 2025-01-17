import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Accessories = () => {
  return (
    <div>
      <div className="flex justify-between pt-12 pb-8 pe-2 lg:pe-0 md:pe-0">
        <h1 className="text-2xl text-center font-semibold px-2">
          Budget Accessories
        </h1>
        <Link className="flex text-center items-center gap-2 text-sm text-primary">
          Show All <IoIosArrowForward />
        </Link>
      </div>
      <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-1 gap-3 p-3 lg:p-0 md:p-0">
        <div className="row-span-2 col-span-1">
          <img
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1705386631054679.jpeg"
            alt=""
            className="h-full"
          />
        </div>

        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/product/20180602_1527933337_765022.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20191204_1575461019_541440.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Xiaomi Piston Basic Headphone
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/product/20210916_1631792031_233845.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/brand/20191204_1575461019_541440.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Mi USB Charger 33W - Fast Charge
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1712375263819209.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1723007199532868.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Baseus Super Si Quick Charger 1C 25W EU Sets
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1713678585049733.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1712639069442145.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            UGREEN USB 2.0 Type C to Type C Cable Nickel Plating
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1714472971263220.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/media/171446390585124.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Vyvylabs Crystal Series Fast Charging Data Cable Type C
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1716464082829171.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1716188558858898.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Joyroom JR-WQW01 Watch Wireless Charger
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
        <div className="max-w-sm rounded-lg shadow-lg p-4 bg-white">
          <img
            className="w-full h-48 object-contain"
            src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1717313848850990.jpeg"
            alt="Xiaomi Piston Basic Headphone"
          />
          <div className="flex justify-center items-center mt-4">
            <img
              className="h-8 w-14"
              src="https://dvf83rt16ac4w.cloudfront.net/upload/media/1717301586578112.png"
              alt="Brand Logo"
            />
          </div>
          <h2 className="text-md font-semibold text-center mt-2">
            Hoco M83 Wire-Controlled Digital Type-C Earphone
          </h2>
          <p className="text-center text-orange-600 text-md font-bold">
            Tk. 549
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex space-x-1 text-yellow-400">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalfAlt className="text-yellow-400" />
            </div>
            <span className="text-gray-600 text-sm font-medium ml-2">
              (4.5)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessories;
