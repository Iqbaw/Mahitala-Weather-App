import axiosInstance from "../../utils/axiosInstance";

export const getForecastMingguan = async ({ location }) => {
  const { latitude, longitude } = location;
  try {
    const res = await axiosInstance.get(`/api/cuaca/weekly`, {
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
