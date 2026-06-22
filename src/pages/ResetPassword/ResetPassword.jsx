import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { authApi } from "../../api/endpoints";
import "../Login/Login.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
        <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0">
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="bg-white rounded-xl shadow-lg w-[92%] max-w-sm sm:max-w-md md:w-[64%] lg:w-[28%] mx-auto z-10 p-8 text-center">
            <p className="text-gray-700 mb-4">Invalid or missing reset link.</p>
            <button className="btn bg-primary text-white w-full" onClick={() => navigate("/forgot-password")}>
              Request a new link
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      <div className="bg-video bg-content flex justify-items-center items-center w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="bg-white rounded-xl shadow-lg w-[92%] max-w-sm sm:max-w-md md:w-[64%] lg:w-[28%] mx-auto z-10 backdrop-blur-sm pt-8 pb-6 lg:p-12 flex flex-col">

          {done ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-green-500 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Updated</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <button className="btn w-full bg-primary text-white" onClick={() => navigate("/login")}>
                Go to Login
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Reset Password</h2>
              <p className="text-gray-500 text-sm mb-6">Enter your new password below.</p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New password"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="input input-bordered pl-10 w-full bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <span
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button disabled={loading} className="btn w-full bg-primary text-white">
                  {loading ? <span className="loading loading-spinner loading-sm text-primary" /> : "Reset Password"}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Link expired?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Request a new one
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

export default ResetPassword;
