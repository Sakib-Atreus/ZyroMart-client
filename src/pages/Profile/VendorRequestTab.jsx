import { useEffect, useState } from "react";
import {
  Alert, Button, Card, Col, Descriptions, Empty, Form, Input, Result, Row, Space,
  Spin, Tag, Typography, message,
} from "antd";
import { ShopOutlined, CheckCircleOutlined, ClockCircleOutlined, DashboardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { vendorApi } from "../../api/endpoints";

const { Paragraph, Title } = Typography;

const statusTag = {
  pending: { color: "gold", icon: <ClockCircleOutlined />, label: "Pending admin review" },
  approved: { color: "green", icon: <CheckCircleOutlined />, label: "Approved" },
  rejected: { color: "red", label: "Rejected" },
  suspended: { color: "orange", label: "Suspended" },
};

const VendorRequestTab = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await vendorApi.me();
      setVendor(res.data);
    } catch (err) {
      // 404 = no vendor profile, which is the default state
      if (err.response?.status !== 404) {
        message.error(err.message || "Failed to load vendor profile");
      }
      setVendor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        shopName: values.shopName,
        description: values.description || undefined,
        logo: values.logo || undefined,
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
      const res = await vendorApi.apply(payload);
      setVendor(res.data);
      message.success("Vendor application submitted");
    } catch (err) {
      message.error(err.message || "Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  // Existing vendor profile
  if (vendor) {
    const status = statusTag[vendor.status] || { color: "default", label: vendor.status };
    return (
      <Card
        title={
          <Space>
            <ShopOutlined /> Vendor Profile
            <Tag color={status.color} icon={status.icon}>{status.label}</Tag>
          </Space>
        }
      >
        {vendor.status === "approved" && (
          <Alert
            type="success"
            showIcon
            message="Your vendor account is active"
            description="Open your Seller Dashboard to manage products, variants, orders, and shop settings."
            action={
              <Link to="/vendor">
                <Button type="primary" icon={<DashboardOutlined />}>
                  Open Seller Dashboard
                </Button>
              </Link>
            }
            style={{ marginBottom: 24 }}
          />
        )}
        {vendor.status === "pending" && (
          <Alert
            type="info"
            showIcon
            message="Application under review"
            description="An admin will review your application. You'll be notified once a decision is made."
            style={{ marginBottom: 24 }}
          />
        )}
        {vendor.status === "rejected" && (
          <Alert
            type="error"
            showIcon
            message="Application rejected"
            description={vendor.rejectionReason || "Contact support for details."}
            style={{ marginBottom: 24 }}
          />
        )}

        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
          <Descriptions.Item label="Shop name">{vendor.shopName}</Descriptions.Item>
          <Descriptions.Item label="Slug"><code>{vendor.slug}</code></Descriptions.Item>
          <Descriptions.Item label="Commission">
            {((vendor.commissionRate ?? 0) * 100).toFixed(1)}%
          </Descriptions.Item>
          <Descriptions.Item label="Rating">{vendor.rating ?? 0} / 5</Descriptions.Item>
          <Descriptions.Item label="Total sales">{vendor.totalSales ?? 0}</Descriptions.Item>
          <Descriptions.Item label="Contact email">{vendor.contact?.email}</Descriptions.Item>
          <Descriptions.Item label="Contact phone">{vendor.contact?.phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {vendor.address?.line1}, {vendor.address?.city}, {vendor.address?.country}
            {vendor.address?.postalCode ? ` (${vendor.address.postalCode})` : ""}
          </Descriptions.Item>
          {vendor.description && (
            <Descriptions.Item label="About" span={2}>
              {vendor.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    );
  }

  // No vendor profile — show application form
  return (
    <Card
      title={
        <Space>
          <ShopOutlined /> Become a Vendor
        </Space>
      }
    >
      <Paragraph type="secondary">
        Sell your products on ZyroMart. Fill out the form below — an admin will review
        your application and activate your vendor account.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleApply}
        style={{ marginTop: 16 }}
      >
        <Title level={5}>Shop details</Title>
        <Form.Item name="shopName" label="Shop name" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="e.g. Alex Electronics" />
        </Form.Item>
        <Form.Item name="description" label="Description (optional)">
          <Input.TextArea rows={3} placeholder="Tell customers what you sell" />
        </Form.Item>
        <Form.Item name="logo" label="Logo URL (optional)">
          <Input placeholder="https://..." />
        </Form.Item>

        <Title level={5} style={{ marginTop: 16 }}>Business address</Title>
        <Form.Item name="line1" label="Street address" rules={[{ required: true, min: 3 }]}>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="postalCode" label="Postal code">
          <Input />
        </Form.Item>

        <Title level={5} style={{ marginTop: 16 }}>Contact</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="contactEmail"
              label="Contact email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="contactPhone" label="Contact phone">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={submitting}>
          Submit Application
        </Button>
      </Form>
    </Card>
  );
};

export default VendorRequestTab;
