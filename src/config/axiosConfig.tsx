import axios from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const getToken = () => {
  return localStorage.getItem("access_token");
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp! < currentTime;
  } catch (error) {
    return true;
  }
};

const logout = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (isTokenExpired(token)) {
        logout();
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;