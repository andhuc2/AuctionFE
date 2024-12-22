import { Flex, Spin } from "antd";
import { useLoading } from "../hooks/useLoading";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner: React.FC = () => {
  const { isLoading } = useLoading();

  return isLoading ? (
    <div className="global-spinner">
      <div className="spinner-container">
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div>
    </div>
  ) : null;
};

export default Spinner;
