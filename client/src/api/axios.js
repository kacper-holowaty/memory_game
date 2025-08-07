import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

export const setupInterceptors = (getState) => {
  api.interceptors.request.use(
    (config) => {
      const { token } = getState();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default api;