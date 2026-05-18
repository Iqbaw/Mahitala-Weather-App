import axios from "axios";
import { API_URL } from "../utils/Constants";
import { auth } from "../utils/firebase";

const axiosInstance = axios.create({
  baseURL: API_URL
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.warn("Failed to get Firebase ID token:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
