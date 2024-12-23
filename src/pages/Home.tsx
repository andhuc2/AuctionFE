import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { Button, Col, Row, Select } from "antd";
import ItemCard from "../components/item/ItemCard";
import URLMapping, { API_URL } from "../utils/URLMapping";
import BaseService from "../services/BaseService";
import { useLoading } from "../hooks/useLoading";

const Home: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<any>([]);
  const { showLoading, hideLoading } = useLoading();
  const [categories, setCategories] = React.useState<any>([]);

  useEffect(() => {
    (async () => {
      showLoading();
      const categoryData = await BaseService.get(
        URLMapping.GET_ALL_CATEGORY,
        false
      );
      setCategories(categoryData?.data ?? []);
      hideLoading();
    })();
    loadData();
  }, []);

  const loadData = async () => {
    showLoading();
    const itemData = await BaseService.get(URLMapping.GET_ITEMS_HOME, false);
    setItems(itemData?.data?.queryable ?? []);
    hideLoading();
  };

  return (
    <SidebarLayout>
      <Row justify="space-between" align="middle">
        <Col>
          <h1>Home</h1>
        </Col>
        <Col>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option key="all" value="all">
              All
            </Select.Option>
            {categories.map((category: any) => (
              <Select.Option key={category.id} value={category.id}>
                {category.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ paddingTop: "2rem" }}>
        {items.map((item: any) => (
          <Col xs={24} sm={12} md={6} lg={5} key={item.id}>
            <ItemCard
              id={item.id}
              name={item.title}
              description={item.description}
              bidStart={item.bidStartDate}
              bidEnd={item.bidEndDate}
              image={API_URL + "/" + item.imagePath}
              mode="view"
            />
          </Col>
        ))}
      </Row>
    </SidebarLayout>
  );
};

export default Home;
