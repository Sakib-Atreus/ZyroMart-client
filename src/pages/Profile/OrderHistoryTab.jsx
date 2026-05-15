import { useCallback, useEffect, useState } from "react";
import {
  Alert, Button, Card, Descriptions, Empty, List, Modal, Popconfirm, Space, Table, Tag, message,
} from "antd";
import { CreditCardOutlined, EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { orderApi, paymentApi } from "../../api/endpoints";

const statusColor = {
  pending: "gold",
  paid: "green",
  processing: "blue",
  shipped: "purple",
  delivered: "cyan",
  cancelled: "red",
  refunded: "default",
  unpaid: "gold",
  failed: "red",
};

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n ?? 0);

const OrderHistoryTab = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderApi.listMine({
        page: meta.page,
        limit: meta.limit,
        sort: "-createdAt",
      });
      setRows(res.data || []);
      setMeta((m) => ({ ...m, total: res.meta?.total ?? (res.data?.length ?? 0) }));
    } catch (err) {
      message.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (id) => {
    try {
      await orderApi.cancel(id, { reason: "Cancelled by customer" });
      message.success("Order cancelled");
      load();
    } catch (err) {
      message.error(err.message || "Unable to cancel");
    }
  };

  const cancellable = (status) => ["pending", "paid", "processing"].includes(status);

  const isRetryable = (row) =>
    row.paymentStatus === "unpaid" &&
    row.status === "pending" &&
    (row.paymentMethod === "stripe" || row.paymentMethod === "sslcommerz");

  const handlePayNow = async (row) => {
    setPayingId(row._id);
    try {
      let url;
      if (row.paymentMethod === "stripe") {
        const session = await paymentApi.createCheckoutSession({ orderId: row._id });
        url = session.data?.url ?? session.url;
      } else {
        const session = await paymentApi.createSSLCSession({ orderId: row._id });
        url = session.data?.url ?? session.url;
      }
      if (url) {
        window.location.href = url;
      } else {
        message.error("Could not get payment URL. Please try again.");
      }
    } catch (err) {
      message.error(err.message || "Failed to initiate payment");
    } finally {
      setPayingId(null);
    }
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      render: (n) => <code>{n}</code>,
    },
    {
      title: "Placed",
      dataIndex: "placedAt",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => items?.length ?? 0,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (v, row) => <strong>{money(v, row.currency)}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space wrap>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setViewing(row)}>
            View
          </Button>
          {isRetryable(row) && (
            <Button
              size="small"
              type="primary"
              icon={<CreditCardOutlined />}
              loading={payingId === row._id}
              onClick={() => handlePayNow(row)}
            >
              Pay Now
            </Button>
          )}
          {cancellable(row.status) && (
            <Popconfirm title="Cancel this order?" onConfirm={() => handleCancel(row._id)}>
              <Button size="small" danger icon={<CloseCircleOutlined />}>
                Cancel
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="My Orders"
        extra={<span style={{ color: "#8c8c8c" }}>{meta.total} total</span>}
      >
        {rows.length === 0 && !loading ? (
          <Empty description="No orders yet" />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={rows}
            loading={loading}
            pagination={{
              current: meta.page,
              pageSize: meta.limit,
              total: meta.total,
              onChange: (page, pageSize) => setMeta({ ...meta, page, limit: pageSize }),
            }}
            scroll={{ x: true }}
          />
        )}
      </Card>

      <Modal
        open={!!viewing}
        title={`Order ${viewing?.orderNumber}`}
        onCancel={() => setViewing(null)}
        footer={
          viewing && isRetryable(viewing) ? (
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              loading={payingId === viewing._id}
              onClick={() => handlePayNow(viewing)}
              block
            >
              Complete Payment —{" "}
              {viewing.paymentMethod === "stripe" ? "Stripe" : "SSL Commerce"}
            </Button>
          ) : null
        }
        width="min(720px, 95vw)"
      >
        {viewing && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {isRetryable(viewing) && (
              <Alert
                type="warning"
                showIcon
                message="Payment Pending"
                description="This order has not been paid yet. Click the button below to complete your payment. Your items are reserved until payment is completed or the order is cancelled."
              />
            )}
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Status">
                <Tag color={statusColor[viewing.status]}>{viewing.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={statusColor[viewing.paymentStatus]}>{viewing.paymentStatus}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Placed">
                {new Date(viewing.placedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                {viewing.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : viewing.paymentMethod === "sslcommerz"
                  ? "SSL Commerce"
                  : "Stripe"}
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                {money(viewing.subtotal, viewing.currency)}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {money(viewing.shippingFee, viewing.currency)}
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                {money(viewing.tax, viewing.currency)}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <strong>{money(viewing.total, viewing.currency)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Shipping address" span={2}>
                {viewing.shippingAddress?.fullName}, {viewing.shippingAddress?.line1},{" "}
                {viewing.shippingAddress?.city}, {viewing.shippingAddress?.country}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <strong>Items</strong>
              <List
                dataSource={viewing.items}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.productSnapshot?.thumbnail}
                          alt=""
                          style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                        />
                      }
                      title={item.productSnapshot?.name}
                      description={`${item.variantSnapshot?.sku} — ${Object.entries(
                        item.variantSnapshot?.options || {}
                      )
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}`}
                    />
                    <div>
                      {item.quantity} × {money(item.unitPrice, viewing.currency)} ={" "}
                      <strong>{money(item.subtotal, viewing.currency)}</strong>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {viewing.statusHistory?.length > 0 && (
              <div>
                <strong>Status history</strong>
                <List
                  size="small"
                  dataSource={viewing.statusHistory}
                  renderItem={(entry) => (
                    <List.Item>
                      <Tag color={statusColor[entry.status]}>{entry.status}</Tag>
                      <span style={{ color: "#8c8c8c" }}>
                        {new Date(entry.at).toLocaleString()}
                      </span>
                      {entry.note && <span style={{ marginLeft: 12 }}>— {entry.note}</span>}
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Space>
        )}
      </Modal>
    </>
  );
};

export default OrderHistoryTab;
