import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import useSideLinks from "./links";
import { User } from "lucide-react";
const { Header, Sider, Content } = Layout;

const Default = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sideLinks = useSideLinks();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      setCollapsed(true); // Collapse sider on mobile
    } else {
      setIsMobile(false);
      setCollapsed(false); // Expand sider on desktop
    }
  };

  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for window resizing

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup listener
    };
  }, []);

  const menuItems = sideLinks.map((link, index) => ({
    key: index + 1,
    icon: link.icon,
    label: link.nom,
    onClick: () => navigate(link.path),
  }));

  return (
    <Layout className="max-h-screen min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          className="h-full"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {!isMobile && (
            <div className="flex items-center justify-between pr-5">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <User
                size={24}
                className="border-2 border-black rounded-full cursor-pointer"
              />
            </div>
          )}
        </Header>
        <Content className="max-h-svh overflow-auto m-5">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Default;
