import axios from "axios";
import { mainUrl } from ".";

const api = axios.create({
  baseURL: `${mainUrl}/v1/order`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const addOrder = async (data) => {
  try {
    const response = await api.post("/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const validateOrder = async (data) => {
  try {
    const response = await api.patch("/validate", data);
    return response.data;
  } catch (error) {
    console.error("Error validating order:", error);
    throw error;
  }
};
export const getAllOrders = async (
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc"
) => {
  try {
    const response = await api.get("/all", {
      params: {
        page,
        size,
        sortBy,
        sortDir,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getUserOrders = async (
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc"
) => {
  try {
    const response = await api.get("", {
      params: {
        page,
        size,
        sortBy,
        sortDir,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};