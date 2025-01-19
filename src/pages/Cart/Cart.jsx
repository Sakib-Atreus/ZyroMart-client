import { useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

const Cart = () => {
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
        "https://smartbuy-me.com/cdn/shop/files/ABJ1501ST0241_1.jpg?v=1722968254&width=1200",
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
  const [coupon, setCoupon] = useState(""); // For coupon input
  const [discount, setDiscount] = useState(0); // For discount amount
  const [showAlert, setShowAlert] = useState(products.length === 0); // Show alert if cart is empty

  const validCoupons = {
    HAPPY10: 10, // 10% discount
    SAVE20: 20, // 20% discount
  };

  const updateQuantity = (id, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter(
        (product) => product.id !== id
      );
      if (updatedProducts.length === 0) {
        setShowAlert(true);
      }
      return updatedProducts;
    });
  };

  const getSubtotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const handleQuantityChange = (id, operator) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity:
                operator === "increase"
                  ? product.quantity + 1
                  : Math.max(product.quantity - 1, 1),
            }
          : product
      )
    );
  };

  const handleApplyCoupon = () => {
    if (validCoupons[coupon.toUpperCase()]) {
      const discountPercentage = validCoupons[coupon.toUpperCase()];
      const subtotal = getSubtotal();
      setDiscount((subtotal * discountPercentage) / 100);
    } else {
      alert("Invalid coupon code!");
      setDiscount(0); // Reset discount if the coupon is invalid
    }
  };

  const getTotal = () => {
    return getSubtotal() - discount;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showAlert && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 flex items-center justify-between">
          <p className="text-md font-semibold">
            Your cart is empty.{" "}
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

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* Cart Items (Left Side) */}
          <div className="space-y-6 col-span-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-1 lg:p-4 md:p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-24 lg:w-24 md:w-24 lg:h-24 md:h-24 object-cover rounded-md shadow-sm"
                  />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-xl font-semibold text-gray-900">
                      ${product.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end ml-auto lg:pe-8 md:pe-6">
                  <button
                    className="text-xl font-bold hover:text-primary"
                    onClick={() => handleQuantityChange(product.id, "decrease")}
                  >
                    <FaCircleMinus className="text-2xl" />
                  </button>
                  <input
                    type="number"
                    className="w-[20%] lg:w-[40%] md:w-[30%] mx-auto text-xl font-semibold text-center border rounded-md bg-white"
                    value={product.quantity}
                    readOnly
                  />
                  <button
                    className="text-xl font-bold hover:text-primary"
                    onClick={() => handleQuantityChange(product.id, "increase")}
                  >
                    <FaCirclePlus className="text-2xl" />
                  </button>
                </div>

                <div className="pb-24 lg:pb-0 md:pb-0">
                  <button
                    className="text-red-500 text-2xl"
                    onClick={() => removeProduct(product.id)}
                  >
                    <span className="hidden sm:block">
                      <RiDeleteBin5Line />
                    </span>
                    <span className="block sm:hidden text-2xl font-bold">
                      &times;
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary (Right Side) */}
          <div className="max-h-max bg-white border rounded-lg shadow-md p-6 col-span-2 lg:col-span-1 md:col-span-1">
            <h2 className="text-xl font-semibold opacity-70 text-primary pb-4">
              Order Summary
            </h2>
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-lg">Subtotal:</span>
              <span className="font-semibold text-lg text-gray-800">
                ${getSubtotal().toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mb-4 items-center">
              <span className="font-semibold text-lg">Shipping Fee:</span>
              <span className="font-semibold text-sm text-gray-500">
                Calculated at checkout
              </span>
            </div>

            {/* Coupon Section */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Voucher Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-[73%] lg:w-[72%] md:w-[68%] p-2 border rounded-md mb-2 bg-white mt-2 me-2 focus:outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="w-[24%] lg:w-[24%] md:w-[25%] py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary"
              >
                Apply
              </button>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-4">
                <span className="font-medium text-lg text-gray-500">
                  Discount:
                </span>
                <span className="font-semibold text-lg text-gray-500">
                  -${discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-xl">Total:</span>
              <span className="font-semibold text-xl text-primary">
                ${getTotal().toFixed(2)}
              </span>
            </div>
            <button className="btn border-none w-full py-3 hover:bg-primary text-white text-md font-semibold rounded-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button className="btn btn-md border-1 border-primary bg-white text-primary hover:bg-primary hover:text-white hover:border-none text-md">
        Add Items from Wishlist
      </button>
        <p className="text-center text-gray-500 mt-8 text-lg">
          Your cart is empty.{" "}
          <a href="/" className="text-blue-600 underline">
            Start shopping
          </a>
          .
        </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
