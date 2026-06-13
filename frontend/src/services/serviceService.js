import axios from "axios";

const BASE_URL = "http://my-garden-helper-backend.onrender.com";

export const getServices = () => {
  return axios.get(`${BASE_URL}/services`);
};

export const addService = (data) => {
  return axios.post(`${BASE_URL}/services`, data);
};

export const updateService = (id, data) => {
  return axios.put(`${BASE_URL}/services/${id}`, data);
};

export const deleteService = (id) => {
  return axios.delete(`${BASE_URL}/services/${id}`);
};