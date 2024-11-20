import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../Components/AuthForm";

function RegisterPage() {
  const handleRegister = (formValues, isChecked) => {
    console.log("Đăng nhập với username:");
  };
  const fields = [
    {
      for: "username",
      text: "Họ và tên *",
      type: "text",
      placeholder: "Họ và tên",
      required: true,
    },
    {
      for: "userBirth",
      text: "Ngày sinh *",
      type: "date",
      placeholder: "abc",
      required: true,
    },
    {
      for: "userPhone",
      text: "Số điện thoại *",
      type: "text",
      placeholder: "012...",
      required: true,
    },
    {
      for: "userAccount",
      text: "Tên đăng nhập *",
      type: "text",
      placeholder: "abc",
      required: true,
    },
    {
      for: "userEmail",
      text: "Email *",
      type: "email",
      placeholder: "abc",
      required: true,
    },
    {
      for: "userPass",
      text: "Mật khẩu *",
      type: "password",
      placeholder: "abc",
      required: true,
    },
    {
      for: "confirmPassword",
      text: "Xác thực mật khẩu *",
      type: "password",
      placeholder: "abc",
      required: true,
    },
  ];
  return (
    <>
      <div
        className="min-h-screen font-sans text-white px-10 py-5 bg-gradient-to-b flex-col from-[#0b0d1c] to-[#1a1a2e]"
        style={{
          backgroundImage: "url('/Images/Cover.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AuthForm
          title="Đăng ký"
          fields={fields}
          layout=""
          isTickRequired={true}
          tickLabel="Chính sách bảo mật"
          links={[
            { text: "Bạn đã có tài khoản?", path: "/auth" },
            { text: "Quên mật khẩu?", path: "/auth/forgot-password" },
          ]}
          buttontitle="Đăng ký"
          onSubmit={handleRegister}
        />
      </div>
    </>
  );
}

export default RegisterPage;
