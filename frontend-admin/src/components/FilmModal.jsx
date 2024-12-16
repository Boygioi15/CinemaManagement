import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Combobox } from "@headlessui/react";
import { FiSearch } from "react-icons/fi";
import Dialog from "./ConfirmDialog";
import SuccessDialog from "./SuccessDialog";

const FilmModal = ({ isOpen, onClose, film, onSave, mode }) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Film Details" : "Add New Film";

  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filmTypes, setFilmTypes] = useState([]);
  const [ageSymbol, setAgeSymbol] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAgeSymbol = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/param");
      setAgeSymbol(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFilmTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tags");
      setFilmTypes(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFilmTypes();
    fetchAgeSymbol();
  }, []);

  const filteredTypes =
    query === ""
      ? filmTypes
      : filmTypes.filter((type) =>
          type.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleTypeSelection = (typeName) => {
    if (!selectedTypes.includes(typeName)) {
      setSelectedTypes([...selectedTypes, typeName]);
    }
  };
  console.log(`Input Changed: Name=${selectedTypes}`);

  const removeType = (typeToRemove) => {
    setSelectedTypes(selectedTypes.filter((type) => type !== typeToRemove));
  };

  // Initialize state with existing film data or empty values
  const [formData, setFormData] = useState({
    _id: film?._id || "",
    name: film?.name || "",
    otherDescription: film?.otherDescription
      ? film.otherDescription.split(",").map((t) => t.trim()) // Chuyển chuỗi thành mảng
      : [],
    originatedCountry: film?.originatedCountry || "",
    ageSymbol: film?.ageSymbol || "",
    twoDthreeD: film?.twoDthreeD || "",
    filmDuration: film?.filmDuration || "",
    voice: film?.voice || "",
    trailerURL: film?.trailerURL || "",
    filmDescription: film?.filmDescription || "",
    thumbnailURL: film?.thumbnailURL || "",
  });

  useEffect(() => {
    if (film?.otherDescription) {
      setFormData((prev) => ({
        ...prev,
        otherDescription: film.otherDescription
          .split(", ")
          .map((type) => type.trim()), // Chuyển chuỗi thành mảng
      }));
    }
  }, [film]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      otherDescription: selectedTypes, // Cập nhật type từ selectedTypes
    }));
  }, [selectedTypes]);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      "name",
      "otherDescription",
      "ageSymbol",
      "originatedCountry",
      "filmDuration",
      "voice",
      "thumbnailURL",
      "trailerURL",
      "filmDescription",
      "twoDthreeD",
    ];
    console.log(formData);

    return requiredFields.every((field) => !!formData[field]); // Chuyển đổi giá trị thành Boolean
  }, [formData]);

  const handleSubmit = () => {
    const formattedData = {
      ...formData,
      otherDescription:
        formData.otherDescription.length > 0
          ? formData.otherDescription.join(", ")
          : null,
    };
    setIsConfirmDialogOpen(true);
    if (mode === "edit") {
      setDialogData({
        title: "Confirm update",
        message: "Bạn có chắc chắn là cập nhật phim này không ?",
      });
    } else {
      setDialogData({
        title: "Confirm add",
        message: "Bạn có chắc chắn là thêm phim này không ?",
      });
    }

    setData(formattedData);
  };

  const handleFilm = async () => {
    setIsLoading(true);
    try {
      console.log(`data nè heheh:${data.otherDescription} `);

      // Gọi API tùy thuộc vào mode
      if (mode === "edit") {
        await axios.put(`http://localhost:8000/api/films/${data.id}`, data);
        setDialogData({
          title: "Successs",
          message: "Cập nhật phim thành công",
        });
      } else {
        await axios.post("http://localhost:8000/api/films", data);
        setDialogData({
          title: "Successs",
          message: "Thêm phim thành công",
        });
      }
      if (response.status === 200 || response.status === 201) {
        // Cập nhật state và hiển thị success dialog
        // Sau khi thành công, hiển thị dialog success
        setIsLoading(false); // Tắt trạng thái loading
        setIsConfirmDialogOpen(false); // Đóng dialog xác nhận
        setIsSuccessDialogOpen(true); // Hiển thị dialog thành công
      }
    } catch (error) {
      console.error("Error updating/adding film:", error);
      alert("An error occurred while updating the film. Please try again.");
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Phim
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể Loại
                </label>
                {/* <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
                <Combobox
                  value={formData.otherDescription}
                  onChange={handleTypeSelection}
                >
                  <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:ring-2 focus-within:ring-blue-500">
                      <Combobox.Input
                        name="type"
                        //value={formData.type.join(", ")}
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={() => ""}
                        placeholder="Search types..."
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <FiSearch
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredTypes.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredTypes.map((type) => (
                          <Combobox.Option
                            key={type.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={type.name}
                          >
                            {({ selected, active }) => (
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {type.name}
                              </span>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <div
                      key={type}
                      className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                    >
                      {type}
                      <button
                        onClick={() => removeType(type)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quốc gia
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.originatedCountry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originatedCountry: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ tuổi
                </label>
                <select
                  name="age"
                  value={formData.ageSymbol || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ageSymbol: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Vui lòng chọn độ tuổi
                  </option>
                  {ageSymbol.map((age) => (
                    <option key={age.id} value={age.symbol}>
                      {age.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.filmDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      filmDuration: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Âm thanh
                </label>
                <input
                  type="text"
                  name="voice"
                  value={formData.voice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, voice: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dạng
                </label>
                <select
                  name="twoDthreeD"
                  value={formData.twoDthreeD || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twoDthreeD: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    vui lòng chọn dạng
                  </option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="2D,3D">2D, 3D</option>
                </select>
              </div>
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Film Image
              </label>
              {formData.thumbnailURL && (
                <img
                  src={formData.thumbnailURL}
                  alt="Film"
                  className="w-full h-4/5 object-cover rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                className="w-full"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Tạo URL tạm thời từ file và cập nhật formData.image
                    const imageUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({
                      ...prev,
                      thumbnailURL: imageUrl,
                    }));
                  }
                  console.log("File selected:", e.target.files[0]);
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
              Trailer Link
            </label>
            <input
              type="text"
              name="trailerLink"
              value={formData.trailerURL}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  trailerURL: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.filmDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  filmDescription: e.target.value,
                }))
              }
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg  ${
                isFormValid
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
            >
              {isEditMode ? "Save Changes" : "Add Film"}
            </button>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleFilm}
        title={dialogData.title}
        message={dialogData.message}
        data={data}
        mode={mode}
      />
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        title={dialogData.title}
        message={dialogData.message}
      />
    </div>
  );
};

export default FilmModal;
