import React from "react";
import { Card, Button } from "antd";
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, SaveOutlined, ShopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

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

const ItemCard: React.FC<ItemCardProps> = ({ id, name, description, bidStart, bidEnd, image, mode = "view" }) => {

  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/items/${id}`)}
      cover={<img alt={name} src={image} style={{ width: '100%', aspectRatio: 1}} />}
      actions={mode === "edit"
        ? [
            <Button key="edit" type="primary" icon={<EditOutlined />}>
              Edit
            </Button>,
            <Button key="delete" danger icon={<DeleteOutlined />}>
              Delete
            </Button>,
          ]
        : [
            <Button key="bid" type="primary" icon={<ShopOutlined />}>
              Bid
            </Button>,
            <Button key="save" icon={<SaveOutlined />}>
              Save
            </Button>,
          ]}
    >
      <Meta title={name} description={description} />
      <p style={{ marginTop: '3rem', marginBottom: 0 }}>
        <strong><ClockCircleOutlined /> Bid time:</strong>
        <br /><br />
        {dayjs(bidStart).format("HH:mm DD/MM/YYYY") + " - " + dayjs(bidEnd).format("HH:mm DD/MM/YYYY")}
    </p>
    </Card>
  );
};

export default ItemCard;
