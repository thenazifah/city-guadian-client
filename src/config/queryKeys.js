export const queryKeys = {
  issues: {
    publicResolved: (limit = 6) => ["issues", "public", "resolved", limit],
    publicAll: (limit = 50) => ["issues", "public", "all", limit],
  },
};
