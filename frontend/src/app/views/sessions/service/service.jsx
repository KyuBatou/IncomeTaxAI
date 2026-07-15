import apiClient from "app/hooks/apiClient";
import { BASE_URL } from "app/utils/constant";

export const forgotPassword = async (email) => {
  const { data } = await apiClient.post(
    `${BASE_URL}/auth/forget-password/`,
    {
      email,
    }
  );

  return data;
};