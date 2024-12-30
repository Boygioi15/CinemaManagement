import axios from "./axios_custom";

export const callLogin = async (data) => {
  return axios.post("/auth/sign-in", { ...data });
};

export const callSignUp = async (data) => {
  return axios.post("/auth/sign-up", { ...data });
};

export const callAccount = async () => {
  return axios.get("/auth/account");
};

export const callSignOut = async (data) => {
  return axios.get("/auth/sign-out", { ...data });
};

export const updateUser = async (id, updateData) => {
  return axios.put(`/user/${id}`, { ...updateData });
};

export const changePasword = async (id, updateData) => {
  return axios.post(`/user/change-password/${id}`, { ...updateData });
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
