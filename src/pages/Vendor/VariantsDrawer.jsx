import { useCallback, useEffect, useState } from "react";
import {
  Drawer, Table, Button, InputNumber, Space, Tag, Popconfirm, Alert, Empty, message,
} from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { variantApi } from "../../api/endpoints";

/**
 * Manages variants of a single product. Inline-edit stock/price per SKU;
 * these updates do NOT reset the product's approval status.
 */
const VariantsDrawer = ({ open, onClose, product }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({}); // { [variantId]: { price, stock } }

  const load = useCallback(async () => {
    if (!product?._id) return;
    setLoading(true);
    try {
      const res = await variantApi.byProduct(product._id);
      setRows(res.data || []);
      setEditing({});
    } catch (err) {
      message.error(err.message || "Failed to load variants");
    } finally {
      setLoading(false);
    }
  }, [product?._id]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const setField = (id, field, value) => {
    setEditing((e) => ({
      ...e,
      [id]: { ...(e[id] || {}), [field]: value },
    }));
  };

  const saveRow = async (row) => {
    const patch = editing[row._id];
    if (!patch || Object.keys(patch).length === 0) return;
    try {
      await variantApi.update(row._id, patch);
      message.success(`Updated ${row.sku}`);
      load();
    } catch (err) {
      message.error(err.message || "Save failed");
    }
  };

  const deleteRow = async (row) => {
    try {
      await variantApi.remove(row._id);
      message.success(`Deactivated ${row.sku}`);
      load();
    } catch (err) {
      message.error(err.message || "Delete failed");
    }
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      render: (sku) => <code>{sku}</code>,
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (opts) =>
        opts
          ? Object.entries(opts)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")
          : "—",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v, row) => (
        <InputNumber
          size="small"
          min={0}
          value={editing[row._id]?.price ?? v}
          onChange={(val) => setField(row._id, "price", val)}
          addonAfter="BDT"
          style={{ width: 150 }}
        />
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (v, row) => (
        <InputNumber
          size="small"
          min={0}
          value={editing[row._id]?.stock ?? v}
          onChange={(val) => setField(row._id, "stock", val)}
          style={{ width: 90 }}
        />
      ),
    },
    {
      title: "Reserved",
      dataIndex: "reservedStock",
      render: (v) => <Tag>{v ?? 0}</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (v) => <Tag color={v ? "green" : "red"}>{v ? "yes" : "no"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<SaveOutlined />}
            disabled={!editing[row._id]}
            onClick={() => saveRow(row)}
          >
            Save
          </Button>
          <Popconfirm title="Deactivate this SKU?" onConfirm={() => deleteRow(row)}>
            <Button size="small" danger icon={<DeleteOutlined />}>
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Variants — ${product?.name ?? ""}`}
      width={960}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        message="Stock and price changes here go live immediately"
        description="Editing the product itself (name, description, images) requires admin re-approval. Variant edits don't."
        style={{ marginBottom: 16 }}
      />
      {(!rows || rows.length === 0) && !loading ? (
        <Empty description="No variants yet — generate them from the product form or POST /variants" />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />
      )}
    </Drawer>
  );
};

export default VariantsDrawer;
