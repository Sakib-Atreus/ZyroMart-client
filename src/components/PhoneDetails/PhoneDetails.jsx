import React, { useEffect, useState } from "react";
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import SocialShare from "../../utils/SocialShare";
import { BsShare } from "react-icons/bs";
import { FiThumbsUp } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { CiCircleQuestion } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

import "./PhoneDetails.css";

const PhoneDetails = () => {
  const [mainImage, setMainImage] = useState(
    "https://assets.gadgetandgear.com/upload/media/172432272608179.jpeg"
  ); // Default main image
  const [zoomImage, setZoomImage] = useState(null); // State to store zoomed image on hover
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // State to store mouse position for zoom
  const [visibleThumbnails, setVisibleThumbnails] = useState(0); // Track which set of thumbnails is visible
  const [thumbnailsToShow, setThumbnailsToShow] = useState(4);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("specification");

  // State to manage EMI checkbox and payment method
  const [isEmiChecked, setIsEmiChecked] = useState(false);
  const [isGiftChecked, setIsGiftChecked] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");


  // Adjust thumbnailsToShow based on screen width
  useEffect(() => {
    const handleResize = () => {
      setThumbnailsToShow(window.innerWidth < 768 ? 3 : 4); // Show 3 on mobile, 4 on desktop
    };

    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize); // Update on window resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const handleEmiToggle = () => {
    setIsEmiChecked(!isEmiChecked);
    if (!isEmiChecked) {
      setPaymentMethod("emi");
    } else {
      setPaymentMethod("cash");
    }
  };

  const handleGiftToggle = () => {
    setIsGiftChecked(!isGiftChecked);
    setShowGiftModal(!isGiftChecked);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setIsEmiChecked(method === "emi");
  };

  const closeModal = () => {
    setShowGiftModal(false);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const thumbnails = [
    "https://assets.gadgetandgear.com/upload/media/172432272608179.jpeg",
    "https://assets.gadgetandgear.com/upload/media/1724322716829420.jpeg",
    "https://assets.gadgetandgear.com/upload/media/1724322718571469.jpeg",
    "https://assets.gadgetandgear.com/upload/media/172432271857987.jpeg",
    "https://assets.gadgetandgear.com/upload/media/1724322718589070.jpeg",
    "https://assets.gadgetandgear.com/upload/media/1724322718582471.jpeg",
  ];

  // Handle arrow click to show next set of thumbnails
  const handleArrowClick = (direction) => {
    if (direction === "up" && visibleThumbnails > 0) {
      setVisibleThumbnails(visibleThumbnails - 1);
    } else if (
      direction === "down" &&
      visibleThumbnails < thumbnails.length - 3
    ) {
      setVisibleThumbnails(visibleThumbnails + 1);
    }
  };

  // Handle mouse movement over the main image to calculate zoom position
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = () => {
    if (navigator.share) {
      // Use native share API if available
      navigator
        .share({
          title: "HONOR X6b",
          text: "Check out this awesome phone: HONOR X6b",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for unsupported browsers: Copy the link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const shareUrl = "https://gadgetandgear.com/product/honor-x6b";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-4">
        <ol className="list-reset flex">
          <li>
            <a href="#" className="text-orange-600">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="#" className="text-orange-600">
              Phones
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a href="#" className="text-orange-600">
              HONOR
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>HONOR X6b</li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-2 md:col-span-2 col-span-1">
          <div className="flex lg:flex-row md:flex-row flex-col-reverse space-x-4">
            {/* Thumbnail Images */}
            <div className="lg:w-1/6 md:w-1/6 w-[25%] flex lg:flex-col md:flex-col flex-row lg:gap-0 md:gap-0 gap-3 items-center lg:justify-center md:justify-center justify-between">
              {/* Up arrow */}
              <button
                onClick={() => handleArrowClick("up")}
                className="text-gray-500 mb-2"
                disabled={visibleThumbnails === 0} // Disable when at the top
              >
                {/** Show different icons for mobile and desktop */}
                {window.innerWidth < 768 ? (
                  <IoIosArrowBack size={24} /> // Back arrow for mobile
                ) : (
                  <IoIosArrowUp size={24} /> // Up arrow for desktop
                )}
              </button>

              {/* Visible thumbnails */}
              {thumbnails
                .slice(visibleThumbnails, visibleThumbnails + thumbnailsToShow)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="lg:w-3/4 md:w-3/4 lg:h-1/6 md:h-1/6 lg:mt-0 md:mt-0 mt-4 object-cover border cursor-pointer mb-2"
                    alt={`thumbnail-${index}`}
                    onClick={() => setMainImage(img)} // Change the main image on click
                  />
                ))}

              {/* Down arrow */}
              <button
                onClick={() => handleArrowClick("down")}
                className="text-gray-500 mt-2"
                disabled={visibleThumbnails === thumbnails.length - 4} // Disable when at the bottom
              >
                {/** Show different icons for mobile and desktop */}
                {window.innerWidth < 768 ? (
                  <IoIosArrowForward size={24} /> // Forward arrow for mobile
                ) : (
                  <IoIosArrowDown size={24} /> // Down arrow for desktop
                )}
              </button>
            </div>

            {/* Main Image */}
            <div className="lg:w-[75%] md:w-[75%] relative">
              <img
                src={mainImage}
                className="w-full h-full object-cover"
                alt="Main product"
                onMouseEnter={() => setZoomImage(mainImage)} // Show zoomed image on hover
                onMouseMove={handleMouseMove} // Update zoom position on mouse move
                onMouseLeave={() => setZoomImage(null)} // Hide zoomed image when hover stops
              />

              {/* Zoomed Image */}
              {zoomImage && (
                <div className="absolute left-full top-0 ml-4 w-96 h-96 border overflow-hidden lg:block md:block hidden">
                  <img
                    src={zoomImage}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(-${zoomPosition.x}%, -${zoomPosition.y}%) scale(2.5)`, // Zoom in and adjust position
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                    alt="Zoomed product"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info & Options */}
        <div className="lg:-mx-8 space-y-8">
          {/* Product Info */}
          <div className="">
            <h1 className="text-md font-medium mt-2 mb-6 ps-1">HONOR</h1>
            <div className="flex items-center ">
              <h1 className="text-2xl font-bold">HONOR X6b</h1>
              <button
                className="text-gray-600 flex items-center space-x-1 hover:text-black transition duration-300 ms-4"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                <TiArrowForwardOutline size={16} />

                <span className="underline text-xs">Share</span>
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box bg-white">
                  <h3 className="font-semibold text-sm  italic">
                    Share this link via
                  </h3>
                  <p className="mt-3 ">
                    <SocialShare></SocialShare>
                  </p>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
            <p className="text-gray-500 mb-2">No Review Yet</p>
            <p className="text-2xl font-semibold text-orange-500">Tk. 14,999</p>

            <div className="mt-4">
              <label className="text-gray-600">Color:</label>
              <div className="flex space-x-2 mt-1">
                <div className="w-8 h-8 bg-black rounded-full border"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full border"></div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <span className="w-20">ROM:</span>
                <span className="text-gray-500">128GB</span>
              </div>
              <div className="flex items-center">
                <span className="w-20">RAM:</span>
                <span className="text-gray-500">6GB</span>
              </div>
            </div>

            <div className="flex mt-4">
              <span className="text-sm">Warranty:</span>
              <span className="text-primary text-xs font-semibold ms-2">
                12 Months (Please preserve your box to claim warranty)
              </span>
            </div>
          </div>

          {/* Pricing & Purchase Options */}
          {/* <div>
            <div className="flex items-center space-x-4">

              <label className="flex items-center space-x-2">
                <input type="checkbox" name="emi" 
                className="peer w-4 h-4 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                />
                <span className="text-sm">EMI</span>

                <span className="absolute hidden peer-checked:block text-white font-bold text-xs pointer-events-none ">
                <FaCheck />
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="checkbox" name="ggGift"
                className="peer w-4 h-4 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none" 
                />
                <span className="text-sm">Z&M Gift</span>

                <span className="absolute hidden peer-checked:block text-white font-bold text-xm pointer-events-none">
                <FaCheck />
                </span>
              </label>
            </div>

            <div className="flex space-x-4 mt-4">
              <div className="border border-orange-500 p-4 rounded-lg flex flex-col items-start space-y-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked
                  className="mb-2 peer w-4 h-4 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                />
                <span className="text-orange-500 font-bold text-md">
                  Tk. 14,999
                </span>

                <span className="absolute hidden peer-checked:block text-white font-bold text-xs pointer-events-none">
                <FaCheck />
                </span>

                <span className="text-gray-500 text-sm">
                  Cash Discount Price
                </span>
                <span className="text-gray-400 text-xs">
                  Online / Cash Payment
                </span>
              </div>

              <div className="border border-gray-300 p-4 rounded-lg flex flex-col items-start space-y-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="emi"
                  className="mb-2 peer w-4 h-4 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                />
                <span className="text-orange-500 font-bold text-sm">
                  Start From 5,000/month
                </span>

                <span className="absolute hidden peer-checked:block text-white font-bold text-xs pointer-events-none ">
                <FaCheck />
                </span>

                <span className="text-gray-500 text-sm">
                  0% EMI Price: Tk. 14,999
                </span>
                <span className="text-gray-400 text-xs">Up to 3 Months</span>
              </div>
            </div>

            <div className="grid grid-cols-2 space-x-4 mt-6">
              <button className="bg-gray-200 py-2 px-4 rounded-lg">
                Add To Cart
              </button>
              <button className="bg-orange-500 text-white py-2 px-4 rounded-lg">
                Buy Now
              </button>
            </div>
          </div>  */}

          <div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 relative">
                <input
                  type="checkbox"
                  name="emi"
                  checked={isEmiChecked}
                  onChange={handleEmiToggle}
                  className="peer w-6 h-6 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                />
                <span className="text-sm">EMI</span>

                <span className="absolute inset-0 items-center justify-center hidden peer-checked:block text-white font-bold text-sm pointer-events-none">
                  ✓
                </span>
              </label>

              <label className="flex items-center space-x-2 relative">
                <input
                  type="checkbox"
                  name="ggGift"
                  checked={isGiftChecked}
                  onChange={handleGiftToggle}
                  className="peer w-6 h-6 rounded-sm border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                />
                <span className="text-sm">Z&M Gift</span>
                <span className="absolute inset-0 items-center justify-center hidden peer-checked:block text-white font-bold text-sm pointer-events-none">
                  ✓
                </span>
              </label>
            </div>

            <div className="flex space-x-4 mt-4">
              <div
                className={`border p-4 rounded-lg flex flex-col items-start space-y-1 ${
                  paymentMethod === "cash"
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
              >
                <label className="relative flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                    className="peer w-6 h-6 rounded-full border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                  />
                  <span className="text-md text-orange-500 font-bold">
                    Tk. 14,999
                  </span>

                  <span className="absolute inset-0 items-center justify-center hidden peer-checked:block text-white font-bold text-sm pointer-events-none">
                    ✓
                  </span>
                </label>
                <span className="text-gray-500 text-sm">
                  Cash Discount Price
                </span>
                <span className="text-gray-400 text-xs">
                  Online / Cash Payment
                </span>
              </div>

              <div
                className={`border p-4 rounded-lg flex flex-col items-start space-y-1 ${
                  paymentMethod === "emi"
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
              >
                <label className="relative flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="emi"
                    checked={paymentMethod === "emi"}
                    onChange={() => handlePaymentMethodChange("emi")}
                    className="peer w-6 h-6 rounded-full border border-gray-300 bg-white checked:bg-orange-500 checked:border-transparent focus:outline-none appearance-none"
                  />
                  <span className="text-sm text-orange-500 font-bold">
                    Start From 5,000/month
                  </span>

                  <span className="absolute inset-0 items-center justify-center hidden peer-checked:block text-white font-bold text-sm pointer-events-none">
                    ✓
                  </span>
                </label>
                <span className="text-gray-500 text-sm">
                  0% EMI Price: Tk. 14,999
                </span>
                <span className="text-gray-400 text-xs">Up to 3 Months</span>
              </div>
            </div>

            {showGiftModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-1/2 max-w-lg space-y-4">
                  <h2 className="text-lg font-bold">Gift From Z&M</h2>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gift" />
                      <img
                        className="w-12 rounded-3xl"
                        src="https://assets.gadgetandgear.com/upload/media/1705386929898370.jpeg"
                        alt="Meko C35 PWS"
                      />
                      <span>Meko C35 PWS x 1</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gift" />
                      <img
                        className="w-12 rounded-3xl"
                        src="https://assets.gadgetandgear.com/upload/media/1723463341930242.jpeg"
                        alt="MEKO N3 Sports Wireless Neckband"
                      />
                      <span>MEKO N3 Sports Wireless Neckband x 1</span>
                    </label>
                  </div>

                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 space-x-4 mt-6">
              {!isEmiChecked && (
                <button className="bg-gray-200 py-2 px-4 rounded-lg">
                  Add To Cart
                </button>
              )}
              <button className="bg-orange-500 text-white py-2 px-4 rounded-lg">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Gift Options */}
        <div className="border p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-bold">Gift From Z&M</h2>
          <div>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gift" />
              <img
                className="w-12 rounded-3xl"
                src="https://assets.gadgetandgear.com/upload/media/1705386929898370.jpeg"
                alt=""
              />
              <span>Meko C35 PWS x 1</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gift" />
              <img
                className="w-12 rounded-3xl"
                src="https://assets.gadgetandgear.com/upload/media/1723463341930242.jpeg"
                alt=""
              />
              <span>MEKO N3 Sports Wireless Neckband x 1</span>
            </label>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Share this link via</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="flex space-x-4 mt-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href={`https://twitter.com/share?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                <FaTwitter size={28} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500"
              >
                <FaWhatsapp size={28} />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-sm">Or copy link</p>
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-gray-200 text-sm py-2 px-4 ml-2 rounded-lg"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <hr className="my-8 mb-16" />

      <div className="grid lg:grid-cols-8 md:grid-cols-8 grid-cols-6 gap-5">
        <div className="col-span-6">
          <div className="tabs-container">
            <ul className="flex overflow-x-auto whitespace-nowrap no-scrollbar">
              <li
                className={`text-md font-semibold lg:px-4 md:px-4 px-2 py-2 cursor-pointer ${
                  activeTab === "specification"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-black hover:text-orange-500"
                }`}
                onClick={() => handleTabClick("specification")}
              >
                Specification
              </li>
              <li
                className={`text-md font-semibold lg:px-4 md:px-4 px-2 py-2 cursor-pointer ${
                  activeTab === "description"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-black hover:text-orange-500"
                }`}
                onClick={() => handleTabClick("description")}
              >
                <a href="#desc">Description</a>
              </li>
              <li
                className={`text-md font-semibold lg:px-4 md:px-4 px-2 py-2 cursor-pointer ${
                  activeTab === "reviews"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-black hover:text-orange-500"
                }`}
                onClick={() => handleTabClick("reviews")}
              >
                <a href="#rev">Reviews (0)</a>
              </li>
              <li
                className={`text-md font-semibold lg:px-4 md:px-4 px-2 py-2 cursor-pointer ${
                  activeTab === "questions"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-black hover:text-orange-500"
                }`}
                onClick={() => handleTabClick("questions")}
              >
                <a href="#ques">Questions (0)</a>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-orange-500">
              Specification
            </h2>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">Battery</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">
                  Connectivity and Location
                </p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">
                  Cellular Network
                </p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">Rear Camera</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">Memory</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">System</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">Processor</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 text-orange-500 rounded-md mt-4">
                <p className="text-md font-semibold py-2 px-4">Display</p>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Sensors</h4>
                <h3 className="col-span-4">
                  Fingerprint Sensor, Gravity Sensor, Ambient Light Sensor,
                  Proximity Sensor
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Bluetooth</h4>
                <h3 className="col-span-4">
                  BT5.1, Supported BLE,SBC,AAC,LDAC,aptX,aptX HD
                </h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Hotspot</h4>
                <h3 className="col-span-4">Supported</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Frequency</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
              <div className="grid grid-cols-6 py-3 px-4 border-b text-gray-700">
                <h4 className="col-span-2">Wi-Fi Protocols</h4>
                <h3 className="col-span-4">2.4GHz and 5GHz</h3>
              </div>
            </div>
          </div>
          <div className="mt-6" id="desc">
            <h2 className="text-xl font-semibold text-orange-500">
              Description
            </h2>
            <hr className="mt-2 text-gray-900 border" />
            <div>
              <h2 className="my-2 text-2xl font-bold">HONOR X6B</h2>
              <p>
                The HONOR X6B is a feature-packed smartphone designed for users
                who demand style, performance, and reliability. This unlocked
                Android device combines a sleek design with powerful
                specifications, ensuring a seamless and enjoyable mobile
                experience.
              </p>
              <h2 className="my-2 text-2xl font-bold">
                Key Features of HONOR X6B
              </h2>
              <p>
                The Honor X6B comes with features that make the Smartphone more
                attractive to the customers. Here’s the details feature of HONOR
                X6B:
              </p>
              <h2 className="my-2 text-xl font-bold">
                6.56-Inch 90Hz Display:
              </h2>
              <p>
                Dive into a smoother and more immersive viewing experience with
                the 6.56-inch FullView display. The 90Hz refresh rate ensures
                that everything from scrolling to gaming is incredibly fluid,
                while the vibrant colors and sharp resolution make videos and
                photos come to life.
              </p>
              <h2 className="my-2 text-xl font-bold">Storage:</h2>
              <p>
                With 6GB of RAM, the HONOR X6B handles multitasking with ease,
                letting you switch between apps without lag. The 128GB of
                internal storage offers ample space to store your favorite apps,
                high-resolution photos, and videos. Expandable storage options
                give you the flexibility to add more as needed.
              </p>
              <h2 className="my-2 text-xl font-bold">Long-Lasting Battery:</h2>
              <p>
                Power through your day without worrying about frequent charging.
                The 5200mAh battery provides all-day power, perfect for heavy
                users who rely on their phone for work, entertainment, and
                staying connected. With intelligent power management, the
                battery optimizes usage to ensure you get the most out of every
                charge.
              </p>
              <h2 className="my-2 text-xl font-bold">Triple Camera System:</h2>
              <p>
                Capture every moment in stunning detail with the 50MP triple
                camera system. The main camera delivers sharp, high-quality
                images, while the additional lenses offer versatility with
                wide-angle and macro capabilities. Whether you’re shooting
                landscapes, portraits, or close-ups, the HONOR X6B ensures every
                shot is picture-perfect.
              </p>
              <h2 className="my-2 text-xl font-bold">
                Android Operating System:
              </h2>
              <p>
                Enjoy the latest Android experience with a user-friendly
                interface, access to millions of apps on the Google Play Store,
                and regular updates to keep your device secure and running
                smoothly.
              </p>
              <h2 className="my-2 text-xl font-bold">1-Years Warranty:</h2>
              <p>
                This device is protected with a 1-years warranty, providing
                coverage for manufacturing defects and ensuring your investment
                is safeguarded.
              </p>
              <h2 className="my-2 text-2xl font-bold">
                Reasons to Buy the HONOR X6B
              </h2>
              <p>
                The HONOR X6B is the ideal choice for users seeking a versatile,
                high-performance smartphone that delivers exceptional value.
                Whether you’re a tech enthusiast, a photography lover, or
                someone who needs a reliable phone for everyday use, the HONOR
                X6B has you covered.
              </p>
              <h2 className="my-2 text-2xl font-bold">
                Get your Honor X6B Smartphone from Gadget & Gear
              </h2>
              <p>
                You can find this feature-packed smartphone available at Gadget
                and Gear, your trusted retailer for the latest tech devices.
                Known for offering authentic products with reliable service,
                Gadget and Gear ensures a seamless buying experience, whether
                you’re shopping online or in-store. Get your HONOR X6B today
              </p>
              <h2 className="my-2 text-xl font-semibold text-orange-500">
                What is the price of HONOR X6b in Bangladesh?
              </h2>
              <hr className="my-2 text-gray-900 border" />
              <p>
                The latest price of HONOR X6b in Bangladesh is BDT 14999. You
                can buy the HONOR X6b at best price from our website or visit
                any of our store .
              </p>
            </div>
          </div>
          <div className="mt-6" id="rev">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-500">Reviews</h2>
              <button className="text-md  bg-orange-100 bg-opacity-70 px-3 py-1 text-orange-500">
                Write a Review
              </button>
            </div>
            <hr className="mt-2 text-gray-900 border" />
            <div className="flex flex-col items-center justify-center my-16">
              {/* Thumbs Up Icon with Stars */}
              <FiThumbsUp className="text-5xl text-black mb-2" />
              <div className="flex space-x-1 mb-4">
                <span className="text-xl text-gray-700">
                  <FaRegStar />
                </span>
                <span className="text-xl text-gray-700">
                  <FaRegStar />
                </span>
                <span className="text-xl text-gray-700">
                  <FaRegStar />
                </span>
              </div>

              {/* No Review Text */}
              <p className="text-xl  text-black mb-2">No Review Found</p>

              {/* Write a Review Button */}
              <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-200 transition duration-300">
                Write a Review
              </button>
            </div>
          </div>

          <div className="mt-6" id="ques">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-500">
                Questions
              </h2>
              <button className="text-md  bg-orange-100 bg-opacity-70 px-3 py-1 text-orange-500">
                Ask a Question
              </button>
            </div>
            <hr className="mt-2 text-gray-900 border" />
            <div className="flex flex-col items-center justify-center my-16">
              {/* Thumbs Up Icon with Stars */}
              <CiCircleQuestion className="text-6xl text-black mb-2" />

              {/* No Review Text */}
              <p className="text-xl text-black mb-2">No Question Found</p>

              {/* Write a Review Button */}
              <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-200 transition duration-300">
                Ask a Question
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 md:col-span-2 col-span-6">
          <div>
            <h2 className="text-2xl font-semibold">Related Products</h2>
            <div className="mt-6">
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Similar Products</h2>
            <div className="mt-6">
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/media/1719983159812679.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">vivo Y28</h3>
                  <h4 className="font-bold text-orange-500">Tk. 19,999</h4>
                  <p className="text-sm">
                    <div className="flex space-x-2 mb-4 items-center">
                      <span className="text-md text-yellow-400">
                        <FaStar />
                      </span>
                      <span className="text-md text-yellow-400">
                        <FaStar />
                      </span>
                      <span className="text-md text-yellow-400">
                        <FaStar />
                      </span>
                      <span className="text-md text-yellow-400">
                        <FaStar />
                      </span>
                      <span className="text-md text-yellow-400">
                        <FaStar />
                      </span>
                      <span className="font-medium">(5.0)</span>
                    </div>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
              <div className="flex gap-4 items-center p-2 border">
                <img
                  className="w-24 h-24"
                  src="https://assets.gadgetandgear.com/upload/product/20231105_1699173058_456356.jpeg"
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">HONOR X5 Plus</h3>
                  <h4 className="font-bold text-orange-500">Tk. 12,999</h4>
                  <p className="text-sm">No Review Yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetails;
