import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Typography,
  Tag,
  Spin,
  Empty,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axiosInstance from "../config/axiosConfig";

const { Title, Paragraph } = Typography;

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  profile_details: string;
  role: string;
  created_at: string;
  is_approved: boolean;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  // ✅ Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users/me");
        const data = response.data;
        setUser(data);
        form.setFieldsValue({
          fullName: `${data.first_name} ${data.last_name}`,
          email: data.email,
          bio: data.profile_details,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [form]);

  // ✅ Save profile changes
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const nameParts = values.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        email: values.email,
        profile_details: values.bio,
      };

      const response = await axiosInstance.put("/users/me", updatedData);
      setUser(response.data);

      message.success({
        content: "Profile updated successfully!",
        duration: 2,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      form.setFieldsValue({
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        bio: user.profile_details,
      });
    }
  };

  // ✅ Loading state
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading Profile..." />
      </div>
    );

  // ✅ No user data fallback
  if (!user)
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Empty description="Failed to load user data" />
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ✅ Profile Header */}
      <Card className="shadow-lg rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar size={100} src="/images/profile.png" icon={<UserOutlined />} />
          <div className="flex-1">
            <Title level={3} className="text-[var(--color-primary)] m-0">
              {user.first_name} {user.last_name}
            </Title>
            <Paragraph className="text-gray-600 mb-1">{user.email}</Paragraph>
            <Tag color={user.is_approved ? "green" : "orange"}>
              {user.is_approved ? "Approved" : "Pending Approval"}
            </Tag>
            <Tag color="blue">{user.role}</Tag>
          </div>

          {/* ✅ Edit / Save / Cancel Buttons */}
          {!isEditing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                icon={<SaveOutlined />}
                type="primary"
                loading={saving}
                onClick={handleSave}
                className="bg-[var(--color-teal)]"
              >
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ✅ Personal Info */}
      <Card title="Personal Information" className="shadow-md rounded-lg mb-6">
        <Form form={form} layout="vertical" disabled={!isEditing}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name" }]}
              >
                <Input placeholder="e.g. John Doe" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email", message: "Enter valid email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={4} placeholder="Tell us about yourself..." />
          </Form.Item>
        </Form>
      </Card>

      {/* ✅ Stats */}
      <Row gutter={16}>
        <Col span={8}>
          <Card className="text-center">
            <h3>Total Ventures</h3>
            <p className="text-2xl font-bold text-[var(--color-teal)]">3</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="text-center">
            <h3>Programs Applied</h3>
            <p className="text-2xl font-bold text-blue-600">2</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="text-center">
            <h3>Mentorship Sessions</h3>
            <p className="text-2xl font-bold text-orange-500">5</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
