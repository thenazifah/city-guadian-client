export const API_ENDPOINTS = {
  auth: {
    firebase: "/auth/firebase",
    me: "/auth/me",
  },
  users: {
    byId: (id) => `/users/${id}`,
  },
  issues: {
    public: "/issues/public",
    publicById: (id) => `/issues/public/${id}`,
    list: "/issues",
    byId: (id) => `/issues/${id}`,
    upvote:  (id) => `/issues/${id}/upvote`,
  },
};
