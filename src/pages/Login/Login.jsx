import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt,
} from "react-icons/fa";
import "./Login.css";
import { toast } from "react-toastify";
import { authApi } from "../../api/endpoints";
import OtpVerify from "../../components/OtpVerify/OtpVerify";

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

  // OTP verification state
  const [otpStep, setOtpStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (location.pathname === "/login") setActiveTab("login");
    else if (location.pathname === "/register") setActiveTab("register");
  }, [location.pathname]);

  const destinationForRole = (role) => {
    if (role === "admin") return "/admin";
    if (role === "vendor") return "/vendor";
    return "/";
  };

  useEffect(() => {
    if (user) {
      navigate(destinationForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOtpStep(false);
    navigate(tab === "login" ? "/login" : "/register");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      login({ user: res.data, token: res.token });
      toast.success("Login successful!");
      navigate(destinationForRole(res.data?.role), { replace: true });
    } catch (err) {
      // Email not verified — auto-send OTP and show verification step
      if (err.response?.data?.message === "EMAIL_NOT_VERIFIED") {
        setPendingEmail(formData.email);
        setPendingPassword(formData.password);
        try {
          await authApi.sendOtp({ email: formData.email });
        } catch {
          // OTP send failure is non-fatal; user can resend from the verify screen
        }
        setOtpStep(true);
        toast.info("Please verify your email to continue");
        return;
      }
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await authApi.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      });
      // Auto-login after signup — OTP verification temporarily disabled
      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      login({ user: res.data, token: res.token });
      toast.success("Account created successfully!");
      navigate(destinationForRole(res.data?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Called after successful OTP verification — proceed with login
  const handleOtpVerified = async () => {
    try {
      const res = await authApi.login({
        email: pendingEmail,
        password: pendingPassword,
      });
      login({ user: res.data, token: res.token });
      toast.success("Login successful!");
      navigate(destinationForRole(res.data?.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
      setOtpStep(false);
      setActiveTab("login");
    }
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="bg-white rounded-xl shadow-lg w-[92%] max-w-sm sm:max-w-md md:w-[64%] lg:w-[28%] mx-auto z-10 backdrop-blur-sm pt-8 pb-2 lg:p-12 flex flex-col col-span-1">

          {otpStep ? (
            <OtpVerify
              email={pendingEmail}
              onVerified={handleOtpVerified}
              onBack={() => {
                setOtpStep(false);
                setActiveTab("login");
              }}
            />
          ) : (
            <>
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
                    <button disabled={loading} className={`btn w-full bg-primary text-white`}>
                      {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : "Log In"}
                    </button>
                    {/* Forgot password — re-enable once email service is configured */}
                    <div className="divider text-xs text-gray-400 my-0">or</div>
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                        onClick={() => handleTabChange("register")}
                      >
                        Sign up
                      </button>
                    </p>
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <button disabled={loading} className={`btn w-full bg-primary text-white`}>
                      {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : "Sign Up"}
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-1">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => handleTabChange("login")}
                      >
                        Login
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
