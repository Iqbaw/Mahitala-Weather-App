import axiosInstance from "../../utils/axiosInstance";

export const getDataFieldByUserID = async () => {
  try {
    const res = await axiosInstance.post(`/api/fields`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDataFieldById = async ({ id }) => {
  try {
    const res = await axiosInstance.get(`/api/field/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const createDataField = async (data) => {
  try {
    const res = await axiosInstance.post(`/api/field/create`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteDataField = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/field/delete`, {
      data: { id },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateDataField = async (data) => {
  try {
    const res = await axiosInstance.put(`/api/field/update`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

