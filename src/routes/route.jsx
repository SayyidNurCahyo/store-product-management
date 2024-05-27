import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import ProtectedRoute from "../routes/protectedRoute";
import Product from "../pages/Product/Product";
import ProductForm from "../pages/Product/components/ProductForm";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Product />,
      },
      {
        path: "/new",
        element: (
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/update/:id",
        element: (
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
