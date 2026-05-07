import { useEffect } from "react";
import { Tabs, Typography, Grid } from "antd";
import {
  UserOutlined, ShoppingOutlined, LockOutlined, ShopOutlined, DashboardOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";

const { useBreakpoint } = Grid;
import ProfileInfoTab from "./ProfileInfoTab";
import OrderHistoryTab from "./OrderHistoryTab";
import ChangePasswordTab from "./ChangePasswordTab";
import VendorRequestTab from "./VendorRequestTab";
import DashboardTab from "./DashboardTab";

const { Title, Paragraph } = Typography;

const TAB_KEYS = ["dashboard", "profile", "orders", "password", "vendor"];

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const screens = useBreakpoint();
  const tab = searchParams.get("tab");
  const activeKey = TAB_KEYS.includes(tab) ? tab : "dashboard";

  useEffect(() => {
    if (!TAB_KEYS.includes(tab)) {
      setSearchParams({ tab: "dashboard" }, { replace: true });
    }
  }, [tab, setSearchParams]);

  const items = [
    {
      key: "dashboard",
      label: (
        <span>
          <DashboardOutlined /> Dashboard
        </span>
      ),
      children: <DashboardTab />,
    },
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined /> Profile
        </span>
      ),
      children: <ProfileInfoTab />,
    },
    {
      key: "orders",
      label: (
        <span>
          <ShoppingOutlined /> Order History
        </span>
      ),
      children: <OrderHistoryTab />,
    },
    {
      key: "password",
      label: (
        <span>
          <LockOutlined /> Change Password
        </span>
      ),
      children: <ChangePasswordTab />,
    },
    {
      key: "vendor",
      label: (
        <span>
          <ShopOutlined /> Become a Vendor
        </span>
      ),
      children: <VendorRequestTab />,
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
      <Title level={2} style={{ marginBottom: 4 }}>My Account</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Manage your profile, orders, security, and vendor application.
      </Paragraph>

      <Tabs
        activeKey={activeKey}
        onChange={(key) => setSearchParams({ tab: key })}
        items={items}
        size={screens.md ? "large" : "middle"}
        tabPosition={screens.lg ? "left" : "top"}
        style={{ minHeight: 500, background: "#fff", padding: screens.lg ? 16 : "12px 8px", borderRadius: 8 }}
      />
    </div>
  );
};

export default Profile;
