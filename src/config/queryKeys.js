export const queryKeys = {
  issues: {
    publicResolved: (limit = 6) => ["issues", "public", "resolved", limit],
  },
};
