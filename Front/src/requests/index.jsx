import axios from "axios";
// https://shop.comparervotremutuelle.info/back
// http://localhost:3301
export const mainUrl = 'https://shop.comparervotremutuelle.info/back'
const api = axios.create({
  baseURL: `${mainUrl}/v1/auth`,
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

export const loginRequest = async (email, password) => {
  try {
    const response = await api.post("/authenticate", {
      email,
      password,
    });
    return response.data; // Assuming the API returns user data
  } catch (error) {
    throw new Error("Invalid credentials"); // Customize error message
  }
};

export const registerRequest = async (
  email,
  firstName,
  lastName,
  password,
  phoneNumber
) => {
  try {
    const response = await api.post("/register", {
      email,
      firstName,
      lastName,
      password,
      phoneNumber,
    });
    return response.data; // Assuming the API returns user data
  } catch (error) {
    throw new Error("Invalid credentials"); // Customize error message
  }
};
