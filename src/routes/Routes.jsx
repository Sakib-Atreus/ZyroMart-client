import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home/Home";
import Phones from "../pages/Phones/Phones";

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
        path: "/phones",
        element: <Phones/>,
      },
    ],
  },
]);
