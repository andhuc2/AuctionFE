import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Modal,
  Rate,
} from "antd";
import URLMapping, { API_URL } from "../utils/URLMapping";
import BaseService from "../services/BaseService";
import { useLoading } from "../hooks/useLoading";
import dayjs from "dayjs";
import { DollarOutlined, StarOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth";
import { Messages } from "../utils/Constant";
import HeaderLayout from "../components/HeaderLayout";

const { Title, Text } = Typography;

const ItemDetails: React.FC = () => {
  const { getUserId } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const { showLoading, hideLoading } = useLoading();
  const [biddingFormState, setBiddingFormState] = useState<boolean>(true);
  const [isRateModalVisible, setIsRateModalVisible] = useState<boolean>(false);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [currentBidderId, setCurrentBidderId] = useState<number>(0);
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
    setBids(response?.data?.bids ?? []);
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
    const response = await BaseService.post(URLMapping.POST_BID, {
      itemId: id,
      bidAmount: bidAmount,
    });
    if (response && response.success) {
      setBidAmount(0);
      setBiddingFormState(true);
      await loadData();
    } else {
      notification.error({
        message: "Failed to place bid",
        description: response?.message || "Please try again later.",
      });
    }
    hideLoading();
  };

  const handleRate = async () => {
    if (ratingValue <= 0 || ratingValue > 5) {
      notification.error({
        message: "Invalid Rating",
        description: "Please enter a rating between 1 and 5.",
      });
      return;
    }

    showLoading();
    const response = await BaseService.post(URLMapping.POST_RATING, {
      rateeId: currentBidderId,
      itemId: item.id,
      ratingValue: ratingValue,
    });
    if (response && !response.success) {
      notification.error({
        message: Messages.ERROR.FAIL,
        description: response.message,
      });
    }
    hideLoading();
    setIsRateModalVisible(false);
    setRatingValue(0);
  };

  const loadRating = async (userId: number) => {
    showLoading();
    const response = await BaseService.get(
      URLMapping.GET_RATING + `/${userId}/${item.id}`,
      false
    );
    if (response && response.success) {
      setRatingValue(response.data.ratingValue);
    }
    hideLoading();
  };

  return (
    <HeaderLayout>
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
              <Descriptions.Item label="Bid Increment">
                <Text>${item?.bidIncrement || "0"}</Text>
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
              <Descriptions.Item label="Seller">
                <Link to={`/info/${item?.sellerId}`}>{item?.seller?.username || "N/A"}</Link>
              </Descriptions.Item>
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
                dataIndex: ["bidder", "fullName"],
                key: "bidder",
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
              ...(getUserId() === item?.sellerId
                ? [
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_: any, record: any) => (
                        <Button
                          type="link"
                          icon={<StarOutlined />}
                          onClick={async () => {
                            await loadRating(record.bidder.id);
                            setIsRateModalVisible(true);
                            setCurrentBidderId(record.bidder.id);
                          }}
                        >
                          Rate
                        </Button>
                      ),
                    },
                  ]
                : []),
            ]}
            pagination={{ pageSize: 50 }}
            rowKey={(record) => record.id}
          />
        </Col>
      </Row>

      <Modal
        title="Rate Bidder"
        visible={isRateModalVisible}
        onOk={handleRate}
        onCancel={() => setIsRateModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <div style={{ textAlign: "center" }}>
          <Text strong>Rate this bidder:</Text>
          <Rate
            value={ratingValue}
            onChange={(value) => setRatingValue(value)}
            style={{ marginTop: "10px" }}
          />
        </div>
      </Modal>
    </HeaderLayout>
  );
};

export default ItemDetails;
