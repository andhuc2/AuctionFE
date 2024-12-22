import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { Button } from "antd";

const Home: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarLayout>
      <h1>Home</h1>
    </SidebarLayout>
  );
};

export default Home;
