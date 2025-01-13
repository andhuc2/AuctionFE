import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Table,
  Typography,
  Avatar,
  Tag,
} from "antd";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
import BaseService from "../services/BaseService";
import URLMapping, { API_URL } from "../utils/URLMapping";
import { Messages } from "../utils/Constant";
import { useLoading } from "../hooks/useLoading";
import ItemCard from "../components/item/ItemCard";

const { Title, Text } = Typography;

const Info: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [items, setItems] = useState<any>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) {
      navigate("/404");
      return;
    }
    loadData();
  }, [id]);

  const loadData = async () => {
    showLoading();
    const userData = await BaseService.get(
      URLMapping.PROFILE_USER + `/${id}`,
      false
    );
    setUser(userData?.data ?? null);
    setItems(userData?.data?.items ?? []);
    setBids(userData?.data?.bids ?? []);
    hideLoading();
  };

  const handleReportUser = async () => {
    try {
      const values = await form.validateFields();
      const reason = values.reason;

      const response = await BaseService.post(URLMapping.ADD_REPORT, {
        userId: id,
        content: reason,
      });

      if (response && response.success) {
        form.resetFields();
        notification.success({
          message: "Success",
          description: "User reported successfully.",
        });
      } else {
        notification.error({
          message: "Error",
          description: response?.message || Messages.ERROR.FAIL,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: Messages.ERROR.FAIL,
      });
    }
  };

  return (
    <SidebarLayout>
      {/* User Profile Section */}
      <Card
        style={{ marginBottom: "24px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col flex={1}>
            <Title level={4} style={{ marginBottom: 0 }}>
              {user?.fullName || "N/A"}
            </Title>
            <Text type="secondary">{user?.email}</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              danger
              icon={<AlertOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Report User",
                  content: (
                    <Form form={form} layout="vertical">
                      <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[
                          {
                            required: true,
                            message: "Please input the reason!",
                          },
                        ]}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </Form>
                  ),
                  onOk: handleReportUser,
                  onCancel: () => form.resetFields(),
                });
              }}
            >
              Report User
            </Button>
          </Col>
        </Row>
      </Card>

      {/* User Details Section */}
      <Card
        title="User Details"
        bordered={false}
        style={{ marginBottom: "24px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">
            <Text strong>{user?.fullName || "N/A"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Text strong>{user?.email}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={user?.role === 1 ? "blue" : "green"}>
              {user?.role === 1 ? "Admin" : "User"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Items Sold">
            <Text strong>{user?.items?.length || 0}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Bids Made">
            <Text strong>{user?.bids?.length || 0}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Items Section */}
      <Card
        title="Items"
        bordered={false}
        style={{ marginBottom: "24px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Row gutter={[16, 16]}>
          {items.map((item: any) => (
            <Col xs={24} sm={12} md={6} lg={4} key={item.id}>
              <ItemCard
                id={item.id}
                name={item.title}
                description={item.description}
                bidStart={item.bidStartDate}
                bidEnd={item.bidEndDate}
                minimumBid={item.minimumBid}
                image={API_URL + "/" + item.imagePath}
                mode="view"
                loadData={loadData}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Bid History Section */}
      <Card
        title="Bid History"
        bordered={false}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Table
          dataSource={bids}
          columns={[
            {
              title: "Item",
              dataIndex: "itemId",
              key: "item",
              render: (itemId) => <Link to={`/items/${itemId}`}>View Item</Link>,
            },
            {
              title: "Amount",
              dataIndex: "bidAmount",
              key: "amount",
              render: (bidAmount) => `$${bidAmount.toFixed(2)}`,
            },
            {
              title: "Time",
              dataIndex: "bidDate",
              key: "time",
              render: (time) => new Date(time).toLocaleString(),
            },
          ]}
          pagination={{ pageSize: 5 }}
          rowKey={(record) => record.id}
        />
      </Card>
    </SidebarLayout>
  );
};

export default Info;