import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const Unauthorize: React.FC = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      }
    />
  );
};

export default Unauthorize;
