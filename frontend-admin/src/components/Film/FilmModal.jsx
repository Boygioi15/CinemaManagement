import React from "react";
import { FiX } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Combobox, ComboboxOption } from "@headlessui/react";
import { FiSearch } from "react-icons/fi";
import Dialog from "../ConfirmDialog";
import SuccessDialog from "../SuccessDialog";
import slugify from "slugify";
import slugifyOption from "../../ulitilities/slugifyOption";
const FilmModal = ({ isOpen, onClose, film, onSave, mode }) => {
  if (!isOpen) return null;
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Cập nhật nội dung phim" : "Thêm mới phim";

  const [queryTagText, setQueryTagText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filmTags, setFilmTags] = useState([]);

  const [ageResData, setAgeResData] = useState([]);

  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });

  /////////////////////////fetch tags and ageRes///////////////////////////
  const fetchAgeRes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/param/age-restriction-symbol"
      );
      setAgeResData(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFilmTags = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tags");
      setFilmTags(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchFilmTags();
    fetchAgeRes();
  }, []);
  /////////////////////////fetch tags and ageRes///////////////////////////
  const filteredTags =
    queryTagText === ""
      ? filmTags
      : filmTags.filter((tag) =>
          slugify(tag.name, slugifyOption).includes(
            slugify(queryTagText),
            slugifyOption
          )
        );
  const handleTagSelection = (tag) => {
    if (!selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  //console.log(`Input Changed: Name=${selectedTags}`);
  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag._id !== tagToRemove._id));
  };
  useEffect(() => {
    const tagIds = selectedTags.map((tag) => tag._id);
    setFormData((prevData) => ({
      ...prevData,
      tagsRef: tagIds,
    }));
  }, [selectedTags]);
  const initTagChoices = (tagIDs) => {
    // For each tagID in tagIDs, check if it exists in filmTags
    tagIDs.forEach((tagID) => {
      const tagExists = filmTags.some((filmTag) => filmTag._id === tagID);
      if (tagExists) {
        // Perform the action if the tag exists
        setSelectedTags(...selectedTags, tagExists);
      }
    });
  };
  const initAgeChoice = (ageSymbol) => {
    const age = ageResData.find((ageItem) => ageItem === ageSymbol);
    console.log("HO");
    return age;
  };

  const [formData, setFormData] = useState({
    _id: film?._id || "",
    name: film?.name || "",
    trailerURL: film?.trailerURL || "",
    thumbnailURL: film?.thumbnailURL || "",
    tagsRef: film?.tagsRef || [],
    filmDuration: film?.filmDuration || "",
    ageRestriction: film?.ageRestriction || "",
    voice: film?.voice || "",
    originatedCountry: film?.originatedCountry || "",
    twoDthreeD: film?.twoDthreeD || "",
    filmDescription: film?.filmDescription || "",
    filmContent: film?.filmContent || "",
    beginDate: film?.beginDate || "",
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    console.log("Film value: " + JSON.stringify(film));
    initAgeChoice(film.ageRestriction);
    initTagChoices(film.tagsRef);
  }, [film]);
  const isFormValid = useMemo(() => {
    const requiredFields = [
      "name",
      "trailerURL",
      "thumbnailURL",
      "tagsRef",
      "filmDuration",
      "ageRestriction",
      "voice",
      "originatedCountry",
      "twoDthreeD",
      "filmDescription",
      "filmContent",
      "beginDate",
    ];
    console.log("Form data : " + JSON.stringify(formData));

    return requiredFields.every((field) => !!formData[field]); // Chuyển đổi giá trị thành Boolean
  }, [formData]);

  const handleSubmit = () => {
    setIsConfirmDialogOpen(true);
    if (mode === "edit") {
      setDialogData({
        title: "Xác nhận cập nhật thông tin phim",
        message: "Cập nhật thông tin phim?",
      });
    } else {
      setDialogData({
        title: "Xác nhận thêm mới phim",
        message: "Thêm mới phim?",
      });
    }
  };

  const handleFilm = async () => {
    setIsLoading(true);
    try {
      //console.log(`data nè heheh:${data.otherDescription} `);

      // Gọi API tùy thuộc vào mode
      if (mode === "edit") {
        await axios.put(
          `http://localhost:8000/api/films/${film._id}`,
          formData
        );
        setDialogData({
          title: "Successs",
          message: "Cập nhật phim thành công",
        });
      } else {
        await axios.post("http://localhost:8000/api/films", formData);
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
                  value={formData.selectedTags}
                  onChange={handleTagSelection}
                >
                  <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus-within:ring-2 focus-within:ring-blue-500">
                      <Combobox.Input
                        name="type"
                        //value={formData.type.join(", ")}
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
                        onChange={(event) =>
                          setQueryTagText(event.target.value)
                        }
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
                      {filteredTags.length === 0 && queryTagText !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Không tìm thấy kết quả
                        </div>
                      ) : (
                        filteredTags.map((tag) => (
                          <Combobox.Option
                            key={tag._id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                            value={tag}
                          >
                            {({ selected, active }) => (
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {tag.name}
                              </span>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag._id}
                      className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag(tag)}
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
                  value={formData.ageRes || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ageRestriction: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Vui lòng chọn độ tuổi
                  </option>
                  {ageResData.map((ageRes, index) => (
                    <option key={index} value={ageRes}>
                      {`${ageRes}`}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khởi chiếu
                </label>
                <input
                  type="date"
                  name="beginDate"
                  value={formData.beginDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, voice: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              Mô tả phim
            </label>
            <textarea
              name="filmDescription"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">
              Nội dung phim
            </label>
            <textarea
              name="filmContent"
              value={formData.filmContent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  filmContent: e.target.value,
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
