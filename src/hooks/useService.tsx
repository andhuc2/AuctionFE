import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { notification } from "antd";
import { Constant } from "../utils/Constant";
import { API_URL } from "../utils/URLMapping";

const axiosInstance = axios.create({
  baseURL: API_URL,
  // timeout: 10000, // Set timeout as needed
});

// Interceptors for request and response
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      notification.error({
        message: "Error",
        description: Constant.ERROR.UNAUTHENTICATED,
      });
      logout();
    } else if (status === 403) {
      notification.error({
        message: "Error",
        description: Constant.ERROR.UNAUTHORIZED,
      });
      window.location.href = "/403";
    } else if (status === 404) {
      notification.error({
        message: "Error",
        description: Constant.ERROR.NOT_FOUND,
      });
    } else if (status === 500) {
      notification.error({
        message: "Error",
        description: Constant.ERROR.RESPONSE,
      });
    } else {
      let message = Constant.ERROR.TIMEOUT;
      if (error.response?.data?.[0]) {
        message = error.response.data[0];
      } else if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).flat().join(", ");
      }
      notification.error({
        message: "Error",
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

const useService = {
  async get(url: string, showToast: boolean = true) {
    try {
      const response = await axiosInstance.get(url);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Constant.SUCCESS.DATA_FETCHED,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.data.message || Constant.ERROR.FAIL,
          });
        }
      }
      return response.data;
    } catch (error) {}
  },

  async post(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.post(url, data);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Constant.SUCCESS.DATA_SAVED,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.data.message || Constant.ERROR.FAIL,
          });
        }
      }
      return response.data;
    } catch (error) {}
  },

  async put(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.put(url, data);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Constant.SUCCESS.DATA_UPDATED,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.data.message || Constant.ERROR.FAIL,
          });
        }
      }
      return response.data;
    } catch (error) {}
  },

  async delete(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.delete(url, { data });
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Constant.SUCCESS.DATA_DELETED,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.data.message || Constant.ERROR.FAIL,
          });
        }
      }
      return response.data;
    } catch (error) {}
  },

  async uploadFile(url: string, file: File, showToast: boolean = true) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Constant.SUCCESS.DATA_SAVED,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.data.message || Constant.ERROR.FAIL,
          });
        }
      }
      return response.data;
    } catch (error) {}
  },
};

function logout() {
  localStorage.removeItem("user_permissions");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export default useService;
