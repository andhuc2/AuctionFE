import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Typography,
  Upload,
} from "antd";
import {
  DollarOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import BaseService from "../services/BaseService";
import URLMapping, { API_URL } from "../utils/URLMapping";
import { Messages } from "../utils/Constant";
import { useLoading } from "../hooks/useLoading";
import ItemCard from "../components/item/ItemCard";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Info: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [items, setItems] = useState<any>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { getUserId } = useAuth();

  useEffect(() => {
    (async () => {
      if (!id) {
        navigate("/404");
        return;
      }
    })();
    loadData();
  }, []);

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

  return (
    <SidebarLayout>
      <Title style={{ marginTop: "2rem" }} level={4}>
        User Info
      </Title>

      {user && (
        <div style={{ marginBottom: "2rem" }}>
          <Card title="User Details" bordered>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">
                {user.fullName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                {user.role === 1 ? "Admin" : "User"}
              </Descriptions.Item>
              <Descriptions.Item label="Items Sold">
                {user.items?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Bids Made">
                {user.bids?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}

      <Title style={{ marginTop: "2rem" }} level={4}>
        Item
      </Title>
      <Row gutter={[16, 16]} style={{ paddingTop: "2rem" }}>
        {items.map((item: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <ItemCard
              id={item.id}
              name={item.title}
              description={item.description}
              bidStart={item.bidStartDate}
              bidEnd={item.bidEndDate}
              image={API_URL + "/" + item.imagePath}
              mode="view"
              loadData={loadData}
            />
          </Col>
        ))}
      </Row>

      <Title style={{ marginTop: "2rem" }} level={4}>
        Bid History
      </Title>
      <Table
        dataSource={bids}
        columns={[
          {
            title: "Item",
            dataIndex: "itemId",
            key: "bidder",
            render: (itemId) => (
              <Link to={`/items/${itemId}`}>View Item</Link>
            ),
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
        pagination={{ pageSize: 50 }}
        rowKey={(record) => record.id}
      />
    </SidebarLayout>
  );
};

export default Info;
