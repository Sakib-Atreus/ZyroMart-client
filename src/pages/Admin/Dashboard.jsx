import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Space } from "antd";
import {
  ShoppingOutlined,
  ShopOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { analyticsApi } from "../../api/endpoints";

const statusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  paid: "green",
  unpaid: "gold",
  processing: "blue",
  shipped: "purple",
  delivered: "cyan",
  cancelled: "red",
};

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n ?? 0);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    categories: 0,
    vendors: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await analyticsApi.platform();
        const d = res.data ?? res;
        setStats({
          categories: d.categories?.total ?? 0,
          vendors: d.vendors?.byStatus?.approved ?? 0,
          products: d.products?.byStatus?.approved ?? 0,
          orders: d.orders?.total ?? 0,
          revenue: d.revenue?.total ?? 0,
        });
        setRecent(d.recentOrders ?? []);
      } catch {
        // silently ignore — stale data is fine
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    { title: "Order #", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length ?? 0,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (v, row) => money(v, row.currency),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Placed",
      dataIndex: "placedAt",
      key: "placedAt",
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <h2 style={{ margin: 0 }}>Overview</h2>
        <p style={{ color: "#8c8c8c", marginTop: 4 }}>
          Snapshot of platform activity
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Categories"
              value={stats.categories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Approved Vendors"
              value={stats.vendors}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Products"
              value={stats.products}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Orders"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#f97316" }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card loading={loading}>
            <Statistic
              title="Revenue (paid orders, recent window)"
              value={money(stats.revenue, "BDT")}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Orders" loading={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={recent}
          pagination={false}
          size="middle"
          scroll={{ x: true }}
        />
      </Card>
    </Space>
  );
};

export default Dashboard;
