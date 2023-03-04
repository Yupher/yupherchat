import axios from "axios";

const API_URL = "https://localhost:5000/api/users";

const register = async (userData) => {
  let res = await axios.post(API_URL, userData);
  //console.log(res);
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const login = async (userData) => {
  let res = await axios.post(`${API_URL}/login`, userData);
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const logout = async () => {
  localStorage.removeItem("user");
  await axios.get(`${API_URL}/logout`);
};
const authService = {
  register,
  login,
  logout,
};
export default authService;
