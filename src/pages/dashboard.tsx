import React from "react";
import { Layout } from "antd";
import StatsCards from "../components/statscard";
import QuickActions from "../components/quickactions"; // ⬅️ import QuickActions
import ResourceCenter from "../components/resoursecenter";
import ProgramApplications from "../components/programstable";
// import VentureSummary from "../components/venturesummary";
import VenturePreview from "../components/venturesummary";

const { Content } = Layout;

const Dashboard: React.FC = () => {
   const ventures = [
    {
      id: "1",
      name: "Tech Innovators Ltd",
      description: "Helping businesses digitize their workflows.",
      logo: "/images/event1.png",
    },
    {
      id: "2",
      name: "AgriBoost",
      description: "A platform to empower local farmers with market insights.",
      logo: "/images/event2.png",
    },
    {
      id: "3",
      name: "EduSmart",
      description: "Revolutionizing e-learning for African students.",
      logo: "/images/event3.png",
    },
    {
      id: "4",
      name: "HealthBridge",
      description: "Connecting patients with doctors virtually.",
      logo: "/images/event4.png",
    },
  ];
  return (
    <Content className="p-6 bg-gray-100 h-dvh">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">
        Dashboard
      </h1>
      <p className="mt-2 text-[var(--color-darkGray)]">
        Welcome to your dashboard. Here’s where your content will go.
      </p>

      {/* Stats Cards Section */}
      <div className="mt-6">
        <StatsCards />
      </div>

      {/* Quick Actions Section */}
      <QuickActions />   {/* ⬅️ here */}
       {/* Venture Summary */}
      {/* Venture Preview */}
      <VenturePreview
        ventures={ventures}
        onView={(id) => console.log("View venture", id)}
        onEdit={(id) => console.log("Edit venture", id)}
        onDelete={(id) => console.log("Delete venture", id)}
      />
      {/* Resource Center Section */}
      <ResourceCenter />
      <ProgramApplications/>
    </Content>
  );
};

export default Dashboard;
