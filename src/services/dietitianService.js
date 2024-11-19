const API_URL = "https://midge-noted-tuna.ngrok-free.app/api/dietitian";

export const fetchAllDietitians = async (limit = 10, sort = "desc") => {
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

export const createDietitian = async (dietitianData) => {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(dietitianData),
  });
  if (!response.ok) {
    throw new Error("Failed to create dietitian");
  }
  return response.json();
};

export const deleteDietitian = async (id) => {
  const response = await fetch(`${API_URL}/delete?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete dietitian");
  }
  return response.json();
};
