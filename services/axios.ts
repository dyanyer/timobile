import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

axios.defaults.withCredentials = true;

export const DOMAIN =
  process.env.EXPO_PUBLIC_API_URL || "https://bluelight.timora.ph";
console.log(`API Domain: ${DOMAIN}`);

const axiosClient = axios.create({
  baseURL: `${DOMAIN}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token before each request
axiosClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("API_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses & errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response) {
      if (error.response.status === 401) {
        await SecureStore.deleteItemAsync("API_TOKEN");
        router.replace("/login"); // Redirect to login on expired session
      }

      return Promise.reject({
        status: error.response.status,
        message:
          (error.response.data as any)?.message || "Something went wrong",
      });
    }

    if (error.request) {
      return Promise.reject({ message: "No response from server" });
    }

    return Promise.reject({ message: error.message });
  }
);

export default axiosClient;
