import * as SecureStore from "expo-secure-store";
import axiosClient from "./axios";

const TOKEN_KEY = "API_TOKEN";
const USER_KEY = "USER_DATA";

// Login function
export async function loginUser(
  email: string,
  password: string,
  companyCode: string
) {
  const res = await axiosClient.post("/login", {
    login: email,
    password,
    companyCode,
  });

  const { token, user } = res.data; // adjust if API returns differently

  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
  if (user) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  }

  return { token, user };
}

// Logout user
export async function logoutUser() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

// Get stored token
export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// Get stored user
export async function getStoredUser(): Promise<any | null> {
  const userData = await SecureStore.getItemAsync(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}
