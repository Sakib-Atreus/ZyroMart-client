import { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, theme, Drawer, Grid } from "antd";
import {
  DashboardOutlined, AppstoreOutlined, ShopOutlined, ShoppingOutlined,
  ShoppingCartOutlined, LogoutOutlined, UserOutlined, HomeOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined, CloseOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScrollToTop from "../utils/ScrollToTop";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token: { colorBgContainer } } = theme.useToken();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

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
      { key: "site", icon: <HomeOutlined />, label: <Link to="/">Go to Website</Link> },
      { type: "divider" },
      { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true, onClick: handleLogout },
    ],
  };

  const sidebarMenu = (
    <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={240}
          style={{ overflow: "auto", height: "100vh", position: "sticky", top: 0, left: 0 }}
        >
          <div style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: collapsed ? 16 : 20,
            letterSpacing: 1,
            borderBottom: "1px solid #1f1f1f",
            flexShrink: 0,
          }}>
            {collapsed ? "ZM" : "ZyroMart Admin"}
          </div>
          {sidebarMenu}
        </Sider>
      )}

      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={240}
        title={<span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>ZyroMart Admin</span>}
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
        styles={{
          header: { background: "#001529", borderBottom: "1px solid #1f1f1f", padding: "0 16px" },
          body: { padding: 0, background: "#001529" },
        }}
      >
        {sidebarMenu}
      </Drawer>

      <Layout>
        <Header style={{
          padding: `0 ${isMobile ? 12 : 24}px`,
          background: colorBgContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <Button
            type="text"
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isMobile && (
              <Link to="/"><Button icon={<HomeOutlined />}>Go to Website</Button></Link>
            )}
            <Dropdown menu={profileMenu} placement="bottomRight">
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} style={{ background: "#f97316" }} />
                {!isMobile && <span style={{ fontWeight: 500 }}>{user?.name ?? "Admin"}</span>}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{
          padding: isMobile ? 12 : 24,
          background: "#f8fafc",
          minHeight: 280,
          overflow: "auto",
        }}>
          <ScrollToTop />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
