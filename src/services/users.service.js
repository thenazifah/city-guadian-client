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

  async listAll() {
    const { data } = await apiClient.get(API_ENDPOINTS.users.list);
    return data.data;
  },

  async createStaff(payload) {
    const { data } = await apiClient.post(API_ENDPOINTS.users.staff, payload);
    return data.data;
  },

  async updateStaff(userId, payload) {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.users.admin(userId),
      payload
    );
    return data.data;
  },

  async updateCitizenStatus(userId, isActive) {
    const { data } = await apiClient.patch(API_ENDPOINTS.users.status(userId), {
      isActive,
    });
    return data.data;
  },

  async deleteStaff(userId) {
    const { data } = await apiClient.delete(API_ENDPOINTS.users.byId(userId));
    return data.data;
  },
};
