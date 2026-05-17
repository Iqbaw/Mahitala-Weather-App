import axiosInstance from "../../utils/axiosInstance";

export const getRekomendasiTanaman = async ({ label }) => {
  try {
    const res = await axiosInstance.get(`/api/crop/recommendation`, {
      params: {
        label,
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
  }
};
