import { useEffect, useState } from "react";
import {
  Avatar, Button, Card, Descriptions, Form, Input, Space, Tag, Typography, message,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { userApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;

const roleColor = { admin: "red", vendor: "purple", user: "blue" };

const ProfileInfoTab = () => {
  const { login, user: ctxUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await userApi.getMe();
      setProfile(res.data);
      form.setFieldsValue(res.data);
    } catch (err) {
      message.error(err.message || "Failed to load profile");
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
      const res = await userApi.updateMe(values);
      setProfile(res.data);
      // Keep AuthContext in sync so the rest of the app sees the new name
      const token = localStorage.getItem("token");
      if (ctxUser) {
        login({ user: { ...ctxUser, ...res.data }, token });
      }
      message.success("Profile updated");
      setEditing(false);
    } catch (err) {
      message.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card loading />;
  if (!profile) return null;

  return (
    <Card
      title={
        <Space align="center" size="middle">
          <Avatar size={56} icon={<UserOutlined />} style={{ background: "#f97316" }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {profile.name}
            </Title>
            <Space>
              <Tag color={roleColor[profile.role] || "default"}>{profile.role}</Tag>
              <span style={{ color: "#8c8c8c" }}>{profile.email}</span>
            </Space>
          </div>
        </Space>
      }
      extra={
        editing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => { setEditing(false); form.resetFields(); form.setFieldsValue(profile); }}>
              Cancel
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
              Save
            </Button>
          </Space>
        ) : (
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )
      }
    >
      {editing ? (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Full name" rules={[{ required: true, min: 2 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, min: 5 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, min: 3 }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      ) : (
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
          <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{profile.phone}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={roleColor[profile.role] || "default"}>{profile.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {profile.address}
          </Descriptions.Item>
          <Descriptions.Item label="Member since">
            {new Date(profile.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last login">
            {profile.loggedInTime ? new Date(profile.loggedInTime).toLocaleString() : "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default ProfileInfoTab;
