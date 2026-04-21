import { useCallback, useEffect, useState } from "react";
import {
  Table, Tag, Space, Button, Modal, Form, Input, Select, Card, Typography,
  Descriptions, message, Segmented, List,
} from "antd";
import { orderApi } from "../../api/endpoints";

const { Title } = Typography;

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

const Orders = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: meta.page, limit: meta.limit, sort: "-createdAt" };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await orderApi.listAll(params);
      setRows(res.data || []);
      setMeta((m) => ({ ...m, total: res.meta?.total ?? (res.data?.length ?? 0) }));
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openStatus = (row) => {
    setViewing(row);
    form.setFieldsValue({ status: undefined, note: "" });
    setStatusModal(true);
  };

  const handleStatusUpdate = async (values) => {
    try {
      await orderApi.updateStatus(viewing._id, values);
      message.success("Order status updated");
      setStatusModal(false);
      setViewing(null);
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const columns = [
    { title: "Order #", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Items",
      dataIndex: "items",
      render: (items) => items?.length ?? 0,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (v, row) => money(v, row.currency),
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
      title: "Method",
      dataIndex: "paymentMethod",
    },
    {
      title: "Placed",
      dataIndex: "placedAt",
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => setViewing(row)}>View</Button>
          <Button size="small" type="primary" onClick={() => openStatus(row)}>
            Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={3} style={{ margin: 0 }}>Orders</Title>
      <p style={{ color: "#8c8c8c", marginBottom: 16 }}>
        Track and fulfil customer orders.
      </p>

      <Card
        title={
          <Segmented
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Paid", value: "paid" },
              { label: "Processing", value: "processing" },
              { label: "Shipped", value: "shipped" },
              { label: "Delivered", value: "delivered" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
        }
      >
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
      </Card>

      <Modal
        open={!!viewing && !statusModal}
        title={`Order ${viewing?.orderNumber}`}
        onCancel={() => setViewing(null)}
        footer={null}
        width={720}
      >
        {viewing && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Status">
                <Tag color={statusColor[viewing.status]}>{viewing.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment">
                <Tag color={statusColor[viewing.paymentStatus]}>{viewing.paymentStatus}</Tag>
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
              <Descriptions.Item label="Address" span={2}>
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
          </Space>
        )}
      </Modal>

      <Modal
        open={statusModal}
        title={`Update status — ${viewing?.orderNumber}`}
        onCancel={() => setStatusModal(false)}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleStatusUpdate}>
          <Form.Item name="status" label="New status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </Form.Item>
          <Form.Item name="note" label="Note (optional)">
            <Input.TextArea rows={3} placeholder="Tracking number, reason, etc." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
