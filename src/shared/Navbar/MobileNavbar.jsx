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
import { Button, Drawer } from "antd";
import { useState } from "react";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
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
        {/* Cart Drawer */}
        <Link
            onClick={showDrawer}
            className="btn bg-[#FFE6C71A] text-white text-2xl hover:bg-primary h-10"
          >
            <ShoppingCartOutlined />
          </Link>
          <Drawer title="My Cart" onClose={onClose} open={open}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>

            <Link
            className="btn btn-sm bg-white text-primary text-md border-1 border-primary hover:bg-primary hover:text-white hover:border-none h-4"
          >
            <ShoppingCartOutlined /> View All Cart
          </Link>
          </Drawer>
          {/* Cart Drawer close */}
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
