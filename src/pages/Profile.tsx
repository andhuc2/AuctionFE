import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import BaseService from "../services/BaseService";
import URLMapping from "../utils/URLMapping";
import { Messages } from "../utils/Constant";

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFunction, setModalFunction] = useState<"add" | "edit">("add");
  const [categories, setCategories] = useState<any>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const categoryData = await BaseService.get(
        URLMapping.GET_ALL_CATEGORY,
        false
      );
      setCategories(categoryData.data ?? []);
    })();
  }, []);

  const handleFormSubmit = async (values: any) => {
    const response = await BaseService.post(URLMapping.ADD_ITEM, values);

    if (response && response.success) {
      setIsModalOpen(false);
      form.resetFields();
    }
  };

  const handleUploadImage = async (options: any) => {
    const { file, onSuccess } = options;
    try {
      const response = await BaseService.uploadFile("/api/upload", file, false);

      // Assuming the response contains a URL
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

      // Assuming the response contains a URL
      if (response && response.success) {
        form.setFieldsValue({ documentPath: response.data });
        onSuccess && onSuccess(response.data);
      }
    } catch (error) {}
  };

  return (
    <SidebarLayout>
      <h1>Profile</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          setModalFunction("add");
        }}
      >
        Add Item to Sell
      </Button>

      <Modal
        title="Add Item to Sell"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="80%" // Set the modal to a larger width
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
                name="minimumBid"
                label="Minimum Bid"
                rules={[
                  { required: true, message: "Please enter the minimum bid!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
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
    </SidebarLayout>
  );
};

export default Profile;
