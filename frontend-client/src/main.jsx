import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/LoginPage/ForgotPassPage";
import SuccessPage from "./pages/LoginPage/SuccessPage";
import UserInfoLayout from "./layouts/UserSpaceLayout";
import UserInfoPage from "./pages/UserPage/UserInfor";
import UserChangePass from "./pages/UserPage/UserChangePass";
import UserTransHistory from "./pages/UserPage/UserTransHistory";
import "./index.css";
import "./App.css";
import FilmDetailPage from "./pages/FilmDetailPage/FilmDetailPage";
import FoodPage from "./pages/FoodPage/FootPage";
import FilmShowingPage from "./pages/FilmShowingPage/FilmShowingPage";
import FilmUpComing from "./pages/FIlmUpComing/FilmUpComing";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Context/AuthContext";
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import ShowTimePage from "./pages/ShowTimePage/ShowTimePage";
import OffLineTicketBooking from "./Components/RoomDisplay";
import NotFoundPage from "./pages/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "auth",
        element: <LoginPage />,
      },
      {
        path: "auth/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "auth/success",
        element: <SuccessPage />,
      },
      {
        path: "/user/user-space",
        element: <UserInfoLayout />,
      },
      {
        path: "/user/user-space/infor",
        element: <UserInfoPage />,
      },
      {
        path: "/user/user-space/change-pass",
        element: <UserChangePass />,
      },
      {
        path: "/user/user-space/trans-history",
        element: <UserTransHistory />,
      },
      {
        path: "/movie/detail/:filmID",
        element: <FilmDetailPage />,
      },
      {
        path: "/movie/showing",
        element: <FilmShowingPage />,
      },
      {
        path: "/movie/upcoming",
        element: <FilmUpComing />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/showtimes",
        element: <ShowTimePage />,
      },

      {
        path: "/food",
        element: <FoodPage />,
      },
    ],
  },
  {
    path: "*", // wildcard cho tất cả đường dẫn không khớp
    element: <NotFoundPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeButton={true}
      pauseOnHover={true}
      draggable={true}
      rtl={false}
    />
  </React.StrictMode>
);
