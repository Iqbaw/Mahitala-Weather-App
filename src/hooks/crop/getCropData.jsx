import axiosInstance from "../../utils/axiosInstance";

export const getCropData = async () => {
    try {
        const res = await axiosInstance.get(`/api/crops`);
        return res.data;
    } catch (error) {
        return error;
    }
}

export const getCropDataById = async (id) => {
    try {
        const res = await axiosInstance.get(`/api/crop/${id}`);
        return res.data;
    } catch (error) {
        return error;
    }
}
