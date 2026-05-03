import { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, theme } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShopOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: <Link to="/admin">Overview</Link> },
  { key: "/admin/categories", icon: <AppstoreOutlined />, label: <Link to="/admin/categories">Categories</Link> },
  { key: "/admin/vendors", icon: <ShopOutlined />, label: <Link to="/admin/vendors">Vendors</Link> },
  { key: "/admin/products", icon: <ShoppingOutlined />, label: <Link to="/admin/products">Products</Link> },
  { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: <Link to="/admin/orders">Orders</Link> },
  { key: "/admin/chat", icon: <MessageOutlined />, label: <Link to="/admin/chat">Vendor Chat</Link> },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token: { colorBgContainer } } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const selectedKey =
    menuItems
      .map((i) => i.key)
      .sort((a, b) => b.length - a.length)
      .find((k) => location.pathname === k || location.pathname.startsWith(k + "/")) || "/admin";

  const profileMenu = {
    items: [
      {
        key: "site",
        icon: <HomeOutlined />,
        label: <Link to="/">Go to Website</Link>,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        style={{ overflow: "auto", height: "100vh", position: "sticky", top: 0, left: 0 }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: collapsed ? 16 : 20,
            letterSpacing: 1,
            borderBottom: "1px solid #1f1f1f",
          }}
        >
          {collapsed ? "ZM" : "ZyroMart Admin"}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/">
              <Button icon={<HomeOutlined />}>Go to Website</Button>
            </Link>
            <Dropdown menu={profileMenu} placement="bottomRight">
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} style={{ background: "#f97316" }} />
                <span style={{ fontWeight: 500 }}>{user?.name ?? "Admin"}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: colorBgContainer, borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
