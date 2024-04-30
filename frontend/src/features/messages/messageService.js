import axios from "axios";
const VITE_ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:5000";
const API_URL = `${VITE_ENDPOINT}/api/message`;

const send = async (message) => {
  let res = await axios.post(API_URL, message);
  return res.data;
};
const getAll = async (chatId, token) => {
  let res = await axios.get(`${API_URL}/${chatId}`);
  return res.data;
};

const messageService = { send, getAll };

export default messageService;
