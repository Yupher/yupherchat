import axios from "axios";
const endpoint = import.meta.env.VITE_ENDPOINT || "http://localhost:5000";
const API_URL = `${endpoint}/api/users`;

const search = async (querry, token) => {
  let res = await axios.get(`${API_URL}?search=${querry}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const chatService = { search };

export default chatService;
