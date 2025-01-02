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
  name: "Danh sách phim",
  path: "/admin/phim",
  icon: <FiFilm className="w-6 h-6" />,
};
const filmShowListTab = {
  name: "Suất phim",
  path: "/admin/suat-phim",
  icon: <FiTrello className="w-6 h-6" />,
};
const filmShowChartTab = {
  name: "Biểu đồ suất phim",
  path: "/admin/suat-phim/bieu-do",
  icon: <FiCalendar className="w-6 h-6" />,
};
const offlineTicketTab = {
  name: "Tạo vé trực tiếp",
  path: "/offline-ticket",
  icon: <RxDashboard className="w-6 h-6" />,
};
const printTicketTab = {
  name: "Duyệt vé",
  path: "/admin/tab/duyet-ve",
  icon: <FiPrinter className="w-6 h-6" />,
};
const serveTicketTab = {
  name: "Bắp nước",
  path: "/admin/tab/phuc-vu-ve",
  icon: <FiPackage className="w-6 h-6" />,
};
const roomTab = {
  name: "Danh sách phòng",
  path: "/admin/co-so-vat-chat",
  icon: <FiList className="w-6 h-6" />,
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
const otherProductTab = {
  name: "Sản phẩm khác",
  path: "/admin/san-pham-khac",
  icon: <FiGift className="w-6 h-6" />,
};
const accountTab = {
  name: "Quản lý tài khoản",
  path: "/admin/tai-khoan-nguoi-dung",
  icon: <RxDashboard className="w-6 h-6" />,
};
const otherRuleTab = {
  name: "Các quy định khác",
  path: "/admin/quy-dinh-khac",
  icon: <FiShield className="w-6 h-6" />,
};
const employeeTab = {
  name: "Quản lý nhân viên",
  path: "/admin/nhan-vien",
  icon: <FiUser className="w-6 h-6" />,
};
const permissionTab = {
  name: "Phân quyền",
  path: "/admin/phan-quyen",
  icon: <FiLock className="w-6 h-6" />,
};

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
        updatedTab.push(offlineTicketTab, printTicketTab, serveTicketTab);
      }
      if (roleList.includes("room")) {
        updatedTab.push(roomTab);
      }
      if (roleList.includes("statistic")) {
        updatedTab.push(dailyReportTab, revenueOverviewTab);
      }
      if (roleList.includes("additional_item")) {
        updatedTab.push(otherProductTab);
      }
      if (roleList.includes("use_account")) {
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
      setTabs(updatedTab);
    }
  };
  useEffect(() => {
    () => fetchRole();
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
