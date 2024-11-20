import React from "react";

const Footer = () => {
  return (
    <div className="rounded-none overflow-hidden bg-gradient-to-r from-purple-700 to-blue-600 text-white font-sans">
      <div className="flex justify-between items-start mx-24">
        <div className="flex space-x-4">
          <img
            alt="Cinestar logo"
            className="w-12 h-12 items-start mt-8"
            height="50"
            src="/Images/logo.svg"
            width="50"
          />
          <div className="mt-8">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-white">CINESTAR</h1>
            </div>
            <p className="text-xl text-white">BE HAPPY, BE A STAR</p>
            <div className="flex space-x-4 mt-4">
              <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded">
                ĐẶT VÉ
              </button>
              <button className="border border-yellow-400 text-yellow-400 font-bold py-2 px-4 rounded">
                ĐẶT BẮP NƯỚC
              </button>
            </div>
            <div className="flex flex-col items-start space-y-1">
              <div className="flex space-x-4 mt-12">
                <a href="#" className="hover:text-gray-400">
                  <img
                    src="/Images/fb.png"
                    alt="Facebook"
                    width="30"
                    height="30"
                  />
                </a>
                <a href="#" className="hover:text-gray-400">
                  <img
                    src="/Images/twitter.png"
                    alt="Twitter"
                    width="30"
                    height="30"
                  />
                </a>
                <a href="#" className="hover:text-gray-400">
                  <img
                    src="/Images/tiktok.png"
                    alt="TikTok"
                    width="30"
                    height="30"
                  />
                </a>
                <a href="#" className="hover:text-gray-400">
                  <img
                    src="/Images/pinterest.png"
                    alt="Pinterest"
                    width="30"
                    height="30"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-10">
          <div>
            <h2 className="font-bold">TÀI KHOẢN</h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="block">
                  Đăng nhập
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Đăng ký
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Membership
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">THUÊ SỰ KIỆN</h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="block">
                  Thuê rạp
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Các loại hình cho thuê khác
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">XEM PHIM</h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="block">
                  Phim đang chiếu
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Phim sắp chiếu
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Suất chiếu đặc biệt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">CINESTAR</h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="block">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">DỊCH VỤ KHÁC</h2>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" className="block">
                  Nhà hàng
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Kidzone
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Bowling
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Billiards
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Gym
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Nhà hát Opera
                </a>
              </li>
              <li>
                <a href="#" className="block">
                  Coffee
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-400 mt-10 pt-4 mx-24 text-center flex justify-between items-center">
        <p className="text-white">© 2023 Cinestar. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Tin điện ảnh</a>
          <a href="#">Hỏi và đáp</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
