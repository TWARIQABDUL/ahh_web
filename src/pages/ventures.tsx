import React, { useState } from "react";
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
  message,
  Modal,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

interface Venture {
  id: string;
  name: string;
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit" | "add">("view");
  const [form] = Form.useForm();

  // ✅ Store ventures in state
  const [venturesData, setVenturesData] = useState<Venture[]>([
    {
      id: "1",
      name: "Tech Innovators Ltd",
      description: "Helping businesses digitize their workflows.",
      logo: "/images/event1.png",
      createdAt: "2025-09-01",
      status: "Active",
      industry: "Technology",
      location: "Kigali, Rwanda",
      teamSize: 12,
      website: "https://techinnovators.rw",
      contactEmail: "info@techinnovators.rw",
    },
    {
      id: "2",
      name: "AgriBoost",
      description: "Empowering farmers with digital tools.",
      logo: "/images/event2.png",
      createdAt: "2025-08-15",
      status: "Pending",
      industry: "Agriculture",
      location: "Nairobi, Kenya",
      teamSize: 8,
      website: "https://agriboost.africa",
      contactEmail: "hello@agriboost.africa",
    },
    {
      id: "3",
      name: "EduSmart",
      description: "Revolutionizing e-learning for African students.",
      logo: "/images/event3.png",
      createdAt: "2025-07-20",
      status: "Draft",
      industry: "Education",
      location: "Lagos, Nigeria",
      teamSize: 5,
    },
  ]);

  // ✅ Filter ventures
  const filteredVentures = venturesData.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const openDrawer = (
    mode: "view" | "edit" | "add",
    venture?: Venture | null
  ) => {
    setDrawerMode(mode);
    setSelectedVenture(venture || null);

    if (mode === "edit" && venture) {
      form.setFieldsValue(venture);
    } else if (mode === "add") {
      form.resetFields();
    }

    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedVenture(null);
    form.resetFields();
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this venture?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () =>
        setVenturesData((prev) => prev.filter((venture) => venture.id !== id)),
    });
  };

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const columns = [
    {
      title: "Venture",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Venture) => (
        <Space>
          <Avatar src={record.logo} alt={record.name} />
          <span className="font-semibold text-[var(--color-primary)]">
            {record.name}
          </span>
        </Space>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
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
          <Button icon={<EyeOutlined />} size="small" onClick={() => openDrawer("view", record)} />
          <Button icon={<EditOutlined />} size="small" type="primary" className="bg-[var(--color-teal)]"
            onClick={() => openDrawer("edit", record)} />
          <Button icon={<DeleteOutlined />} size="small" danger
            onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  // ✅ Stats
  const total = venturesData.length;
  const active = venturesData.filter((v) => v.status === "Active").length;
  const pending = venturesData.filter((v) => v.status === "Pending").length;
  const draft = venturesData.filter((v) => v.status === "Draft").length;

  return (
    <div className="p-6 bg-gray-100 h-dvh">
      {/* ✅ Stats Section */}
      <Row gutter={16} className="mb-6">
        <Col span={6}><Card className="text-center"><h3>Total Ventures</h3><p>{total}</p></Card></Col>
        <Col span={6}><Card className="text-center"><h3>Active</h3><p className="text-green-600">{active}</p></Card></Col>
        <Col span={6}><Card className="text-center"><h3>Pending</h3><p className="text-orange-500">{pending}</p></Card></Col>
        <Col span={6}><Card className="text-center"><h3>Draft</h3><p className="text-red-500">{draft}</p></Card></Col>
      </Row>

      {/* ✅ Table Section */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-[var(--color-primary)] m-0">My Ventures</h1>
            <Button type="primary" icon={<PlusOutlined />}
              className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
              onClick={() => openDrawer("add")}>
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

        <Table rowKey="id" dataSource={filteredVentures} columns={columns} pagination={{ pageSize: 5 }} />
      </Card>

      {/* ✅ Drawer */}
      <Drawer
        title={
          drawerMode === "view"
            ? selectedVenture?.name
            : drawerMode === "edit"
            ? `Edit: ${selectedVenture?.name}`
            : "Add New Venture"
        }
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
            <p><strong>Status:</strong> <Tag color={selectedVenture.status === "Active" ? "green" : selectedVenture.status === "Pending" ? "orange" : "red"}>{selectedVenture.status}</Tag></p>
          </div>
        )}

        {(drawerMode === "edit" || drawerMode === "add") && (
          <Form
            id="ventureForm"
            form={form}
            layout="vertical"
            onFinish={(values) => {
              if (drawerMode === "add") {
                const newVenture: Venture = {
                  id: (venturesData.length + 1).toString(),
                  createdAt: new Date().toISOString().split("T")[0],
                  ...values,
                };
                setVenturesData((prev) => [...prev, newVenture]);
              } else if (selectedVenture) {
                setVenturesData((prev) =>
                  prev.map((v) => (v.id === selectedVenture.id ? { ...v, ...values } : v))
                );
              }
              closeDrawer();
            }}
          >
            {/* Row 1: Venture Name + Industry */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Venture Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter venture name" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Industry" name="industry">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2: Status + Location */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <Select>
                    <Select.Option value="Active">Active</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Draft">Draft</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Location" name="location">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 3: Team Size + Contact Email */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Team Size" name="teamSize">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Contact Email" name="contactEmail">
                  <Input type="email" />
                </Form.Item>
              </Col>
            </Row>

            {/* Website (full width) */}
            <Form.Item label="Website" name="website">
              <Input />
            </Form.Item>

            {/* Description (full width) */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* Logo Upload */}
            <Form.Item label="Logo" name="logo">
              <Upload
                name="file"
                listType="picture"
                maxCount={1}
                action="/upload"
                onChange={handleUpload}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default VenturesPage;
