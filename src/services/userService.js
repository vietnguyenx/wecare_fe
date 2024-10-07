// src/services/userService.js
const API_URL = "https://localhost:7999/api/user";

export const fetchAllUsers = async (limit = 10, sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?limit=${limit}&sort=${sort}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
