import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUpComponent = ({
  title,
  fields,
  layout = "column",
  isTickRequired = false,
  tickLabel = "Lưu mật khẩu đăng nhập",
  links = [],
  buttontitle,
  onSubmit,
  bottomLink,
}) => {
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    // Cập nhật formValues khi fields thay đổi
    if (fields && fields.length > 0) {
      const initialValues = fields.reduce((acc, field) => {
        acc[field.for] = field.value || "";
        return acc;
      }, {});
      setFormValues(initialValues);
    }
  }, [fields]);

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formValues, isChecked);
    }
  };

  return (
    <div className="flex items-center">
      <div className="bg-white bg-opacity-90 text-black p-5 rounded-b-lg  max-w-[1000px] shadow-lg">
        <h1 className="text-center mb-5 text-2xl font-bold">{title}</h1>

        {/* Render fields dynamically */}
        <div
          className={`grid gap-4 ${
            layout === "row" ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field.for} className="block mb-1 font-bold">
                {field.text}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              <input
                id={field.for}
                name={field.for}
                type={field.type}
                placeholder={field.placeholder}
                value={formValues[field.for] || ""}
                onChange={handleChange}
                required={field.required || false}
                className="w-full p-2 border border-gray-300 rounded-md min-w-[350px]"
              />
              {/* <p className="text-sm text-red-500">
                Giá trị đang render: {formValues[field.for]}
              </p> */}
            </div>
          ))}
        </div>

        {/* Optional "Tick" checkbox */}
        {isTickRequired && (
          <div className="flex items-center mb-5 mt-3">
            <input
              id="remember"
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="mr-2"
            />
            <label htmlFor="remember">{tickLabel}</label>
          </div>
        )}

        {/* Links like forgot password, register */}
        {links.length > 0 && (
          <div className="text-right items-center">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.path} // Dùng `to` thay vì `onClick`
                className="text-black underline hover:underline cursor-pointer"
                onMouseOver={(e) => (e.currentTarget.style.color = "purple")}
                onMouseOut={(e) => (e.currentTarget.style.color = "black")}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  if (link.onClick) link.onClick(); // Gọi callback khi có
                }}
              >
                {link.text}
              </Link>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-yellow-400 rounded-md text-lg font-bold cursor-pointer hover:bg-yellow-500 mt-3"
        >
          {buttontitle}
        </button>

        {/* bottom link */}
        {bottomLink && (
          <div className="mt-4 text-center">
            <span className="text-base text-gray-700">
              {bottomLink.text}{" "}
              <span
                onClick={bottomLink.onClick}
                className="text-black underline hover:underline cursor-pointer"
                onMouseOver={(e) => (e.currentTarget.style.color = "purple")}
                onMouseOut={(e) => (e.currentTarget.style.color = "black")}
              >
                {bottomLink.linkText}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpComponent;
