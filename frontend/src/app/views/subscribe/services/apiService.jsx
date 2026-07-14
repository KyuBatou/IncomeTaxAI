import apiClient from "app/hooks/apiClient";
import { BASE_URL } from "app/utils/constant";

const AUTH_API = `${BASE_URL}/auth/user/`;
const API_URL = `${BASE_URL}/`;

export const fetchUserDetail = async (email) => {
  try {
    const { data } = await apiClient.get(`${AUTH_API}${email}/`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("User not found, redirecting to signup...");
    }
    throw error;
  }
};

export const fetchSalesmans = async () => {
  const { data } = await apiClient.get(`${API_URL}salesmen/`);
  return data;
};

export const fetchSubscriptionPlans = async () => {
  const { data } = await apiClient.get(`${API_URL}plans/`);
  return data;
};

export const postCreateOrder = async (userDetails) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/api/create-order/`,
    userDetails
  );
  return data;
};

export const postVerifyPayment = async (response) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/api/verify-payment/`,
    response
  );
  return data;
};

export const postDiscountCoupon = async (response) => {
  const { data } = await apiClient.post(
    `${API_URL}validate-coupon/`,
    response
  );
  return data;
};

export const postCreatePaytmTransaction = async (userDetails) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/api/create-paytm-order/`,
    userDetails
  );
  return data;
};

export const postVerifyPaytmPayment = async (response) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/api/verify-paytm-payment/`,
    response
  );
  return data;
};

export default fetchUserDetail;