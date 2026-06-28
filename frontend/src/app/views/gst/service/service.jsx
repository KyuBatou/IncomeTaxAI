import axios from "axios";
import { BASE_URL } from "app/utils/constant";

const API_URL = `${BASE_URL}/api/sessions/`;

export const getSessions = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createSession = async () => {
  const payload = {
    title: "New Chat",
    session_token: crypto.randomUUID(),
    category: 1,
    metadata: {}
  };

  const { data } = await axios.post(API_URL, payload);
  return data;
};

export const deleteSession = async (id) => {
  await axios.delete(`${API_URL}${id}/`);
};

export const getSessionMessages = async (sessionId) => {
  const res = await fetch(
    `${BASE_URL}/sessions/${sessionId}/messages/`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
};

import apiClient from "app/hooks/apiClient";

export const sendChatMessage = async (payload) => {
  const formData = new FormData();

  formData.append("main_content", payload.message);
  formData.append("session_id", payload.sessionId);
  formData.append("model", payload.model);

  payload.files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await apiClient.post(`${BASE_URL}/chat/gpt/`, formData);

  return data;
};