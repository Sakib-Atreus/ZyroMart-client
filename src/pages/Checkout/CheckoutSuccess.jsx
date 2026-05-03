import { useEffect, useState } from "react";
import { Button, Card, Descriptions, Result, Skeleton, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined, HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { orderApi } from "../../api/endpoints";

const { Text } = Typography;

const statusColor = {
  pending: "gold",
  paid: "green",
  processing: "blue",
  shipped: "purple",
  delivered: "cyan",
  cancelled: "red",
};

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: ccy }).format(n ?? 0);

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    orderApi
      .get(orderId)
      .then((res) => setOrder(res.data ?? res))
      .catch((err) => setError(err.message || "Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "80px auto", padding: "0 16px" }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !orderId) {
    return (
      <div style={{ maxWidth: 700, margin: "80px auto", padding: "0 16px" }}>
        <Result
          status="error"
          title="Something went wrong"
          subTitle={error || "Order ID is missing from the URL."}
          extra={[
            <Link to="/" key="home">
              <Button icon={<HomeOutlined />}>Go Home</Button>
            </Link>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        status="success"
        title="Order Placed Successfully!"
        subTitle={
          order
            ? `Order #${order.orderNumber} has been placed. ${
                order.paymentStatus === "paid"
                  ? "Payment confirmed."
                  : "We will process it shortly."
              }`
            : "Your order has been placed successfully."
        }
        extra={[
          <Link to="/profile?tab=orders" key="orders">
            <Button type="primary" icon={<ShoppingOutlined />}>
              View My Orders
            </Button>
          </Link>,
          <Link to="/phones" key="shop">
            <Button icon={<HomeOutlined />}>Continue Shopping</Button>
          </Link>,
        ]}
      />

      {order && (
        <Card style={{ marginTop: 24 }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Order Number" span={2}>
                <Text copyable strong>
                  {order.orderNumber}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColor[order.status] || "default"}>{order.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={statusColor[order.paymentStatus] || "default"}>
                  {order.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card / Stripe"}
              </Descriptions.Item>
              <Descriptions.Item label="Items">
                {order.items?.length ?? 0} item(s)
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={2}>
                <Text strong style={{ color: "#f97316", fontSize: 16 }}>
                  {money(order.total, order.currency)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {order.shippingAddress && (
              <Descriptions column={1} size="small" bordered title="Shipping To">
                <Descriptions.Item label="Name">
                  {order.shippingAddress.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {[
                    order.shippingAddress.line1,
                    order.shippingAddress.line2,
                    order.shippingAddress.city,
                    order.shippingAddress.postalCode,
                    order.shippingAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {order.shippingAddress.phone}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default CheckoutSuccess;
