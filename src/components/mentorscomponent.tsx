import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Tag,
  Avatar,
  Drawer,
  Button,
  message,
  Spin,
} from "antd";
import axiosInstance from "../config/axiosConfig";

interface Mentor {
  user_id: number;
  first_name: string;
  last_name: string;
  role: string;
  profile_details?: string;
  created_at: string;
}

const MentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [sending, setSending] = useState(false);

  // ✅ Fetch mentors
  const fetchMentors = async () => {
    try {
      const response = await axiosInstance.get("/users/mentors");
      setMentors(response.data);
    } catch (error) {
      messageApi.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // ✅ Filter mentors
  const filteredMentors = mentors.filter((m) => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  // ✅ Drawer control
  const openDrawer = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setSelectedMentor(null);
    setIsDrawerOpen(false);
  };

  // ✅ Request mentorship
  const handleRequestMentorship = async () => {
    if (!selectedMentor) return;

    try {
      setSending(true);

      await axiosInstance.post(`/mentor-matches/request?mentor_id=${selectedMentor.user_id}`);

      messageApi.success(
        `✅ Mentorship request sent to ${selectedMentor.first_name}`
      );
      closeDrawer();
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.detail) {
        messageApi.error(`❌ ${error.response.data.detail}`);
      } else {
        messageApi.error("❌ Failed to send mentorship request");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {contextHolder}
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
        Mentors
      </h1>

      {/* ✅ Search */}
      <Input.Search
        placeholder="Search mentors by name..."
        allowClear
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm mb-6"
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredMentors.map((mentor) => (
            <Col xs={24} sm={12} lg={8} key={mentor.user_id}>
              <Card
                hoverable
                onClick={() => openDrawer(mentor)}
                className="shadow-md rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar size={64}>{mentor.first_name[0]}</Avatar>
                  <div>
                    <h3 className="font-bold text-[var(--color-primary)]">
                      {mentor.first_name} {mentor.last_name}
                    </h3>
                    <Tag color="green">Mentor</Tag>
                    <p className="text-sm text-gray-500 mt-1">
                      Joined {new Date(mentor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {mentor.profile_details && (
                  <p className="mt-3 text-gray-600 text-sm">
                    {mentor.profile_details.slice(0, 80)}...
                  </p>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ Drawer */}
      <Drawer
        title={
          selectedMentor
            ? `${selectedMentor.first_name} ${selectedMentor.last_name}`
            : ""
        }
        open={isDrawerOpen}
        onClose={closeDrawer}
        width={480}
      >
        {selectedMentor && (
          <>
            <Avatar size={80} className="mb-4">
              {selectedMentor.first_name[0]}
            </Avatar>
            <p>
              <strong>Email:</strong>{" "}
              {selectedMentor.first_name.toLowerCase()}@example.com
            </p>
            <p>
              <strong>Role:</strong> {selectedMentor.role}
            </p>
            <p className="mt-3">{selectedMentor.profile_details}</p>

            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                onClick={handleRequestMentorship}
                loading={sending}
                disabled={sending}
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
