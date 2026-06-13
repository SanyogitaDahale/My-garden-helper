import axios from "axios";

const BASE_URL = "http://my-garden-helper-backend.onrender.com";

// CUSTOMER
export const getAppointments = (userId) => {
  return axios.get(`${BASE_URL}/appointments/user/${userId}`);
};

// GARDENER
export const getGardenerAppointments = (gardenerId) => {
  return axios.get(`${BASE_URL}/appointments/gardener/${gardenerId}`);
};

// UPDATE STATUS
export const updateAppointmentStatus = (id, status) => {
  return axios.put(`${BASE_URL}/appointments/${id}/status?status=${status}`);
};

export const deleteAppointment = (id) => {
  return axios.delete(`${BASE_URL}/appointments/${id}`);
};

// GET SINGLE APPOINTMENT BY ID
export const getAppointmentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/appointments/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw error;
  }
};

export const getCustomerAppointments =
(customerId) => {

  return axios.get(
    `${BASE_URL}/appointments/customer/${customerId}`,
    {
      auth: {
        username: "user",
        password: "Sanyogita#123"
      }
    }
  );

  };
// ADMIN

export const getAllAppointments = () => {

  return axios.get(
    `${BASE_URL}/appointments/all`
  );

};

// ASSIGN GARDENER

export const assignGardener = (

  appointmentId,
  gardenerId

) => {

  return axios.put(

    `${BASE_URL}/appointments/${appointmentId}/assign/${gardenerId}`

  );

};