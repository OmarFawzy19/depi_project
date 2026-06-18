import axios from "axios";

export const sendEnquiry = (
    propertyId: string,
    message: string
) => {
    return axios.post(
        `/api/enquiries/${propertyId}`,
        { message }
    );
};