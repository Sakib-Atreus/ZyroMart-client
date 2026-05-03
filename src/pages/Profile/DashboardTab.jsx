import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Alert,
} from "antd";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  HeartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { userDashboardApi } from "../../api/endpoints";

const { Title, Paragraph } = Typography;

const statusColor = {
  pending: "gold",
  paid: "green",
  processing: "blue",
  shipped: "purple",
  delivered: "cyan",
  cancelled: "red",
  refunded: "volcano",
  unpaid: "gold",
  failed: "red",
};

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: ccy }).format(n ?? 0);

const DashboardTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userDashboardApi
      .get()
      .then((res) => setData(res.data ?? res))
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const orderColumns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (v, row) => (
        <Link to={`/profile?tab=orders`}>
          <span style={{ fontFamily: "monospace" }}>{v}</span>
        </Link>
      ),
    },
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
      title: "Date",
      dataIndex: "placedAt",
      key: "placedAt",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
  ];

  if (loading) {
    return (
      <Card title="My Dashboard">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="My Dashboard">
        <Alert type="error" message={error} showIcon />
      </Card>
    );
  }

  const byStatus = data?.orders?.byStatus ?? {};
  const recentOrders = data?.orders?.recent ?? [];

  return (
    <Card title="My Dashboard">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>Overview</Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total Orders"
                  value={data?.orders?.total ?? 0}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: "#1677ff" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total Spend"
                  value={money(data?.totalSpend ?? 0)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#f97316", fontSize: 14 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Wishlist"
                  value={data?.wishlistCount ?? 0}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: "#eb2f96" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Cart Items"
                  value={data?.cartItemCount ?? 0}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {Object.keys(byStatus).length > 0 && (
          <div>
            <Title level={5} style={{ marginBottom: 12 }}>Orders by Status</Title>
            <Row gutter={[8, 8]}>
              {Object.entries(byStatus).map(([status, count]) => (
                <Col key={status}>
                  <Tag
                    color={statusColor[status] || "default"}
                    style={{ padding: "4px 10px", fontSize: 13 }}
                  >
                    {status}: {count}
                  </Tag>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>Recent Orders</Title>
            <Link to="/profile?tab=orders">View all</Link>
          </div>
          {recentOrders.length > 0 ? (
            <Table
              rowKey="_id"
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              scroll={{ x: true }}
            />
          ) : (
            <Paragraph type="secondary">
              No orders yet.{" "}
              <Link to="/phones">Start shopping!</Link>
            </Paragraph>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default DashboardTab;
