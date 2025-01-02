import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../config/api";
import { toast } from "react-toastify";
import background from "../../assets/fg_background.png";

function ForgotPasswordPage() {
   useEffect(() => {
      document.title = "Quên mật khẩu";
    });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Thêm state để lưu lỗi
  const [loading, setLoading] = useState(false); // Thêm state để kiểm tra trạng thái loading

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Reset lỗi khi người dùng thay đổi email
  };

  const validateEmail = async (email) => {
    // Kiểm tra email có đúng định dạng không
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zAherica]{2,}$/;
    return regex.test(email);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email không được để trống");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true); // Bắt đầu trạng thái loading

    const response = await resetPassword(email);
    setLoading(false); // Kết thúc trạng thái loading

    if (response.success) {
      toast.success("Gửi mật khẩu mới thành công");
      navigate("/auth");
    } else {
      toast.error("Gửi mật khẩu mới thất bại");
    }
  };

  return (
    <div
      className="font-sans text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        height: "1000px",
        paddingTop: "200px"
      }}
    >
      <div  className=" flex items-center justify-center">
        <div className="text-white rounded-lg shadow-xl p-10 max-w-xl w-full">
          <h2 className="text-4xl font-bold mb-6 text-center">Quên mật khẩu</h2>
          <p className="text-center text-lg mb-8">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để
            tạo mật khẩu mới
          </p>
          <input
            type="email"
            value={email} // Liên kết giá trị với state
            onChange={handleEmailChange} // Cập nhật state khi người dùng nhập email
            placeholder="Nhập email"
            className="w-full p-4 text-black rounded-lg mb-6 outline-none border border-gray-400 focus:ring-2 focus:ring-indigo-500 text-lg"
          />
          {/* Hiển thị lỗi nếu có */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            onClick={handleClick} // Gọi hàm khi người dùng click nút
            disabled={loading} // Vô hiệu hóa nút khi đang loading
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400"
            } text-black font-semibold py-3 rounded-lg text-lg transition duration-200`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Gửi mã xác minh"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
