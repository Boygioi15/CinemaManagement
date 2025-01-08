import React, { useState, useEffect } from "react";
import { FiColumns, FiFilm, FiPrinter, FiGift } from "react-icons/fi";
import {
  FiBarChart2,
  FiUser,
  FiShield,
  FiTrello,
  FiCalendar,
  FiList,
  FiFile,
  FiLock,
  FiPackage,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { RxDashboard } from "react-icons/rx";
import Sidebar from "../../components/Sidebar";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const filmTab = {
  name: "Quản lý phim",
  path: "/admin/film-management",
  icon: <FiFilm className="w-6 h-6" />,
};
const filmShowListTab = {
  name: "Danh sách suất phim",
  path: "/admin/film-show-management/list",
  icon: <FiTrello className="w-6 h-6" />,
};
const filmShowChartTab = {
  name: "Biểu đồ suất phim",
  path: "/admin/film-show-management/chart",
  icon: <FiCalendar className="w-6 h-6" />,
};
const offlineTicketTab = {
  name: "Tạo vé trực tiếp",
  path: "/create-offline-ticket",
  icon: <RxDashboard className="w-6 h-6" />,
};
const printTicketTab = {
  name: "Duyệt vé",
  path: "/admin/ticket-management/print-list",
  icon: <FiPackage className="w-6 h-6" />,
};
const serveTicketTab = {
  name: "Phục vụ vé",
  path: "/admin/ticket-management/serve-list",
  icon: <FiPackage className="w-6 h-6" />,
};
const dailyReportTab = {
  name: "Báo cáo hằng ngày",
  path: "/admin/thong-ke/ngay",
  icon: <FiFile className="w-6 h-6" />,
};
const revenueOverviewTab = {
  name: "Doanh thu hằng năm",
  path: "/admin/thong-ke/nam",
  icon: <FiBarChart2 className="w-6 h-6" />,
};


const roomTab = {
  name: "Quản lý phòng",
  path: "/admin/room-management",
  icon: <FiList className="w-6 h-6" />,
};
const statisticTab = {
  name: "Báo cáo & Thống kê",
  path: "/admin/statistic",
  icon: <FiFile className="w-6 h-6" />,
};
const otherProductTab = {
  name: "Quản lý sản phẩm ngoài",
  path: "/admin/additionalItem",
  icon: <FiGift className="w-6 h-6" />,
};
const accountTab = {
  name: "Quản lý tài khoản",
  path: "/admin/user-account",
  icon: <RxDashboard className="w-6 h-6" />,
};
const otherRuleTab = {
  name: "Cài đặt quy định hệ thống",
  path: "/admin/admin-param",
  icon: <FiShield className="w-6 h-6" />,
};
const employeeTab = {
  name: "Quản lý nhân viên",
  path: "/admin/employee-management",
  icon: <FiUser className="w-6 h-6" />,
};
const permissionTab = {
  name: "Phân quyền nhân viên",
  path: "/admin/role-division",
  icon: <FiLock className="w-6 h-6" />,
};
const promotionTab = {
  name: "Quản lý sự kiện",
  path: "/admin/promotion-management",
  icon: <FiLock className="w-6 h-6" />,
}


const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    employeeDetail,
    setEmployeeDetail,
    fetchEmployeeDetail,
    signOut,
    signInNotification,
  } = useAuth();
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();
  const fetchRole = async () => {
    if (employeeDetail) {
      const roleList = await employeeDetail.roles.map(
        (role) => role.permissionID.symbol
      );
      const updatedTab = [];
      if (roleList.includes("film")) {
        updatedTab.push(filmTab);
      }
      if (roleList.includes("film_show")) {
        updatedTab.push(filmShowListTab, filmShowChartTab);
      }
      if (roleList.includes("ticket")) {
        updatedTab.push(printTicketTab, serveTicketTab,offlineTicketTab);
      }
      if (roleList.includes("room")) {
        updatedTab.push(roomTab);
      }
      if (roleList.includes("statistic")) {
        updatedTab.push(statisticTab);
      }
      if (roleList.includes("additional_item")) {
        updatedTab.push(otherProductTab);
      }
      if (roleList.includes("user_account")) {
        updatedTab.push(accountTab);
      }
      if (roleList.includes("admin_param")) {
        updatedTab.push(otherRuleTab);
      }
      if (roleList.includes("employee")) {
        updatedTab.push(employeeTab);
      }
      if (roleList.includes("role_division")) {
        updatedTab.push(permissionTab);
      }
      if (roleList.includes("promotion")) {
        updatedTab.push(promotionTab);
      }
      setTabs(updatedTab);
    }
  };
  useEffect(() => {
    () => console.log("Hi");
    fetchRole();
  }, [signInNotification]);
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      alert("Có lỗi khi xác thực người dùng, vui lòng đăng nhập lại");
      signOut();
      navigate("/admin/auth");
    }
    if (!employeeDetail) {
      fetchEmployeeDetail().catch((error) => {
        console.log(error);
        alert("Xác thực người dùng thất bại, vui lòng đăng nhập lại");
        signOut();
        navigate("/admin/auth");
      });
    }
    if (employeeDetail) {
      fetchRole();
    }
  }, [employeeDetail]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tabs={tabs}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
