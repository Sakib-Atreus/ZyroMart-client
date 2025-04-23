import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync active tab with route
  useEffect(() => {
    if (location.pathname === "/login") {
      setActiveTab("login");
    } else if (location.pathname === "/register") {
      setActiveTab("register");
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === "login" ? "/login" : "/register");
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="bg-white rounded-xl shadow-lg w-72 lg:w-[28%] md:w-[64%] mx-auto z-10 backdrop-blur-sm pt-8 pb-2 lg:p-12 flex flex-col col-span-1">
          <div className="tabs w-[70%] mx-auto grid grid-cols-2 justify-center bg-gray-100 rounded-full mb-4">
            <button
              className={`tab border-none text-lg font-medium rounded-full ${
                activeTab === "login"
                  ? " bg-white text-primary m-1 tab-active hover:bg-white hover:text-primary"
                  : " bg-gray-100 m-1 tab-inactive hover:bg-gray-100 hover:text-black"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`tab border-none text-lg font-medium rounded-full ${
                activeTab === "register"
                  ? " bg-white text-primary m-1 tab-active hover:bg-white hover:text-primary"
                  : " bg-gray-100 m-1 tab-inactive hover:bg-gray-100 hover:text-black"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
          </div>
          <div className="p-6">
            {activeTab === "login" ? (
              <form className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <p className="text-right text-primary opacity-75 font-medium pb-2">
                  Forgot Password?
                </p>
                <button className="btn border-none bg-primary text-xl font-semibold text-white w-full hover:bg-primary hover:text-white">
                  Log In
                </button>
                
                <p className="text-center font-medium pt-2">
                  Don{"'"}t have an account?{" "}
                  <Link className="text-primary opacity-75" to="/register">
                    Register Here
                  </Link>
                </p>
              </form>
            ) : (
              <form className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="input input-bordered pl-10 w-full bg-white"
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button className="btn border-none bg-primary text-xl font-semibold text-white w-full hover:bg-primary hover:text-white">
                  Sign Up
                </button>
                <p className="text-center font-medium pt-2">
                  Already have an account?{" "}
                  <Link className="text-primary opacity-75" to="/login">
                    Login Here
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
