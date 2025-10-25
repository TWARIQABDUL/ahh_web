import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spin, Statistic, Typography, Divider } from "antd";
import { UserOutlined, TeamOutlined, FileTextOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import axiosInstance from '../config/axiosConfig';

const { Title } = Typography;

interface MentorStatsResponse {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  mentor_matches: any[];
  pending_requests: any[];
  shared_resources: any[];
  potential_mentees: any[];
  stats: {
    total_mentees: number;
    pending_requests: number;
    resources_shared: number;
  };
}

const MentorStats: React.FC = () => {
  const [stats, setStats] = useState<MentorStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/dashboard/mentor')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching mentee statistics:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading mentor stats..." />
      </div>
    );

  if (!stats)
    return <p className="text-center text-gray-500 mt-6">No data found</p>;

  const cardStyle =
    "shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* === Page Title === */}
      <div className="mb-8">
        <Title level={3} className="text-[var(--color-primary)]">
          Mentor Dashboard
        </Title>
        <p className="text-gray-500">
          Overview of your mentorship activity and statistics.
        </p>
      </div>

      {/* === Top KPIs === */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={`${cardStyle} bg-gradient-to-br from-blue-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Total Mentees</span>}
              value={stats.stats.total_mentees}
              prefix={<TeamOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={`${cardStyle} bg-gradient-to-br from-amber-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Pending Requests</span>}
              value={stats.stats.pending_requests}
              prefix={<UsergroupAddOutlined style={{ color: "#d48806" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={`${cardStyle} bg-gradient-to-br from-green-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Resources Shared</span>}
              value={stats.stats.resources_shared}
              prefix={<FileTextOutlined style={{ color: "#389e0d" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={`${cardStyle} bg-gradient-to-br from-purple-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Potential Mentees</span>}
              value={stats.potential_mentees.length}
              prefix={<UserOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Divider className="my-8" />

      {/* === Mentor Info === */}
      <Card
        title={<span className="font-semibold text-[var(--color-primary)]">Mentor Info</span>}
        className={`${cardStyle} mb-8`}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Statistic title="Name" value={`${stats.user.first_name} ${stats.user.last_name}`} />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic title="Email" value={stats.user.email} />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Statistic title="Role" value={stats.user.role} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default MentorStats;