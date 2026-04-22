import { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { productApi, orderApi, vendorApi } from "../../api/endpoints";

const { Title, Paragraph } = Typography;

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
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState({
    productsApproved: 0,
    productsPending: 0,
    productsRejected: 0,
    ordersCount: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vendorRes, approved, pending, rejected, orders] = await Promise.all([
          vendorApi.me(),
          productApi.vendorMe({ status: "approved", limit: 1 }),
          productApi.vendorMe({ status: "pending", limit: 1 }),
          productApi.vendorMe({ status: "rejected", limit: 1 }),
          orderApi.vendorMine({ sort: "-createdAt", limit: 10 }),
        ]);

        const orderRows = orders.data || [];
        const revenue = orderRows
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + (o.total || 0), 0);

        setVendor(vendorRes.data);
        setStats({
          productsApproved: approved.meta?.total ?? 0,
          productsPending: pending.meta?.total ?? 0,
          productsRejected: rejected.meta?.total ?? 0,
          ordersCount: orders.meta?.total ?? orderRows.length,
          revenue,
        });
        setRecentOrders(orderRows);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = [
    { title: "Order #", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Items (yours)",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length ?? 0,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (v, row) => money(v, row.currency),
    },
    {
      title: "Order status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Placed",
      dataIndex: "placedAt",
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ margin: 0 }}>
          {vendor?.shopName || "My Shop"}
        </Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          {vendor ? (
            <>
              Status:{" "}
              <Tag color={statusColor[vendor.status] || "default"}>{vendor.status}</Tag>
              &nbsp;&nbsp;
              Commission: {((vendor.commissionRate ?? 0) * 100).toFixed(1)}%
            </>
          ) : (
            "Seller overview"
          )}
        </Paragraph>
      </div>

      {vendor && vendor.status !== "approved" && (
        <Alert
          type="warning"
          showIcon
          message="Your shop is not currently approved"
          description={
            vendor.status === "pending"
              ? "An admin is reviewing your application. You cannot publish products until approved."
              : vendor.rejectionReason || "Contact support for details."
          }
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Approved products"
              value={stats.productsApproved}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#389e0d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Pending approval"
              value={stats.productsPending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#d48806" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Rejected"
              value={stats.productsRejected}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Orders"
              value={stats.ordersCount}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card loading={loading}>
            <Statistic
              title="Revenue (paid orders, recent window)"
              value={money(stats.revenue)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent orders with your items"
        extra={<Link to="/vendor/orders">View all</Link>}
        loading={loading}
      >
        <Table
          rowKey="_id"
          dataSource={recentOrders}
          columns={columns}
          pagination={false}
          size="middle"
          scroll={{ x: true }}
        />
      </Card>
    </Space>
  );
};

export default Dashboard;
