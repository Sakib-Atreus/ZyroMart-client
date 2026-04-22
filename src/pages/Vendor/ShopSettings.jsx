import { useEffect, useState } from "react";
import {
  Alert, Avatar, Button, Card, Col, Descriptions, Form, Input, Row, Space, Tag, Typography, message,
} from "antd";
import { ShopOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { vendorApi } from "../../api/endpoints";

const { Title, Paragraph } = Typography;

const statusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  suspended: "orange",
};

const ShopSettings = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await vendorApi.me();
      setVendor(res.data);
      form.setFieldsValue({
        shopName: res.data.shopName,
        description: res.data.description,
        logo: res.data.logo,
        banner: res.data.banner,
        line1: res.data.address?.line1,
        city: res.data.address?.city,
        country: res.data.address?.country,
        postalCode: res.data.address?.postalCode,
        contactEmail: res.data.contact?.email,
        contactPhone: res.data.contact?.phone,
      });
    } catch (err) {
      message.error(err.message || "Failed to load shop profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const payload = {
        shopName: values.shopName,
        description: values.description || undefined,
        logo: values.logo || undefined,
        banner: values.banner || undefined,
        address: {
          line1: values.line1,
          city: values.city,
          country: values.country,
          postalCode: values.postalCode || undefined,
        },
        contact: {
          email: values.contactEmail,
          phone: values.contactPhone || undefined,
        },
      };
      const res = await vendorApi.updateMe(payload);
      setVendor(res.data);
      message.success("Shop settings updated");
      setEditing(false);
    } catch (err) {
      message.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card loading />;
  if (!vendor) {
    return (
      <Alert
        type="info"
        message="No vendor profile"
        description="Your vendor profile hasn't been created yet."
      />
    );
  }

  return (
    <Card
      title={
        <Space align="center" size="middle">
          <Avatar
            size={56}
            src={vendor.logo}
            icon={<ShopOutlined />}
            style={{ background: "#722ed1" }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {vendor.shopName}
            </Title>
            <Space>
              <Tag color={statusColor[vendor.status] || "default"}>{vendor.status}</Tag>
              <span style={{ color: "#8c8c8c" }}>
                Commission {((vendor.commissionRate ?? 0) * 100).toFixed(1)}%
              </span>
            </Space>
          </div>
        </Space>
      }
      extra={
        editing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              Save
            </Button>
          </Space>
        ) : (
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Edit Shop
          </Button>
        )
      }
    >
      {vendor.status === "pending" && (
        <Alert
          type="info"
          showIcon
          message="Shop awaiting approval"
          description="Your application is being reviewed. You can still update details while you wait."
          style={{ marginBottom: 16 }}
        />
      )}

      {editing ? (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="shopName" label="Shop name" rules={[{ required: true, min: 2 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="logo" label="Logo URL">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="banner" label="Banner URL">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Title level={5} style={{ marginTop: 16 }}>Address</Title>
          <Form.Item name="line1" label="Street" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="postalCode" label="Postal code">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Title level={5} style={{ marginTop: 16 }}>Contact</Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="contactEmail" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="contactPhone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
          <Descriptions.Item label="Shop name">{vendor.shopName}</Descriptions.Item>
          <Descriptions.Item label="Slug"><code>{vendor.slug}</code></Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={statusColor[vendor.status] || "default"}>{vendor.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Commission">
            {((vendor.commissionRate ?? 0) * 100).toFixed(1)}%
          </Descriptions.Item>
          <Descriptions.Item label="Rating">{vendor.rating ?? 0} / 5</Descriptions.Item>
          <Descriptions.Item label="Total sales">{vendor.totalSales ?? 0}</Descriptions.Item>
          <Descriptions.Item label="Email">{vendor.contact?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{vendor.contact?.phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {vendor.address?.line1}, {vendor.address?.city}, {vendor.address?.country}
            {vendor.address?.postalCode ? ` (${vendor.address.postalCode})` : ""}
          </Descriptions.Item>
          {vendor.description && (
            <Descriptions.Item label="Description" span={2}>
              <Paragraph style={{ margin: 0 }}>{vendor.description}</Paragraph>
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Card>
  );
};

export default ShopSettings;
