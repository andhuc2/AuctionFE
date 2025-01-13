import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  Upload,
  Typography,
  Space,
  Avatar,
} from "antd";
import {
  DollarOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BaseService from "../services/BaseService";
import URLMapping, { API_URL } from "../utils/URLMapping";
import { Messages } from "../utils/Constant";
import { useLoading } from "../hooks/useLoading";
import ItemCard from "../components/item/ItemCard";
import dayjs from "dayjs";
import HeaderLayout from "../components/HeaderLayout";

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFunction, setModalFunction] = useState<"add" | "edit">("add");
  const [categories, setCategories] = useState<any>([]);
  const [form] = Form.useForm();
  const { showLoading, hideLoading } = useLoading();
  const [items, setItems] = useState<any>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const { getUserId } = useAuth();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeForm] = Form.useForm();

  useEffect(() => {
    (async () => {
      showLoading();
      const categoryData = await BaseService.get(
        URLMapping.GET_ALL_CATEGORY,
        false
      );
      setCategories(categoryData?.data ?? []);

      const userData = await BaseService.get(
        URLMapping.PROFILE_USER + `/${getUserId()}`,
        false
      );
      setUser(userData?.data ?? null);
      hideLoading();
    })();
    loadData();
  }, []);

  const loadData = async () => {
    const itemData = await BaseService.get(URLMapping.GET_PERSON_ITEMS, false);
    setItems(itemData?.data?.queryable ?? []);
  };

  const handleFormSubmit = async (values: any) => {
    showLoading();
    if (modalFunction === "add") {
      const response = await BaseService.post(URLMapping.ADD_ITEM, values);
      if (response && response.success) {
        setIsModalOpen(false);
        form.resetFields();
        user.credit -= 5000;
      } else {
        notification.error({
          message: Messages.ERROR.FAIL,
          description: response.message,
        });
      }
      await loadData();
    } else {
      values.id = selectedItemId;
      const response = await BaseService.put(URLMapping.UPDATE_ITEM, values);
      if (response && response.success) {
        setIsModalOpen(false);
        form.resetFields();
      } else {
        notification.error({
          message: Messages.ERROR.FAIL,
          description: response.message,
        });
      }
      await loadData();
    }
    hideLoading();
  };

  const handleUploadImage = async (options: any) => {
    const { file, onSuccess } = options;
    try {
      const response = await BaseService.uploadFile("/api/upload", file, false);
      if (response && response.success) {
        form.setFieldsValue({ imagePath: response.data });
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {}
  };

  const handleUploadDoc = async (options: any) => {
    const { file, onSuccess } = options;
    try {
      const response = await BaseService.uploadFile("/api/upload", file, false);
      if (response && response.success) {
        form.setFieldsValue({ documentPath: response.data });
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {}
  };

  const handleEdit = (item: any) => {
    setModalFunction("edit");
    setIsModalOpen(true);
    setSelectedItemId(item.id);

    form.setFieldsValue({
      title: item.title,
      minimumBid: item.minimumBid,
      bidIncrement: item.bidIncrement,
      bidStartDate: dayjs(item.bidStartDate),
      bidEndDate: dayjs(item.bidEndDate),
      description: item.description,
      categoryId: item.categoryId,
      imagePath: item.imagePath,
      documentPath: item.documentPath,
    });
  };

  const handleRechargeSubmit = async (values: any) => {
    showLoading();
    try {
      const response = await BaseService.post(
        URLMapping.PAYMENT_PAY,
        {
          amount: values.amount,
        },
        false
      );

      if (response && response.success) {
        setIsRechargeModalOpen(false);
        rechargeForm.resetFields();
        window.location.href = response.data;
      } else {
        notification.error({
          message: Messages.ERROR.FAIL,
          description: response.message || Messages.ERROR.FAIL,
        });
      }
    } catch (error) {
      notification.error({
        message: Messages.ERROR.FAIL,
        description: "An error occurred while recharging credits.",
      });
    }
    hideLoading();
  };

  return (
    <HeaderLayout>
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
            <Space>
              <Button
                type="primary"
                icon={<DollarOutlined />}
                onClick={() => setIsRechargeModalOpen(true)}
              >
                Recharge Credits
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  if (user.credit / 1000 < 5) {
                    notification.error({
                      message: "Insufficient Credits",
                      description:
                        "You need at least 5 credits to add an item. Please recharge your credits.",
                    });
                    return;
                  }
                  setIsModalOpen(true);
                  setModalFunction("add");
                }}
              >
                Add Item
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Items Grid Section */}
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
              mode="edit"
              loadData={loadData}
              handleEdit={() => handleEdit(item)}
            />
          </Col>
        ))}
      </Row>

      {/* Add/Edit Item Modal */}
      <Modal
        title={modalFunction === "add" ? "Add Item to Sell" : "Edit Item"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%"
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={24}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter the title!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  placeholder="Select a category"
                  style={{ width: "100%" }}
                >
                  {categories.map((category: any) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="minimumBid"
                label="Minimum Bid"
                rules={[
                  { required: true, message: "Please enter the minimum bid!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
              </Form.Item>
              <Form.Item
                name="bidIncrement"
                label="Bid Increment"
                rules={[
                  {
                    required: true,
                    message: "Please enter the bid increment!",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description!" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="bidStartDate"
                label="Bid Start Date"
                rules={[
                  { required: true, message: "Please select the start date!" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="bidEndDate"
                label="Bid End Date"
                rules={[
                  { required: true, message: "Please select the end date!" },
                ]}
              >
                <DatePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="imagePath" hidden></Form.Item>
              <Form.Item label="Image">
                <Upload
                  customRequest={handleUploadImage}
                  multiple={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="documentPath" hidden></Form.Item>
              <Form.Item label="Document">
                <Upload
                  customRequest={handleUploadDoc}
                  multiple={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload Document</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Recharge Modal */}
      <Modal
        title="Recharge Credits"
        visible={isRechargeModalOpen}
        onCancel={() => setIsRechargeModalOpen(false)}
        footer={null}
      >
        <Form
          form={rechargeForm}
          layout="vertical"
          onFinish={handleRechargeSubmit}
        >
          <Form.Item
            name="amount"
            label="Amount (1.000 = 1 credit)"
            rules={[
              { required: true, message: "Please enter the amount!" },
              { type: "number", min: 1, message: "Amount must be at least 1!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Recharge
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </HeaderLayout>
  );
};

export default Profile;