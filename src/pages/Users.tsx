import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  Input,
  Modal,
  Form,
  Row,
  Col,
  notification,
  Tag,
  Select,
} from "antd";
import {
  EditOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/layouts/SidebarLayout";
import useService from "../hooks/useService";
import URLMapping from "../utils/URLMapping";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: number;
  isDeleted: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, searchText]);

  const loadData = async () => {
    try {
      const response = await useService.get(
        `${URLMapping.GET_USER}?page=${currentPage}&size=${pageSize}&search=${searchText}`,
        false
      );
      setUsers(response.data.queryable);
      setTotalItems(response.data.rowCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    const updatedUser = { ...editingUser, ...form.getFieldsValue() };
    const response = await useService.put(URLMapping.UPDATE_USER, updatedUser);
    if (response && response.success) {
      setIsEditModalVisible(false);
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        await useService.delete(URLMapping.DELETE_USER + `/${id}`);
        loadData();
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: number) => {
        let color = role === 1 ? "warning" : "green";
        let label = role === 1 ? "ADMIN" : "USER";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted: boolean) => (
        <Tag color={isDeleted ? "red" : "blue"}>
          {isDeleted ? "DELETED" : "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          ></Button>
          {!record.isDeleted && record.role != 1 && (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
              title="Delete"
            ></Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <SidebarLayout>
      <h2>Users</h2>
      <Input.Search
        placeholder="Search users"
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
        dataSource={users}
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
        title="Edit User"
        visible={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={1}>Admin</Select.Option>
              <Select.Option value={0}>User</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isDeleted"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={false}>Active</Select.Option>
              <Select.Option value={true}>Deleted</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </SidebarLayout>
  );
};

export default Users;
