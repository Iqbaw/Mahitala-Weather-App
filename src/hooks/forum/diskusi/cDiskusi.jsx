import { API_URL } from "../../../utils/Constants";
import { API_STATIC } from "../../../utils/Constants";
import axiosInstance from "../../../utils/axiosInstance";

export const createDiskusi = async (data) => {
  try {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("id_kategori", data.id_kategori);
    formData.append("isi", data.isi);
    if (data.gambar) {
      formData.append("gambar", data.gambar);
    }

    const res = await axiosInstance.post(`${API_URL}/api/forum/diskusi`, formData, {
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDiskusi = async (id) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/api/forum/diskusi/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getDetailDiskusi = async (id) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi/${id}`);
    const data = res.data;
    const dateObj = new Date(data.tgl_dibuat);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    data.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
    data.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

    if (data.gambar) {
      data.gambar = `${API_STATIC}${data.gambar}`;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const balasDiskusi = async (id_diskusi, id_interact, id_reply, isi) => {
  try {
    const res = await axiosInstance.post(
      `${API_URL}/api/forum/diskusi/reply`,
      {
        id_diskusi,
        id_interact,
        id_reply,
        isi
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMainReply = async (id) => {
  try {
    const res = await axiosInstance.delete(
      `${API_URL}/api/forum/diskusi/reply/firstIn/${id}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubReply = async (id) => {
  try {
    const res = await axiosInstance.delete(`${API_URL}/api/forum/diskusi/reply/secIn/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};
