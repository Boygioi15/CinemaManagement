import React, { useState, useEffect } from "react";

const UserChangePassComponent = ({ title, fields, buttontitle, onSubmit }) => {
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
      <div className="bg-white bg-opacity-90 text-black p-5 rounded  max-w-[1000px] shadow-lg">
        <h1 className="text-center mb-5 text-2xl font-bold">{title}</h1>

        {/* Render fields dynamically */}
        <div className={"grid gap-4 grid-cols-1"}>
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
                className="w-full p-2 border border-gray-300 rounded-md min-w-[710px]"
              />
              {/* <p className="text-sm text-red-500">
                Giá trị đang render: {formValues[field.for]}
              </p> */}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-yellow-400 rounded-md text-lg font-bold cursor-pointer hover:bg-yellow-500 mt-3"
        >
          {buttontitle}
        </button>
      </div>
    </div>
  );
};

export default UserChangePassComponent;
