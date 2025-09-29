import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

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
        <Layout.Content style={{ padding: "24px" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboardlayout;
