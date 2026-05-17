import { API_URL } from "../../utils/Constants";
import { API_STATIC } from "../../utils/Constants";
import axiosInstance from "../../utils/axiosInstance";

export const getForumTeratas = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/top-diskusi`);
    res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getForumSaya = async () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || !user.token) {
    return '401';
  }

  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi-saya`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }

      return item; 
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export const getForumTerbaru = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi-terbaru`);
    res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    }); 
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getForumTerakhir = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi-terakhir`);

    const data = res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }

      return item; 
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export const getForumKategori = async (id) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi-kategori/${id}`);
    res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export const getSearchForum = async (search) => {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/forum/diskusi-search/${search}`);
    res.data.map((item) => {
      const dateObj = new Date(item.tgl_dibuat);
      const options = { day: "2-digit", month: "long", year: "numeric" };
      item.tanggal = new Intl.DateTimeFormat("id-ID", options).format(dateObj);
      item.waktu = dateObj.toISOString().split("T")[1].split(".")[0];

      if (item.gambar) {
        item.gambar = `${API_STATIC}${item.gambar}`;
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}