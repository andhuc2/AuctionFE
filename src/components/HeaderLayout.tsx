import React, { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  TrophyOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
  StarOutlined,
  LoginOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, theme, Button, Space, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
import PermissionMapping from "../utils/PermissionMapping";
import usePermissions from "../hooks/usePermissions";
import { JSX } from "react/jsx-runtime";

const { Header, Content, Footer } = Layout;

const menuItems: {
  label: string;
  key: string;
  icon: JSX.Element;
  path: string;
  permission: string;
}[] = [
  // {
  //   label: "Home",
  //   key: "home",
  //   icon: <HomeOutlined />,
  //   path: "/home",
  //   permission: PermissionMapping.NONE,
  // },
];

const HeaderLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { hasPermission } = usePermissions();
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const LOGO_URL = (import.meta.env.VITE_LOGO_URL as string) || "/logo.svg";
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (isAdmin() && !menuItems.some(item => item.key === "users")) {
    menuItems.push({
      label: "Users",
      key: "users",
      icon: <UserOutlined />,
      path: "/users",
      permission: PermissionMapping.VIEW_USER,
    })
  }
  if (isAdmin() && !menuItems.some(item => item.key === "categories")) {
    menuItems.push({
      label: "Categories",
      key: "categories",
      icon: <AppstoreOutlined />,
      path: "/categories",
      permission: PermissionMapping.VIEW_USER,
    })
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>
          <Link to="/home">
            <img
              src={LOGO_URL}
              alt="Logo"
              style={{
                width: "35px",
                margin: "0 2rem",
              }}
            />
          </Link>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname.split("/")[1]]}
            style={{ border: "none" }}
          >
            {menuItems.map((item) =>
              hasPermission(item.permission) ? (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.path}>{item.label}</Link>
                </Menu.Item>
              ) : null
            )}
          </Menu>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated && (
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
              style={{ fontSize: "16px", margin: "0 8px" }}
              title="Profile"
            />
          )}
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => {}}>
                {["English"].map((lang) => (
                  <Menu.Item
                    disabled
                    style={{ fontWeight: "bold", color: "#1890ff" }}
                    key={lang}
                  >
                    {lang}
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              title="Change Language"
              type="text"
              icon={<GlobalOutlined />}
              style={{ fontSize: 16, margin: "0 8px" }}
            />
          </Dropdown>
          <Button
            type="text"
            icon={isAuthenticated ? <LogoutOutlined /> : <LoginOutlined />}
            onClick={logout}
            style={{ fontSize: "16px", margin: "0 16px" }}
            title={isAuthenticated ? "Logout" : "Login"}
          />
        </div>
      </Header>

      <Content style={{ padding: "0 32px" }}>
        <DynamicBreadcrumb />
        <div
          style={{
            padding: 24,
            minHeight: "70vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default HeaderLayout;
