import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Button,
} from "antd";

const { Search } = Input;

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

const ResourceCenter: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const resources: Resource[] = [
    {
      id: "1",
      title: "How to Pitch Your Startup",
      description: "A complete guide on building and delivering winning pitches.",
      category: "Business",
      link: "#",
    },
    {
      id: "2",
      title: "Understanding Startup Funding",
      description: "Learn about funding stages, investors, and raising capital.",
      category: "Funding",
      link: "#",
    },
    {
      id: "3",
      title: "Digital Marketing Basics",
      description: "How to use social media, SEO, and ads to grow your venture.",
      category: "Marketing",
      link: "#",
    },
    {
      id: "4",
      title: "Introduction to AI for Startups",
      description: "How artificial intelligence can transform your business.",
      category: "Technology",
      link: "#",
    },
  ];

  // ✅ Apply search + category filter
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
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
          <Select.Option value="Business">Business</Select.Option>
          <Select.Option value="Funding">Funding</Select.Option>
          <Select.Option value="Marketing">Marketing</Select.Option>
          <Select.Option value="Technology">Technology</Select.Option>
        </Select>
      </div>

      {/* ✅ Resource Grid */}
      <Row gutter={[16, 16]}>
        {filteredResources.map((resource) => (
          <Col xs={24} sm={12} lg={8} key={resource.id}>
            <Card
              title={
                <span className="font-semibold text-[var(--color-primary)]">
                  {resource.title}
                </span>
              }
              className="shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
              extra={<Tag color="blue">{resource.category}</Tag>}
            >
              <p className="text-[var(--color-darkGray)] mb-4">
                {resource.description}
              </p>
              <Button
                type="primary"
                href={resource.link}
                target="_blank"
                className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
              >
                View Resource
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ResourceCenter;
