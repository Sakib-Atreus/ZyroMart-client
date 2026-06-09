import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { authApi } from "../../api/endpoints";

const RESEND_DELAY = 60;
const OTP_LENGTH = 6;

const OtpVerify = ({ email, onVerified, onBack }) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const inputRefs = useRef([]);

  // Count down to 0, then stop
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...digits];
    updated[index] = value.slice(-1);
    setDigits(updated);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { updated[i] = ch; });
    setDigits(updated);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleVerify = async () => {
    if (loading) return;
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) return toast.error("Enter all 6 digits");
    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otp });
      toast.success("Email verified successfully!");
      onVerified();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    try {
      await authApi.sendOtp({ email });
      toast.success("New OTP sent to your email");
      setCountdown(RESEND_DELAY);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  }, [countdown, email]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back to login
      </button>

      {/* Icon + heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-3">
          <FaEnvelope className="text-indigo-500" size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Verify your email</h2>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold text-gray-700 truncate">{email}</p>
      </div>

      {/* 6-digit OTP input */}
      <div
        className="flex justify-center gap-2 mb-6"
        onPaste={handlePaste}
        onKeyDown={handleKeyPress}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-lg bg-white outline-none transition-all
              ${digit ? "border-indigo-500 text-indigo-700" : "border-gray-300 text-gray-800"}
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={loading || digits.join("").length < OTP_LENGTH}
        className={`btn w-full transition-all duration-200 ${loading ? "bg-white/80 backdrop-blur-sm border border-primary/30 shadow-inner" : "bg-primary text-white disabled:opacity-60"}`}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : (
          "Verify Email"
        )}
      </button>

      {/* Resend */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Didn&apos;t receive the code?{" "}
        {countdown > 0 ? (
          <span className="text-gray-400">
            Resend in <span className="font-semibold text-gray-600">{countdown}s</span>
          </span>
        ) : (
          <button
            onClick={handleResend}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
};

export default OtpVerify;
