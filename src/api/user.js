import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function getAllUsers(userId) {
  return await axios.get(`${BASE_URL}/crm/v1/users/${userId}`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });
}
