import axios from "axios";
import apiClient from "app/hooks/apiClient";
import { API_BASE_URL } from "app/utils/constant";

const AUTH_URL = `${API_BASE_URL}/auth`;


// Get CSRF token from cookie
const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

  return cookieValue;
};


// Forgot Password API
export const forgotPassword = async (email) => {

  const { data } = await axios.post(
    `${AUTH_URL}/forget-password/`,
    {
      email
    },
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
        "Content-Type": "application/json"
      },
      withCredentials: true
    }
  );

  return data;
};


// Register User API
export const registerUser = async (payload) => {

  const { data } = await apiClient.post(
    `${AUTH_URL}/register/`,
    payload
  );

  return data;
};


// Update User Profile
export const updateUserProfile = async (payload) => {

  const { data } = await apiClient.put(
    `${AUTH_URL}/profile/`,
    payload
  );

  return data;
};