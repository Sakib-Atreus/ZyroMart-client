import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt,
} from "react-icons/fa";
import "./Login.css";
import { toast } from "react-toastify";


const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.pathname === "/login") setActiveTab("login");
    else if (location.pathname === "/register") setActiveTab("register");
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === "login" ? "/login" : "/register");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      login(res.data.data); // Store token or user info
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      });

      login(res.data.data);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="bg-white rounded-xl shadow-lg w-72 lg:w-[28%] md:w-[64%] mx-auto z-10 backdrop-blur-sm pt-8 pb-2 lg:p-12 flex flex-col col-span-1">
          <div className="tabs w-[70%] mx-auto grid grid-cols-2 justify-center bg-gray-100 rounded-full mb-4">
            <button
              className={`tab border-none text-lg font-medium rounded-full ${
                activeTab === "login" ? "bg-white text-primary m-1" : "m-1"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`tab border-none text-lg font-medium rounded-full ${
                activeTab === "register" ? "bg-white text-primary m-1" : "m-1"
              }`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {activeTab === "login" ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button className="btn bg-primary text-white w-full">Log In</button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="relative">
                  <FaUser className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button className="btn bg-primary text-white w-full">Sign Up</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
