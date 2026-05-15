import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guard for /vendor/* routes.
 *  - No user → send to login
 *  - Admin → send to /admin (their dashboard)
 *  - Anyone other than vendor → send to home
 */
const VendorRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role !== "vendor") return <Navigate to="/" replace />;

  return children;
};

export default VendorRoute;
