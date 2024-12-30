export const getDayAndMonthFromISOString = (isoString) => {
  const date = new Date(isoString);
  const day = date.getDate(); // Lấy ngày (1 - 31)
  const month = date.getMonth() + 1; // Lấy tháng (1 - 12)

  // Trả về ngày và tháng theo định dạng "DD-MM"
  return `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}`;
};

export const getDayOfWeekFromISOString = (isoString) => {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];

  const date = new Date(isoString);
  const dayOfWeek = date.getDay(); // Lấy số thứ tự ngày trong tuần (0 - 6)

  // Trả về tên ngày trong tuần
  return days[dayOfWeek];
};
