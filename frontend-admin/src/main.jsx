import * as React from "react";
import * as ReactDOM from "react-dom/client";

import ReactDOMServer from "react-dom/server";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RootLayout from "./layouts/RootLayout/RootLayout";

import "./index.css";

import { FiShield } from "react-icons/fi";
import FilmManagementPage from "./pages/FilmManagementPage/FilmManagementPage";
import FilmShowListPage from "./pages/FilmShowManagement/FilmShowListPage";
import FilmShowChartPage from "./pages/FilmShowManagement/FilmShowChartPage";
import TicketPrintListPage from "./pages/TicketManagement/TicketPrintListPage";
import TicketServeListPage from "./pages/TicketManagement/TicketServeListPage";
import RoomManagementPage from "./pages/RoomManagementPage/RoomManagementPage";
import UserAccountManagementPage from "./pages/UserAccountManagementPage/UserAccountManagementPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage/EmployeeManagementPage";
import RoleDivisionPage from "./pages/RoleDivisionPage/RoleDivisionPage";
import AdminParamPage from "./pages/AdminParam/AdminParamPage";

import AuthPage from "./pages/AuthPage/AuthPage";
import CreateOfflineTicketPage from "./pages/TicketManagement/CreateOfflineTicketPage/OfflineTicketBookingPage";
import CreateRoomPage from "./pages/RoomManagementPage/CreateRoomPage/CreateRoomPage";
import ViewRoompage from "./pages/RoomManagementPage/ViewRoomPage/ViewRoomPage";

import RedirectToRoot from "./components/RedirectToRoot";
import StatisticPage from "./pages/StatisticPage/StatisticPage";
import PromotionManagementPage from "./pages/PromotionManagementPage/PromotionManagementPage";
import AdditionalItemManagementPage from "./pages/AdditionalItemManagementPage/AdditionalItemManagementPage";

const generateIconURL = () => {
  const svgString = ReactDOMServer.renderToString(<FiShield size={64} />);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
};

// Thiết lập icon cho trang web
const setDynamicIcon = () => {
  const iconURL = generateIconURL();
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml"; // Dùng SVG làm favicon
  link.href = iconURL;

  // Xóa icon cũ nếu có
  const existingLink = document.querySelector("link[rel='icon']");
  if (existingLink) {
    document.head.removeChild(existingLink);
  }

  // Thêm icon mới
  document.head.appendChild(link);
};

setDynamicIcon();
const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectToRoot />,
  },
  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      {
        path: "film-management",
        element: <FilmManagementPage />,
      },
      {
        path: "film-show-management/chart",
        element: <FilmShowChartPage />,
      },
      {
        path: "film-show-management/list",
        element: <FilmShowListPage />,
      },
      {
        path: "ticket-management/print-list",
        element: <TicketPrintListPage />,
      },
      {
        path: "ticket-management/serve-list",
        element: <TicketServeListPage />,
      },
      {
        path: "room-management",
        element: <RoomManagementPage />,
      },
      {
        path: "user-account",
        element: <UserAccountManagementPage />,
      },
      {
        path: "employee-management",
        element: <EmployeeManagementPage />,
      },
      {
        path: "role-division",
        element: <RoleDivisionPage />,
      },
      {
        path: "admin-param",
        element: <AdminParamPage />,
      },
      {
        path: "statistic",
        element: <StatisticPage />,
      },
      {
        path: "promotion-management",
        element: <PromotionManagementPage />,
      },
      {
        path: "additionalItem",
        element: <AdditionalItemManagementPage />,
      },
    ],
  },
  {
    path: "/admin/auth",
    element: <AuthPage />,
    index: true,
  },
  {
    path: "/create-room",
    element: <CreateRoomPage />,
  },
  {
    path: "/view-room/:id",
    element: <ViewRoompage />,
  },
  {
    path: "/create-offline-ticket",
    element: <CreateOfflineTicketPage />,
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
