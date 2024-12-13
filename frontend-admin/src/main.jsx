import * as React from "react";
import * as ReactDOM from "react-dom/client";
import RootLayout from "./layouts/RootLayout/RootLayout";
import AdminFilm from "./pages/FilmManagement/FilmList";
import OnlineTickets from "./pages/TicketManagement/OnlineTicket";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      {
        path: "/admin/ticket",
        element: <OnlineTickets />,
      },
      {
        path: "/admin/film",
        element: <AdminFilm />,
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
