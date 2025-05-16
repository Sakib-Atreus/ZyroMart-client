import { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const initialProducts = [
    {
      id: 1,
      name: "Product Name Na me NAme Hello ",
      category: "Category Name",
      price: 19.99,
      quantity: 1,
      imageUrl:
        "https://d61s2hjse0ytn.cloudfront.net/category_cover/1/iPhone_14_Pro_Max.webp",
    },
    {
      id: 2,
      name: "Product Name",
      category: "Category Name",
      price: 29.99,
      quantity: 1,
      imageUrl:
        "https://9to5google.com/wp-content/uploads/sites/4/2024/01/pixel-9-onl-3.jpg",
    },
    {
      id: 3,
      name: "Product Name",
      category: "Category Name",
      price: 19.99,
      quantity: 1,
      imageUrl:
        "https://d61s2hjse0ytn.cloudfront.net/category_cover/1/iPhone_14_Pro_Max.webp",
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [showAlert, setShowAlert] = useState(false);

  // Check for empty products list on initial render
  useEffect(() => {
    if (products.length === 0) {
      setShowAlert(true);
    }
  }, [products]);

  const removeProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);

    if (updatedProducts.length === 0) {
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Left Sidebar */}
      <div className="w-1/4 max-h-max bg-white border rounded-lg shadow-md p-4 pb-8 hidden lg:block md:block">
        <div className="flex items-center justify-center flex-col space-y-2 mb-8 text-center">
          <img
            className="w-16 h-16 rounded-full"
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
            alt="user photo"
          />
          <h2 className="text-lg font-bold mb-4">Samiul Islam Sakib</h2>
        </div>
        <ul className="space-y-4 text-gray-700">
          <li>
            <Link to="/account" className="hover:text-primary font-semibold">
              My Account
            </Link>
          </li>
          <li>
            <Link to="/orders" className="hover:text-primary font-semibold">
              My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/ebook-library"
              className="hover:text-primary font-semibold"
            >
              My eBook Library
            </Link>
          </li>
          <li>
            <Link to="/lists" className="hover:text-primary font-semibold">
              My Lists
            </Link>
          </li>
          <li>
            <Link to="/bookshelf" className="hover:text-primary font-semibold">
              My Bookshelf
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="text-primary font-semibold">
              My Wishlist
            </Link>
          </li>
          <li>
            <Link to="/interests" className="hover:text-primary font-semibold">
              My Interests
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 flex items-center justify-between">
            <p className="text-md font-semibold">
              Your wishlist is empty.{" "}
              <a href="/shop" className="text-blue-600">
                Continue shopping
              </a>
              .
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="text-yellow-700 font-bold text-lg"
            >
              &times;
            </button>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            <div className="space-y-6 col-span-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-1 py-3 lg:p-4 md:p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-24 lg:w-32 md:w-28 lg:h-32 md:h-24 object-cover rounded-md shadow-sm"
                    />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-xl font-semibold text-gray-900">
                        ${product.price}
                      </p>
                      <button className="btn btn-sm border-1 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:border-none">
                        Add To Cart
                      </button>
                    </div>
                  </div>

                  <div className="lg:pb-0 md:pb-0">
                    <button
                      className="text-red-500 text-2xl"
                      onClick={() => removeProduct(product.id)}
                    >
                      <RiDeleteBin5Line />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 col-span-3 text-center">
              No products in the wishlist.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
