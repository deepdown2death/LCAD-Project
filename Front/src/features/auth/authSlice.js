import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const storageUser = localStorage.getItem("user");
const storageToken = localStorage.getItem("token");
const storageRole = localStorage.getItem("role");

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
};

if (
  storageUser &&
  storageToken &&
  isTokenExpired(storageToken)
) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}

const initialState = {
  user: storageUser ? JSON.parse(storageUser) : null,
  token: storageToken ? storageToken : null,
  role: storageRole ? storageRole : null,
  isAuthenticated:
    storageUser && storageToken && !isTokenExpired(storageToken) ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = JSON.stringify(action.payload);
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = !isTokenExpired(action.payload.token);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRole = (state) => state.auth.role;
export default authSlice.reducer;
