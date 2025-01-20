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
import useAuth from "../../hooks/useAuth";
import Spinner from "../Spinner";
import DynamicBreadcrumb from "../DynamicBreadcrumb";
import PermissionMapping from "../../utils/PermissionMapping";
import usePermissions from "../../hooks/usePermissions";
import { Constant } from "../../utils/Constant";

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    label: "Home",
    key: "home",
    icon: <HomeOutlined />,
    path: "/home",
    permission: PermissionMapping.NONE,
  }
];

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { hasPermission } = usePermissions();
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed") === "true"
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

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
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ position: "sticky", height: "100vh", top: 0, left: 0 }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Link to="/home">
            <img
              src={Constant.ASSET.LOGO_URL}
              style={{ maxWidth: collapsed ? "70%" : "30%", height: "auto" }}
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname.split("/")[1]]}
          mode="inline"
        >
          {menuItems.map(
            (item) =>
              hasPermission(item.permission) && (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.path}>{item.label}</Link>
                </Menu.Item>
              )
          )}

          {/* <Menu.Item
            icon={<LogoutOutlined />}
            onClick={logout}
            style={{ position: "absolute", bottom: 0 }}
          >
            Logout
          </Menu.Item> */}
        </Menu>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              localStorage.setItem("collapsed", !collapsed + "");
              setCollapsed(!collapsed);
            }}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              border: "none",
              background: "transparent",
              color: "#9fa7ae",
            }}
          />
        </div>
      </Sider>

      <Layout style={{ position: "relative" }}>
        <Spinner />
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
            style={{
              fontSize: "16px",
              width: 32,
              height: 32,
              marginLeft: 16,
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated && (
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => navigate("/profile")}
                style={{
                  fontSize: "16px",
                  width: 32,
                  height: 32,
                  margin: 6,
                }}
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
                style={{ fontSize: 16, width: 32, height: 32, margin: 6 }}
              />
            </Dropdown>
            <Button
              type="text"
              icon={isAuthenticated ? <LogoutOutlined /> : <LoginOutlined  />}
              onClick={logout}
              style={{
                fontSize: "16px",
                width: 32,
                height: 32,
                margin: 6,
                marginRight: 24,
              }}
              title={isAuthenticated ? "Logout" : "Login"}
            />
          </div>
        </Header>

        <Content style={{ margin: "0 16px" }}>
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
    </Layout>
  );
};

export default SidebarLayout;
