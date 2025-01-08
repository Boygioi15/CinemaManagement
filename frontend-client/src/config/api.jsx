import axios from "./axios_custom";

export const callLogin = async (data) => {
  return axios.post("/auth/user/sign-in", { ...data });
};

export const callSignUp = async (data) => {
  return axios.post("/auth/user/sign-up", { ...data });
};

export const callAccount = async () => {
  return axios.get("/auth/user/account");
};

export const callSignOut = async (data) => {
  return axios.get("/auth/user/sign-out", { ...data });
};

export const updateUser = async (id, updateData) => {
  return axios.put(`/user/user/${id}`, { ...updateData });
};

export const changePasword = async (id, updateData) => {
  return axios.post(`/user/user/change-password/${id}`, { ...updateData });
};

export const getShowingFilms = async () => {
  return await axios.get(`film-show/showing`);
};

export const getUpcommingFilms = async () => {
  return await axios.get(`film-show/upcoming`);
};

export const searchFilm = async ({ keyword, page = 1, limit = 2 }) => {
  return await axios.post(`films/searchFilm`, {
    keyword,
    page,
    limit,
  });
};

export const getShowTimeOfDateByFilmId = async (filmId) => {
  return await axios.get(`film-show/getByDate`, {
    params: {
      filmId,
    },
  });
};

export const getAvailableShowDate = async (filmId) => {
  return await axios.get(`film-show/get-available/showDate`);
};

export const getAvailableFilmByDate = async ({
  date,
  filmId,
  page,
  limit = 1000,
}) => {
  return await axios.post(`film-show/get-film-available-by-date`, {
    date,
    filmId,
    page,
    limit,
  });
};

export const getAllFilms = async () => {
  return await axios.get(`/films`);
};

export const getAllFoods = async () => {
  return await axios.get(`/additional-items`);
};

export const resetPassword = async (email) => {
  return await axios.post(`/email/send-reset-password`, { userEmail: email });
};

export const createPayment = async ({
  totalPrice,
  filmShowId = null,
  seatSelections = null,
  promotionIDs = null,
  ticketSelections = null,
  additionalItemSelections = null,
  pointUsage = null,
}) => {
  return await axios.post(`/payment`, {
    totalPrice,
    filmShowId,
    seatSelections,
    promotionIDs,
    ticketSelections,
    additionalItemSelections,
    pointUsage,
  });
};

export const createPromotion = async (formData) => {
  return await axios.post(`/promotion`, { ...formData });
};
export const getCurrentPro = async (date) => {
  return await axios.get(`/promotion`, { params: { date } });
};
export const updatePro = async (id) => {
  return await axios.patch(`/promotion/${id}`);
};
export const deletePro = async (id) => {
  return await axios.delete(`/promotion/${id}`);
};

export const getProById = async (id) => {
  return await axios.get(`/promotion/${id}`);
};

export const getAllOrderByUserId = async () => {
  return await axios.get(`/orders/all-order-by-userId`);
};

export const getAllPromotion = async () => {
  return await axios.get(`/promotion/active`);
};

// point

export const getCurrentPoint = async () => {
  return await axios.get(`/loyalpoint`);
};

export const getParam = async () => {
  return await axios.get(`/param`);
};
