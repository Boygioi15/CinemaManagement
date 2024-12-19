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

import RedirectToRoot from "./components/RedirectToRoot";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";

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

      // {
      //   path: "/admin/minh-hoa-ca-lam",
      //   element: <ShiftVisualization />
      // },
      // {
      //   path: "/admin/nhan-vien",
      //   element: <Employee />
      // },
      // {
      //   path: "/admin/statistic",
      //   element: <Statistic />
      // },
      // {
      //   path: "/admin/tai-khoan-nguoi-dung",
      //   element: <UserAccount />
      // }
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
