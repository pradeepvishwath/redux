import axios from "axios";

export const API_URL =
  "https://64d60e47754d3e0f13618812.mockapi.io/form/Usestate/";

export const getUser = async (id) => {
  try {
    const response = await axios.get(API_URL + id);

    return response;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateuser = async (id, userData) => {
  try {
    const response = await axios.put(API_URL + id, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(API_URL + id, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(API_URL + id);
    return response;
  } catch (error) {
    throw error;
  }
};


