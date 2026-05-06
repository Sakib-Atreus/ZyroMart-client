import { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Skeleton, Tag, Table, Avatar } from "antd";
import {
  ShoppingOutlined, ShoppingCartOutlined, DollarOutlined,
  WarningOutlined, ClockCircleOutlined, CheckCircleOutlined, RiseOutlined,
} from "@ant-design/icons";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { analyticsApi, vendorApi, orderApi } from "../../api/endpoints";

// ── helpers ──────────────────────────────────────────────────────────────────
const money = (n) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(n ?? 0);

const STATUS_COLOR = {
  pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444",
  paid: "#10b981", unpaid: "#f59e0b", processing: "#3b82f6",
  shipped: "#8b5cf6", delivered: "#06b6d4", cancelled: "#ef4444",
};

const PALETTE = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#f97316"];

const ChartTooltip = ({ active, payload, label, isMoney }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1f2937", color: "#f9fafb", borderRadius: 10,
      padding: "10px 14px", fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      {label && <p style={{ color: "#9ca3af", marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.stroke || "#10b981" }}>
          {p.name}: {isMoney ? money(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color, loading }) => (
  <Card loading={loading} bordered={false} style={{
    borderRadius: 16,
    background: `linear-gradient(135deg, ${color}12 0%, #fff 70%)`,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    border: `1px solid ${color}22`,
  }} styles={{ body: { padding: "20px 22px" } }}>
    <div className="flex items-start justify-between">
      <div style={{ minWidth: 0 }}>
        <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1.2, wordBreak: "break-word" }}>{value}</p>
        {sub && <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>{sub}</p>}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color, flexShrink: 0, marginLeft: 8,
      }}>{icon}</div>
    </div>
  </Card>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>{children}</h3>
);

// ── main component ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vendorRes, analyticsRes, ordersRes] = await Promise.all([
          vendorApi.me(),
          analyticsApi.vendor(),
          orderApi.vendorMine({ sort: "-createdAt", limit: 10 }),
        ]);
        const d = analyticsRes.data ?? analyticsRes;
        setVendor(vendorRes.data ?? vendorRes);
        setStats(d);
        setTopProducts(d.topProducts ?? []);
        setRecentOrders(ordersRes.data ?? []);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const productsByStatus = Object.entries(stats?.products?.byStatus ?? {}).map(([name, value]) => ({ name, value }));
  const ordersByStatus = Object.entries(stats?.orders?.byStatus ?? {}).map(([name, value]) => ({ name, value }));
  const revenue = stats?.revenue?.total ?? 0;
  const unitsSold = stats?.revenue?.unitsSold ?? 0;

  const orderCols = [
    {
      title: "Order #", dataIndex: "orderNumber", key: "n",
      render: (v) => <span style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</span>,
    },
    { title: "Items", dataIndex: "items", key: "i", render: (items) => items?.length ?? 0 },
    {
      title: "Total", dataIndex: "total", key: "t",
      render: (v) => <span style={{ fontWeight: 600, color: "#f97316" }}>{money(v)}</span>,
    },
    {
      title: "Status", dataIndex: "status", key: "s",
      render: (s) => <Tag color={STATUS_COLOR[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag>,
    },
    {
      title: "Payment", dataIndex: "paymentStatus", key: "p",
      render: (s) => <Tag color={STATUS_COLOR[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag>,
    },
    { title: "Date", dataIndex: "placedAt", key: "d", render: (d) => d ? new Date(d).toLocaleDateString("en-BD") : "-" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "0 0 40px" }}>
      {/* ── Hero header ── */}
      <div style={{
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        borderRadius: "0 0 24px 24px",
        padding: "28px 28px 36px",
        margin: "-20px -20px 0",
        marginBottom: -20,
      }}>
        <p style={{ color: "#6ee7b7", fontSize: 12, marginBottom: 4 }}>Seller Portal</p>
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0 }}>
          {vendor?.shopName || "My Shop"}
        </h1>
        {vendor && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Tag color={STATUS_COLOR[vendor.status] || "default"} style={{ borderRadius: 20, fontWeight: 600 }}>
              {vendor.status}
            </Tag>
            <span style={{ color: "#a7f3d0", fontSize: 13 }}>
              Commission: {((vendor.commissionRate ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "0 20px" }}>
        {vendor && vendor.status !== "approved" && (
          <div style={{ marginTop: 36, marginBottom: 8 }}>
            <Alert type="warning" showIcon
              message="Your shop is not currently approved"
              description={
                vendor.status === "pending"
                  ? "An admin is reviewing your application. Products cannot be published until approved."
                  : vendor.rejectionReason || "Contact support for details."
              }
            />
          </div>
        )}

        {/* ── KPI Row ── */}
        <Row gutter={[14, 14]} style={{ marginTop: 34, marginBottom: 16 }}>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<RiseOutlined />} label="Total Revenue" color="#f97316"
              value={money(revenue)} sub="Paid orders" />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<ShoppingCartOutlined />} label="Units Sold" color="#3b82f6"
              value={unitsSold.toLocaleString()} sub="From paid orders" />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<CheckCircleOutlined />} label="Live Products" color="#10b981"
              value={stats?.products?.byStatus?.approved ?? 0} sub="Approved & visible" />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<ClockCircleOutlined />} label="Pending Review" color="#f59e0b"
              value={stats?.products?.byStatus?.pending ?? 0} sub="Awaiting approval" />
          </Col>
        </Row>

        {/* ── Charts ── */}
        <Row gutter={[14, 14]} style={{ marginBottom: 16 }}>
          {/* Products by Status */}
          <Col xs={24} md={12} xl={8}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: 22 } }}>
              <SectionTitle>Products by Status</SectionTitle>
              {loading ? <Skeleton active /> : productsByStatus.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: "32px 0" }}>No products yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={productsByStatus} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4}>
                      {productsByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

          {/* Orders by Status */}
          <Col xs={24} md={12} xl={8}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: 22 } }}>
              <SectionTitle>Orders by Status</SectionTitle>
              {loading ? <Skeleton active /> : ordersByStatus.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: "32px 0" }}>No orders yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ordersByStatus} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f0fdf4" }} />
                    <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
                      {ordersByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

          {/* Top Products */}
          <Col xs={24} xl={8}>
            <Card bordered={false} title={<span style={{ fontWeight: 700, fontSize: 14 }}>Top Products</span>}
              style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: "16px 22px 22px" } }}>
              {loading ? <Skeleton active /> : topProducts.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: "32px 0" }}>No data yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {topProducts.map((p, i) => {
                    const max = topProducts[0]?.totalSold || 1;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar src={p.thumbnail} size={38} shape="square"
                          style={{ borderRadius: 8, border: "1px solid #f0f0f0", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            <div style={{ flex: 1, height: 4, borderRadius: 99, background: "#f1f5f9" }}>
                              <div style={{ width: `${((p.totalSold || 0) / max) * 100}%`, height: "100%", borderRadius: 99, background: PALETTE[i % PALETTE.length] }} />
                            </div>
                            <span style={{ fontSize: 10, color: "#6b7280", flexShrink: 0 }}>{p.totalSold || 0} sold</span>
                          </div>
                          <Tag color={STATUS_COLOR[p.status] || "default"} style={{ borderRadius: 20, fontSize: 10, marginTop: 3 }}>{p.status}</Tag>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* ── Recent Orders table ── */}
        <Card bordered={false}
          title={<span style={{ fontWeight: 700 }}>Recent Orders</span>}
          extra={<Link to="/vendor/orders" style={{ color: "#10b981", fontWeight: 600 }}>View all →</Link>}
          style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="_id"
            loading={loading}
            dataSource={recentOrders}
            columns={orderCols}
            pagination={false}
            size="middle"
            scroll={{ x: true }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
