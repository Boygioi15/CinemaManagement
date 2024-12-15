import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { FiSearch } from "react-icons/fi";

const FilmModal = ({ isOpen, onClose, film, onSave, mode }) => {
  if (!isOpen) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Film Details" : "Add New Film";

  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filmTypes, setFilmTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // const filmTypes = [
  //   { id: 1, name: "Action" },
  //   { id: 2, name: "Comedy" },
  //   { id: 3, name: "Drama" },
  //   { id: 4, name: "Horror" },
  //   { id: 5, name: "Romance" },
  //   { id: 6, name: "Sci-Fi" },
  // ];
  const fetchFilmTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tags");
      setFilmTypes(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  console.log(filmTypes);
  useEffect(() => {
    fetchFilmTypes();
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

  const removeType = (typeToRemove) => {
    setSelectedTypes(selectedTypes.filter((type) => type !== typeToRemove));
  };

  // Initialize state with existing film data or empty values
  const [formData, setFormData] = useState({
    name: film?.name || "",
    type: film?.otherDescription
      ? film.otherDescription.split(",").map((t) => t.trim()) // Chuyển chuỗi thành mảng
      : [],
    country: film?.originatedCountry || "",
    age: film?.ageSymbol || "",
    twoDthreeD: film?.twoDthreeD || "",
    duration: film?.filmDuration || "",
    voice: film?.voice || "",
    trailerLink: film?.trailerURL || "",
    description: film?.filmDescription || "",
    image: film?.thumbnailURL || "",
  });
  useEffect(() => {
    if (film?.otherDescription) {
      setFormData((prev) => ({
        ...prev,
        type: film.otherDescription.split(", ").map((type) => type.trim()), // Chuyển chuỗi thành mảng
      }));
    }
  }, [film]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
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
                  onChange={handleInputChange}
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
                <Combobox value={formData.type} onChange={handleTypeSelection}>
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
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ tuổi
                </label>
                <select
                  name="age"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="P">P</option>
                  <option value="K">K</option>
                  <option value="T13">T13</option>
                  <option value="T16">T16</option>
                  <option value="T18">T18</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dạng
                </label>
                <select
                  name="twoDthreeD"
                  value={formData.twoDthreeD}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
              {formData.image && (
                <img
                  src={formData.image}
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
                      image: imageUrl,
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
              value={formData.trailerLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {isEditMode ? "Save Changes" : "Add Film"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmModal;
