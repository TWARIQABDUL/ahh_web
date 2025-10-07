import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Input,
  Select,
  Row,
  Col,
  Drawer,
  Form,
  Upload,
  message, // Keep for the hook
  Modal,   // Keep for the hook
  Spin,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../config/axiosConfig";

interface Venture {
  venture_id: string;
  venture_name: string;
  description: string;
  logo?: string;
  createdAt: string;
  status: "Active" | "Pending" | "Draft";
  industry?: string;
  location?: string;
  teamSize?: number;
  website?: string;
  contactEmail?: string;
}

const VenturesPage: React.FC = () => {
  const [venturesData, setVenturesData] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit" | "add">("view");
  const [form] = Form.useForm();

  // 1. Use the hooks to get context-aware instances and their contextHolders
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  // ✅ Fetch Ventures on mount
  useEffect(() => {
    const fetchVentures = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/ventures");
        setVenturesData(response.data);
      } catch (error) {
        console.error("Failed to fetch ventures:", error);
        messageApi.error("Failed to load ventures"); // Use messageApi instance
      } finally {
        setLoading(false);
      }
    };
    fetchVentures();
  }, [messageApi]); // Add messageApi to dependency array

  // ✅ Filtered list
  const filteredVentures = venturesData.filter((v) => {
    const matchesSearch =
      v.venture_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // ✅ Drawer controls
  const openDrawer = (mode: "view" | "edit" | "add", venture?: Venture) => {
    setDrawerMode(mode);
    setSelectedVenture(venture || null);
    if (mode === "edit" && venture) form.setFieldsValue(venture);
    else if (mode === "add") form.resetFields();
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    form.resetFields();
    setIsDrawerOpen(false);
    setSelectedVenture(null);
  };

  // ✅ Delete Venture
  const handleDelete = (venture_id: string) => {
    // Use the modal instance from the hook
    modal.confirm({
      title: "Are you sure you want to delete this venture?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        setLoading(true);
        try {
          await axiosInstance.delete(`/ventures/${venture_id}`);
          messageApi.success("Venture deleted successfully!"); // Use messageApi
          setVenturesData((prev) =>
            prev.filter((v) => v.venture_id !== venture_id)
          );
        } catch (error) {
          console.error("Delete failed:", error);
          messageApi.error("Failed to delete venture"); // Use messageApi
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // ✅ Handle Upload
  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      messageApi.success(`${info.file.name} uploaded successfully`); // Use messageApi
    } else if (info.file.status === "error") {
      messageApi.error(`${info.file.name} upload failed`); // Use messageApi
    }
  };

  // ✅ Submit Add/Edit
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        venture_name: values.venture_name,
        description: values.description,
      };

      if (drawerMode === "add") {
        const response = await axiosInstance.post("/ventures", payload);
        messageApi.success("Venture created successfully!"); // Use messageApi
        setVenturesData((prev) => [...prev, response.data]);
      } else if (drawerMode === "edit" && selectedVenture) {
        const response = await axiosInstance.put(
          `/ventures/${selectedVenture.venture_id}`,
          payload
        );
        messageApi.success("Venture updated successfully!"); // Use messageApi
        setVenturesData((prev) =>
          prev.map((v) =>
            v.venture_id === selectedVenture.venture_id
              ? { ...v, ...response.data }
              : v
          )
        );
      }

      closeDrawer();
    } catch (error: any) {
      console.error("Error saving venture:", error);
      messageApi.error(error.response?.data?.message || "Failed to save venture"); // Use messageApi
    } finally {
      setLoading(false);
    }
  };

  // ✅ Table Columns
  const columns = [
    // ... (column definitions remain the same)
    {
      title: "Venture",
      dataIndex: "venture_name",
      key: "venture_name",
      render: (_: any, record: Venture) => (
        <Space>
          <Avatar src={record.logo} alt={record.venture_name} />
          <span className="font-semibold text-[var(--color-primary)]">
            {record.venture_name}
          </span>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    { title: "Industry", dataIndex: "industry", key: "industry" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Venture, b: Venture) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Venture["status"]) => {
        let color = "blue";
        if (status === "Active") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Draft") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Venture) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openDrawer("view", record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            className="bg-[var(--color-teal)]"
            onClick={() => openDrawer("edit", record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record.venture_id)}
          />
        </Space>
      ),
    },
  ];

  // ✅ Stats summary
  const total = venturesData.length;
  const active = venturesData.filter((v) => v.status === "Active").length;
  const pending = venturesData.filter((v) => v.status === "Pending").length;
  const draft = venturesData.filter((v) => v.status === "Draft").length;

  return (
    <Spin spinning={loading} tip="Loading...">
      {/* 2. Render the context holders here. They don't produce any visible UI. */}
      {contextHolder}
      {messageContextHolder}
      <div className="p-6 bg-gray-100 h-dvh">
        {/* ... (rest of your JSX is exactly the same) ... */}
        <Row gutter={16} className="mb-6">
          <Col span={6}><Card className="text-center"><h3>Total Ventures</h3><p>{total}</p></Card></Col>
          <Col span={6}><Card className="text-center"><h3>Active</h3><p className="text-green-600">{active}</p></Card></Col>
          <Col span={6}><Card className="text-center"><h3>Pending</h3><p className="text-orange-500">{pending}</p></Card></Col>
          <Col span={6}><Card className="text-center"><h3>Draft</h3><p className="text-red-500">{draft}</p></Card></Col>
        </Row>

        <Card
          title={
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-[var(--color-primary)] m-0">My Ventures</h1>
              <Button type="primary" icon={<PlusOutlined />} className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]" onClick={() => openDrawer("add")}>
                Add Venture
              </Button>
            </div>
          }
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input.Search placeholder="Search ventures..." allowClear onChange={(e) => setSearch(e.target.value)} />
            <Select placeholder="Filter by status" allowClear className="w-48" onChange={(val) => setStatusFilter(val)}>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Draft">Draft</Select.Option>
            </Select>
          </div>
          <Table rowKey="venture_id" dataSource={filteredVentures} columns={columns} pagination={{ pageSize: 5 }} />
        </Card>

        <Drawer
          title={ drawerMode === "view" ? selectedVenture?.venture_name : drawerMode === "edit" ? `Edit: ${selectedVenture?.venture_name}` : "Add New Venture" }
          open={isDrawerOpen}
          onClose={closeDrawer}
          width={480}
          footer={
            drawerMode !== "view" && (
              <div className="flex justify-end gap-2">
                <Button onClick={closeDrawer}>Cancel</Button>
                <Button type="primary" htmlType="submit" form="ventureForm" className="bg-[var(--color-teal)]">
                  {drawerMode === "add" ? "Create Venture" : "Save Changes"}
                </Button>
              </div>
            )
          }
        >
          {drawerMode === "view" && selectedVenture && (
            <div>
              <Avatar src={selectedVenture.logo} size={64} className="mb-4" />
              <p><strong>Description:</strong> {selectedVenture.description}</p>
              <p><strong>Industry:</strong> {selectedVenture.industry}</p>
              <p><strong>Location:</strong> {selectedVenture.location}</p>
              <p><strong>Team Size:</strong> {selectedVenture.teamSize}</p>
              <p><strong>Website:</strong> {selectedVenture.website}</p>
              <p><strong>Email:</strong> {selectedVenture.contactEmail}</p>
              <p><strong>Status:</strong> <Tag color={ selectedVenture.status === "Active" ? "green" : selectedVenture.status === "Pending" ? "orange" : "red" }>{selectedVenture.status}</Tag></p>
            </div>
          )}

          {(drawerMode === "edit" || drawerMode === "add") && (
            <Form id="ventureForm" form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Venture Name" name="venture_name" rules={[{ required: true, message: "Please enter venture name" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter description" }]}>
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Logo" name="logo">
                <Upload name="file" listType="picture" maxCount={1} action="/upload" onChange={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          )}
        </Drawer>
      </div>
    </Spin>
  );
};

export default VenturesPage;