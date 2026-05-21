import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const issuesService = {
  async getPublicResolved(limit = 6) {
    const { data } = await apiClient.get(API_ENDPOINTS.issues.public, {
      params: { status: "resolved", limit },
    });
    return data.data;
  },
};
