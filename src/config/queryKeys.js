export const queryKeys = {
  issues: {
    publicResolved: (limit) => ["issues", "public", "resolved", limit],
    publicAll: (limit) => ["issues", "public", "all", limit],
    detail: (id) => ["issues", "detail", id],
    myList: () => ["issues", "my"],
    staffAssigned: () => ["issues", "staff", "assigned"],
    adminAll: () => ["issues", "admin", "all"],
  },
  users: {
    profile: (id) => ["users", id],
    all: () => ["users", "all"],
  },
};
