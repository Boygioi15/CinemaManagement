import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../../Components/AuthForm";

function VerifyCodePage() {
  const fields = [
    {
      for: "user",
      text: "Nhập mã OTP ",
      type: "text",
      placeholder: "irsus123",
      required: true,
    },
  ];

  const handleClick = async (e) => {};

  return (
    <div
      className="min-h-screen m-0 overflow-y-auto font-sans text-white bg-gradient-to-b from-[#0b0d1c] to-[#1a1a2e]bg-contain"
      style={{ backgroundImage: "url('/Images/Cover.png')" }}
    >
      <div className="relative z-10">
        <div className="flex h-full  bg-black min-h-screen bg-opacity-50">
          <div className="w-1/2 flex items-center pl-20">
            <AuthForm
              title="Quên mật khẩu"
              fields={fields}
              isTickRequired={false}
              buttontitle="Xác nhận mã OTP"
              onSubmit={handleClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyCodePage;
