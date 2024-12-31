import React from "react";

const Footer = () => {
  return (
    <footer
      className="w-full text-white py-8"
      style={{ background: "linear-gradient(to right, #7c3aed, #3b82f6)" }}
    >
      <div className="text-center text-sm">
        <p>© 2024 UIT Nhóm 22.</p>
        <p className="mt-4">
          TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN ĐẠI HỌC QUỐC GIA HCM
        </p>
        <p className="mt-2">ĐỊA CHỈ: KHU PHỐ LINH XUÂN THỦ ĐỨC THÀNH PHỐ HCM</p>
        <p className="mt-2">
          GIẤY CNĐKKD SỐ: 0313747244, ĐĂNG KÝ LẦN ĐẦU NGÀY 15/04/2014, ĐĂNG KÝ
          THAY ĐỔI LẦN THỨ 3 NGÀY 15/09/2014, CẤP BỞI SỞ KHĐT TPHCM
        </p>
      </div>
    </footer>
  );
};

export default Footer;
