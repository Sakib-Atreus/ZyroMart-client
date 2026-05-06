import { useEffect, useState } from "react";
import { Button, Empty, Skeleton, Typography, message } from "antd";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { wishlistApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useCartWishlist } from "../../context/CartWishlistContext";

const { Title, Text } = Typography;

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: ccy }).format(n ?? 0);

const Wishlist = () => {
  const { user } = useAuth();
  const { syncWishlistCount } = useCartWishlist();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    wishlistApi
      .get()
      .then((res) => {
        const products = res.data?.products ?? res.products ?? [];
        setItems(products);
        syncWishlistCount(products.length);
      })
      .catch(() => message.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await wishlistApi.remove(productId);
      setItems((prev) => {
        const next = prev.filter((i) => i._id !== productId);
        syncWishlistCount(next.length);
        return next;
      });
      message.success("Removed from wishlist");
    } catch (err) {
      message.error(err.message || "Failed to remove item");
    } finally {
      setRemoving(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Title level={3}>Please log in to view your wishlist</Title>
        <Button type="primary" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Left Sidebar */}
      <div className="w-56 lg:w-64 max-h-max bg-white border rounded-lg shadow-md p-4 pb-8 hidden md:block flex-shrink-0">
        <div className="flex items-center justify-center flex-col space-y-2 mb-8 text-center">
          <img
            className="w-16 h-16 rounded-full"
            src="https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
            alt="user"
          />
          <h2 className="text-lg font-bold mb-4">{user?.name || "My Account"}</h2>
        </div>
        <ul className="space-y-4 text-gray-700">
          <li>
            <Link to="/profile" className="hover:text-primary font-semibold">
              My Account
            </Link>
          </li>
          <li>
            <Link to="/profile?tab=orders" className="hover:text-primary font-semibold">
              My Orders
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="text-primary font-semibold">
              My Wishlist
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Title level={2} style={{ marginBottom: 32 }}>
          My Wishlist
        </Title>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} active avatar paragraph={{ rows: 2 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Empty
            description={
              <span>
                Your wishlist is empty.{" "}
                <Link to="/phones" className="text-blue-600">
                  Browse products
                </Link>
              </span>
            }
          >
            <Link to="/phones">
              <Button type="primary">Start Shopping</Button>
            </Link>
          </Empty>
        ) : (
          <div className="space-y-6">
            {items.map((product) => {
              const productId = product._id;
              const price = product.basePrice ?? product.compareAtPrice ?? 0;
              const thumbnail =
                product.thumbnail ??
                product.images?.[0] ??
                "https://via.placeholder.com/128x128?text=?";
              const slug = product.slug ?? "";

              return (
                <div
                  key={productId}
                  className="flex items-center justify-between p-3 lg:p-4 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <Link to={`/products/${slug}`}>
                      <img
                        src={thumbnail}
                        alt={product.name}
                        className="w-16 h-24 lg:w-32 md:w-28 lg:h-32 md:h-24 object-cover rounded-md shadow-sm"
                      />
                    </Link>
                    <div className="space-y-2">
                      <Link to={`/products/${slug}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-primary line-clamp-2">
                          {product.name || "Product"}
                        </h3>
                      </Link>
                      {product.brand && (
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {product.brand}
                        </Text>
                      )}
                      <p className="text-xl font-semibold text-gray-900">
                        {money(price)}
                      </p>
                      <Button
                        size="small"
                        icon={<ShoppingCartOutlined />}
                        className="border border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => navigate(`/products/${slug}`)}
                      >
                        Add To Cart
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="text"
                      danger
                      icon={<RiDeleteBin5Line style={{ fontSize: 22 }} />}
                      loading={removing === productId}
                      onClick={() => handleRemove(productId)}
                      title="Remove from wishlist"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
