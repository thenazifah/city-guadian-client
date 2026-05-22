import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const usersService = {
  async updateProfile(userId, payload) {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.users.byId(userId),
      payload
    );
    return data.data;
  },
};
