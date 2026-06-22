import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../layout/Main";
import AdminLayout from "../layout/AdminLayout";
import VendorLayout from "../layout/VendorLayout";
import Home from "../pages/Home/Home";
import Phones from "../pages/Phones/Phones";
import PhoneDetails from "../components/PhoneDetails/PhoneDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import StoreLocations from "../pages/StoreLocations/StoreLocations";
import About from "../pages/About/About";
import FAQ from "../pages/FAQ/FAQ";
import Careers from "../pages/Careers/Careers";
import Contact from "../pages/Contact/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import Profile from "../pages/Profile/Profile";
import Checkout from "../pages/Checkout/Checkout";
import CheckoutSuccess from "../pages/Checkout/CheckoutSuccess";
import CheckoutCancel from "../pages/Checkout/CheckoutCancel";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoute";
import VendorRoute from "./VendorRoute";

import Dashboard from "../pages/Admin/Dashboard";
import AdminCategories from "../pages/Admin/Categories";
import AdminVendors from "../pages/Admin/Vendors";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";
import AdminChat from "../pages/Admin/Chat";

import VendorDashboard from "../pages/Vendor/Dashboard";
import VendorProducts from "../pages/Vendor/MyProducts";
import VendorOrders from "../pages/Vendor/Orders";
import VendorShopSettings from "../pages/Vendor/ShopSettings";
import VendorChat from "../pages/Vendor/Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/phones", element: <Phones /> },
      { path: "/products/:slug", element: <PhoneDetails /> },
      { path: "/phones/new", element: <PhoneDetails /> },
      { path: "/cart", element: <Cart /> },
      {
        path: "/wishlist",
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout/success",
        element: (
          <PrivateRoute>
            <CheckoutSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout/cancel",
        element: (
          <PrivateRoute>
            <CheckoutCancel />
          </PrivateRoute>
        ),
      },
      { path: "/storeLocations", element: <StoreLocations /> },
      { path: "/about", element: <About /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/careers", element: <Careers /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsOfService /> },
    ],
  },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "vendors", element: <AdminVendors /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "chat", element: <AdminChat /> },
      { path: "*", element: <Navigate to="/admin" replace /> },
    ],
  },
  {
    path: "/vendor",
    element: (
      <VendorRoute>
        <VendorLayout />
      </VendorRoute>
    ),
    children: [
      { index: true, element: <VendorDashboard /> },
      { path: "products", element: <VendorProducts /> },
      { path: "orders", element: <VendorOrders /> },
      { path: "chat", element: <VendorChat /> },
      { path: "settings", element: <VendorShopSettings /> },
      { path: "*", element: <Navigate to="/vendor" replace /> },
    ],
  },
]);
