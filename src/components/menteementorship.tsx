import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  message,
  Drawer,
  Avatar,
  Spin,
} from "antd";
import axiosInstance from "../config/axiosConfig";

interface MentorMatch {
  match_id: number;
  mentor_id: number;
  member_id: number;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

interface MentorProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_details: string;
  created_at: string;
}

const MenteeMentorships: React.FC = () => {
  const [matches, setMatches] = useState<MentorMatch[]>([]);
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // === Fetch Mentee Mentorships ===
  const fetchMatches = async () => {
    try {
      const response = await axiosInstance.get("/mentor-matches/");
      setMatches(response.data);
      console.log("✅ Mentee Matches:", response.data);
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Failed to load mentorships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // === Fetch Mentor Details ===
  const fetchMentorDetails = async (mentorId: number) => {
    setDrawerVisible(true);
    setDrawerLoading(true);
    try {
      const response = await axiosInstance.get(`/users/${mentorId}`);
      setMentor(response.data);
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Failed to load mentor details");
    } finally {
      setDrawerLoading(false);
    }
  };

  // === Cancel Request ===
  const handleCancelRequest = async (matchId: number) => {
    try {
      await axiosInstance.delete(`/mentor-matches/${matchId}`);
      messageApi.success("✅ Mentorship request cancelled");
      fetchMatches();
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Failed to cancel mentorship request");
    }
  };

  // === Table Columns ===
  const columns = [
    {
      title: "Mentor ID",
      dataIndex: "mentor_id",
      key: "mentor_id",
      render: (id: number) => <span>#{id}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const color =
          status === "accepted"
            ? "green"
            : status === "declined"
            ? "red"
            : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Requested On",
      dataIndex: "created_at",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (match: MentorMatch) => (
        <Space>
          <Button onClick={() => fetchMentorDetails(match.mentor_id)}>
            View Mentor
          </Button>
          {match.status === "pending" && (
            <Button
              danger
              onClick={() => handleCancelRequest(match.match_id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {contextHolder}
      <Card title="📘 My Mentorship Requests" className="shadow-md rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            You haven't sent any mentorship requests yet.
          </p>
        ) : (
          <Table
            rowKey="match_id"
            columns={columns}
            dataSource={matches}
            pagination={{ pageSize: 6 }}
          />
        )}
      </Card>

      {/* === Mentor Drawer === */}
      <Drawer
        title={
          mentor ? `${mentor.first_name} ${mentor.last_name}` : "Mentor Details"
        }
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={480}
      >
        {drawerLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin />
          </div>
        ) : mentor ? (
          <>
            <div className="flex flex-col items-center mb-4">
              <Avatar size={80} className="bg-[var(--color-primary)] text-white">
                {mentor.first_name[0]}
              </Avatar>
              <h3 className="mt-3 text-lg font-semibold text-[var(--color-primary)]">
                {mentor.first_name} {mentor.last_name}
              </h3>
              <Tag color="blue" className="mt-1">
                {mentor.role}
              </Tag>
            </div>

            <p>
              <strong>Email:</strong> {mentor.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(mentor.created_at).toLocaleDateString()}
            </p>
            <div className="mt-4">
              <strong>Profile Details:</strong>
              <p className="mt-2 text-gray-600">
                {mentor.profile_details || "No details available."}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No mentor data available.</p>
        )}
      </Drawer>
    </div>
  );
};

export default MenteeMentorships;
