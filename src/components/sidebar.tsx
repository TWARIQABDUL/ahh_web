import React, { useContext, useState, useMemo } from "react";
import { Layout, Menu, Button, Tag } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes.tsx";
import { AuthContext } from "../context/authcontext.tsx";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const authcontext = useContext(AuthContext);

  const role = authcontext?.user?.role || "Member"; // fallback

  // === Member Menu ===
  const memberMenu = [
    { key: "dashboard", label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link>, icon: <HomeOutlined /> },
    { key: "programs", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.PROGRAMS}`}>Programs</Link>, icon: <AppstoreOutlined /> },
    { key: "ventures", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.VENTURES}`}>Ventures</Link>, icon: <AppstoreOutlined /> },
    { key: "mentors", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.MENTORS}`}>Mentors</Link>, icon: <TeamOutlined /> },
    { key: "resources", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.RESOURCE_CENTER}`}>Resource Center</Link>, icon: <BookOutlined /> },
    { key: "mymentor", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.MYMENTORS}`}>My Mentors</Link>, icon: <SettingOutlined /> },
    { key: "settings", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.SETTINGS}`}>Settings</Link>, icon: <SettingOutlined /> },

  ];

  // === Admin Menu ===
  const adminMenu = [
    { key: "dashboard", label: <Link to={ROUTES.DASHBOARD}>Admin Dashboard</Link>, icon: <HomeOutlined /> },
    { key: "users", label: <Link to={`${ROUTES.DASHBOARD}/users`}>Manage Users</Link>, icon: <UserOutlined /> },
    { key: "programs", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.PROGRAMS}`}>Manage Programs</Link>, icon: <AppstoreOutlined /> },
    { key: "reports", label: <Link to={`${ROUTES.DASHBOARD}/reports`}>Reports</Link>, icon: <FileTextOutlined /> },
    { key: "settings", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.SETTINGS}`}>Settings</Link>, icon: <SettingOutlined /> },
  ];

  // === Mentor Menu ===
  const mentorMenu = [
    { key: "dashboard", label: <Link to={ROUTES.DASHBOARD}>Mentor Dashboard</Link>, icon: <HomeOutlined /> },
    { key: "requests", label: <Link to={`${ROUTES.DASHBOARD}/requests`}>Mentee Requests</Link>, icon: <TeamOutlined /> },
    { key: "mentees", label: <Link to={`${ROUTES.DASHBOARD}/mentees`}>My Mentees</Link>, icon: <UserOutlined /> },
    { key: "resources", label: <Link to={`${ROUTES.DASHBOARD}/resources`}>My Resources</Link>, icon: <BookOutlined /> },
    { key: "settings", label: <Link to={`${ROUTES.DASHBOARD}/${ROUTES.SETTINGS}`}>Settings</Link>, icon: <SettingOutlined /> },
  ];

  // === Pick menu based on role ===
  const menuItems = useMemo(() => {
    let baseItems;
    if (role === "Admin") baseItems = adminMenu;
    else if (role === "Mentor") baseItems = mentorMenu;
    else baseItems = memberMenu;

    return [
      ...baseItems,
      {
        key: "logout",
        label: <Link to="/logout">Logout</Link>,
        icon: <LogoutOutlined />,
      },
    ];
  }, [role]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      collapsedWidth={80}
      className="!bg-[var(--color-primary)] !text-[var(--color-white)] min-h-screen fixed left-0 top-0 h-full"
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

      {/* Profile Section */}
      {!collapsed && (
        <div className="flex flex-col items-center py-8 border-b border-[var(--color-darkGray)]">
          <img
            src="/images/event1.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <p className="mt-3 font-semibold text-[var(--color-white)] text-center">
            {authcontext?.user?.first_name} {authcontext?.user?.last_name}
          </p>
          <Tag color="blue" className="mt-2">
            {role}
          </Tag>
          <Button
            type="link"
            className="!text-[var(--color-teal)] !p-0 mt-1"
            onClick={() => navigate(`${ROUTES.DASHBOARD}/${ROUTES.PROFILE}`)}
          >
            Edit Profile
          </Button>
        </div>
      )}

      {/* Menu */}
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
