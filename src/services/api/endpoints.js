export const API_ENDPOINTS = {
  auth: {
    firebase: "/auth/firebase",
    me: "/auth/me",
  },
  issues: {
    public: "/issues/public",
    list: "/issues",
    byId: (id) => `/issues/${id}`,
  },
};
