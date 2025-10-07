import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Avatar,
  Drawer,
  Button,
} from "antd";

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  location: string;
  bio: string;
  status: "Available" | "Unavailable";
  avatar?: string;
}

const allMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Amina K.",
    expertise: ["Healthcare", "Digital Health"],
    location: "Kigali, Rwanda",
    bio: "Public health specialist with 10+ years mentoring startups in healthcare.",
    status: "Available",
    avatar: "/images/mentor1.png",
  },
  {
    id: "2",
    name: "John Doe",
    expertise: ["Agriculture", "Business Strategy"],
    location: "Nairobi, Kenya",
    bio: "AgriTech entrepreneur supporting early-stage farmers' cooperatives.",
    status: "Unavailable",
    avatar: "/images/mentor2.png",
  },
  {
    id: "3",
    name: "Grace W.",
    expertise: ["Education", "EdTech"],
    location: "Lagos, Nigeria",
    bio: "Education innovator passionate about digital learning platforms.",
    status: "Available",
    avatar: "/images/mentor3.png",
  },
];

const MentorsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ✅ Filtered mentors
  const filteredMentors = allMentors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((exp) =>
        exp.toLowerCase().includes(search.toLowerCase())
      );
    const matchesExpertise = expertiseFilter
      ? m.expertise.includes(expertiseFilter)
      : true;
    const matchesStatus = statusFilter ? m.status === statusFilter : true;
    return matchesSearch && matchesExpertise && matchesStatus;
  });

  const openDrawer = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedMentor(null);
    setIsDrawerOpen(false);
  };

  const getStatusColor = (status: Mentor["status"]) =>
    status === "Available" ? "green" : "red";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Mentors
      </h1>

      {/* ✅ Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input.Search
          placeholder="Search mentors..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          placeholder="Filter by expertise"
          allowClear
          className="w-48"
          onChange={(val) => setExpertiseFilter(val)}
        >
          <Select.Option value="Healthcare">Healthcare</Select.Option>
          <Select.Option value="Agriculture">Agriculture</Select.Option>
          <Select.Option value="Education">Education</Select.Option>
        </Select>
        <Select
          placeholder="Filter by status"
          allowClear
          className="w-48"
          onChange={(val) => setStatusFilter(val)}
        >
          <Select.Option value="Available">Available</Select.Option>
          <Select.Option value="Unavailable">Unavailable</Select.Option>
        </Select>
      </div>

      {/* ✅ Mentor Cards */}
      <Row gutter={[16, 16]}>
        {filteredMentors.map((mentor) => (
          <Col xs={24} sm={12} lg={8} key={mentor.id}>
            <Card
              hoverable
              onClick={() => openDrawer(mentor)}
              className="shadow-md rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar size={64} src={mentor.avatar}>
                  {mentor.name[0]}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--color-primary)]">
                    {mentor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{mentor.location}</p>
                  <Tag color={getStatusColor(mentor.status)}>
                    {mentor.status}
                  </Tag>
                </div>
              </div>
              <div className="mt-3">
                {mentor.expertise.map((exp, idx) => (
                  <Tag key={idx} color="blue">
                    {exp}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ Drawer */}
      <Drawer
        title={selectedMentor?.name}
        open={isDrawerOpen}
        onClose={closeDrawer}
        width={480}
      >
        {selectedMentor && (
          <>
            <Avatar
              src={selectedMentor.avatar}
              size={80}
              className="mb-4"
            />
            <p>
              <strong>Location:</strong> {selectedMentor.location}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedMentor.status)}>
                {selectedMentor.status}
              </Tag>
            </p>
            <p>
              <strong>Expertise:</strong>{" "}
              {selectedMentor.expertise.join(", ")}
            </p>
            <p className="mt-4">{selectedMentor.bio}</p>

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                disabled={selectedMentor.status !== "Available"}
                className="bg-[var(--color-teal)]"
              >
                Request Mentorship
              </Button>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default MentorsPage;
