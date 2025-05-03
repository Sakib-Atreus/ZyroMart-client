import axios from "axios";
import { toast } from "react-toastify";

export const LogOut = async () => {
  try {
    await axios.post("http://localhost:5000/api/v1/auth/logout", {
    //   withCredentials: true, // if using cookies
    });
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully!");
  } catch (error) {
    toast.error("Logout failed. Please try again.");
  }
};
