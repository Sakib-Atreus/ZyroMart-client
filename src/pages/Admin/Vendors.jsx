import { useEffect, useState } from "react";
import {
  Table, Tag, Space, Button, Modal, Input, InputNumber, Select,
  Form, Card, Typography, message,
} from "antd";
import { CheckOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import { vendorApi } from "../../api/endpoints";

const { Title } = Typography;

const statusColor = {
  pending: "gold",
  approved: "green",
  rejected: "red",
  suspended: "orange",
};

const Vendors = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await vendorApi.list();
      setRows(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openStatus = (row) => {
    setSelected(row);
    form.setFieldsValue({
      status: row.status,
      commissionRate: row.commissionRate,
      rejectionReason: row.rejectionReason,
    });
    setModalOpen(true);
  };

  const handleStatus = async (values) => {
    try {
      await vendorApi.changeStatus(selected._id, values);
      message.success("Vendor status updated");
      setModalOpen(false);
      load();
    } catch (err) {
      message.error(err.message || "Failed");
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
      title: "Actions",
      key: "actions",
      render: (_, row) => <Button onClick={() => openStatus(row)}>Manage</Button>,
    },
  ];

  return (
    <>
      <Title level={3} style={{ margin: 0 }}>Vendors</Title>
      <p style={{ color: "#8c8c8c", marginBottom: 16 }}>
        Approve, reject, or suspend vendor applications.
      </p>

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
        title={`Manage: ${selected?.shopName ?? ""}`}
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
    </>
  );
};

export default Vendors;
