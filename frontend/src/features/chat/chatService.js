import axios from "axios";

const VITE_ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:5000";
const API_URL = `${VITE_ENDPOINT}/api/chat`;
const getChats = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
const accessChat = async (userId) => {
  const res = await axios.post(API_URL, { userId });
  return res.data;
};
const createGroup = async (groupData) => {
  const res = await axios.post(`${API_URL}/group`, groupData);
  return res.data;
};
const renameGroup = async (groupData) => {
  const res = await axios.put(`${API_URL}/rename`, groupData);
  return res.data;
};

const addToGroup = async (groupData) => {
  const res = await axios.put(`${API_URL}/groupadd`, groupData);
  return res.data;
};
const deleteFromGroup = async (groupData) => {
  const res = await axios.put(`${API_URL}/groupremove`, groupData);
  return res.data;
};
const deleteGroup = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
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
