import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Products = lazy(() => import("@/pages/Products"));
const AddProducts = lazy(() => import("@/pages/AddProduct"));
const UpdateProducts = lazy(() => import("@/pages/UpdateProduct"));
const ProductDetail = lazy(() => import("@/pages/ProductDetails"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));

const routes = [
  {
    path: "/",
    exact: true,
    isProtected: true,
    component: <Dashboard />,
  },
  {
    path: "/products",
    exact: true,
    isProtected: true,
    component: <Products />,
  },
  {
    path: "/product/add",
    exact: true,
    isProtected: true,
    component: <AddProducts />,
  },
  {
    path: "/product/update/:id",
    exact: true,
    isProtected: true,
    component: <UpdateProducts />,
  },
  {
    path: "/product/:id",
    exact: true,
    isProtected: true,
    component: <ProductDetail />,
  },
];

const authRoutes = [
  {
    path: "/login",
    exact: true,
    component: <Login />,
  },
  {
    path: "/register",
    exact: true,
    component: <Register />,
  },
];
export { authRoutes };
export default routes;
