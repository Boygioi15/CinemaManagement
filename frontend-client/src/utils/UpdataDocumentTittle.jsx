import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const UpdateDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    switch (path) {
      case "/":
        document.title = "Trang chủ - Cinema App";
        break;
      case "/auth":
        document.title = "Đăng nhập - Cinema App";
        break;
      case "/auth/forgot-password":
        document.title = "Quên mật khẩu - Cinema App";
        break;
      case "/auth/success":
        document.title = "Thành công - Cinema App";
        break;
      case "/movie/showing":
        document.title = "Phim đang chiếu - Cinema App";
        break;
      case "/movie/upcoming":
        document.title = "Phim sắp chiếu - Cinema App";
        break;
      case "/search":
        document.title = "Tìm kiếm - Cinema App";
        break;
      case "/showtimes":
        document.title = "Lịch chiếu - Cinema App";
        break;
      default:
        document.title = "Cinema App";
        break;
    }
  }, [location]);

  return null; // Không render gì cả
};

export default UpdateDocumentTitle;
