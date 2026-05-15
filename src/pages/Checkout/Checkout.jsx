import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Skeleton,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CreditCardOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { cartApi, orderApi, paymentApi } from "../../api/endpoints";

const { Title, Text, Paragraph } = Typography;

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: ccy }).format(n ?? 0);

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    cartApi
      .get()
      .then((res) => setCart(res.data ?? res))
      .catch(() => message.error("Failed to load cart"))
      .finally(() => setLoadingCart(false));
  }, []);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? items.reduce((s, i) => s + (i.lineTotal ?? (i.variant?.price ?? 0) * i.quantity), 0);
  const shippingFee = subtotal > 3000 ? 0 : 80;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee + tax;

  const handlePlaceOrder = async (values) => {
    if (items.length === 0) {
      message.warning("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const shippingAddress = {
        fullName: values.fullName,
        line1: values.line1,
        line2: values.line2 || undefined,
        city: values.city,
        country: values.country || "BD",
        postalCode: values.postalCode || undefined,
        phone: values.phone,
      };

      const order = await orderApi.create({
        shippingAddress,
        paymentMethod,
      });

      const orderId = order.data?._id ?? order._id;

      if (paymentMethod === "stripe") {
        const session = await paymentApi.createCheckoutSession({ orderId });
        const url = session.data?.url ?? session.url;
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("No Stripe session URL returned");
        }
      } else if (paymentMethod === "sslcommerz") {
        const session = await paymentApi.createSSLCSession({ orderId });
        const url = session.data?.url ?? session.url;
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("No SSL Commerce gateway URL returned");
        }
      } else {
        navigate(`/checkout/success?orderId=${orderId}`);
      }
    } catch (err) {
      message.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loadingCart) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 16px" }}>
        <ShoppingCartOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
        <Title level={3} style={{ marginTop: 24 }}>Your cart is empty</Title>
        <Paragraph type="secondary">Add some products before checkout.</Paragraph>
        <Link to="/phones">
          <Button type="primary" size="large">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      <Title level={2} style={{ marginBottom: 8 }}>Checkout</Title>
      <Steps
        current={step}
        size="small"
        style={{ marginBottom: 32 }}
        items={[
          { title: "Shipping", icon: <EnvironmentOutlined /> },
          { title: "Payment", icon: <CreditCardOutlined /> },
          { title: "Confirm", icon: <ShoppingCartOutlined /> },
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Left — form */}
        <Col xs={24} lg={15}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrder}
            onValuesChange={() => step === 0 && setStep(1)}
            scrollToFirstError
          >
            <Card
              title={
                <span>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  Shipping Address
                </span>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fullName"
                    label="Full name"
                    rules={[{ required: true, message: "Enter full name" }]}
                  >
                    <Input placeholder="e.g. Sakib Rahman" autoComplete="name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[
                      { required: true, message: "Enter phone number" },
                      { pattern: /^[0-9+\s\-()]{7,15}$/, message: "Enter a valid phone number" },
                    ]}
                  >
                    <Input placeholder="01XXXXXXXXX" autoComplete="tel" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="line1"
                label="Address line 1"
                rules={[{ required: true, message: "Enter address" }]}
              >
                <Input placeholder="House/Flat no., Road, Area" autoComplete="address-line1" />
              </Form.Item>

              <Form.Item name="line2" label="Address line 2 (optional)">
                <Input placeholder="Apartment, floor, landmark" autoComplete="address-line2" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: "Enter city" }]}
                  >
                    <Input placeholder="Dhaka" autoComplete="address-level2" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="postalCode" label="Postal code">
                    <Input placeholder="1207" autoComplete="postal-code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="country" label="Country" initialValue="BD">
                    <Input placeholder="BD" autoComplete="country" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              title={
                <span>
                  <CreditCardOutlined style={{ marginRight: 8 }} />
                  Payment Method
                </span>
              }
              style={{ marginBottom: 24 }}
            >
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setStep(2);
                }}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="cod">
                    <Space>
                      <span style={{ fontWeight: 500 }}>Cash on Delivery (COD)</span>
                      <Tag color="green">Free</Tag>
                    </Space>
                    <Paragraph
                      type="secondary"
                      style={{ margin: "4px 0 0 24px", fontSize: 12 }}
                    >
                      Pay when your order arrives
                    </Paragraph>
                  </Radio>
                  <Radio value="stripe">
                    <Space>
                      <span style={{ fontWeight: 500 }}>Credit / Debit Card</span>
                      <Tag color="blue">Stripe</Tag>
                    </Space>
                    <Paragraph
                      type="secondary"
                      style={{ margin: "4px 0 0 24px", fontSize: 12 }}
                    >
                      Secure payment via Stripe — you will be redirected
                    </Paragraph>
                  </Radio>
                  <Radio value="sslcommerz">
                    <Space>
                      <span style={{ fontWeight: 500 }}>bKash / Nagad / Card (SSL Commerce)</span>
                      <Tag color="orange">SSLCommerz</Tag>
                    </Space>
                    <Paragraph
                      type="secondary"
                      style={{ margin: "4px 0 0 24px", fontSize: 12 }}
                    >
                      Pay with bKash, Nagad, Rocket, or any card — powered by SSL Commerce
                    </Paragraph>
                  </Radio>
                </Space>
              </Radio.Group>

              {paymentMethod === "stripe" && (
                <Alert
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                  message="After placing the order you will be redirected to Stripe's secure payment page."
                />
              )}
              {paymentMethod === "sslcommerz" && (
                <Alert
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                  message="After placing the order you will be redirected to SSL Commerce's secure payment page. Supports bKash, Nagad, Rocket, and all major cards."
                />
              )}
            </Card>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={placing}
              icon={
                paymentMethod === "cod"
                  ? <ShoppingCartOutlined />
                  : <CreditCardOutlined />
              }
            >
              {paymentMethod === "cod"
                ? "Place Order (COD)"
                : paymentMethod === "sslcommerz"
                ? "Continue to SSL Commerce"
                : "Continue to Payment"}
            </Button>
          </Form>
        </Col>

        {/* Right — order summary */}
        <Col xs={24} lg={9}>
          <Card title="Order Summary" style={{ position: "sticky", top: 80 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {items.map((item) => (
                <div
                  key={item.variant?._id ?? item._id}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  <img
                    src={
                      item.product?.thumbnail ||
                      item.product?.images?.[0] ||
                      "https://via.placeholder.com/56x56?text=?"
                    }
                    alt={item.product?.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #f0f0f0",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        display: "block",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.product?.name}
                    </Text>
                    {item.variant?.options && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {Object.values(item.variant.options).join(" · ")}
                      </Text>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Qty: {item.quantity}
                      </Text>
                      <Text style={{ fontWeight: 500 }}>
                        {money(item.lineTotal ?? (item.variant?.price ?? 0) * item.quantity)}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Subtotal</Text>
                <Text>{money(subtotal)}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Shipping</Text>
                <Text>
                  {shippingFee === 0 ? (
                    <Tag color="green">Free</Tag>
                  ) : (
                    money(shippingFee)
                  )}
                </Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Tax (5%)</Text>
                <Text>{money(tax)}</Text>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 16 }}>Total</Text>
                <Text strong style={{ fontSize: 16, color: "#f97316" }}>
                  {money(total)}
                </Text>
              </div>

              {shippingFee > 0 && (
                <Alert
                  type="info"
                  showIcon
                  style={{ fontSize: 12 }}
                  message={`Add ${money(3000 - subtotal)} more for free shipping`}
                />
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
