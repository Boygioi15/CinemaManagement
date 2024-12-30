import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../Components/LoginComponent";
import SignUpComponent from "../../Components/SignUpComponent";
import { useAuth } from "../../Context/AuthContext";
import { callLogin, callSignUp } from "../../config/api";
import { toast } from "react-toastify";

function ParentForm() {
  const [display, setDisplay] = useState(true);
  const switchToLogin = () => {
    setDisplay(true); // Chuyển sang form Đăng nhập
  };
  let displayContent;
  if (display) {
    displayContent = <LoginForm />;
  } else {
    displayContent = (
      <SignUpForm switchToLogin={switchToLogin} setDisplay={setDisplay} />
    );
  }
  return (
    <div className="authForm">
      <div className="authForm-title">
        <button
          onClick={() => {
            setDisplay(true);
          }}
          className={`w-1/2 py-2 text-center font-bold rounded-t-lg transition-all ${
            display
              ? "bg-white text-black"
              : "bg-[#2A246D] text-white hover:bg-[#3B337E]"
          }`}
        >
          Đăng nhập
        </button>
        <button
          onClick={() => {
            setDisplay(false);
          }}
          className={`w-1/2 py-2 text-center font-bold rounded-t-lg transition-all ${
            !display
              ? "bg-white text-black"
              : "bg-[#2A246D] text-white hover:bg-[#3B337E]"
          }`}
        >
          Đăng ký
        </button>
      </div>
      {displayContent}
    </div>
  );
}
function LoginForm() {
  const { setUser } = useAuth(); // Để lưu thông tin người dùng sau khi đăng nhập
  const navigate = useNavigate(); // Hook để điều hướng
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (formValues) => {
    const response = await callLogin(formValues);
    console.log("🚀 ~ handleLogin ~ response:", response);
    if (response.success) {
      const { accesssToken } = response.data.tokens;
      setUser(response.data);
      localStorage.setItem("accessToken", accesssToken);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    }
  };

  const fields = [
    {
      for: "identifier",
      text: "Tài khoản, Email hoặc số điện thoại *",
      type: "text",
      placeholder: "irsus123",
      required: true,
    },
    {
      for: "userPass",
      text: "Mật khẩu *",
      type: "password",
      placeholder: "abc",
      required: true,
    },
  ];

  return (
    <div className="">
      <LoginComponent
        fields={fields}
        isTickRequired={true}
        tickLabel="Lưu mật khẩu đăng nhập"
        links={[{ text: "Quên mật khẩu?", path: "/auth/forgot-password" }]}
        buttontitle="Đăng nhập"
        onSubmit={handleLogin}
      />
    </div>
  );
}

function SignUpForm({ switchToLogin, setDisplay }) {
  const handleRegister = async (formValues, isChecked) => {
    const response = await callSignUp(formValues);
    if (response.success === true) {
      toast.success("Đăng kí thành công");
      setDisplay(true);
    } else {
      toast.error(response.msg);
    }
  };
  const fields = [
    {
      for: "name",
      text: "Họ và tên *",
      type: "text",
      placeholder: "Họ và tên",
      required: true,
    },
    {
      for: "birthDate",
      text: "Ngày sinh *",
      type: "date",
      placeholder: "abc",
      required: true,
    },
    {
      for: "phone",
      text: "Số điện thoại *",
      type: "text",
      placeholder: "012...",
      required: true,
    },
    {
      for: "account",
      text: "Tên đăng nhập *",
      type: "text",
      placeholder: "abc",
      required: true,
    },
    {
      for: "email",
      text: "Email *",
      type: "email",
      placeholder: "abc",
      required: true,
    },
    {
      for: "password",
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
    <div className="">
      <SignUpComponent
        fields={fields}
        layout=""
        buttontitle="Đăng ký"
        onSubmit={handleRegister}
        bottomLink={{
          text: "Bạn đã có tài khoản?",
          linkText: "Đăng nhập",
          path: "#",
          onClick: { switchToLogin },
        }}
      />
    </div>
  );
}
export default function LoginPage() {
  return (
    <div
      className="min-h-screen m-0 overflow-y-auto font-sans text-white  bg-gradient-to-b flex-col bg-contain"
      style={{
        backgroundImage: "url('/Images/image 1.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#14102c",
      }}
    >
      <div className="">
        <div className="h-full   min-h-screen ">
          <div className="w-fit flex items-center ml-40 mt-20 mb-20">
            <ParentForm />
          </div>
        </div>
      </div>
    </div>
  );
}
