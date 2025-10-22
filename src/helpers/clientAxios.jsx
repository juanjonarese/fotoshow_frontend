import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const clientAxios = axios.create({
  baseURL: `${API_URL}/api`,
});

// 🔑 Interceptor para agregar el token automáticamente
clientAxios.interceptors.request.use(
  (config) => {
    // 🔥 CORRECCIÓN: Obtener el token directamente
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 Interceptor para manejar errores 401
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
