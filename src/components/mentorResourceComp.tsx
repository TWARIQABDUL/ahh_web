import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Table,
  Button,
  Form,
  Modal,
  message,
  Spin,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../config/axiosConfig";

interface Resource {
  resource_id: number;
  category_id: number;
  title: string;
  description: string;
  url: string;
  uploaded_by_id?: number;
  created_at?: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

const { Search } = Input;
const { Option } = Select;

const MentorResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // modal/form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [form] = Form.useForm();

  // message & modal hooks
  const [messageApi, messageContext] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();

  // fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/resources/categories/");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to load categories");
    }
  };

  // fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      // optionally send category filter, skip & limit params if necessary
      const params: any = {};
      if (categoryFilter) params.category_id = categoryFilter;
      const res = await axiosInstance.get("/resources/", { params });
      setResources(res.data || []);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh (for manual refresh)
  const handleRefresh = async () => {
    await fetchCategories();
    await fetchResources();
    messageApi.success("Refreshed");
  };

  // open create modal
  const openCreate = () => {
    setEditingResource(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // open edit modal
  const openEdit = (resource: Resource) => {
    setEditingResource(resource);
    form.setFieldsValue({
      category_id: resource.category_id,
      title: resource.title,
      description: resource.description,
      url: resource.url,
    });
    setIsModalOpen(true);
  };

  // create/update resource
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingResource) {
        // update
        const payload = {
          title: values.title,
          description: values.description,
          url: values.url,
        };
        const res = await axiosInstance.put(
          `/resources/${editingResource.resource_id}`,
          payload
        );
        messageApi.success("Resource updated");
        // update local list
        setResources((prev) =>
          prev.map((r) =>
            r.resource_id === editingResource.resource_id ? res.data : r
          )
        );
      } else {
        // create
        const payload = {
          category_id: values.category_id,
          title: values.title,
          description: values.description,
          url: values.url,
        };
        const res = await axiosInstance.post("/resources/", payload);
        messageApi.success("Resource created");
        // prepend or append based on preference
        setResources((prev) => [res.data, ...prev]);
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      if (err?.errorFields) {
        // validation handled by antd
      } else {
        console.error(err);
        messageApi.error("Failed to save resource");
      }
    } finally {
      setSaving(false);
    }
  };

  // delete resource
  const handleDelete = (resource: Resource) => {
    modal.confirm({
      title: "Delete resource?",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${resource.title}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/resources/${resource.resource_id}`);
          messageApi.success("Resource deleted");
          setResources((prev) =>
            prev.filter((r) => r.resource_id !== resource.resource_id)
          );
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to delete resource");
        }
      },
    });
  };

  // filtered + paginated
  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? r.category_id === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (v: string) => <strong>{v}</strong>,
      sorter: (a: Resource, b: Resource) =>
        a.title.localeCompare(b.title || ""),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category",
      render: (catId: number) =>
        categories.find((c) => c.category_id === catId)?.category_name ||
        "Uncategorized",
      filters: categories.map((c) => ({
        text: c.category_name,
        value: c.category_id,
      })),
      onFilter: (value: any, record: Resource) =>
        record.category_id === Number(value),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noreferrer">
          Open
        </a>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
      sorter: (a: Resource, b: Resource) =>
        (new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()) || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Resource) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {messageContext}
      {modalContext}
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 className="text-xl font-semibold" style={{ margin: 0 }}>
                Mentor Resources
              </h2>
              <div style={{ color: "var(--color-darkGray)", marginTop: 6 }}>
                Post articles, guides and links for mentees
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button onClick={handleRefresh}>Refresh</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreate}
                style={{ background: "var(--color-teal)", borderColor: "transparent" }}
              >
                New Resource
              </Button>
            </div>
          </div>
        }
        className="shadow-md rounded-xl"
      >
        <Row gutter={[12, 12]} className="mb-4">
          <Col xs={24} sm={12}>
            <Search
              placeholder="Search by title or description..."
              allowClear
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by category"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => {
                setCategoryFilter(val || null);
                setPage(1);
              }}
            >
              {categories.map((c) => (
                <Option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={4} className="flex justify-end">
            <Tag color="blue">{resources.length} total</Tag>
          </Col>
        </Row>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="resource_id"
            columns={columns}
            dataSource={paginated}
            pagination={{
              current: page,
              pageSize,
              total: filtered.length,
              onChange: (p) => setPage(p),
            }}
          />
        )}
      </Card>

      <Modal
        title={editingResource ? "Edit Resource" : "New Resource"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editingResource ? "Save" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              {categories.map((c) => (
                <Option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: "Please enter a URL" }]}
          >
            <Input placeholder="https://example.com/article" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorResources;
