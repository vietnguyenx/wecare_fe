// src/services/userService.js
const API_URL = "https://wecareexe201.azurewebsites.net/api/user";

export const fetchAllUsers = async (limit = 10, sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?limit=${limit}&sort=${sort}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json(); 
};

export const fetchAllUsers2 = async (sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?sort=${sort}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), 
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/delete?id=${id}`, {
    method: "PUT", // Đảm bảo phương thức là PUT
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json(); // Trả về kết quả từ API
};
