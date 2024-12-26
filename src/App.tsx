import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ConfigProvider, GetProps, Spin, theme } from "antd";
import Favicon from "./components/Favicon";
import Users from "./pages/Users";
import Unauthorize from "./pages/Unauthorize";
import { LoadingProvider } from "./hooks/useLoading";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ItemDetails from "./pages/ItemDetails";
import Categories from "./pages/Categories";

// Define the route configuration
const routeConfig = [
  {
    path: "/login",
    element: <Login />,
    protected: false,
  },
  {
    path: "/register",
    element: <Register />,
    protected: false,
  },
  {
    path: "/404",
    element: <NotFound />,
    protected: false,
  },
  {
    path: "/403",
    element: <Unauthorize />,
    protected: false,
  },
  {
    path: "/home",
    element: <Home />,
    protected: false,
  },
  {
    path: "/profile",
    element: <Profile />,
    protected: true,
  },
  {
    path: "/items/:id",
    element: <ItemDetails />,
    protected: false,
  },
  {
    path: "/items",
    element: <Home />,
    protected: false,
  },
  {
    path: "/users",
    element: <Users />,
    protected: true,
  },
  {
    path: "/categories",
    element: <Categories />,
    protected: true,
  }
];

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#51a7bf',
        },
      }}
    >
      <LoadingProvider>
        <Favicon />
        <Routes>
          {/* Dynamic Route Rendering */}
          {routeConfig.map((route) => {
            const { path, element, protected: isProtected } = route;
            return (
              <Route
                key={path}
                path={path}
                element={
                  isProtected ? (
                    <ProtectedRoute>{element}</ProtectedRoute>
                  ) : (
                    element
                  )
                }
              />
            );
          })}

          {/* Redirect '/' to '/home' */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LoadingProvider>
    </ConfigProvider>
  );
};

export default App;
