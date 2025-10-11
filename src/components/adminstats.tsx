import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Statistic,
  Divider,
  Typography,
} from "antd";
import {
  TeamOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  UserSwitchOutlined,
  BookOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import axiosInstance from "../config/axiosConfig";

const { Title } = Typography;

interface AdminMetrics {
  users: {
    total: number;
    approved: number;
    pending_approval: number;
    admins: number;
    mentors: number;
    members: number;
  };
  ventures: { total: number };
  applications: { total: number; pending: number; approved: number };
  mentor_matches: { total: number; active: number };
  programs: { total: number; active: number };
  resources: { total: number };
}

const AdminStats: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/dashboard/metrics");
        setMetrics(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );

  if (!metrics)
    return <p className="text-center text-gray-500 mt-6">No data found</p>;

  // === Card Style Helper ===
  const cardStyle =
    "shadow-md hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* === Page Title === */}
      <div className="mb-8">
        <Title level={2} className="text-[var(--color-primary)]">
          Admin Dashboard
        </Title>
        <p className="text-gray-500">
          Overview of platform activity, users, and performance metrics.
        </p>
      </div>

      {/* === Top KPIs === */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-teal-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Users</span>}
              value={metrics.users.total}
              prefix={<TeamOutlined style={{ color: "#08979c" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-amber-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Ventures</span>}
              value={metrics.ventures.total}
              prefix={<AppstoreOutlined style={{ color: "#d48806" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-sky-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Applications</span>}
              value={metrics.applications.total}
              prefix={<FileTextOutlined style={{ color: "#1677ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-green-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Programs</span>}
              value={metrics.programs.total}
              prefix={<BookOutlined style={{ color: "#389e0d" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-purple-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Active Matches</span>}
              value={metrics.mentor_matches.active}
              prefix={<UserSwitchOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className={`${cardStyle} bg-gradient-to-br from-gray-50 to-white`}>
            <Statistic
              title={<span className="font-semibold text-gray-600">Resources</span>}
              value={metrics.resources.total}
              prefix={<CloudOutlined style={{ color: "#8c8c8c" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Divider className="my-8" />

      {/* === User Breakdown === */}
      <Card
        title={<span className="font-semibold text-[var(--color-primary)]">User Breakdown</span>}
        className={`${cardStyle} mb-8`}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Approved" value={metrics.users.approved} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic
              title="Pending"
              value={metrics.users.pending_approval}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Admins" value={metrics.users.admins} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Mentors" value={metrics.users.mentors} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Members" value={metrics.users.members} />
          </Col>
        </Row>
      </Card>

      {/* === Applications Breakdown === */}
      <Card
        title={<span className="font-semibold text-[var(--color-primary)]">Applications Overview</span>}
        className={cardStyle}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Statistic
              title="Pending"
              value={metrics.applications.pending}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic
              title="Approved"
              value={metrics.applications.approved}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Total" value={metrics.applications.total} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminStats;
