import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  TrophyOutlined,
  TeamOutlined,
  StarOutlined,
  GoldOutlined,
  ReloadOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Table,
  Space,
  Tag,
  Pagination,
  GetProps,
  Input,
  Modal,
  Row,
  Col,
  Switch,
  notification,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import BaseService from "../services/BaseService";
import URLMapping from "../utils/URLMapping";
import { useLoading } from "../hooks/useLoading";
import { SearchProps } from "antd/es/input";
import { Messages } from "../utils/Constant";
import Search from "antd/es/input/Search";
import usePermissions from "../hooks/usePermissions";
import PermissionMapping from "../utils/PermissionMapping";

interface User {
  id: string;
  userId: string;
  email: string;
  username: string;
  nickname: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<User[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { showLoading, hideLoading } = useLoading();
  const [searchText, setSearchText] = useState<string>("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // const [editingUser, setEditingUser] = useState<any>(null);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [form] = Form.useForm();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    showLoading();
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  const loadData = async () => {
    showLoading();

    const url = searchText
      ? URLMapping.SEARCH_PLAYER
      : URLMapping.GET_ALL_PLAYER;

    const response = await BaseService.get(
      url +
        `?PageNumber=${currentPage}&PageSize=${pageSize}&input=${searchText}`,
      false
    );

    hideLoading();
    setData(response.data);
    setTotalCount(response.totalCount);
  };

  // Define the columns for the Ant Design table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            color="default"
            variant="text"
            onClick={() => handleInfo(record.id)}
            icon={<InfoCircleOutlined />}
          ></Button>
          {hasPermission(PermissionMapping.EDIT_USER) && (
            <Button
              color="default"
              variant="text"
              onClick={() => handleEdit(record.id)}
              icon={<EditOutlined />}
            ></Button>
          )}
          {/* <Button onClick={() => handleEdit(record.id)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button> */}
        </Space>
      ),
    },
  ];

  // Function to handle delete action
  const handleDelete = async (id: string) => {
    // Implement the delete functionality here
    loadData();
  };

  const handleEdit = async (id: string) => {
    try {
      const player = await BaseService.get(
        URLMapping.GET_PLAYER + `?playerId=${id}`,
        false
      );
      const user = await BaseService.get(
        URLMapping.GET_USER + `?playerId=${id}`,
        false
      );

      // setEditingUser(user);
      setEditingPlayer(player);
      setIsEditModalVisible(true);

      // Set form values
      form.setFieldsValue({
        username: user.userName,
        email: user.email,
        walletAddress: user.walletAddress,
        emailConfirmed: user.emailConfirmed,
        level: player.level,
        exp: player.exp,
        trophy: player.trophy,
        win: player.win,
        totalGames: player.totalGames,
        winStreakCurrent: player.winStreakCurrent,
        winStreak: player.winStreak,
        mvp: player.mvp,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      showLoading();

      // Update User
      // const responseUser = await BaseService.put(
      //   URLMapping.UPDATE_USER,
      //   { ...editingUser, ...values },
      //   false
      // );
      // Update Player
      const responsePlayer = await BaseService.put(
        URLMapping.UPDATE_PLAYER,
        { ...editingPlayer, ...values },
        false
      );

      // if (responsePlayer.errors || responseUser.errors) {
      if (responsePlayer.errors) {
        notification.error({
          message: "Error",
          description: Messages.ERROR.REQUEST,
        });
      } else {
        notification.success({
          message: "Success",
          description: Messages.SUCCESS.DATA_UPDATED,
        });

        setIsEditModalVisible(false);
        loadData();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      hideLoading();
    }
  };

  const handleInfo = async (id: string) => {
    const player = await BaseService.get(
      URLMapping.GET_PLAYER + `?playerId=${id}`,
      false
    );
    const user = await BaseService.get(
      URLMapping.GET_USER + `?playerId=${id}`,
      false
    );
    Modal.info({
      style: { minWidth: 800 },
      title: "User Info",
      content: (
        <div style={{ padding: "10px" }}>
          <Row gutter={[16, 16]}>
            {/* First Column */}
            <Col span={12}>
              <div
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                }}
              >
                <p>
                  <UserOutlined /> <b>Username:</b> {user.userName}
                </p>
                <p>
                  <UserOutlined /> <b>Nickname:</b> {player.nickname}
                </p>
                <p>
                  <MailOutlined /> <b>Email:</b> {user.email}
                </p>
                <p>
                  <UserOutlined /> <b>UserId:</b> {player.userId}
                </p>
              </div>
              <div
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                }}
              >
                <p>
                  <UserOutlined /> <b>Wallet Address:</b>{" "}
                  {player.walletAddress || "N/A"}
                </p>
                <p>
                  <GoldOutlined /> <b>Level:</b> {player.level}
                </p>
                <p>
                  <GoldOutlined /> <b>Experience (EXP):</b> {player.exp}
                </p>
              </div>
            </Col>

            {/* Second Column */}
            <Col span={12}>
              <div
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                }}
              >
                <p>
                  <TrophyOutlined /> <b>Trophy:</b> {player.trophy}
                </p>
                <p>
                  <TeamOutlined /> <b>Wins:</b> {player.win}
                </p>
                <p>
                  <TeamOutlined /> <b>Total Games:</b> {player.totalGames}
                </p>
                <p>
                  <StarOutlined /> <b>Current Win Streak:</b>{" "}
                  {player.winStreakCurrent}
                </p>
                <p>
                  <StarOutlined /> <b>Highest Win Streak:</b> {player.winStreak}
                </p>
                <p>
                  <StarOutlined /> <b>MVP Count:</b> {player.mvp}
                </p>
              </div>
              <div></div>
            </Col>
          </Row>
        </div>
      ),
      onOk() {},
    });
  };

  const handleReset = async () => {
    setSearchText("");
    setCurrentPage(1);
  };

  const handleSearch: SearchProps["onSearch"] = (value, _e, info) => {
    loadData();
  };

  const renderEditModal = () => (
    <Modal
      title="Edit User"
      visible={isEditModalVisible}
      okText="Update"
      onOk={handleUpdate}
      onCancel={() => {
        setIsEditModalVisible(false);
        // setEditingUser(null);
        setEditingPlayer(null);
      }}
      style={{ minWidth: 800 }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={30}>
          <Col span={12}>
            <h3>User Information</h3>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Input username!" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Input email!" },
                { type: "email", message: "Invalid E-mail!" },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item label="Wallet Address" name="walletAddress">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Email Confirmed"
              name="emailConfirmed"
              valuePropName="checked"
            >
              <Switch disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <h3>Player Information</h3>
            <Form.Item
              label="Level"
              name="level"
              rules={[{ required: true, message: "Input level!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Experience (EXP)"
              name="exp"
              rules={[{ required: true, message: "Input experience!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Trophy"
              name="trophy"
              rules={[{ required: true, message: "Input trophy!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Wins"
              name="win"
              rules={[{ required: true, message: "Input wins!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Total Games"
              name="totalGames"
              rules={[{ required: true, message: "Input total games!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Current Win Streak"
              name="winStreakCurrent"
              rules={[{ required: true, message: "Input current streak!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Highest Win Streak"
              name="winStreak"
              rules={[{ required: true, message: "Input highest streak!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="MVP Count"
              name="mvp"
              rules={[{ required: true, message: "Input MVP count!" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );

  return (
    <SidebarLayout>
      <h2>Users</h2>
      <div style={{ width: "100%", textAlign: "end" }}>
        <Search
          placeholder="Input search text"
          onSearch={handleSearch}
          enterButton
          style={{ maxWidth: 300, marginBottom: 20 }}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Button
          onClick={handleReset}
          icon={<ReloadOutlined />}
          style={{
            marginLeft: "10px",
          }}
        ></Button>
      </div>
      <Table
        style={{ minHeight: "60vh" }}
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          },
          position: ["bottomRight"],
        }}
      />
      {/* <div
        style={{
          width: "100%",
          flexDirection: "row-reverse",
          display: "flex",
          marginTop: "20px",
          paddingRight: "40px",
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        ></Pagination>
      </div> */}
      {renderEditModal()}
    </SidebarLayout>
  );
};

export default Users;
