import { useEffect } from "react";
import { Tabs, Typography } from "antd";
import {
  UserOutlined, ShoppingOutlined, LockOutlined, ShopOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import ProfileInfoTab from "./ProfileInfoTab";
import OrderHistoryTab from "./OrderHistoryTab";
import ChangePasswordTab from "./ChangePasswordTab";
import VendorRequestTab from "./VendorRequestTab";

const { Title, Paragraph } = Typography;

const TAB_KEYS = ["profile", "orders", "password", "vendor"];

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const activeKey = TAB_KEYS.includes(tab) ? tab : "profile";

  useEffect(() => {
    if (!TAB_KEYS.includes(tab)) {
      setSearchParams({ tab: "profile" }, { replace: true });
    }
  }, [tab, setSearchParams]);

  const items = [
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      <Title level={2} style={{ marginBottom: 4 }}>My Account</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Manage your profile, orders, security, and vendor application.
      </Paragraph>

      <Tabs
        activeKey={activeKey}
        onChange={(key) => setSearchParams({ tab: key })}
        items={items}
        size="large"
        tabPosition="left"
        style={{ minHeight: 500, background: "#fff", padding: 16, borderRadius: 8 }}
      />
    </div>
  );
};

export default Profile;
