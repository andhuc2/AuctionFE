import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { notification } from "antd";
import { Messages } from "../utils/Constant";
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
        description: Messages.ERROR.UNAUTHENTICATED,
      });
      logout();
    } else if (status === 403) {
      notification.error({
        message: "Error",
        description: Messages.ERROR.UNAUTHORIZED,
      });
      window.location.href = "/403";
    } else if (status === 404) {
      notification.error({
        message: "Error",
        description: Messages.ERROR.NOT_FOUND,
      });
    } else if (status === 500) {
      notification.error({
        message: "Error",
        description: Messages.ERROR.RESPONSE,
      });
    } else {
      let message = Messages.ERROR.TIMEOUT;
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

const BaseService = {
  async get(url: string, showToast: boolean = true) {
    try {
      const response = await axiosInstance.get(url);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Messages.SUCCESS.DATA_FETCHED,
          });
        }
      }
      return response.data;
    } catch (error) {

    }
  },

  async post(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.post(url, data);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Messages.SUCCESS.DATA_SAVED,
          });
        }
      }
      return response.data;
    } catch (error) {

    }
  },

  async put(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.put(url, data);
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Messages.SUCCESS.DATA_UPDATED,
          });
        }
      }
      return response.data;
    } catch (error) {

    }
  },

  async delete(url: string, data: any = {}, showToast: boolean = true) {
    try {
      const response = await axiosInstance.delete(url, { data });
      if (showToast) {
        if (response.data && response.data.success) {
          notification.success({
            message: "Success",
            description: Messages.SUCCESS.DATA_DELETED,
          });
        }
      }
      return response.data;
    } catch (error) {

    }
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
            description: Messages.SUCCESS.DATA_SAVED,
          });
        }
      }

      return response.data;
    } catch (error) {

    }
  },
};

function logout() {
  localStorage.removeItem("user_permissions");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export default BaseService;
