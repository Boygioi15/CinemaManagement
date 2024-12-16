import * as React from "react";
import * as ReactDOM from "react-dom/client";
import RootLayout from "./layouts/RootLayout/RootLayout";
import AdminFilm from "./pages/FilmManagement/FilmList";
import OnlineTickets from "./pages/TicketManagement/OnlineTicket";
import BapNuoc from "./pages/TicketManagement/BapNuoc";
import OfflineTicket from "./pages/TicketManagement/OfflineTicket";
import InfrasManage from "./pages/Infrastructure/InfrasManage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      {
        path: "/admin/tab/onlineticket",
        element: <OnlineTickets />,
      },
      {
        path: "/admin/tab/bapnuoc",
        element: <BapNuoc />,
      },
      {
        path: "/admin/tab/offlineticket",
        element: <OfflineTicket />,
      },
      {
        path: "/admin/film",
        element: <AdminFilm />,
      },
      {
        path: "/admin/infras",
        element: <InfrasManage />,
      },
      // {
      //   path: "/admin/filmshow",
      //   element: <SuccessPage />,
      // },
      // {
      //   path: "/admin/infras",
      //   element: <UserInfoLayout />,
      // },
      // {
      //   path: "/admin/customer",
      //   element: <UserInfoPage />,
      // },
      // {
      //   path: "/admin/employee",
      //   element: <UserChangePass />,
      // },
      // {
      //   path: "/admin/statistic",
      //   element: <UserTransHistory />,
      // },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
