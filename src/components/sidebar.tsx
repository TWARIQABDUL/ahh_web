import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes.";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "dashboard", label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link>, icon: <HomeOutlined /> },
    { key: "resources", label: <Link to="/resources">Resource Center</Link>, icon: <BookOutlined /> },
    { key: "programs", label: <Link to="/programs">Programs</Link>, icon: <AppstoreOutlined /> },
    { key: "ventures", label: <Link to="/ventures">Ventures</Link>, icon: <AppstoreOutlined /> },
    { key: "mentors", label: <Link to="/mentors">Mentors</Link>, icon: <TeamOutlined /> },
    { key: "settings", label: <Link to="/settings">Settings</Link>, icon: <SettingOutlined /> },
    { key: "logout", label: <Link to="/logout">Logout</Link>, icon: <LogoutOutlined /> },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null} // custom toggle button
      width={240}
      collapsedWidth={80}
      className="!bg-[var(--color-primary)] !text-[var(--color-white)] font-[var(--font-inter)] min-h-screen fixed left-0 top-0 h-full"
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3 border-b border-[var(--color-darkGray)]">
        <Button
          type="text"
          className="!text-[var(--color-white)]"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Profile Section (hidden when collapsed) */}
      {!collapsed && (
        <div className="flex flex-col items-center py-8 border-b border-[var(--color-darkGray)]">
          <img
            src="/images/event1.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <p className="mt-3 font-semibold text-[var(--color-white)]">CLAUDIAN</p>
          <Button type="link" className="!text-[var(--color-teal)] !p-0">
            Edit Profile
          </Button>
        </div>
      )}

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        className="!bg-[var(--color-primary)] !text-white border-none mt-6
                   [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!gap-3
                   [&_.ant-menu-item]:!text-white
                   [&_.ant-menu-item-selected]:!bg-[var(--color-teal)]/20 
                   [&_.ant-menu-item-selected]:!text-[var(--color-teal)] 
                   [&_.ant-menu-item-selected]:!rounded-lg
                   [&_.ant-menu-item:hover]:!bg-[var(--color-teal)]/10"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
