import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/LoginPage/ForgotPassPage";
import VerifyCodePage from "./pages/LoginPage/VerifyCodePage";
import ResetPassPage from "./pages/LoginPage/ResetPassPage";
import UserInfoPage from "./layouts/UserSpaceLayout";
import "./index.css";
//specified element here
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "auth",
        element: <LoginPage />,
      },
      {
        path: "auth/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "auth/verify",
        element: <VerifyCodePage />,
      },
      {
        path: "auth/reset-password",
        element: <ResetPassPage />,
      },
      {
        path: "/profile",
        element: <UserInfoPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
