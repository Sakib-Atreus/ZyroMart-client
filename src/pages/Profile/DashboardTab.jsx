import { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Skeleton, Table, Tag, Typography } from "antd";
import {
  ShoppingCartOutlined, ShoppingOutlined, HeartOutlined,
  DollarOutlined, CheckCircleOutlined, ClockCircleOutlined,
} from "@ant-design/icons";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from "recharts";
import { Link } from "react-router-dom";
import { userDashboardApi } from "../../api/endpoints";

const { Title } = Typography;

// ── helpers ──────────────────────────────────────────────────────────────────
const money = (n) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(n ?? 0);

const STATUS_COLOR_HEX = {
  pending: "#f59e0b", paid: "#10b981", processing: "#3b82f6",
  shipped: "#8b5cf6", delivered: "#06b6d4", cancelled: "#ef4444",
  refunded: "#f97316", unpaid: "#f59e0b", failed: "#ef4444",
};

const STATUS_COLOR_ANT = {
  pending: "gold", paid: "green", processing: "blue",
  shipped: "purple", delivered: "cyan", cancelled: "red",
  refunded: "volcano", unpaid: "gold", failed: "red",
};

const PALETTE = ["#3b82f6", "#10b981", "#8b5cf6", "#f97316", "#f59e0b", "#06b6d4", "#ef4444"];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1f2937", color: "#f9fafb", borderRadius: 10,
      padding: "9px 13px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    }}>
      {label && <p style={{ color: "#9ca3af", marginBottom: 3 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || "#3b82f6" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card bordered={false} style={{
    borderRadius: 14,
    background: `linear-gradient(135deg, ${color}12 0%, #fff 70%)`,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: `1px solid ${color}22`,
  }} styles={{ body: { padding: "16px 18px" } }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "4px 0 2px", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{sub}</p>}
      </div>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, color, flexShrink: 0,
      }}>{icon}</div>
    </div>
  </Card>
);

// ── main component ────────────────────────────────────────────────────────────
const DashboardTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userDashboardApi.get()
      .then((res) => setData(res.data ?? res))
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const byStatus = data?.orders?.byStatus ?? {};
  const recentOrders = data?.orders?.recent ?? [];
  const totalOrders = data?.orders?.total ?? 0;
  const totalSpend = data?.totalSpend ?? 0;

  const statusChartData = Object.entries(byStatus)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const deliveredCount = byStatus.delivered ?? 0;
  const deliveryRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;

  const radialData = [{ name: "Delivered", value: deliveryRate, fill: "#10b981" }];

  const orderCols = [
    {
      title: "Order #", dataIndex: "orderNumber", key: "n",
      render: (v) => (
        <Link to="/profile?tab=orders">
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#3b82f6" }}>{v}</span>
        </Link>
      ),
    },
    { title: "Items", dataIndex: "items", key: "i", render: (items) => items?.length ?? 0 },
    {
      title: "Total", dataIndex: "total", key: "t",
      render: (v) => <span style={{ fontWeight: 600, color: "#f97316" }}>{money(v)}</span>,
    },
    {
      title: "Status", dataIndex: "status", key: "s",
      render: (s) => <Tag color={STATUS_COLOR_ANT[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag>,
    },
    {
      title: "Payment", dataIndex: "paymentStatus", key: "p",
      render: (s) => <Tag color={STATUS_COLOR_ANT[s] || "default"} style={{ borderRadius: 20 }}>{s}</Tag>,
    },
    {
      title: "Date", dataIndex: "placedAt", key: "d",
      render: (d) => d ? new Date(d).toLocaleDateString("en-BD") : "-",
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon style={{ margin: 24 }} />;
  }

  return (
    <div>
      {/* ── Hero banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #4f46e5 100%)",
        borderRadius: 16, padding: "24px 28px", marginBottom: 20,
      }}>
        <p style={{ color: "#93c5fd", fontSize: 12, margin: 0 }}>My Account</p>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "6px 0 4px" }}>Shopping Dashboard</h2>
        <p style={{ color: "#bfdbfe", fontSize: 13, margin: 0 }}>Your personal activity overview</p>
      </div>

      {/* ── KPI Cards ── */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <StatCard icon={<ShoppingOutlined />} label="Total Orders" color="#3b82f6"
            value={totalOrders} sub="All time" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<DollarOutlined />} label="Total Spend" color="#f97316"
            value={money(totalSpend)} sub="Paid orders" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<HeartOutlined />} label="Wishlist" color="#ec4899"
            value={data?.wishlistCount ?? 0} sub="Saved items" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard icon={<ShoppingCartOutlined />} label="Cart Items" color="#10b981"
            value={data?.cartItemCount ?? 0} sub="Ready to buy" />
        </Col>
      </Row>

      {/* ── Charts ── */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {/* Orders by Status — pie */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            styles={{ body: { padding: 20 } }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Orders by Status</h3>
            {statusChartData.length === 0 ? (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: "28px 0", fontSize: 13 }}>No orders yet. <Link to="/phones">Shop now!</Link></p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                    {statusChartData.map((item, i) => (
                      <Cell key={i} fill={STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Status legend pills */}
            {statusChartData.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {statusChartData.map((item, i) => (
                  <span key={item.name} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: `${STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length]}18`,
                    border: `1px solid ${STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length]}44`,
                    borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    color: STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length],
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length] }} />
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Delivery rate — radial */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}
            styles={{ body: { padding: 20 } }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Delivery Rate</h3>
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
                  data={[{ name: "bg", value: 100, fill: "#f1f5f9" }, ...radialData]}
                  startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={8} background={false} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", textAlign: "center",
              }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#10b981", margin: 0, lineHeight: 1 }}>{deliveryRate}%</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0" }}>delivered</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "8px 0", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#10b981", margin: 0 }}>{deliveredCount}</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Delivered</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b", margin: 0 }}>{(byStatus.processing ?? 0) + (byStatus.shipped ?? 0)}</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>In Transit</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", margin: 0 }}>{byStatus.cancelled ?? 0}</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Cancelled</p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Order status bar chart */}
        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}
            styles={{ body: { padding: 20 } }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Status Breakdown</h3>
            {statusChartData.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                <p style={{ color: "#9ca3af", fontSize: 13 }}>No orders yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={statusChartData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={64} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="value" name="Orders" radius={[0, 6, 6, 0]}>
                    {statusChartData.map((item, i) => (
                      <Cell key={i} fill={STATUS_COLOR_HEX[item.name] || PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Recent Orders ── */}
      <Card bordered={false}
        title={<span style={{ fontWeight: 700, fontSize: 14 }}>Recent Orders</span>}
        extra={<Link to="/profile?tab=orders" style={{ color: "#3b82f6", fontWeight: 600, fontSize: 13 }}>View all →</Link>}
        style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 0 } }}>
        {recentOrders.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ color: "#9ca3af", marginBottom: 12 }}>No orders yet.</p>
            <Link to="/phones">
              <button style={{
                background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8,
                padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Start Shopping</button>
            </Link>
          </div>
        ) : (
          <Table
            rowKey="_id"
            columns={orderCols}
            dataSource={recentOrders}
            pagination={false}
            size="small"
            scroll={{ x: true }}
          />
        )}
      </Card>
    </div>
  );
};

export default DashboardTab;
