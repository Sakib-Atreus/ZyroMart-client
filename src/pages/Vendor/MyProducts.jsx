import { useCallback, useEffect, useState } from "react";
import {
  Table, Tag, Space, Button, Card, Typography, Image, Popconfirm, Segmented, Input, message,
} from "antd";
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from "@ant-design/icons";
import { productApi } from "../../api/endpoints";
import ProductFormModal from "./ProductFormModal";
import VariantsDrawer from "./VariantsDrawer";

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

const MyProducts = () => {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [variantsOpen, setVariantsOpen] = useState(false);
  const [variantsProduct, setVariantsProduct] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: meta.page, limit: meta.limit, sort: "-createdAt" };
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.searchTerm = search;
      const res = await productApi.vendorMe(params);
      setRows(res.data || []);
      setMeta((m) => ({ ...m, total: res.meta?.total ?? (res.data?.length ?? 0) }));
    } catch (err) {
      message.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id);
      message.success("Product deleted");
      load();
    } catch (err) {
      message.error(err.message || "Delete failed");
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
      title: "Type",
      dataIndex: "hasVariants",
      render: (v, row) =>
        v ? <Tag color="cyan">{row.variantOptions?.length || 0} option(s)</Tag> : <Tag>Single</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s, row) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusColor[s]}>{s}</Tag>
          {s === "rejected" && row.rejectionReason && (
            <span style={{ color: "#cf1322", fontSize: 11 }}>{row.rejectionReason}</span>
          )}
        </Space>
      ),
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
          <Button
            size="small"
            icon={<AppstoreOutlined />}
            onClick={() => {
              setVariantsProduct(row);
              setVariantsOpen(true);
            }}
            disabled={!row.hasVariants}
          >
            Variants
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(row);
              setFormOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(row._id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>My Products</Title>
          <p style={{ color: "#8c8c8c", margin: 0 }}>
            Create products, generate SKUs, and manage inventory.
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            New Product
          </Button>
        </Space>
      </div>

      <Card
        title={
          <Space wrap>
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
            <Input.Search
              placeholder="Search name / brand / tag"
              allowClear
              style={{ width: 260 }}
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

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={load}
        product={editing}
      />

      <VariantsDrawer
        open={variantsOpen}
        onClose={() => setVariantsOpen(false)}
        product={variantsProduct}
      />
    </>
  );
};

export default MyProducts;
