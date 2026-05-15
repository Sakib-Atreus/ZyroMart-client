import { useState } from "react";
import { Alert, Button, Card, Form, Input, Space, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { authApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;

const ChangePasswordTab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ oldPassword, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      return message.error("New passwords do not match");
    }
    setLoading(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      message.success("Password changed — please log in again");
      await logout();
      navigate("/login");
    } catch (err) {
      message.error(err.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Change Password">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Alert
          type="info"
          showIcon
          message="For your security, you'll be logged out after changing the password."
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 520 }}
        >
          <Form.Item
            name="oldPassword"
            label="Current password"
            rules={[{ required: true, message: "Enter current password" }]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New password"
            rules={[
              { required: true, message: "Enter new password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm new password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirm the new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
          </Form.Item>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            Use a strong password you haven't used anywhere else.
          </Paragraph>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Password
          </Button>
        </Form>
      </Space>
    </Card>
  );
};

export default ChangePasswordTab;
