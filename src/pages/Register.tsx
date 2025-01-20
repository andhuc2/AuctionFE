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
import useService from "../hooks/useService";
import URLMapping from "../utils/URLMapping";
import { Constant } from "../utils/Constant";

const { Title, Paragraph } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string; confirmPassword: string }) => {
    setLoading(true);
    
    // Ensure the passwords match
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match!",
      });
      setLoading(false);
      return;
    }

    const response = await useService.post(
      URLMapping.REGISTER,
      {
        email: values.email,
        password: values.password,
      }
    );

    if (response?.data) {
      localStorage.setItem("ve", values.email);
      navigate("/verify");
    } else {
      notification.error({
        message: "Error",
        description: response?.message || Constant.ERROR.FAIL,
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
            src={Constant.ASSET.LOGO_URL}
            alt="Logo"
            preview={false}
            style={{}}
          />
        </div>
        <Title level={2} style={{ textAlign: "center" }}>
          Register
        </Title>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm your password!" }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Space direction="vertical" style={{ width: "100%", textAlign: "center" }}>
          <Paragraph>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: "bold" }}>
              Login
            </Link>
          </Paragraph>
          <Paragraph>Copyright © 2025</Paragraph>
        </Space>
      </div>
    </div>
  );
};

export default Register;
