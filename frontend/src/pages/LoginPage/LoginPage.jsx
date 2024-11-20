import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../Components/AuthForm";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function LoginPage() {
  const { setUser } = useAuth(); // Để lưu thông tin người dùng sau khi đăng nhập
  const navigate = useNavigate(); // Hook để điều hướng
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleLogin = (formValues) => {
    const { username, password } = formValues;
    console.log(username);
    if (username === "irisus" && password === "123") {
      setUser({ fullName: "Irisus User" }); // Lưu thông tin người dùng
      alert("Thành công");
      navigate("/");
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  const fields = [
    {
      for: "username",
      text: "Tài khoản, Email hoặc số điện thoại *",
      type: "text",
      placeholder: "irsus123",
      required: true,
    },
    {
      for: "password",
      text: "Mật khẩu *",
      type: "password",
      placeholder: "abc",
      required: true,
    },
  ];

  return (
    <div
      className="min-h-screen m-0 overflow-y-auto font-sans text-white bg-gradient-to-b from-[#0b0d1c] to-[#1a1a2e]bg-contain"
      style={{ backgroundImage: "url('/Images/Cover.png')" }}
    >
      <div className="relative z-10">
        <div className="flex h-full  bg-black min-h-screen bg-opacity-50">
          <div className="w-1/2 flex items-center pl-20">
            <AuthForm
              title="Đăng nhập"
              fields={fields}
              isTickRequired={true}
              tickLabel="Lưu mật khẩu đăng nhập"
              links={[
                { text: "Đăng ký", path: "/auth/register" },
                { text: "Quên mật khẩu?", path: "/auth/forgot-password" },
              ]}
              buttontitle="Đăng nhập"
              onSubmit={handleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
