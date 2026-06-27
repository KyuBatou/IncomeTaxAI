import axios from "axios";

const API_URL = "http://127.0.0.1:8000/ai/api/sessions/";
const BASE_URL = "http://127.0.0.1:8000/ai";

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