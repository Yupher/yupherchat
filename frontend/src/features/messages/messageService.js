import axios from "axios";

const API_URL = "https://localhost:5000/api/message";

const send = async (message, token) => {
  let res = await axios.post(API_URL, message, {
    headers: { Authorization: `Bearer: ${token}` },
  });
  return res.data;
};
const getAll = async (chatId, token) => {
  let res = await axios.get(`${API_URL}/${chatId}`, {
    headers: { Authorization: `Bearer: ${token}` },
  });
  return res.data;
};

const messageService = { send, getAll };

export default messageService;
