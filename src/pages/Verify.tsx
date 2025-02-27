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

  const onFinish = async (values: {
    code: string;
  }) => {
    setLoading(true);

    const response = await useService.post(
      URLMapping.VEFIRY,
      {
        email: localStorage.getItem("ve"),
        token: values.code,
      }
    );

    if (response?.data) {
      navigate("/login");
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
          Verify
        </Title>
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Paragraph>
            We have sent a verification code to your email. Please enter the
            code to verify your email.
          </Paragraph>
        </Space>
        <Form
          name="verify"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: "24px" }}
        >
          <Form.Item
            name="code"
            rules={[
              { required: true, message: "Please input your verify code!" },
            ]}
          >
            <Input placeholder="Verify code" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Space
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
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
