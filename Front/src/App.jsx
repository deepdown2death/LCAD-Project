import "./App.css";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes, { authRoutes } from "./routes";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Layout/Dashboard";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<Dashboard />}>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                element={
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute>{route.component}</ProtectedRoute>
                  </Suspense>
                }
              />
            );
          })}
        </Route>

        {authRoutes.map((adminRoute, index) => {
          return (
            <Route
              key={index}
              path={adminRoute.path}
              exact={adminRoute.exact}
              element={
                <Suspense fallback={<Loading />}>
                  {isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    adminRoute.component
                  )}
                </Suspense>
              }
            />
          );
        })}

        <Route path="*" element={<>404</>} />
      </Routes>
    </>
  );
}

export default App;
