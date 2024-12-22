import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Space,
  Image,
  notification,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import BaseService from "../services/BaseService";
import URLMapping from "../utils/URLMapping";
import { Messages } from "../utils/Constant";

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const LOGO_URL = import.meta.env.VITE_LOGO_URL || "/logo.svg";

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const response = await BaseService.post(
      URLMapping.LOGIN,
      {
        email: values.email,
        password: values.password,
      },
      false
    );
    if (response?.data) {
      login(response.data);
      notification.success({
        message: "Success",
        description: Messages.SUCCESS.AUTHENTICATED,
      });
      navigate("/home");
    } else {
      notification.error({
        message: "Error",
        description: Messages.ERROR.UNAUTHENTICATED,
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('./bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Image
            width={"20%"}
            src={LOGO_URL}
            alt="Logo"
            preview={false}
            style={{}}
          />
        </div>
        <Title level={2} style={{ textAlign: "center" }}>
          Login
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit"  block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Paragraph>Copyright © 2024</Paragraph>
        </Space>
      </div>
    </div>
  );
};

export default Login;
