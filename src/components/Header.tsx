import { Flex, Menu, Button, Drawer } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
const menuItems = [
  { key: "1", label: "Home" },
  {
    key: "2",
    label: (
      <span>
        Updates <DownOutlined className="ml-1 text-xs" />
      </span>
    ),
    children: [
      { key: "2-1", label: "Latest News" },
      { key: "2-2", label: "Events" },
      { key: "2-3", label: "Announcements" },
    ],
  },
  {
    key: "3",
    label: (
      <span>
        Resources <DownOutlined className="ml-1 text-xs" />
      </span>
    ),
    children: [
      { key: "3-1", label: "Guides" },
      { key: "3-2", label: "Reports" },
      { key: "3-3", label: "Media" },
    ],
  },
  {
    key: "4",
    label: (
      <span>
        About Us <DownOutlined className="ml-1 text-xs" />
      </span>
    ),
    children: [
      { key: "4-1", label: "Who We Are" },
      { key: "4-2", label: "Our Philosophy" },
      { key: "4-3", label: "Team" },
    ],
  },
];

const AppHeader:React.FC = ()=> {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Detect screen size reliably
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="!bg-primary px-4 md:px-10 h-20 flex items-center">
      {/* Logo + Text (Left) */}
      <Flex gap={10} align="center" className="shrink-0">
        <img
          src="/images/logo.jpg"
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
        <Flex vertical className="leading-tight text-white">
          <p className="text-sm font-semibold">AFRICAN</p>
          <p className="text-sm font-semibold">HEALTHPRENEURSHIP</p>
          <p className="text-sm font-semibold">HUB</p>
        </Flex>
      </Flex>

      {/* Desktop Menu (rendered only if not mobile) */}
      {!isMobile && (
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          overflowedIndicator={null}
          className="flex-1 justify-center !bg-primary text-white border-none 
                     [&_.ant-menu-item]:!bg-primary 
                     [&_.ant-menu-item:hover]:!bg-teal/20 
                     [&_.ant-menu-submenu-title]:!text-white"
        />
      )}

      {/* CTA Button (Right) & Hamburger */}
      <div className="ml-auto flex items-center gap-3">
        {/* CTA visible only on desktop */}
        {!isMobile && (
          <Button
            type="primary"
            className="shrink-0 bg-teal hover:!bg-white hover:!text-primary font-semibold"
          >
            Get Started
          </Button>
        )}

        {/* Hamburger visible only on mobile */}
        {isMobile && (
          <Button
            type="text"
            className="!text-white !border-none !shadow-none"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            icon={<MenuOutlined className="text-2xl text-white" />}
          />
        )}
      </div>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          theme="dark"
          mode="inline" // ✅ makes submenus expandable
          items={menuItems}
          className="!bg-primary text-white border-none 
                     [&_.ant-menu-submenu-title]:!text-white 
                     [&_.ant-menu-item]:!bg-primary 
                     [&_.ant-menu-item:hover]:!bg-teal/20"
        />
        <div className="p-4">
          <Button
            type="primary"
            block
            className="bg-teal hover:!bg-white hover:!text-primary font-semibold"
          >
            Get Started
          </Button>
        </div>
      </Drawer>
    </nav>
  );
}

export default AppHeader;
