import React, { useState, useEffect } from "react";
import { updateUser } from "../config/api";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import CustomButton from "./button";
const UserInforComponent = ({ title, fields, buttontitle, onSubmit }) => {
  const [formValues, setFormValues] = useState({});
  const { user, handleAccount } = useAuth();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const response = await updateUser(user.id, formValues);
    if (response.success) {
      await handleAccount();
      toast.success("Cập nhật thành công");
    }
  };

  return (
    <div className="flex items-center w-full">    
      <div className="bg-white  text-black p-5 rounded w-full shadow-lg">
        <h1 className="text-center mb-5 text-2xl font-bold">{title}</h1>

        {/* Render fields dynamically */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <CustomButton
          defaultColor="#F3EA28" /* Default background color */
          gradientFrom="#663399" /* Gradient start color */
          gradientTo="#3366CC" /* Gradient end color */
          textColor="#000000" /* Text color */
          hoverTextColor="#FFFFFF" /* Text color on hover */
          
          text="Cập nhật thông tin"
          onClick={handleSubmit}          
          className={"w-full mt-4"}  
        />
      </div>
    </div>
  );
};

export default UserInforComponent;
