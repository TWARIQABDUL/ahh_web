import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const Dashboard: React.FC = () => {
  return (
    <Content className="p-6 bg-gray-100 h-dvh">
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">
        Dashboard
      </h1>
      <p className="mt-2 text-[var(--color-darkGray)]">
        Welcome to your dashboard. Here’s where your content will go.
      </p>
    </Content>
  );
};

export default Dashboard;
