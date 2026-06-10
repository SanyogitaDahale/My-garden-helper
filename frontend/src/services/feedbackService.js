import axios from "axios";

const BASE_URL="http://localhost:8081";

export const submitFeedback=(data)=>{
return axios.post(
`${BASE_URL}/feedback`,
data
);
};

export const getGardenerFeedback=(id)=>{
return axios.get(
`${BASE_URL}/feedback/gardener/${id}`
);
};

export const getAllFeedback=()=>{
return axios.get(
`${BASE_URL}/feedback`
);
};