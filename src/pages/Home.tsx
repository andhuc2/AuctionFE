import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/layouts/SidebarLayout";
import { Button, Col, Input, Row, Select } from "antd";
import ItemCard from "../components/item/ItemCard";
import URLMapping, { API_URL } from "../utils/URLMapping";
import useService from "../hooks/useService";
import { useLoading } from "../hooks/useLoading";
import { set } from "lodash";
import Search, { SearchProps } from "antd/es/input/Search";
import HeaderLayout from "../components/layouts/HeaderLayout";

const Home: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = React.useState<any>([]);
  const { showLoading, hideLoading } = useLoading();
  const [categories, setCategories] = React.useState<any>([]);
  const [totalPage, setTotalPage] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(100);
  const [search, setSearch] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<
    number | string
  >("0");
  const [selectedStatus, setSelectedStatus] = React.useState<number | string>(
    "0"
  );

  useEffect(() => {
    loadData();
  }, [currentPage, selectedCategory, selectedStatus]);

  useEffect(() => {
    (async () => {
      showLoading();
      const categoryData = await useService.get(
        URLMapping.GET_ALL_CATEGORY,
        false
      );
      setCategories(categoryData?.data ?? []);
      hideLoading();
    })();
    setCurrentPage(1);
  }, []);

  const loadData = async () => {
    if (currentPage > totalPage) return;
    showLoading();
    const queryParams = `page=${currentPage}&size=${pageSize}&search=${search}&categoryId=${
      selectedCategory !== 0 ? selectedCategory : ""
    }&status=${selectedStatus !== 0 ? selectedStatus : ""}`;
    const itemData = await useService.get(
      `${URLMapping.GET_ITEMS_HOME}?${queryParams}`,
      false
    );
    setItems((prevItems: any) => [
      ...prevItems,
      ...(itemData?.data?.queryable ?? []),
    ]);
    setTotalPage(Math.max(itemData?.data?.pageCount ?? 1, 1));
    hideLoading();
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const bottom =
      (e.target as HTMLElement).scrollHeight ===
      (e.target as HTMLElement).scrollTop +
        (e.target as HTMLElement).clientHeight;
    if (bottom && currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setCurrentPage(1);
    setItems([]);
    loadData();
  };

  const handleCategoryChange = (value: number | string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    setItems([]);
  };

  const handleStatusChange = (value: number | string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
    setItems([]);
  };

  return (
    <HeaderLayout>
      <Row justify="space-between" align="middle">
        <Col>
          <h1>Home</h1>
        </Col>
        <Col style={{ display: "flex" }}>
          <Search
            style={{ marginRight: "1rem" }}
            placeholder="Input search text"
            onSearch={handleSearch}
            enterButton
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Select
            style={{ width: 160 }}
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <Select.Option key="0" value="0">
              All
            </Select.Option>
            {categories.map((category: any) => (
              <Select.Option key={category.id} value={category.id}>
                {category.categoryName}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 180, marginLeft: 10 }}
            onChange={handleStatusChange}
            value={selectedStatus}
          >
            <Select.Option key="0" value="0">
              All
            </Select.Option>
            <Select.Option key="ended" value="ended">
              Ended
            </Select.Option>
            <Select.Option key="happening" value="happening">
              Happening
            </Select.Option>
            <Select.Option key="soon" value="soon">
              Upcoming
            </Select.Option>
          </Select>
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{ paddingTop: "2rem" }}
        onScroll={handleScroll}
      >
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
              mode="view"
            />
          </Col>
        ))}
      </Row>
    </HeaderLayout>
  );
};

export default Home;
