import { api, setToken } from "../apiClient.js";

export const authApi = {
  async register({ name, email, password }) {
    let data = await api.post("/auth/register", { name, email, password });
    setToken(data.token);
    return data;
  },
  async login({ email, password, rememberMe }) {
    let data = await api.post("/auth/login", { email, password, rememberMe });
    setToken(data.token);
    return data;
  },
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setToken(null);
    }
  },
  me: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
};
