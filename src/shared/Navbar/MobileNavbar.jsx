import React from "react";
import { Input, Space, Avatar, Badge, Dropdown } from "antd";
// import type { GetProps } from 'antd';
import "./Navbar.css";
import {
  AudioOutlined,
  MenuOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaPhoneAlt, FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { CgProfile } from "react-icons/cg";

const MobileNavbar = () => {
  const { user, logout } = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      await logout();
      navigate("/login");
      // LogOut();
    };
  
  const [open, setOpen] = useState(false);
  
  const showDrawer = () => {
    setOpen(true);
  };
  
  const onClose = () => {
    setOpen(false);
  };

  const onMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  // navbar profile icon
  const profileItems = user
    ? [
        // {
        //   key: "1",
        //   label: "My Account",
        //   disabled: true,
        // },
        // {
        //   type: "divider",
        // },
        {
          key: "2",
          label: "Profile",
          icon: <CgProfile />,
        },
        {
          key: "4",
          label: "Settings",
          icon: <SettingOutlined />,
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: <span className="text-primary font-medium">LogOut</span>,
          // onClick: handleLogout,
        },
      ]
    : [
        {
          key: "login",
          label: <Link to="/login">Login</Link>,
        },
      ];

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

  const removeProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };
  
  return (
    <div className="sticky bottom-0 z-50">
      <div className="bg-black lg:hidden md:hidden flex w-full mx-auto justify-between p-2 border-t-2 border-gray-500">
        <Link to="/storeLocations" className="btn bg-[#FFE6C71A] text-white hover:bg-primary">
          <FaLocationDot className="text-xl" /> <p>Store Locator</p>
        </Link>
        <Link
          to="/wishlist"
          className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary"
        >
          <a href="/wishlist">
            <Badge count={5} className="custom-badge">
              {" "}
              <FaHeart className="custom-icon" />{" "}
            </Badge>
          </a>
        </Link>
        {/* Cart Drawer */}
        <button
          onClick={showDrawer}
          className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary h-10"
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

        {/* Profile dropdown menu */}
        <div className="flex justify-center items-center hover:text-primary">
            {user ? (
              <Dropdown menu={{ items: profileItems, onClick: onMenuClick }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon
                      icon={faUser}
                      className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-primary"
                    />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <Link to="/login">
                <FontAwesomeIcon
                  icon={faUser}
                  className="bg-[#FFE6C71A] text-white mt-1 px-[14px] py-[10px] rounded-lg h-5 hover:bg-primary"
                />
              </Link>
            )}
          </div>


        {/* <Link
          to="/login"
          className="btn bg-[#FFE6C71A] text-white text-xl hover:bg-primary"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link> */}


      </div>
    </div>
  );
};

export default MobileNavbar;
