import { useCallback, useEffect, useState } from "react";
import {
  Table, Tag, Space, Button, Modal, Input, InputNumber, Select,
  Form, Card, Typography, Segmented, Row, Col, Badge, message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { userApi, vendorApi } from "../../api/endpoints";

const { Title } = Typography;

const statusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  suspended: "orange",
};

const Vendors = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, suspended: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [statusModal, setStatusModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const [userOptions, setUserOptions] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchTerm) params.searchTerm = searchTerm;
      const res = await vendorApi.adminList(params);
      setRows(res.data?.vendors || []);
      setCounts(res.data?.statusCounts || {});
    } catch (err) {
      message.error(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    load();
  }, [load]);

  const searchUsers = async (term) => {
    setUserSearchLoading(true);
    try {
      const res = await userApi.adminList({ searchTerm: term, limit: 20 });
      setUserOptions(
        (res.data || []).map((u) => ({
          value: u._id,
          label: `${u.name} — ${u.email} (${u.role})`,
          user: u,
        })),
      );
    } catch {
      setUserOptions([]);
    } finally {
      setUserSearchLoading(false);
    }
  };

  const openStatus = (row) => {
    setSelected(row);
    statusForm.setFieldsValue({
      status: row.status,
      commissionRate: row.commissionRate,
      rejectionReason: row.rejectionReason,
    });
    setStatusModal(true);
  };

  const handleStatus = async (values) => {
    try {
      await vendorApi.changeStatus(selected._id, values);
      message.success("Vendor status updated");
      setStatusModal(false);
      load();
    } catch (err) {
      message.error(err.message || "Failed");
    }
  };

  const openCreate = () => {
    createForm.resetFields();
    createForm.setFieldsValue({ commissionRate: 0.08 });
    searchUsers("");
    setCreateModal(true);
  };

  const handleCreate = async (values) => {
    try {
      await vendorApi.adminCreate({
        user: values.user,
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
        commissionRate: values.commissionRate,
      });
      message.success("Vendor created and approved");
      setCreateModal(false);
      load();
    } catch (err) {
      message.error(err.message || "Failed to create vendor");
    }
  };

  const columns = [
    {
      title: "Shop",
      key: "shop",
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.shopName}</div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>{row.slug}</div>
        </div>
      ),
    },
    {
      title: "User",
      key: "user",
      render: (_, row) => {
        const u = row.user;
        if (!u || typeof u === "string") return "—";
        return (
          <div style={{ fontSize: 13 }}>
            <div>{u.name}</div>
            <div style={{ color: "#8c8c8c" }}>{u.email}</div>
          </div>
        );
      },
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, row) => (
        <div style={{ fontSize: 13 }}>
          <div>{row.contact?.email}</div>
          <div style={{ color: "#8c8c8c" }}>{row.contact?.phone || "—"}</div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, row) =>
        row.address ? `${row.address.city}, ${row.address.country}` : "—",
    },
    {
      title: "Commission",
      dataIndex: "commissionRate",
      render: (v) => `${((v ?? 0) * 100).toFixed(1)}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Applied",
      dataIndex: "createdAt",
      render: (d) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => <Button onClick={() => openStatus(row)}>Manage</Button>,
    },
  ];

  const totalCount =
    (counts.pending || 0) + (counts.approved || 0) + (counts.rejected || 0) + (counts.suspended || 0);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Vendors</Title>
          <p style={{ color: "#8c8c8c", margin: 0 }}>
            Review applications, approve new sellers, or create vendors directly.
          </p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Create Vendor
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>PENDING</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#d48806" }}>{counts.pending || 0}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>APPROVED</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#389e0d" }}>{counts.approved || 0}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>REJECTED</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#cf1322" }}>{counts.rejected || 0}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>SUSPENDED</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#d46b08" }}>{counts.suspended || 0}</div>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space wrap>
            <Segmented
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: <span>All <Badge count={totalCount} color="#bfbfbf" offset={[4, -2]} /></span>, value: "all" },
                { label: `Pending (${counts.pending || 0})`, value: "pending" },
                { label: `Approved (${counts.approved || 0})`, value: "approved" },
                { label: `Rejected (${counts.rejected || 0})`, value: "rejected" },
                { label: `Suspended (${counts.suspended || 0})`, value: "suspended" },
              ]}
            />
            <Input.Search
              placeholder="Search by shop, email, or slug"
              allowClear
              style={{ width: 280 }}
              onSearch={setSearchTerm}
            />
          </Space>
        }
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Manage status modal */}
      <Modal
        title={`Manage: ${selected?.shopName ?? ""}`}
        open={statusModal}
        onCancel={() => setStatusModal(false)}
        onOk={() => statusForm.submit()}
        okText="Save"
      >
        <Form form={statusForm} layout="vertical" onFinish={handleStatus}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "suspended", label: "Suspended" },
              ]}
            />
          </Form.Item>
          <Form.Item name="commissionRate" label="Commission rate (0–1)">
            <InputNumber min={0} max={1} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="rejectionReason" label="Reason (if rejecting)">
            <Input.TextArea rows={3} placeholder="Optional" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create vendor modal */}
      <Modal
        title="Create Vendor"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onOk={() => createForm.submit()}
        okText="Create"
        width={720}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="user"
            label="Owner (existing user)"
            rules={[{ required: true }]}
            tooltip="The user who will own this vendor profile. Their role is promoted to 'vendor'."
          >
            <Select
              showSearch
              placeholder="Search users by name or email"
              filterOption={false}
              onSearch={searchUsers}
              loading={userSearchLoading}
              options={userOptions}
              notFoundContent={userSearchLoading ? "Searching..." : "No users found"}
            />
          </Form.Item>
          <Form.Item name="shopName" label="Shop name" rules={[{ required: true, min: 2 }]}>
            <Input placeholder="e.g. Alex Electronics" />
          </Form.Item>
          <Form.Item name="description" label="Description (optional)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="logo" label="Logo URL (optional)">
            <Input placeholder="https://..." />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item name="line1" label="Street address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="postalCode" label="Postal code">
                <Input />
              </Form.Item>
            </Col>
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
            <Col xs={24} sm={12}>
              <Form.Item name="commissionRate" label="Commission rate (0–1)">
                <InputNumber min={0} max={1} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Vendors;
