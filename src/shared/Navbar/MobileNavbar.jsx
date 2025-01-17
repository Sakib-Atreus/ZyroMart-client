import React from "react";
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

const MobileNavbar = () => {
  return (
    <div className="sticky bottom-0 z-50">
      <div className="bg-black lg:hidden md:hidden flex w-full mx-auto justify-between p-2 border-t-2 border-gray-500">
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
        <Link
          to="/login"
          className="btn bg-[#FFE6C71A] text-white text-xl hover:bg-primary"
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
