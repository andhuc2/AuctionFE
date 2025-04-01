import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Statistic,
  Avatar,
  Typography,
  Divider,
  message,
  notification,
  Space,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import useService from "../hooks/useService";
import { useLoading } from "../hooks/useLoading";
import SidebarLayout from "../components/layouts/SidebarLayout";
import URLMapping from "../utils/URLMapping";
import { Constant } from "../utils/Constant";

const { Text } = Typography;

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      showLoading();
      const response = await useService.get(
        `${URLMapping.ADMIN_DASHBOARD}`,
        false
      );
      setData(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: Constant.ERROR.RESPONSE,
      });
    } finally {
      hideLoading();
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const statusColors: Record<string, string> = {
    pending: "gold",
    completed: "green",
    cancelled: "red",
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => <Text strong>${value.toFixed(2)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <SidebarLayout>
      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={4}>Dashboard</Typography.Title>
        </Col>
      </Row>

      {data && (
        <>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col span={4} style={{ display: "flex" }}>
              <Card style={{ height: "100%", width: "100%" }}>
                <Statistic
                  title="Total Exchanges"
                  value={data.totalExchange}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={4} style={{ display: "flex" }}>
              <Card style={{ height: "100%", width: "100%" }}>
                <Statistic
                  title="Total Amount"
                  value={data.totalExchangeAmount.toFixed(2)}
                  prefix={<DollarCircleOutlined />}
                  suffix="$"
                />
              </Card>
            </Col>
            <Col span={4} style={{ display: "flex" }}>
              <Card style={{ height: "100%", width: "100%" }}>
                <Statistic
                  title="Total Bids"
                  value={data.totalBid}
                  prefix={<FileDoneOutlined />}
                />
              </Card>
            </Col>
            <Col span={4} style={{ display: "flex" }}>
              <Card style={{ height: "100%", width: "100%" }}>
                <Statistic
                  title="Total Items"
                  value={data.totalItems}
                  prefix={<AppstoreOutlined />}
                />
              </Card>
            </Col>
            <Col span={8} style={{ display: "flex" }}>
              <Card style={{ height: "100%", width: "100%" }}>
                <Space direction="vertical" size="small">
                  <Statistic
                    title="Total Revenue"
                    value={data.totalBidRevenue + data.totalSellRevenue}
                    prefix={<DollarCircleOutlined />}
                    suffix="$"
                  />
                  <Typography.Text type="secondary">
                    {data.totalBidRevenue}$ (Bids) + {data.totalSellRevenue}$
                    (Sells)
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={24}>
              <Card title="Top 5 Exchanges">
                <Table
                  dataSource={data.top5Exchanges}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </SidebarLayout>
  );
};

export default Dashboard;
