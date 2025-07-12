const API_BASE_URL = "http://localhost:5001/api";

export const authAPI = {
  signup: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getRankings: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/rankings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getTournaments: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
