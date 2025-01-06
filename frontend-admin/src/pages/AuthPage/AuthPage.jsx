import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import loginBG from "../../assets/loginBG.png";
const AuthPage = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validate form
  
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra identifier
    if (!formData.identifier && !formData.password) {
      alert("Không được để trống các trường!")
      return false;
    }
    return true;
  };
  const {signIn} = useAuth();
  const navigate = useNavigate();
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const response = await axios.post('http://localhost:8000/api/auth/employee/log-in', formData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status===200) {
        signIn(response.data.data.tokens.accesssToken);
        alert("Đăng nhập thành công!");
        navigate('/admin');
        
      } else {
        alert("Đăng nhập thất bại, identifier hoặc mật khẩu không đúng!");
      }


    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{ backgroundColor: "rgb(245,245,245)",backgroundImage: `url(${loginBG})`,backgroundSize: "cover	"}}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={`w-full px-10 py-2 border rounded-md ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tài khoản, identifier hoặc SĐT"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password input */}
          <div className="relative mt-4 ">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-10 py-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu..."
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2 right-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
