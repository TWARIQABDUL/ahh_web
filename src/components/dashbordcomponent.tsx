import React, { useContext } from "react";
import { Layout } from "antd";

import AdminStats from "./adminstats";
import { AuthContext } from "../context/authcontext";
import MentorStats from "./mentorStats";

const { Content } = Layout;

const DashboardComponent: React.FC = () => {


    const dataContext = useContext(AuthContext)
  const role = dataContext?.user?.role || "Member"; // fallback

    return (
        <Content className="p-6 bg-gray-100 h-dvh">
            {/* Dashboard Header */}
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                Dashboard
            </h1>
            <p className="mt-2 text-[var(--color-darkGray)]">
                Welcome to your dashboard. Here’s where your content will go.
            </p>

            <div className="mt-6">
                {role === "Admin" && <AdminStats />}
                {role === "Mentor" && <MentorStats />}
                
            </div>


        </Content>
    );
};

export default DashboardComponent;
