import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
// import DashboardHeader from "../components/dashbordheader";
// import DashboardHeader from "../components/DashboardHeader";

const Dashboardlayout: React.FC = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout
        style={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Sticky header */}
        {/* <DashboardHeader /> */}

        {/* Page content */}
        <Layout.Content style={{ padding: "24px" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboardlayout;
