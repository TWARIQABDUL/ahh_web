import React, { useState } from "react";
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
} from "antd";
import { useNavigate } from "react-router-dom";

interface Program {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: "Open" | "Closed" | "Upcoming";
}

const allPrograms: Program[] = [
    {
        id: "1",
        title: "Healthcare Innovation Challenge",
        description: "Submit your ideas to transform healthcare delivery in Africa.",
        deadline: "2025-11-30",
        status: "Open",
    },
    {
        id: "2",
        title: "Women in Tech Fellowship",
        description: "Empowering women innovators with mentorship and funding.",
        deadline: "2025-12-15",
        status: "Upcoming",
    },
    {
        id: "3",
        title: "Student Innovators Bootcamp",
        description: "A week-long program to sharpen your innovation skills.",
        deadline: "2025-10-20",
        status: "Closed",
    },
    {
        id: "4",
        title: "Digital Health Accelerator",
        description: "Grow your digital health startup with expert mentors.",
        deadline: "2026-01-05",
        status: "Open",
    },
    {
        id: "5",
        title: "AgriTech Program",
        description: "Innovating agriculture through technology.",
        deadline: "2025-12-01",
        status: "Open",
    },
    {
        id: "6",
        title: "AI in Healthcare Hackathon",
        description: "48-hour hackathon focused on AI-driven solutions.",
        deadline: "2025-11-10",
        status: "Upcoming",
    },
    {
        id: "7",
        title: "Public Health Fellowship",
        description: "Support communities with data-driven health interventions. Support communities with data-driven health interventions.",
        deadline: "2026-02-01",
        status: "Open",
    },
    {
        id: "8",
        title: "Green Health Initiative",
        description: "Innovations at the intersection of health and environment.",
        deadline: "2025-12-28",
        status: "Upcoming",
    },
    {
        id: "9",
        title: "MedTech Innovators",
        description: "For startups developing cutting-edge medical technologies.",
        deadline: "2025-11-05",
        status: "Closed",
    },
];

const ProgramsPage: React.FC = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // ✅ Filter + Search
    const filteredPrograms = allPrograms.filter((p) => {
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

    const getStatusColor = (status: Program["status"]) => {
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

            {/* ✅ Program Cards */}
            <Row gutter={[16, 16]}>
                {paginatedPrograms.map((program) => (
                    <Col xs={24} sm={12} lg={8} key={program.id}>
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
                            {/* ✅ Truncated Description */}
                            <Typography.Paragraph
                                ellipsis={{ rows: 2, tooltip: program.description }}
                                className="text-[var(--color-darkGray)] mb-4"
                            >
                                {program.description}
                            </Typography.Paragraph>

                            <p className="text-sm text-gray-500 mb-4">
                                Deadline: <strong>{program.deadline}</strong>
                            </p>
                            <Button
                                type="primary"
                                className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
                                onClick={() => navigate(`${program.id}/apply`)}
                            >
                                Apply
                            </Button>
                        </Card>
                    </Col>
                ))}
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
        </div>
    );
};

export default ProgramsPage;
