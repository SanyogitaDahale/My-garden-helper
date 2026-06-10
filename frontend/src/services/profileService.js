import axios from "axios";

const BASE_URL = "http://localhost:8081/api";

// ================= GET PROFILE =================

export const getUserProfile = async (userId) => {

    return axios.get(
        `${BASE_URL}/users/${userId}`
    );
};

// ================= UPDATE PROFILE =================

export const updateUserProfile = async (userId, userData) => {

    return axios.put(
        `${BASE_URL}/users/${userId}`,
        userData
    );
};

// ================= CHANGE PASSWORD =================

export const updatePassword = async (userId, passwordData) => {

    return axios.put(
        `${BASE_URL}/users/${userId}/password`,
        passwordData
    );
};

// ================= UPLOAD AVATAR =================

export const uploadAvatar = async (userId, formData) => {

    return axios.post(
        `${BASE_URL}/users/${userId}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};