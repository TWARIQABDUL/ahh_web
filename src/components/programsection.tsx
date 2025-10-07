import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Pagination,
  Typography,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../config/axiosConfig";

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  // ✅ Fetch Programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/programs"); // adjust if you have baseURL configured
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        message.error("Failed to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // ✅ Determine Program Status Based on Deadline + is_active
  const getProgramStatus = (program: any): "Open" | "Closed" | "Upcoming" => {
    const now = new Date();
    const deadline = new Date(program.application_deadline);

    if (!program.is_active) return "Closed";
    if (deadline < now) return "Closed";
    if (deadline > now && (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) > 7)
      return "Open";
    return "Upcoming";
  };

  const getStatusColor = (status: "Open" | "Closed" | "Upcoming") => {
    switch (status) {
      case "Open":
        return "green";
      case "Closed":
        return "red";
      case "Upcoming":
        return "orange";
      default:
        return "blue";
    }
  };

  // ✅ Filter + Search
  const filteredPrograms = programs
    .map((p) => ({
      ...p,
      status: getProgramStatus(p),
    }))
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });

  // ✅ Pagination
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Programs
      </h1>

      {/* ✅ Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input.Search
          placeholder="Search programs..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          placeholder="Filter by status"
          allowClear
          className="w-48"
          onChange={(val) => setStatusFilter(val)}
        >
          <Select.Option value="Open">Open</Select.Option>
          <Select.Option value="Upcoming">Upcoming</Select.Option>
          <Select.Option value="Closed">Closed</Select.Option>
        </Select>
      </div>

      {/* ✅ Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ✅ Program Cards */}
          <Row gutter={[16, 16]}>
            {paginatedPrograms.length === 0 ? (
              <p className="text-gray-500">No programs found.</p>
            ) : (
              paginatedPrograms.map((program) => (
                <Col xs={24} sm={12} lg={8} key={program.program_id}>
                  <Card
                    title={
                      <div className="flex justify-between items-start gap-2">
                        <Typography.Text
                          strong
                          ellipsis={{ tooltip: program.title }}
                          style={{
                            maxWidth: "70%",
                            color: "var(--color-primary)",
                            fontSize: 16,
                          }}
                        >
                          {program.title}
                        </Typography.Text>
                        <Tag color={getStatusColor(program.status)}>
                          {program.status}
                        </Tag>
                      </div>
                    }
                    className="shadow-md rounded-lg h-full"
                  >
                    <Typography.Paragraph
                      ellipsis={{ rows: 2, tooltip: program.description }}
                      className="text-[var(--color-darkGray)] mb-4"
                    >
                      {program.description}
                    </Typography.Paragraph>

                    <p className="text-sm text-gray-500 mb-4">
                      Deadline:{" "}
                      <strong>
                        {new Date(program.application_deadline).toLocaleDateString()}
                      </strong>
                    </p>

                    <Button
                      type="primary"
                      className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
                      onClick={() => navigate(`${program.program_id}/apply`)}
                    >
                      Apply
                    </Button>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* ✅ Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPrograms.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProgramsPage;
