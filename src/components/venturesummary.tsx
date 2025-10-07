import React from "react";
import { Card, Button } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface Venture {
  id: string;
  name: string;
  description: string;
  logo?: string;
}

interface VenturePreviewProps {
  ventures: Venture[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const VenturePreview: React.FC<VenturePreviewProps> = ({
  ventures,
  onView,
  onEdit,
  onDelete,
}) => {
  // Show max 3 ventures for preview
  const previewVentures = ventures.slice(0, 3);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          Ventures
        </h2>
        <Link
          to="/ventures"
          className="text-[var(--color-teal)] hover:underline font-medium"
        >
          See more
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {previewVentures.map((venture) => (
          <Card
            key={venture.id}
            className="shadow-md rounded-xl"
            cover={
              <img
                alt={venture.name}
                src={venture.logo || "/images/event1.png"}
                className="h-40 object-cover rounded-t-xl"
              />
            }
          >
            <h3 className="font-bold text-lg text-[var(--color-primary)]">
              {venture.name}
            </h3>
            <p className="text-sm text-[var(--color-darkGray)] mb-4 line-clamp-2">
              {venture.description}
            </p>

            <div className="flex gap-2">
              <Button icon={<EyeOutlined />} onClick={() => onView(venture.id)}>
                View
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => onEdit(venture.id)}
                className="!bg-[var(--color-teal)] !text-white"
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(venture.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VenturePreview;
