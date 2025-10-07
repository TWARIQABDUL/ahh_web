import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Button,
  Spin,
  message,
} from "antd";
// imort axios from "axios";
import axiosInstance from "../config/axiosConfig";


const { Search } = Input;

interface Resource {
  resource_id: number;
  category_id: number;
  uploaded_by_id: number;
  title: string;
  description: string;
  url: string;
  created_at: string;
}

const ResourceCenter: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/resources"); // Adjust baseURL if needed
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        message.error("Failed to load resources. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // ✅ Apply search + category filter
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? r.category_id.toString() === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-100 h-dvh">
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Resource Center
      </h1>
      <p className="mb-6 text-[var(--color-darkGray)]">
        Explore guides, articles, and resources to help you grow your venture.
      </p>

      {/* ✅ Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Search
          placeholder="Search resources..."
          allowClear
          onSearch={(value) => setSearch(value)}
          className="max-w-md"
        />
        <Select
          placeholder="Filter by category"
          allowClear
          className="w-48"
          onChange={(val) => setCategoryFilter(val)}
        >
          <Select.Option value="1">Business</Select.Option>
          <Select.Option value="2">Funding</Select.Option>
          <Select.Option value="3">Marketing</Select.Option>
          <Select.Option value="4">Technology</Select.Option>
        </Select>
      </div>

      {/* ✅ Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredResources.length === 0 ? (
            <p className="text-gray-500">No resources found.</p>
          ) : (
            filteredResources.map((resource) => (
              <Col xs={24} sm={12} lg={8} key={resource.resource_id}>
                <Card
                  title={
                    <span className="font-semibold text-[var(--color-primary)]">
                      {resource.title}
                    </span>
                  }
                  className="shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                  extra={<Tag color="blue">Category {resource.category_id}</Tag>}
                >
                  <p className="text-[var(--color-darkGray)] mb-4">
                    {resource.description}
                  </p>
                  <Button
                    type="primary"
                    href={resource.url}
                    target="_blank"
                    className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
                  >
                    View Resource
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default ResourceCenter;
