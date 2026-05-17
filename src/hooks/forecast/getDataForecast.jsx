import axiosInstance from "../../utils/axiosInstance";

export const getDataForecast = async ({ location }) => {
  const { latitude, longitude } = location;
  
  try {
    const res = await axiosInstance.get(`/api/cuaca/forecast`, {
      params: {
        latitude,
        longitude,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getNowForecast = async ({ location }) => {
  const { latitude, longitude } = location;

  try {
    const res = await axiosInstance.get(`/api/cuaca/now`, {
      params: {
        latitude,
        longitude,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

