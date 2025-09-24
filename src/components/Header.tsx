import { Flex, Layout, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

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

function AppHeader() {


  return (
 <AntHeader className="!bg-primary px-4 md:px-10 h-20 flex items-center">
  {/* Logo + Text (Left) */}
  <Flex gap={10} align="center" className="shrink-0">
    <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12 object-contain" />
    <Flex vertical className="leading-tight text-white">
      <p className="text-sm font-semibold">AFRICAN</p>
      <p className="text-sm font-semibold">HEALTHPRENEURSHIP</p>
      <p className="text-sm font-semibold">HUB</p>
    </Flex>
  </Flex>

  {/* Menu (Center, takes remaining space) */}
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

  {/* CTA Button (Right) */}
  <Button
    type="primary"
    className="ml-4 shrink-0 bg-teal hover:!bg-white hover:!text-primary font-semibold"
  >
    Get Started
  </Button>
</AntHeader>


  );
}

export default AppHeader;
