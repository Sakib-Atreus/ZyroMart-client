import { useEffect, useState } from "react";
import { Card, Col, Row, Table, Tag, Skeleton, Avatar, Grid } from "antd";

const { useBreakpoint } = Grid;
import {
  ShoppingOutlined, ShopOutlined, AppstoreOutlined,
  ShoppingCartOutlined, RiseOutlined, TeamOutlined, TrophyOutlined,
} from "@ant-design/icons";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { analyticsApi } from "../../api/endpoints";

// ── helpers ──────────────────────────────────────────────────────────────────
const money = (n) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(n ?? 0);

const STATUS_COLOR = {
  pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444",
  paid: "#10b981", unpaid: "#f59e0b", processing: "#3b82f6",
  shipped: "#8b5cf6", delivered: "#06b6d4", cancelled: "#ef4444",
};

const PALETTE = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

// ── stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, loading }) => (
  <Card
    loading={loading}
    bordered={false}
    style={{
      borderRadius: 16,
      background: `linear-gradient(135deg, ${color}15 0%, #fff 60%)`,
      boxShadow: "0 2px 16px 0 rgba(0,0,0,0.07)",
      border: `1px solid ${color}22`,
    }}
    styles={{ body: { padding: "20px 24px" } }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value}</p>
        {sub && <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>{sub}</p>}
      </div>
      <div
        style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

// ── custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1f2937", color: "#f9fafb", borderRadius: 10,
      padding: "10px 14px", fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      {label && <p style={{ color: "#9ca3af", marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.stroke || "#f97316" }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// ── section heading ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>{children}</h3>
);

// ── main component ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(null);
  const screens = useBreakpoint();

  useEffect(() => {
    analyticsApi.platform()
      .then((res) => setD(res.data ?? res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revenue = d?.revenue?.total ?? 0;
  const ordersByStatus = Object.entries(d?.orders?.byStatus ?? {}).map(([name, value]) => ({ name, value }));
  const productsByStatus = Object.entries(d?.products?.byStatus ?? {}).map(([name, value]) => ({ name, value }));
  const vendorsByStatus = Object.entries(d?.vendors?.byStatus ?? {}).map(([name, value]) => ({ name, value }));
  const usersByRole = Object.entries(d?.users?.byRole ?? {}).map(([name, value]) => ({ name, value }));
  const topVendors = d?.topVendors ?? [];
  const topProducts = d?.topProducts ?? [];
  const recentOrders = d?.recentOrders ?? [];

  const orderCols = [
    { title: "Order #", dataIndex: "orderNumber", key: "n", render: (v) => <span style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</span> },
    { title: "Total", dataIndex: "total", key: "t", render: (v, r) => <span style={{ fontWeight: 600, color: "#f97316" }}>{money(v)}</span> },
    { title: "Status", dataIndex: "status", key: "s", render: (s) => <Tag color={STATUS_COLOR[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag> },
    { title: "Payment", dataIndex: "paymentStatus", key: "p", render: (s) => <Tag color={STATUS_COLOR[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag> },
    { title: "Placed", dataIndex: "placedAt", key: "d", render: (d) => d ? new Date(d).toLocaleDateString("en-BD") : "-" },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 40 }}>
      {/* ── Hero header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
        borderRadius: 16,
        padding: screens.md ? "28px 28px 36px" : "20px 16px 28px",
        marginBottom: 24,
      }}>
        <p style={{ color: "#a5b4fc", fontSize: 13, marginBottom: 4 }}>Admin Portal</p>
        <h1 style={{ color: "#fff", fontSize: screens.md ? 28 : 22, fontWeight: 800, margin: 0 }}>Platform Overview</h1>
        <p style={{ color: "#c7d2fe", fontSize: 14, marginTop: 6 }}>Real-time snapshot of ZyroMart activity</p>
      </div>

      <div>

        {/* ── KPI Cards ── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24, marginTop: 0 }}>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<RiseOutlined />} label="Total Revenue" color="#f97316"
              value={money(revenue)} sub={`${d?.revenue?.paidOrders ?? 0} paid orders`} />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<ShoppingCartOutlined />} label="Total Orders" color="#3b82f6"
              value={(d?.orders?.total ?? 0).toLocaleString()} sub="All time" />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<TeamOutlined />} label="Active Vendors" color="#8b5cf6"
              value={(d?.vendors?.byStatus?.approved ?? 0).toLocaleString()} sub="Approved sellers" />
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <StatCard loading={loading} icon={<ShoppingOutlined />} label="Live Products" color="#10b981"
              value={(d?.products?.byStatus?.approved ?? 0).toLocaleString()} sub="Approved listings" />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <StatCard loading={loading} icon={<AppstoreOutlined />} label="Categories" color="#06b6d4"
              value={d?.categories?.total ?? 0} />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard loading={loading} icon={<TeamOutlined />} label="Total Users" color="#f59e0b"
              value={d?.users?.total ?? 0} />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard loading={loading} icon={<ShopOutlined />} label="Pending Vendors" color="#ef4444"
              value={d?.vendors?.byStatus?.pending ?? 0} />
          </Col>
          <Col xs={12} sm={6}>
            <StatCard loading={loading} icon={<TrophyOutlined />} label="Pending Products" color="#8b5cf6"
              value={d?.products?.byStatus?.pending ?? 0} />
          </Col>
        </Row>

        {/* ── Charts row 1 ── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {/* Orders by Status — pie */}
          <Col xs={24} md={12} xl={8}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: 24 } }}>
              <SectionTitle>Orders by Status</SectionTitle>
              {loading ? <Skeleton active /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {ordersByStatus.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

          {/* Products by Status — bar */}
          <Col xs={24} md={12} xl={8}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: 24 } }}>
              <SectionTitle>Products by Status</SectionTitle>
              {loading ? <Skeleton active /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={productsByStatus} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="value" name="Products" radius={[6, 6, 0, 0]}>
                      {productsByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>

          {/* Vendors by Status + Users by Role */}
          <Col xs={24} xl={8}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: 24 } }}>
              <SectionTitle>Vendors by Status</SectionTitle>
              {loading ? <Skeleton active /> : (
                <ResponsiveContainer width="100%" height={110}>
                  <PieChart>
                    <Pie data={vendorsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={48} paddingAngle={3}>
                      {vendorsByStatus.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 12, paddingTop: 12 }}>
                <SectionTitle>Users by Role</SectionTitle>
                {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={usersByRole} layout="vertical" barSize={12}>
                      <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f1f5f9" }} />
                      <Bar dataKey="value" name="Users" radius={[0, 6, 6, 0]}>
                        {usersByRole.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* ── Top Vendors & Top Products ── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {/* Top Vendors */}
          <Col xs={24} lg={12} style={{ display: "flex", flexDirection: "column" }}>
            <Card bordered={false}
              style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", height: "100%", display: "flex", flexDirection: "column" }}
              styles={{ body: { padding: 24, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" } }}>
              <SectionTitle>Top Vendors by Revenue</SectionTitle>
              {loading ? <Skeleton active /> : topVendors.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "#9ca3af" }}>No data yet</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topVendors.map((v) => ({ name: v.shopName || "Unknown", revenue: v.totalRevenue }))} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip prefix="৳" />} cursor={{ fill: "#fef3c7" }} />
                      <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{
                    flex: 1,
                    overflowY: "auto",
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    paddingRight: 2,
                  }}>
                    {topVendors.map((v, i) => {
                      const max = topVendors[0]?.totalRevenue || 1;
                      return (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "6px 6px", borderRadius: 8,
                          background: i % 2 === 0 ? "#fafafa" : "#fff",
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: i === 0 ? "#f97316" : i === 1 ? "#8b5cf6" : i === 2 ? "#3b82f6" : PALETTE[i % PALETTE.length],
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                          }}>{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {v.shopName || "Unknown"}
                          </span>
                          <div style={{ width: 80, height: 6, borderRadius: 99, background: "#f1f5f9", flexShrink: 0 }}>
                            <div style={{ width: `${(v.totalRevenue / max) * 100}%`, height: "100%", borderRadius: 99, background: PALETTE[i % PALETTE.length] }} />
                          </div>
                          <span style={{ fontSize: 12, color: "#f97316", fontWeight: 600, width: 90, textAlign: "right", flexShrink: 0 }}>
                            {money(v.totalRevenue)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* ── Top Products ── */}
          <Col xs={24} lg={12} style={{ display: "flex", flexDirection: "column" }}>
            <Card bordered={false}
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>Top Products by Sales</span>
                  {topProducts.length > 0 && (
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>{topProducts.length} items</span>
                  )}
                </div>
              }
              style={{
                borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              styles={{
                body: {
                  padding: "12px 16px 16px",
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                },
              }}>
              {loading ? (
                <Skeleton active />
              ) : topProducts.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "#9ca3af" }}>No data yet</p>
                </div>
              ) : (
                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  paddingRight: 2,
                }}>
                  {topProducts.map((p, i) => {
                    const max = topProducts[0]?.totalSold || 1;
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "8px 6px", borderRadius: 10,
                        background: i % 2 === 0 ? "#fafafa" : "#fff",
                      }}>
                        {/* Rank badge */}
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: i === 0 ? "#f97316" : i === 1 ? "#8b5cf6" : i === 2 ? "#3b82f6" : "#e5e7eb",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: i < 3 ? "#fff" : "#6b7280", fontSize: 11, fontWeight: 700,
                        }}>{i + 1}</div>

                        <Avatar src={p.thumbnail} size={40} shape="square"
                          style={{ borderRadius: 8, border: "1px solid #f0f0f0", background: "#f9fafb", flexShrink: 0 }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 13, fontWeight: 600, color: "#111827",
                            margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{p.name}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            <div style={{ flex: 1, height: 5, borderRadius: 99, background: "#f1f5f9" }}>
                              <div style={{
                                width: `${((p.totalSold || 0) / max) * 100}%`,
                                height: "100%", borderRadius: 99,
                                background: PALETTE[i % PALETTE.length],
                                transition: "width 0.4s ease",
                              }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#6b7280", flexShrink: 0, minWidth: 44, textAlign: "right" }}>
                              {p.totalSold || 0} sold
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: 13, fontWeight: 700, color: "#f97316", flexShrink: 0 }}>
                          {money(p.basePrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* ── Recent Orders table ── */}
        <Card bordered={false} title={<span style={{ fontWeight: 700 }}>Recent Orders</span>}
          style={{ borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="_id"
            loading={loading}
            columns={orderCols}
            dataSource={recentOrders}
            pagination={false}
            size="middle"
            scroll={{ x: true }}
            rowClassName={(_, i) => i % 2 === 0 ? "bg-white" : "bg-gray-50"}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
