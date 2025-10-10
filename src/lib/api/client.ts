import axios from "axios";
import { API_BASE_URL } from "../../../config";

/**
 * Instancia axios con baseURL y un interceptor que añade
 * Authorization: Token <token> desde localStorage en cada petición.
 *
 * Además maneja 401 limpiando token y redirigiendo al login.
 */

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000, // opcional
});

client.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      // Usas "Token " en tu logout, así que mantenemos el mismo prefijo.
      config.headers.Authorization = `Token ${token}`;
    }
  } catch (e) {
    // ignore
    console.warn("No se pudo leer token en interceptor:", e);
  }
  return config;
});

/**
 * Manejo de respuestas: si recibimos 401, limpiamos token y redirigimos a /auth/login
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("token");
      } catch (e) {
        // ignore
      }
      // Redirigir al login (fuera de componentes Next.js usamos location)
      if (typeof window !== "undefined") {
        window.location.assign("/auth/login");
      }
    }
    return Promise.reject(error);
  },
);

export default client;