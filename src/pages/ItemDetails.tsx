import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HeaderLayout from "../components/HeaderLayout";
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
  Space,
  Image,
  Tag,
} from "antd";
import URLMapping, { API_URL } from "../utils/URLMapping";
import BaseService from "../services/BaseService";
import { useLoading } from "../hooks/useLoading";
import dayjs from "dayjs";
import { DollarOutlined, StarOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth";
import { Messages } from "../utils/Constant";

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

  const getBidStatus = () => {
    const now = dayjs();
    if (now.isBetween(item?.bidStartDate, item?.bidEndDate)) {
      return <Tag color="green">Active</Tag>;
    } else if (now.isAfter(item?.bidEndDate)) {
      return <Tag color="red">Ended</Tag>;
    } else {
      return <Tag color="blue">Upcoming</Tag>;
    }
  };

  return (
    <HeaderLayout>
      {/* Hero Section */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={16}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            cover={
              <Image
                src={API_URL + "/" + item?.imagePath}
                alt="Item"
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
            }
          >
            <Title level={2} style={{ marginBottom: "8px" }}>
              {item?.title || "--"}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              {item?.description || "--"}
            </Text>
            <Divider />
            <Space size="large">
              <Text strong style={{ fontSize: "24px" }}>
                ${item?.minimumBid || "0"}
              </Text>
              {getBidStatus()}
            </Space>
          </Card>
        </Col>

        {/* Bid Section (Sticky Sidebar) */}
        <Col xs={24} md={8}>
          <Card
            title={<Text strong>Place a Bid</Text>}
            bordered={false}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: "sticky",
              top: "24px",
            }}
          >
            <Input
              min={item?.minimumBid ?? 1}
              hidden={biddingFormState}
              placeholder="Enter bid amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              style={{ marginBottom: "16px" }}
            />
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={handleBidSubmit}
              block
              style={{ height: "40px", fontSize: "16px" }}
            >
              Place Bid
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Details Section */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card
            title={<Text strong>Item Details</Text>}
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Starting Price">
                <Text strong>${item?.minimumBid || "0"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Bid Increment">
                <Text strong>${item?.bidIncrement || "0"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Bid Timeframe">
                <Text strong>
                  {dayjs(item?.bidStartDate).format("HH:mm DD/MM/YYYY")} -{" "}
                  {dayjs(item?.bidEndDate).format("HH:mm DD/MM/YYYY")}
                </Text>
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
                <Link to={`/info/${item?.sellerId}`}>
                  {item?.seller?.username || "N/A"}
                </Link>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Bid History Section */}
      <Row style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card
            title={<Text strong>Bid History</Text>}
            bordered={false}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Table
              dataSource={bids}
              columns={[
                {
                  title: "Bidder",
                  dataIndex: "bidder",
                  key: "bidder",
                  render: (bidder) => <Link to={`/info/${bidder.id}`}>{bidder.fullName}</Link>,
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
              pagination={{ pageSize: 5 }}
              rowKey={(record) => record.id}
            />
          </Card>
        </Col>
      </Row>

      {/* Rate Bidder Modal */}
      <Modal
        title={<Text strong>Rate Bidder</Text>}
        visible={isRateModalVisible}
        onOk={handleRate}
        onCancel={() => setIsRateModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Space direction="vertical" size="middle" style={{ textAlign: "center" }}>
          <Text strong style={{ fontSize: 16 }}>
            Rate this bidder:
          </Text>
          <Rate
            value={ratingValue}
            onChange={(value) => setRatingValue(value)}
            style={{ fontSize: 24 }}
          />
        </Space>
      </Modal>
    </HeaderLayout>
  );
};

export default ItemDetails;