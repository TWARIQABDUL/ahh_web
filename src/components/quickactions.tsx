import React from "react";
import { Card } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  BookOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const QuickActions: React.FC = () => {
  const actions = [
    {
      key: "apply",
      label: "Apply to a Program",
      icon: <PlusOutlined />,
      onClick: () => console.log("Apply to program clicked"),
    },
    {
      key: "edit",
      label: "Edit Venture Profile",
      icon: <EditOutlined />,
      onClick: () => console.log("Edit venture clicked"),
    },
    {
      key: "resources",
      label: "Resource Center",
      icon: <BookOutlined />,
      onClick: () => console.log("Resource center clicked"),
    },
    {
      key: "mentorship",
      label: "Request Mentorship",
      icon: <TeamOutlined />,
      onClick: () => console.log("Mentorship clicked"),
    },
  ];

  return (
    <><h2 className="text-xl font-semibold text-[var(--color-primary)]">
              Resource Center
            </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        
      {actions.map((action) => (
        <Card
          key={action.key}
          hoverable
          onClick={action.onClick}
          className="shadow-md rounded-xl transition-all duration-300 cursor-pointer 
                     hover:!shadow-xl hover:!bg-[var(--color-teal)]/10"
        >
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--color-teal)]/20 text-[var(--color-teal)] text-2xl mb-4">
              {action.icon}
            </div>
            <p className="font-semibold text-[var(--color-primary)]">
              {action.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
    </>
  );
};

export default QuickActions;
