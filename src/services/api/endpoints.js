export const API_ENDPOINTS = {
  auth: {
    firebase: "/auth/firebase",
    me: "/auth/me",
  },
  users: {
    list: "/users",
    staff: "/users/staff",
    byId: (id) => `/users/${id}`,
    status: (id) => `/users/${id}/status`,
    admin: (id) => `/users/${id}/admin`,
  },
  issues: {
    public: "/issues/public",
    publicById: (id) => `/issues/public/${id}`,
    list: "/issues",
    byId: (id) => `/issues/${id}`,
    upvote: (id) => `/issues/${id}/upvote`,
  },
};
