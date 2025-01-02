import * as React from "react";
import * as ReactDOM from "react-dom/client";
import RootLayout from "./layouts/RootLayout/RootLayout";
import AdminFilm from "./pages/FilmManagement/FilmList";

import InVe from "./pages/TicketManagement/InVe";
import TaoVe from "./pages/TicketManagement/TaoVe";
import PhucVuVe from "./pages/TicketManagement/PhucVuVe";

import InfrasManage from "./pages/Infrastructure/InfrasManage";
import FilmShow from "./pages/FilmShow/filmshow";
import FilmShowChart from "./pages/FilmShow/filmshowChart";

import DailyReport from "./pages/Statistic/DailyReport";
import RenevueOverview from "./pages/Statistic/RenevueOverview";
import LoginPage from "./pages/Auth/login";
import ForgotPasswordPage from "./pages/Auth/fotgotpass";

import AdditionalItem from "./pages/AdditionalItem/item";
import UserList from "./pages/User/userList";
import AnotherRule from "./pages/Rule/AnotherRule";
import Role from "./pages/Role/role";
import Employee from "./pages/Employee/employee";

import RedirectToRoot from "./components/RedirectToRoot";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";
import RoomCreate from "./pages/CreateRoom/RoomCreate";
import OffLineTicketBooking from "./pages/OfflineTicketBooking/OfflineTicketBooking";
import ViewRoompage from "./pages/ViewRoomPage/ViewRoomPage";
import { AuthProvider } from "./contexts/AuthContext";

import { FiShield } from "react-icons/fi";
import ReactDOMServer from "react-dom/server";

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
        path: "/admin/tab/tao-ve",
        element: <TaoVe />,
      },
      {
        path: "/admin/tab/duyet-ve",
        element: <InVe />,
      },
      {
        path: "/admin/tab/phuc-vu-ve",
        element: <PhucVuVe />,
      },
      {
        path: "/admin/phim",
        element: <AdminFilm />,
      },
      {
        path: "/admin/suat-phim",
        element: <FilmShow />,
      },
      {
        path: "/admin/suat-phim/bieu-do",
        element: <FilmShowChart />,
      },
      {
        path: "/admin/co-so-vat-chat",
        element: <InfrasManage />,
      },
      {
        path: "/admin/thong-ke/ngay",
        element: <DailyReport />,
      },
      {
        path: "/admin/thong-ke/nam",
        element: <RenevueOverview />,
      },
      {
        path: "/admin/san-pham-khac",
        element: <AdditionalItem />,
      },
      {
        path: "/admin/tai-khoan-nguoi-dung",
        element: <UserList />,
      },
      {
        path: "/admin/quy-dinh-khac",
        element: <AnotherRule />,
      },
      {
        path: "/admin/phan-quyen",
        element: <Role />,
      },
      {
        path: "/admin/nhan-vien",
        element: <Employee />,
      },
    ],
  },
  {
    path: "/admin/auth",
    element: <LoginPage />,
  },
  {
    path: "/admin/auth/forgot-pass",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/create-room",
    element: <RoomCreate />,
  },
  {
    path: "/view-room/:id",
    element: <ViewRoompage />,
  },
  {
    path: "/offline-ticket",
    element: <OffLineTicketBooking />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
