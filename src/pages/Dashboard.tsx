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
      message.error("Failed to load dashboard data");
    } finally {
      hideLoading();
    }
  };

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
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Exchanges"
                  value={data.totalExchange}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Exchange Amount"
                  value={data.totalExchangeAmount.toFixed(2)}
                  prefix={<DollarCircleOutlined />}
                  suffix="$"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Bids"
                  value={data.totalBid}
                  prefix={<FileDoneOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Items"
                  value={data.totalItems}
                  prefix={<AppstoreOutlined />}
                />
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
