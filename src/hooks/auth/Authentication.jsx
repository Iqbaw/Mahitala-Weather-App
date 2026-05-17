import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../utils/Constants";


export const checkUser = async () => {
  try {
    const res = await axiosInstance.post("/api/auth/check");
    return res.data;
  } catch (error) {
    return error.response ? error.response.data : { message: "Unknown error" };
  }
}

export const loginAuth = async (data) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", data);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return res;
  } catch (error) {
    return error.response ? error.response.data : { message: "Unknown error" };
  }
};

export const registerAuth = async (data) => {
  try {
    const res = await axios.post(API_URL + "/api/auth/register", data);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return res;
  } catch (error) {
    return error.response ? error.response.data : { message: "Unknown error" };
  }
};

export const logoutAuth = () => {
  localStorage.removeItem("token");
};
