import axios from "axios";
import { BASE_URL } from "app/utils/constant";

const API_URL_CONTENT = `${BASE_URL}/content/`;

export const fetchContentDetail = async (slug) => {
  const { data } = await axios.get(`${API_URL_CONTENT}${slug}/`);
  return data;
};