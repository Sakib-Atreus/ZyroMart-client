import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { authApi } from "../../api/endpoints";
import "../Login/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="bg-white rounded-xl shadow-lg w-[92%] max-w-sm sm:max-w-md md:w-[64%] lg:w-[28%] mx-auto z-10 backdrop-blur-sm pt-8 pb-6 lg:p-12 flex flex-col">

          {sent ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">
                If <strong>{email}</strong> is registered, a password reset link has been sent.
                The link expires in <strong>10 minutes</strong>.
              </p>
              <button
                className="btn w-full bg-primary text-white"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Forgot Password</h2>
              <p className="text-gray-500 text-sm mb-6">
                Enter your registered email and we'll send you a reset link.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button disabled={loading} className="btn w-full bg-primary text-white">
                  {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : "Send Reset Link"}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
