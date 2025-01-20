import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  // Initialize from localStorage on first render
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const [token, setToken] = useState<string>(
    localStorage.getItem("token") ?? ""
  );

  // Function to log in
  const login = (token: string) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("token", token);
  };

  // Function to log out
  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem("user_permissions");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate('/login');
  };

  const isAdmin = () => {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      return payloadDecoded.role === 1;
    } catch (error) {
      return false;
    }
  };

  const getUserId = () => {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      return payloadDecoded.id;
    } catch (error) {
      return 0;
    }
  }

  // Ensure to sync state with localStorage on initial render
  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    const token = localStorage.getItem("token") ?? "";
    setIsAuthenticated(authenticated);
    setToken(token);
  }, []);

  return { isAuthenticated, token, login, logout, isAdmin, getUserId };
};

export default useAuth;
