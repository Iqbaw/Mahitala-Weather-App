import axios from "axios";
import { API_URL } from "../../../utils/Constants";
import { API_STATIC } from "../../../utils/Constants";
import NonImage from "../../../assets/Images/nonimage.jpg";

export const getKategori = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/kategori/all`);
    res.data.map((item) => {
      if (!item.gambar) {
        item.gambar = `${NonImage}`;
      } else {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getKategoriById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/api/kategori/${id}`);
    res.data.gambar = res.data.gambar
      ? `${API_STATIC}${res.data.gambar}`
      : `${NonImage}`;
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getKategoriBest = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/kategori/best`);
    res.data.map((item) => {
      if (!item.gambar) {
        item.gambar = `${NonImage}`;
      } else {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
