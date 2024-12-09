import axios from "axios";
import { mainUrl } from ".";

const api = axios.create({
  baseURL: `${mainUrl}/v1/product`,
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

export const addProduct = async (data) => {
  try {
    const response = await api.post("/add", data);
    return response.data;
  } catch (error) {
    console.error("Error adding products:", error);
    throw error;
  }
};

export const getProducts = async (
  page = 0,
  size = 10,
  sortBy = "name",
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
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProducts = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await api.patch(`/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding products:", error);
    throw error;
  }
};

export const getOneProduct = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

export const addReview = async (id, rating, comment) => {
  try {
    const response = await api.post(`/review/add`, {
      id: parseInt(id),
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

export const getFiltredProducts = async (page = 0, filters = {}) => {
  try {
    const response = await api.get("/filter", {
      params: {
        page,
        size: 10,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error filtring products:", error);
    throw error;
  }
};

export const exportProducts = async () => {
  try {
    const response = await api.get("/export/csv", {
      responseType: "blob",
    });

    if (response.status !== 200) {
      throw new Error("Failed to download file");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the CSV file", error);
  }
};

export const importProducts = async (data) => {
  try {
    const response = await api.post("/upload/csv", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
