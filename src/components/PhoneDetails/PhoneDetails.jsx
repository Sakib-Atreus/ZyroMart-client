import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import SocialShare from "../../utils/SocialShare";
import { BsShare } from "react-icons/bs";

const PhoneDetails = () => {
  const [mainImage, setMainImage] = useState(
    "https://assets.gadgetandgear.com/upload/media/172432272608179.jpeg"
  ); // Default main image
  const [zoomImage, setZoomImage] = useState(null); // State to store zoomed image on hover
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // State to store mouse position for zoom
  const [visibleThumbnails, setVisibleThumbnails] = useState(0); // Track which set of thumbnails is visible
  const [showShareModal, setShowShareModal] = useState(false);

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
        <div className="col-span-2">
          <div className="flex space-x-4">
            {/* Thumbnail Images */}
            <div className="w-1/6 flex flex-col items-center">
              {/* Up arrow */}
              <button
                onClick={() => handleArrowClick("up")}
                className="text-gray-500 mb-2"
                disabled={visibleThumbnails === 0} // Disable when at the top
              >
                <IoIosArrowUp size={24} />
              </button>

              {/* Visible thumbnails */}
              {thumbnails
                .slice(visibleThumbnails, visibleThumbnails + 3)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-3/4 h-1/6 object-cover border cursor-pointer mb-2"
                    alt={`thumbnail-${index}`}
                    onClick={() => setMainImage(img)} // Change the main image on click
                  />
                ))}

              {/* Down arrow */}
              <button
                onClick={() => handleArrowClick("down")}
                className="text-gray-500 mt-2"
                disabled={visibleThumbnails === thumbnails.length - 3} // Disable when at the bottom
              >
                <IoIosArrowDown size={24} />
              </button>
            </div>

            {/* Main Image */}
            <div className="w-4/5 relative">
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
                <div className="absolute left-full top-0 ml-4 w-96 h-96 border overflow-hidden">
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
        <div className="space-y-8">
          {/* Product Info */}
          <div>
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
          <div>
            <div className="flex items-center space-x-4">
              {/* EMI Checkbox */}
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="emi" />
                <span className="text-sm">EMI</span>
              </label>

              {/* Z&M Gift Checkbox */}
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="ggGift" />
                <span className="text-sm">Z&M Gift</span>
              </label>
            </div>

            <div className="flex space-x-4 mt-4">
              {/* Cash Discount Price Box */}
              <div className="border border-orange-500 p-4 rounded-lg flex flex-col items-start space-y-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked
                  className="mb-2"
                />
                <span className="text-orange-500 font-bold text-md">
                  Tk. 14,999
                </span>
                <span className="text-gray-500 text-sm">
                  Cash Discount Price
                </span>
                <span className="text-gray-400 text-xs">
                  Online / Cash Payment
                </span>
              </div>

              {/* EMI Box */}
              <div className="border border-gray-300 p-4 rounded-lg flex flex-col items-start space-y-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="emi"
                  className="mb-2"
                />
                <span className="text-orange-500 font-bold text-sm">
                  Start From 5,000/month
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
          </div>
        </div>

        {/* Gift Options */}
        <div className="border p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-bold">Gift From G&G</h2>
          <div>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gift" />
              <span>Meko C35 PWS x 1</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gift" />
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
    </div>
  );
};

export default PhoneDetails;
