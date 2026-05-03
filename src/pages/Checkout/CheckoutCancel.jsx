import { Button, Result } from "antd";
import { HomeOutlined, RedoOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";

const CheckoutCancel = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 16px" }}>
      <Result
        status="warning"
        title="Payment Cancelled"
        subTitle="Your payment was not completed. Your order is still saved — you can try again."
        extra={[
          orderId && (
            <Link to={`/checkout?retry=${orderId}`} key="retry">
              <Button type="primary" icon={<RedoOutlined />}>
                Try Again
              </Button>
            </Link>
          ),
          <Link to="/cart" key="cart">
            <Button icon={<ShoppingCartOutlined />}>Back to Cart</Button>
          </Link>,
          <Link to="/" key="home">
            <Button icon={<HomeOutlined />}>Go Home</Button>
          </Link>,
        ].filter(Boolean)}
      />
    </div>
  );
};

export default CheckoutCancel;
