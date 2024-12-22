import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

// Helper function to capitalize and transform path segments
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DynamicBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  // Build the breadcrumb items dynamically based on the URL
  const breadcrumbItems = pathSnippets
    .map((segment, index) => {
      if (segment.toLowerCase() === "home") return null;

      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;

      // Dynamically handle the final ID segment, for example, display "User #1" instead of just "1"
      const name = isNaN(Number(segment)) ? capitalize(segment) : `${segment}`;

      return isLast ? (
        <Breadcrumb.Item key={url}>{name}</Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{name}</Link>
        </Breadcrumb.Item>
      );
    })
    .filter(Boolean);

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
