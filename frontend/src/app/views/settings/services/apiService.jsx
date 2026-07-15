import apiClient from "app/hooks/apiClient";

const API_URL_STATUTES = "auth/";

export const patchBasicSettings = async (data) => {
  const response = await apiClient.put(
    `${API_URL_STATUTES}basic/setting/`,
    data
  );

  return response.data;
};

export const updatePassword = async (data) => {
  const response = await apiClient.put(
    `${API_URL_STATUTES}change-password/`,
    data
  );

  return response.data;
};

export const fetchBasicSettings = async () => {
  const response = await apiClient.get(
    `${API_URL_STATUTES}basic/setting/`
  );

  return response.data;
};

export default fetchBasicSettings;