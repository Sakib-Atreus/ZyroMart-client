import { useCallback, useEffect, useState } from "react";
import {
  Table, Tag, Space, Button, Modal, Form, Input, Select, Card, Typography,
  Image, message, Popconfirm, Segmented,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { productApi } from "../../api/endpoints";
import ProductCreateModal from "./ProductCreateModal";

const { Title } = Typography;

const statusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  archived: "default",
  draft: "blue",
};

const money = (n, ccy = "BDT") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n ?? 0);

const Products = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: meta.page, limit: meta.limit, sort: "-createdAt" };
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.searchTerm = search;
      const res = await productApi.list(params);
      setRows(res.data || []);
      setMeta((m) => ({ ...m, total: res.meta?.total ?? (res.data?.length ?? 0) }));
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openStatus = (row) => {
    setSelected(row);
    form.setFieldsValue({
      status: row.status,
      rejectionReason: row.rejectionReason,
    });
    setModalOpen(true);
  };

  const handleStatus = async (values) => {
    try {
      await productApi.changeStatus(selected._id, values);
      message.success("Product status updated");
      setModalOpen(false);
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id);
      message.success("Product deleted");
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, row) => (
        <Space>
          <Image
            src={row.thumbnail}
            width={56}
            height={56}
            style={{ objectFit: "cover", borderRadius: 6 }}
            preview={false}
            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'/%3E"
          />
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>{row.brand}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "basePrice",
      render: (v, row) => money(v, row.currency),
    },
    {
      title: "Variants",
      dataIndex: "hasVariants",
      render: (v, row) => (v ? <Tag color="cyan">{row.variantOptions?.length || 0} options</Tag> : <Tag>Single</Tag>),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    {
      title: "Sold",
      dataIndex: "totalSold",
      render: (v) => v ?? 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => openStatus(row)}>
            Review
          </Button>
          <Popconfirm title="Delete product?" onConfirm={() => handleDelete(row._id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Products</Title>
          <p style={{ color: "#8c8c8c", margin: 0 }}>
            Create, moderate, or manage all catalog products.
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Create Product
          </Button>
        </Space>
      </div>

      <Card
        styles={{ body: { paddingTop: 16 } }}
        title={
          <Space wrap>
            <div style={{ overflowX: "auto", paddingBottom: 2 }}>
              <Segmented
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: "All", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                  { label: "Archived", value: "archived" },
                ]}
              />
            </div>
            <Input.Search
              placeholder="Search by name/brand/tag"
              allowClear
              style={{ width: 280, maxWidth: "100%" }}
              onSearch={(v) => {
                setMeta((m) => ({ ...m, page: 1 }));
                setSearch(v);
              }}
            />
          </Space>
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
        title={`Review: ${selected?.name ?? ""}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleStatus}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </Form.Item>
          <Form.Item name="rejectionReason" label="Rejection reason (optional)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <ProductCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />
    </>
  );
};

export default Products;
