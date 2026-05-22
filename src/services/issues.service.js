import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const issuesService = {
  async getPublicResolved(limit = 6) {
    const { data } = await apiClient.get(API_ENDPOINTS.issues.public, {
      params: { status: "resolved", limit },
    });
    return data.data;
  },

  async getPublicAll(limit = 50) {
    const { data } = await apiClient.get(API_ENDPOINTS.issues.public, {
      params: { limit },
    });
    return data.data;
  },

  async getPublicDetails(id) {
    const { data } = await apiClient.get(API_ENDPOINTS.issues.publicById(id));
    return data.data;
  },

  async upvote(issueId) {
    const { data } = await apiClient.post(API_ENDPOINTS.issues.upvote(issueId));
    return data.data;
  },

  async updateByCitizen(id, payload) {
    const { data } = await apiClient.patch(API_ENDPOINTS.issues.byId(id), payload);
    return data.data;
  },

  async deleteIssue(id) {
    const { data } = await apiClient.delete(API_ENDPOINTS.issues.byId(id));
    return data.data;
  },
};
