import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Card,
  Input,
  Select,
  Modal,
  Form,
  Spin,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axiosInstance from "../config/axiosConfig";
import type { ColumnsType } from "antd/es/table";

interface AdminUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_approved: boolean;
  created_at: string;
  profile_details?: string;
}

const AdminUsersComponent: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [messageApi, messageContext] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  // === Fetch Users ===
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/approve`);
      messageApi.success("User approved successfully!");
      fetchUsers();
    } catch {
      messageApi.error("Failed to approve user");
    }
  };

  const handleReject = (id: number) => {
    modal.confirm({
      title: "Reject this user?",
      content: "This will mark the user as rejected and prevent login.",
      okText: "Reject",
      okType: "danger",
      onOk: async () => {
        try {
          await axiosInstance.put(`/admin/users/${id}/reject`);
          messageApi.info("User rejected");
          fetchUsers();
        } catch {
          messageApi.error(" Failed to reject user");
        }
      },
    });
  };

  const handleDelete = (id: number, fullName: string) => {
    modal.confirm({
      title: `Deactivate ${fullName}?`,
      content:
        "This will permanently deactivate this account. The user will no longer be able to log in.",
      okText: "Deactivate",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/admin/users/${id}`);
          messageApi.success(` ${fullName} deactivated successfully`);
          fetchUsers();
        } catch (err) {
          console.error(err);
          messageApi.error(" Failed to deactivate user");
        }
      },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_details: user.profile_details || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      if (!editingUser) return;

      setSaving(true);
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        profile_details: values.profile_details,
      };

      await axiosInstance.put(`/admin/users/${editingUser.user_id}`, payload);
      messageApi.success(" User updated successfully!");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error(" Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  // === Columns (with sorting added) ===
  const columns: ColumnsType<AdminUser> = [
    {
      title: "Full Name",
      key: "full_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      sortDirections: ["ascend", "descend"],
      render: (u) => (
        <Space>
          <UserOutlined />
          {u.first_name} {u.last_name}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      // Sorter for Role (alphabetical)
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
      render: (role) => {
        const colors: Record<string, string> = {
          Admin: "red",
          Mentor: "geekblue",
          Member: "green",
        };
        return <Tag color={colors[role] || "blue"}>{role}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "is_approved",
      key: "status",
      // Sorter for Status (boolean: false then true)
      sorter: (a, b) => Number(a.is_approved) - Number(b.is_approved),
      sortDirections: ["ascend", "descend"],
      render: (isApproved) =>
        isApproved ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      // Sorter for Dates (chronological)
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      sortDirections: ["ascend", "descend"],
      // Default sort direction (newest first)
      defaultSortOrder: "descend",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (u) => (
        <Space>
          {!u.is_approved && (
            <>
              <Button
                icon={<CheckOutlined />}
                size="small"
                className="bg-green-500 text-white"
                onClick={() => handleApprove(u.user_id)}
              />
              <Button
                icon={<CloseOutlined />}
                size="small"
                danger
                onClick={() => handleReject(u.user_id)}
              />
            </>
          )}
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(u)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() =>
              handleDelete(u.user_id, `${u.first_name} ${u.last_name}`)
            }
          />
        </Space>
      ),
    },
  ];

  // === Filters ===
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {messageContext}
      {modalContext}

      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-[var(--color-primary)]">
              👥 User Management
            </span>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Refresh
            </Button>
          </div>
        }
        className="shadow-md rounded-xl"
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input.Search
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Filter by role"
            allowClear
            className="w-48"
            onChange={(value) => setRoleFilter(value)}
          >
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Mentor">Mentor</Select.Option>
            <Select.Option value="Member">Member</Select.Option>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="user_id"
            columns={columns}
            dataSource={filteredUsers}
            pagination={{ pageSize: 6 }}
          />
        )}
      </Card>

      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateUser}
        confirmLoading={saving}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Enter valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Bio / Profile Details" name="profile_details">
            <Input.TextArea rows={3} placeholder="User bio or notes..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsersComponent;