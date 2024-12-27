import React from "react";
import { Card, Button, Modal, notification } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { useNavigate } from "react-router-dom";
import BaseService from "../../services/BaseService";
import URLMapping from "../../utils/URLMapping";
import { get } from "lodash";

const { Meta } = Card;

interface ItemCardProps {
  id: number;
  name: string;
  description: string;
  bidStart: string;
  bidEnd: string;
  image: string;
  mode: "edit" | "view";
}

const ItemCard: React.FC<ItemCardProps & { [key: string]: any }> = ({
  id,
  name,
  description,
  bidStart,
  bidEnd,
  image,
  mode = "view",
  ...props
}) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      icon: <DeleteOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const response = await BaseService.delete(
          URLMapping.DELETE_ITEM + `/${id}`
        );
        if (response && response.success) {
          props.loadData && props.loadData();
        } else if (response?.message) {
          notification.error({
            message: "Error",
            description: response.message,
          });
        }
      },
    });
  };

  const getBidStatus = () => {
    const now = dayjs();

    if (now.isBetween(bidStart, bidEnd)) {
      return "Bid Now";
    } else if (now.isAfter(bidEnd)) {
      return "Ended";
    } else if (now.isBefore(bidStart)) {
      return "Coming Soon";
    } else {
      return "Save";
    }
  };

  return (
    <Card
      hoverable
      cover={
        <img
          onClick={() => navigate(`/items/${id}`)}
          alt={name}
          src={image}
          style={{ width: "100%", aspectRatio: 1 }}
        />
      }
      actions={
        mode === "edit"
          ? [
              <Button
                onClick={() => props.handleEdit && props.handleEdit(id)}
                key="edit"
                type="primary"
                icon={<EditOutlined />}
              >
                Edit
              </Button>,
              <Button
                onClick={handleDelete}
                key="delete"
                danger
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>,
            ]
          : [
              <Button
                onClick={() => navigate(`/items/${id}`)}
                key="bid"
                type={getBidStatus() === 'Bid Now' ? 'primary' : 'default'}
                icon={getBidStatus() === 'Bid Now' ? <ShopOutlined /> : null}
              >
                {getBidStatus()}
              </Button>,
              // <Button key="save" icon={<SaveOutlined />}>
              //   Save
              // </Button>,
            ]
      }
    >
      <Meta title={name} description={description} />
      <p style={{ marginTop: "3rem", marginBottom: 0 }}>
        <strong>
          <ClockCircleOutlined /> Bid time:
        </strong>
        <br />
        <br />
        {dayjs(bidStart).format("HH:mm DD/MM/YYYY") +
          " - " +
          dayjs(bidEnd).format("HH:mm DD/MM/YYYY")}
      </p>
    </Card>
  );
};

export default ItemCard;
