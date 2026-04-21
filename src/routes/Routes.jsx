import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../layout/Main";
import AdminLayout from "../layout/AdminLayout";
import Home from "../pages/Home/Home";
import Phones from "../pages/Phones/Phones";
import PhoneDetails from "../components/PhoneDetails/PhoneDetails";
import Login from "../pages/Login/Login";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import StoreLocations from "../pages/StoreLocations/StoreLocations";
import Profile from "../pages/Profile/Profile";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoute";

import Dashboard from "../pages/Admin/Dashboard";
import AdminCategories from "../pages/Admin/Categories";
import AdminVendors from "../pages/Admin/Vendors";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Login /> },
      { path: "/phones", element: <Phones /> },
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
      { path: "/storeLocations", element: <StoreLocations /> },
    ],
  },
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
      { path: "*", element: <Navigate to="/admin" replace /> },
    ],
  },
]);
