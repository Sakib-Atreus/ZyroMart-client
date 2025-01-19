import { Input, Space, Avatar, Badge } from "antd";
// import type { GetProps } from 'antd';
import "./Navbar.css";
import {
  AudioOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaPhoneAlt, FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

// type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const items = [
  {
    key: "sub1",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/phones">
          Phones
        </Link>
      </p>
    ),
    danger: true,
    children: [
      {
        key: "1-1",
        // label: "Item 1",
        type: "group",
        children: [
          {
            key: "1",
            label: <Link to="/">Home ZyroMart</Link>,
          },
          {
            key: "2",
            label: "Option 2",
          },
          {
            key: "3",
            label: "Option 3",
          },
          {
            key: "4",
            label: "Option 4",
          },
        ],
      },
    ],
  },
  {
    key: "sub2",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          iPad & Tab
        </Link>
      </p>
    ),
    children: [
      {
        key: "5",
        label: "Option 5",
      },
      {
        key: "6",
        label: "Option 6",
      },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          {
            key: "7",
            label: "Option 7",
          },
          {
            key: "8",
            label: "Option 8",
          },
        ],
      },
    ],
  },
  {
    key: "sub4",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Mac
        </Link>
      </p>
    ),
    children: [
      {
        key: "9",
        label: "Option 9",
      },
      {
        key: "10",
        label: "Option 10",
      },
      {
        key: "11",
        label: "Option 11",
      },
      {
        key: "12",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub5",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Wearable
        </Link>
      </p>
    ),
    children: [
      {
        key: "13",
        label: "Option 9",
      },
      {
        key: "14",
        label: "Option 10",
      },
      {
        key: "15",
        label: "Option 11",
      },
      {
        key: "16",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub6",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Headphone & Speaker
        </Link>
      </p>
    ),
    children: [
      {
        key: "17",
        label: "Option 9",
      },
      {
        key: "18",
        label: "Option 10",
      },
      {
        key: "19",
        label: "Option 11",
      },
      {
        key: "20",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub7",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Accessories
        </Link>
      </p>
    ),
    children: [
      {
        key: "21",
        label: "Option 9",
      },
      {
        key: "22",
        label: "Option 10",
      },
      {
        key: "23",
        label: "Option 11",
      },
      {
        key: "23",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub8",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Camera
        </Link>
      </p>
    ),
    children: [
      {
        key: "21",
        label: "Option 9",
      },
      {
        key: "22",
        label: "Option 10",
      },
      {
        key: "23",
        label: "Option 11",
      },
      {
        key: "23",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub9",
    label: (
      <p className="lg:text-white md:text-white text-black">
        <Link className="hover:text-white" to="/">
          Video Games
        </Link>
      </p>
    ),
    children: [
      {
        key: "21",
        label: "Option 9",
      },
      {
        key: "22",
        label: "Option 10",
      },
      {
        key: "23",
        label: "Option 11",
      },
      {
        key: "23",
        label: "Option 12",
      },
    ],
  },
  {
    key: "sub10",
    label: (
      <p className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-semibold ">
        Online Exclusive
      </p>
    ),
  },
];
const onClick = (e) => {
  console.log("click", e);
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const initialProducts = [
    {
      id: 1,
      name: "Product Name",
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
    // Add more products here
  ];

  const [products, setProducts] = useState(initialProducts);

  const removeProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };
  return (
    <nav className="bg-[#191A20] sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-[1] mt-0 left-0 w-52  "
            >
              <Menu
                className="bg-white text-black"
                onClick={onClick}
                style={{
                  width: 220,
                }}
                mode="vertical"
                items={items}
              />
            </ul>
          </div>
          <Link className="lg:text-3xl md:text-3xl text-2xl font-bold ps-2 text-white">
            Zyro<span className="text-primary">Mart</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex md:flex justify-center lg:w-[50%] md:w-[30%] lg:-ms-8 md:me-20">
          <Search
            // style={{
            //   backgroundColor: "green",
            //   color: "white",
            // }}
            className="custom-search"
            placeholder="Search products"
            allowClear
            enterButton="Search"
            size="medium"
            //   onSearch={onSearch}
          />
        </div>

        <div className="navbar-end lg:flex md:flex gap-4 hidden">
          <Link to="/storeLocations" className="btn btn-sm bg-[#FFE6C71A] text-white hover:bg-primary h-10">
            <FaLocationDot className="text-xl" /> <p>Store Locator</p>
          </Link>
          <Link
            to="/wishlist"
            className="btn btn-sm bg-[#FFE6C71A] text-white text-2xl hover:bg-primary h-10"
          >
            <a href="/wishlist">
              <Badge count={5} className="custom-badge">
                {" "}
                {/* Apply custom class */}
                <FaHeart className="custom-icon" />{" "}
                {/* Apply custom icon class */}
              </Badge>
            </a>
          </Link>

          {/* Cart Drawer */}
          <button
            onClick={showDrawer}
            className="btn btn-sm bg-[#FFE6C71A] text-white text-2xl hover:bg-primary h-10"
          >
            <ShoppingCartOutlined />
          </button>
          <Drawer title="My Cart" onClose={onClose} open={open}>
            {products.length > 0 ? (
              <div className="grid grid-cols-1">
                {/* Cart Items (Left Side) */}
                <div className="space-y-6 col-span-2">
                  {products.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-md shadow-sm"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.category}
                          </p>
                          <p className="text-xl font-semibold text-gray-900">
                            ${product.price}
                          </p>
                        </div>
                      </div>

                      <button
                        className="text-red-500 text-2xl"
                        onClick={() => removeProduct(product.id)}
                      >
                        <RiDeleteBin5Line />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-8 text-lg">
                Your cart is empty.{" "}
                <a href="/" className="text-blue-600 underline">
                  Start shopping
                </a>
                .
              </p>
            )}

            <div className="text-center my-6">
              <Link
                to="/cart"
                onClick={onClose}
                className="btn btn-sm bg-white text-primary text-md border-1 border-primary hover:bg-primary hover:text-white hover:border-none"
              >
                <ShoppingCartOutlined className="text-2xl" /> View All Cart
              </Link>
            </div>
          </Drawer>
          {/* Cart Drawer close */}

          <Link
            to="/login"
            className="btn btn-sm bg-[#FFE6C71A] text-white text-xl hover:bg-primary h-10"
          >
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
        {/* Search for mobile device */}
        <Search
          className="lg:hidden md:hidden flex w-full justify-end px-4 py-2 custom-search"
          placeholder="Search"
          allowClear
          enterButton
          size="medium"
          //   onSearch={onSearch}
          style={{
            width: "100%",
          }}
          inputStyle={{
            color: "black", // Adjust the font size of the input (affects placeholder too)
          }}
        />
      </div>

      {/* For mobile phone */}
      {/* <div className="fixed bottom-0 z-50">
        <div className=" border-t-1 bg-yellow-500 lg:hidden md:hidden flex w-full mx-auto justify-between p-2">
          <Link className="btn bg-[#FFE6C71A] text-white hover:bg-primary">
            <FaLocationDot className="text-xl" /> <p>Store Locator</p>
          </Link>
          <Link className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary">
            <a href="#">
              <Badge count={5} className="custom-badge">
                {" "}
                <FaHeart className="custom-icon" />{" "}
              </Badge>
            </a>
          </Link>
          <Link className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary">
            <ShoppingCartOutlined />
          </Link>
          <Link className="btn bg-[#FFE6C71A] text-white text-xl hover:bg-primary">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </div> */}

      <div className="bg-black">
        <div className="max-w-7xl mx-auto hidden lg:flex justify-start px-4 bg-black text-white">
          <MenuOutlined /> <hr className="border-r-2 h-8 ms-4 my-auto" />
          <Menu
            className="bg-black text-white custom-menu"
            onClick={onClick}
            style={{
              width: 1080,
              border: "2px solid black",
            }}
            mode="horizontal"
            horizontalItemHoverColor="#ff4d4f"
            horizontalItemSelectedColor="#ff4d4f"
            itemSelectedColor="#ff4d4f"
            darkItemSelectedBg="#ff4d4f"
            colorPrimaryBorder="#ff4d4f"
            horizontalItemHoverBg="#ff4d4f"
            horizontalItemSelectedBg="#ff4d4f"
            horizontalLineHeight="12px"
            itemMarginInline="0"
            activeBarBorderWidth="0"
            items={items}
          />
          <div className="flex justify-center items-center gap-4 text-sm font-semibold hover:text-primary">
            <FaPhoneAlt />
            <a href="tel:09727070118">09727-070118</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
