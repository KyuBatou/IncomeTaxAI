import axios from "axios";
import { BASE_URL } from "app/utils/constant";

const API_URL = `${BASE_URL}/api/sessions/`;

export const getSessions = async () => {
  const { data } = await axios.get(`${API_URL}?model_type=draft_assistant`);
  return data;
};

export const createSession = async () => {
  const payload = {
    title: "New Chat",
    model_type: "draft_assistant",
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
  let url = `${BASE_URL}/chat/draft-assistant/gpt/`;

  formData.append("main_content", payload.message);
  formData.append("session_id", payload.sessionId);
  formData.append("model", payload.model);

  payload.files.forEach((file) => {
    formData.append("files", file);
  });
  const { data } = await apiClient.post(url, formData);

  return data;
};
