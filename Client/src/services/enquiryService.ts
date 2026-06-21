import axiosClient from "@/lib/axiosClient";

export const sendEnquiry = (
    propertyId: string,
    message: string
) => {
    return axiosClient.post(`/enquiries/${propertyId}`, {
        message,
    });
};