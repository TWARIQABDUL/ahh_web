import React from "react";
import { Layout } from "antd";

import AdminStats from "./adminstats";

const { Content } = Layout;

const DashboardComponent: React.FC = () => {

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
                <AdminStats />
            </div>


        </Content>
    );
};

export default DashboardComponent;
