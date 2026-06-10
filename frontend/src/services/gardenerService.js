import axios from "axios";

const BASE_URL = "http://localhost:8081";

// ======================
// GET ALL GARDENERS
// ======================

export const getGardeners = () => {

  return axios.get(
    `${BASE_URL}/api/gardeners`
  );

};

// ======================
// ADD GARDENER
// ======================

export const addGardener = (data) => {

  return axios.post(
    `${BASE_URL}/api/gardeners`,
    data
  );

};

// ======================
// UPDATE GARDENER
// ======================

export const updateGardener = (id, data) => {

  return axios.put(
    `${BASE_URL}/api/gardeners/${id}`,
    data
  );

};

// ======================
// DELETE GARDENER
// ======================

export const deleteGardener = (id) => {

  return axios.delete(
    `${BASE_URL}/api/gardeners/${id}`
  );

};