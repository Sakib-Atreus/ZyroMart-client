import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import Phones from "../pages/Phones/Phones";
import PhoneDetails from "../components/PhoneDetails/PhoneDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/signup",
        element: <Register/>,
      },
      {
        path: "/phones",
        element: <Phones/>
      },
      {
        path: "/phones/new",
        element: <PhoneDetails/>,
      },
    ],
  },
]);
