import React from "react";
import { Card, Row, Col } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  TeamOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

const statsData = [
  {
    title: "Programs Applied",
    value: 3,
    icon: <AppstoreOutlined className="text-3xl text-[var(--color-teal)]" />,
  },
  {
    title: "Ventures Created",
    value: 1,
    icon: <ProjectOutlined className="text-3xl text-[var(--color-teal)]" />,
  },
  {
    title: "Resources Available",
    value: 12,
    icon: <BookOutlined className="text-3xl text-[var(--color-teal)]" />,
  },
  {
    title: "Mentorship Requests",
    value: 2,
    icon: <TeamOutlined className="text-3xl text-[var(--color-teal)]" />,
  },
];

const StatsCards: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className="mb-6">
      {statsData.map((stat) => (
        <Col xs={24} sm={12} md={12} lg={6} key={stat.title}>
          <Card
            className="shadow-md rounded-xl hover:shadow-lg transition-all"
            bodyStyle={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px",
            }}
          >
            <div>{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-darkGray)]">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-[var(--color-primary)]">
                {stat.value}
              </p>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
