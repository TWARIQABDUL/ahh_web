import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  message,
  Spin,
  Drawer,
  Avatar,
  Tabs,
  List,
} from "antd";
import axiosInstance from "../config/axiosConfig";

interface MentorMatch {
  match_id: number;
  mentor_id: number;
  member_id: number;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

interface MenteeProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_details: string;
  created_at: string;
}

interface Venture {
  venture_id: number;
  member_id: number;
  venture_name: string;
  description: string;
  created_at: string;
  member: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_approved: boolean;
    profile_details: string | null;
    created_at: string;
  };
}

const MentorRequestsComponent: React.FC = () => {
  const [matches, setMatches] = useState<MentorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [mentee, setMentee] = useState<MenteeProfile | null>(null);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // === Fetch Matches ===
  const fetchMatches = async () => {
    try {
      const response = await axiosInstance.get("/mentor-matches/");
      setMatches(response.data);
      console.log("✅ Mentor matches:", response.data);
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Failed to load mentee requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // === Fetch Mentee Profile & Ventures ===
  const fetchMenteeData = async (memberId: number) => {
    setDrawerVisible(true);
    setDrawerLoading(true);
    try {
      const [profileRes, venturesRes] = await Promise.all([
        axiosInstance.get(`/users/${memberId}`),
        axiosInstance.get(`/dashboard/mentees/${memberId}/ventures`), // updated endpoint
      ]);
      console.log("✅ Mentee profile:", profileRes.data);
      console.log("✅ Mentee ventures:", venturesRes.data);

      setMentee(profileRes.data);
      setVentures(venturesRes.data);
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Failed to load mentee data");
    } finally {
      setDrawerLoading(false);
    }
  };

  // === Update Match Status ===
  const handleStatusChange = async (matchId: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/mentor-matches/${matchId}`, { status: newStatus });
      messageApi.success(`✅ Request ${newStatus} successfully!`);
      fetchMatches();
    } catch {
      messageApi.error("❌ Failed to update request status");
    }
  };

  // === Table Columns ===
  const columns = [
    {
      title: "Mentee ID",
      dataIndex: "member_id",
      key: "member_id",
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
      title: "Created At",
      dataIndex: "created_at",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (match: MentorMatch) => (
        <Space>
          {match.status === "pending" && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusChange(match.match_id, "accepted")}
              >
                Accept
              </Button>
              <Button
                danger
                onClick={() => handleStatusChange(match.match_id, "declined")}
              >
                Decline
              </Button>
            </>
          )}
          <Button onClick={() => fetchMenteeData(match.member_id)}>
            View Profile
          </Button>
        </Space>
      ),
    },
  ];

  // === Drawer Tabs ===
  const tabItems = [
    {
      key: "profile",
      label: "Profile",
      children: mentee ? (
        <div>
          <div className="flex flex-col items-center mb-4">
            <Avatar size={80} className="bg-[var(--color-primary)] text-white">
              {mentee.first_name[0]}
            </Avatar>
            <h3 className="mt-3 text-lg font-semibold text-[var(--color-primary)]">
              {mentee.first_name} {mentee.last_name}
            </h3>
            <Tag color="blue" className="mt-1">
              {mentee.role}
            </Tag>
          </div>

          <p>
            <strong>Email:</strong> {mentee.email}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(mentee.created_at).toLocaleDateString()}
          </p>

          <div className="mt-4">
            <strong>Profile Details:</strong>
            <p className="mt-2 text-gray-600">
              {mentee.profile_details || "No details available."}
            </p>
          </div>
        </div>
      ) : (
        <Spin />
      ),
    },
    {
      key: "ventures",
      label: "Ventures",
      children: (
        <div>
          {ventures.length === 0 ? (
            <p className="text-gray-500">No ventures found for this mentee.</p>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={ventures}
              renderItem={(venture) => (
                <List.Item key={venture.venture_id}>
                  <List.Item.Meta
                    title={
                      <h3 className="text-[var(--color-primary)] font-semibold">
                        {venture.venture_name}
                      </h3>
                    }
                    description={`Created: ${new Date(
                      venture.created_at
                    ).toLocaleDateString()}`}
                  />
                  <p>{venture.description}</p>
                </List.Item>
              )}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {contextHolder}

      <Card title="🤝 Mentee Requests" className="shadow-md rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="match_id"
            columns={columns}
            dataSource={matches}
            pagination={{ pageSize: 6 }}
          />
        )}
      </Card>

      {/* === Mentee Drawer === */}
      <Drawer
        title={
          mentee
            ? `${mentee.first_name} ${mentee.last_name}`
            : "Mentee Details"
        }
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={560}
      >
        {drawerLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin />
          </div>
        ) : (
          <Tabs defaultActiveKey="profile" items={tabItems} />
        )}
      </Drawer>
    </div>
  );
};

export default MentorRequestsComponent;
