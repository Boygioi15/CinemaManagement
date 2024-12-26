import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert("Login successful!");
      }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-10 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập email..."
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password input */}
          <div className="relative mt-4">
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

          {/* Forgot password */}
          <div className="flex justify-between">
            <Link
              to="/admin/auth/forgot-pass"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Quên mật khẩu?
            </Link>
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

export default LoginPage;
