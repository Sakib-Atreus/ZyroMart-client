import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar/Navbar";
import Footer from "../shared/Footer/Footer";
import MobileNavbar from "../shared/Navbar/MobileNavbar";
import DynamicBreadcrumb from "../utils/Breadcrumb";
import ChatWidget from "../components/ChatWidget/ChatWidget";

const Main = () => {
    return (
        <div className="max-w-full mx-auto bg-[#F9F9F7] text-black">
            <Navbar />
            <DynamicBreadcrumb />
            <Outlet />
            <Footer />
            <MobileNavbar />
            <ChatWidget />
        </div>
    );
};

export default Main;