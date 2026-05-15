import { Button, Result } from "antd";
import { HomeOutlined, ProfileOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";

const CheckoutCancel = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 16px" }}>
      <Result
        status="warning"
        title="Payment Not Completed"
        subTitle={
          error
            ? `Payment could not be verified: ${error}`
            : "Your payment was not completed. Your order is still saved — go to Order History to retry payment or cancel the order."
        }
        extra={[
          orderId && (
            <Link to="/profile?tab=orders" key="orders">
              <Button type="primary" icon={<ProfileOutlined />}>
                Go to Order History
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
