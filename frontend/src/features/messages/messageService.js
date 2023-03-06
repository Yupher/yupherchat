import axios from "axios";

const API_URL = "https://localhost:5000/api/message";

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
