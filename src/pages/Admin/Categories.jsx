import { useEffect, useState } from "react";
import {
  Button, Table, Tag, Space, Modal, Form, Input, Select, Switch,
  Popconfirm, Typography, Card, Divider, InputNumber, message,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, EditOutlined, MinusCircleOutlined,
} from "@ant-design/icons";
import { categoryApi } from "../../api/endpoints";

const { Title } = Typography;

const attributeTypes = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "enum", label: "Enum (single choice)" },
  { value: "multiselect", label: "Multi-select" },
];

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.list();
      setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, attributeSchema: [] });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    form.setFieldsValue({
      name: row.name,
      icon: row.icon,
      isActive: row.isActive,
      attributeSchema: row.attributeSchema || [],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      attributeSchema: (values.attributeSchema || []).map((a) => ({
        ...a,
        options:
          a.type === "enum" || a.type === "multiselect"
            ? (a.options || "").split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
      })),
    };
    try {
      if (editing) {
        await categoryApi.update(editing._id, payload);
        message.success("Category updated");
      } else {
        await categoryApi.create(payload);
        message.success("Category created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.remove(id);
      message.success("Category deactivated");
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", render: (t) => <strong>{t}</strong> },
    { title: "Slug", dataIndex: "slug", key: "slug", render: (s) => <code>{s}</code> },
    {
      title: "Attributes",
      dataIndex: "attributeSchema",
      key: "attributeSchema",
      render: (a) => <Tag>{a?.length ?? 0} fields</Tag>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (v) => <Tag color={v ? "green" : "red"}>{v ? "active" : "inactive"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(row)}>Edit</Button>
          <Popconfirm
            title="Deactivate category?"
            onConfirm={() => handleDelete(row._id)}
          >
            <Button danger icon={<DeleteOutlined />}>Deactivate</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Categories</Title>
          <p style={{ color: "#8c8c8c", margin: 0 }}>
            Blueprints for product types. Define attributes once — products inherit them.
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Category
        </Button>
      </div>

      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editing ? "Edit Category" : "New Category"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, min: 2 }]}>
            <Input placeholder="e.g. Phone, Laptop" />
          </Form.Item>
          <Form.Item name="icon" label="Icon URL (optional)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider orientation="left">Attribute Schema</Divider>
          <p style={{ color: "#8c8c8c", marginTop: -8 }}>
            Mark <code>isVariantOption</code> for attributes that differentiate variants (color, RAM, storage).
          </p>

          <Form.List name="attributeSchema">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 12 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Space wrap>
                      <Form.Item {...rest} name={[name, "key"]} label="key" rules={[{ required: true }]}>
                        <Input placeholder="ram" style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "label"]} label="label" rules={[{ required: true }]}>
                        <Input placeholder="RAM" style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "group"]} label="group" rules={[{ required: true }]}>
                        <Input placeholder="Memory" style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "type"]} label="type" rules={[{ required: true }]}>
                        <Select options={attributeTypes} style={{ width: 180 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "unit"]} label="unit">
                        <Input placeholder="GB" style={{ width: 100 }} />
                      </Form.Item>
                      <Form.Item
                        {...rest}
                        name={[name, "options"]}
                        label="options (comma)"
                        tooltip="Required for enum/multiselect — comma separated"
                      >
                        <Input placeholder="Android,iOS" style={{ width: 240 }} />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "required"]} label="required" valuePropName="checked">
                        <Switch size="small" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "isVariantOption"]} label="variant-capable" valuePropName="checked">
                        <Switch size="small" />
                      </Form.Item>
                      <Form.Item {...rest} name={[name, "filterable"]} label="filterable" valuePropName="checked">
                        <Switch size="small" />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}
                <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ type: "string" })}>
                  Add Attribute
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default Categories;
