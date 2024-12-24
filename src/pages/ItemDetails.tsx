import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import {
  Button,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Divider,
  notification,
  Descriptions,
  Card,
} from "antd";
import URLMapping, { API_URL } from "../utils/URLMapping";
import BaseService from "../services/BaseService";
import { useLoading } from "../hooks/useLoading";
import dayjs from "dayjs";
import { DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const { showLoading, hideLoading } = useLoading();
  const [biddingFormState, setBiddingFormState] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/404");
      return;
    }
    loadData();
  }, [id]);

  const loadData = async () => {
    showLoading();
    const response = await BaseService.get(
      URLMapping.GET_ITEMS + `/${id}`,
      false
    );
    setItem(response?.data ?? null);
    hideLoading();
  };

  const handleBidSubmit = async () => {
    if (biddingFormState) {
      setBiddingFormState(false);
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      notification.error({
        message: "Invalid Bid Amount",
        description: "Please enter a valid bid amount.",
      });
      return;
    }
    showLoading();
    // Simulate bid submission logic here
    hideLoading();
  };

  return (
    <SidebarLayout>
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={16}>
          <Title level={3}>{item?.title || "--"}</Title>
          <Text>{item?.description || "--"}</Text>
          <Divider />
          {item?.imagePath && (
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={API_URL + "/" + item.imagePath}
                alt="Item"
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  maxWidth: "600px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          <div>
            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{ fontWeight: "bold", color: "#595959" }}
              contentStyle={{ color: "#333" }}
            >
              <Descriptions.Item label="Starting Price">
                <Text>${item?.minimumBid || "0"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Bid Timeframe">
                {dayjs(item?.bidStartDate).format("HH:mm DD/MM/YYYY")} -{" "}
                {dayjs(item?.bidEndDate).format("HH:mm DD/MM/YYYY")}
              </Descriptions.Item>
              {item?.documentPath && (
                <Descriptions.Item label="Document">
                  <Button
                    type="link"
                    href={API_URL + "/" + item.documentPath}
                    target="_blank"
                    download
                    style={{ padding: 0, color: "#1890ff" }}
                  >
                    {item.documentPath.split("/").pop()}
                  </Button>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        </Col>
        <Col span={8}></Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              maxWidth: "200px",
            }}
          >
            <Input
              min={item?.minimumBid ?? 1}
              hidden={biddingFormState}
              placeholder="Enter bid amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              style={{ marginBottom: "10px" }}
            />
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={handleBidSubmit}
            >
              Place Bid
            </Button>
          </div>
          <Title style={{ marginTop: "2rem" }} level={4}>
            Bid History
          </Title>
          <Table
            dataSource={bids}
            columns={[
              {
                title: "Bidder",
                dataIndex: "bidder",
                key: "bidder",
              },
              {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                render: (amount) => `$${amount.toFixed(2)}`,
              },
              {
                title: "Time",
                dataIndex: "time",
                key: "time",
                render: (time) => new Date(time).toLocaleString(),
              },
            ]}
            pagination={{ pageSize: 50 }}
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>
    </SidebarLayout>
  );
};

export default ItemDetails;
