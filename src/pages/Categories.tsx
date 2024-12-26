import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  Input,
  Modal,
  Form,
  Tag,
  notification,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import BaseService from "../services/BaseService";
import URLMapping from "../utils/URLMapping";
import SidebarLayout from "../components/SidebarLayout";

interface Category {
  id: number;
  categoryName: string;
  parentCategoryId: number | null;
  createdAt: string | null;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, searchText]);

  const loadData = async () => {
    try {
      const response = await BaseService.get(
        `${URLMapping.GET_CATEGORY}?page=${currentPage}&size=${pageSize}&search=${searchText}`,
        false
      );
      setCategories(response.data.queryable);
      setTotalItems(response.data.rowCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    const updatedCategory = { ...editingCategory, ...form.getFieldsValue() };
    const response = await BaseService.put(URLMapping.UPDATE_CATEGORY, updatedCategory);
    if (response && response.success) {
      setIsEditModalVisible(false);
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action will soft delete the category (set CreatedAt to null).",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        await BaseService.delete(`${URLMapping.DELETE_CATEGORY}/${id}`);
        loadData();
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Category Name", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "Parent Category",
      dataIndex: "parentCategoryId",
      key: "parentCategoryId",
      render: (parentCategoryId: number | null) => (
        <Tag color="blue">{parentCategoryId === null ? "None" : parentCategoryId}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string | null) => (
        <Tag color={createdAt ? "blue" : "red"}>{createdAt ? "ACTIVE" : "DELETED"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            title="Delete"
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <SidebarLayout>
      <h2>Categories</h2>
      <Input.Search
        placeholder="Search categories"
        onSearch={(value) => setSearchText(value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button
        icon={<ReloadOutlined />}
        onClick={() => loadData()}
        style={{ marginBottom: 16, marginLeft: "1rem" }}
      ></Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: totalItems,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
      />
      <Modal
        title="Edit Category"
        visible={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parentCategoryId"
            label="Parent Category"
            rules={[{ required: false }]}
          >
            <Select>
              <Select.Option value={null}>None</Select.Option>
              {/* Populate parent categories dynamically if needed */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </SidebarLayout>
  );
};

export default Categories;