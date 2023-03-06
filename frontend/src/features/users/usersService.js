import axios from "axios";

const API_URL = "https://localhost:5000/api/users";

const search = async (querry, token) => {
  let res = await axios.get(`${API_URL}?search=${querry}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const chatService = { search };

export default chatService;
