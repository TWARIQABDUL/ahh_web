import React from "react";
import { Layout, Input, Avatar, Dropdown, Menu, Badge } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const DashboardHeader: React.FC = () => {
  const menu = (
    <Menu
      items={[
        { key: "profile", label: "Profile", icon: <UserOutlined /> },
        { key: "settings", label: "Settings", icon: <SettingOutlined /> },
        { type: "divider" },
        { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
      ]}
    />
  );

  return (
    <Header
      className="!bg-white !px-6 flex items-center justify-between shadow-sm h-16 sticky top-0 z-10"
    >
      {/* Left: Page Title */}
      <h2 className="text-lg font-semibold text-[var(--color-primary)]">
        Dashboard
      </h2>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center gap-6">
        {/* Search bar */}
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search..."
          className="w-64 rounded-lg"
        />

        {/* Notifications */}
        <Badge count={3} offset={[0, 6]}>
          <BellOutlined className="text-xl text-[var(--color-darkGray)] cursor-pointer" />
        </Badge>

        {/* Avatar + Username + Dropdown */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar src="/images/event1.png" />
            <span className="font-medium text-[var(--color-darkGray)]">
              Claudia
            </span>
            <DownOutlined className="text-xs text-gray-400" />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default DashboardHeader;
