// config/clientAxios.js
import axios from "axios";

// ⚡ Usar variable de entorno para la URL del backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const clientAxios = axios.create({
  baseURL: `${API_URL}/api`,
});

// 🔑 Interceptor para agregar el token automáticamente
clientAxios.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) {
          // Agregar el token al header Authorization
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error al parsear userData:", error);
      }
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
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
