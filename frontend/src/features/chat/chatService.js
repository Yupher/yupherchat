import axios from "axios";

const API_URL = "https://localhost:5000/api/chat";
const getChats = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
const accessChat = async (userId, token) => {
  const res = await axios.post(
    API_URL,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};
const createGroup = async (groupData, token) => {
  const res = await axios.post(`${API_URL}/group`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
const renameGroup = async (groupData, token) => {
  const res = await axios.put(`${API_URL}/rename`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const addToGroup = async (groupData, token) => {
  const res = await axios.put(`${API_URL}/groupadd`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
const deleteFromGroup = async (groupData, token) => {
  const res = await axios.put(`${API_URL}/groupremove`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
const deleteGroup = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
const chatService = {
  getChats,
  accessChat,
  createGroup,
  renameGroup,
  addToGroup,
  deleteFromGroup,
  deleteGroup,
};

export default chatService;
