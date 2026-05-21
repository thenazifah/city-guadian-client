import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const authService = {
  async exchangeFirebaseToken(idToken) {
    const { data } = await apiClient.post(API_ENDPOINTS.auth.firebase, {
      idToken,
    });
    return data.data;
  },

  async getMe() {
    const { data } = await apiClient.get(API_ENDPOINTS.auth.me);
    return data.data;
  },
};
