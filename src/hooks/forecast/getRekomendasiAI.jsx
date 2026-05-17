import axiosInstance from "../../utils/axiosInstance";

export const getRekomendasiAI = async ({ location }) => {
  const { latitude, longitude } = location;
  try {
    const res = await axiosInstance.get(`/api/crop/predict`, {
      params: {
        latitude,
        longitude,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
