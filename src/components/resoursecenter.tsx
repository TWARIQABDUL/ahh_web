import React from "react";
import { Card, Button } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const resources = [
  {
    id: 1,
    title: "How to Pitch Your Startup",
    description: "Learn how to craft and deliver a compelling pitch that attracts investors.",
  },
  {
    id: 2,
    title: "Fundamentals of Scaling",
    description: "Best practices to grow your venture while keeping operations sustainable.",
  },
  {
    id: 3,
    title: "Healthcare Innovation Guide",
    description: "Explore how healthtech startups are transforming Africa’s healthcare system.",
  },
];

const ResourceCenter: React.FC = () => {
  return (
    <div className="mt-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          Resource Center
        </h2>
        <Button type="link" className="!text-[var(--color-teal)] font-medium">
          View All
        </Button>
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <Card
            key={res.id}
            className="shadow-md rounded-xl hover:shadow-lg transition-all"
            bodyStyle={{ padding: "16px" }}
          >
            <div className="flex items-start gap-3">
              <FileTextOutlined className="text-[var(--color-teal)] text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-[var(--color-primary)]">
                  {res.title}
                </h3>
                <p className="text-[var(--color-darkGray)] text-sm mt-1">
                  {res.description}
                </p>
                <Button
                  type="link"
                  size="small"
                  className="!text-[var(--color-teal)] p-0 mt-2"
                >
                  Read More
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourceCenter;
