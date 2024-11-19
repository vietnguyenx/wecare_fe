const API_URL = "https://midge-noted-tuna.ngrok-free.app/api/user";

export const fetchAllUsers = async (limit = 10, sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?limit=${limit}&sort=${sort}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const fetchAllUsers2 = async (sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?sort=${sort}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
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
      "ngrok-skip-browser-warning": "true",
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
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
};
