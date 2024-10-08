const API_URL = "https://wecareexe201.azurewebsites.net/api/dietitian";

export const fetchAllDietitians = async (limit = 10, sort = "desc") => {
  const response = await fetch(`${API_URL}/get-all?limit=${limit}&sort=${sort}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};