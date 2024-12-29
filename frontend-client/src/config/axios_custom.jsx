import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const NO_RETRY_HEADER = "x-no-retry";

instance.interceptors.request.use(
  function (config) {
    if (
      window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("accessToken")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("accessToken");
    }

    if (!config.headers.Accept && config.headers["Content-Type"]) {
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    return error?.response?.data || Promise.reject(error);
  }
);
export default instance;
