import React from "react";
import { Table, Tag } from "antd";

interface Application {
  key: string;
  program: string;
  dateApplied: string;
  status: "Accepted" | "Pending" | "Rejected";
}

const data: Application[] = [
  { key: "1", program: "Entrepreneurship Bootcamp", dateApplied: "2025-09-01", status: "Pending" },
  { key: "2", program: "Health Innovation Challenge", dateApplied: "2025-08-20", status: "Accepted" },
  { key: "3", program: "Startup Accelerator", dateApplied: "2025-07-15", status: "Rejected" },
  { key: "4", program: "Digital Health Hackathon", dateApplied: "2025-07-10", status: "Pending" },
  { key: "5", program: "Impact Fellowship", dateApplied: "2025-06-30", status: "Accepted" },
  { key: "6", program: "AI for Health Cohort", dateApplied: "2025-06-15", status: "Rejected" },
  { key: "7", program: "Women in Tech Program", dateApplied: "2025-05-25", status: "Pending" },
];

const ProgramApplications: React.FC = () => {
  const columns = [
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
    },
    {
      title: "Date Applied",
      dataIndex: "dateApplied",
      key: "dateApplied",
      sorter: (a: Application, b: Application) =>
        new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a: Application, b: Application) =>
        a.status.localeCompare(b.status),
      render: (status: Application["status"]) => {
        let color = "";
        if (status === "Accepted") color = "green";
        if (status === "Pending") color = "blue";
        if (status === "Rejected") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
        My Program Applications
      </h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
        className="bg-white rounded-lg shadow-md"
      />
    </div>
  );
};

export default ProgramApplications;
