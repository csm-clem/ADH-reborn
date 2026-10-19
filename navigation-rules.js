/** UX contract: one clear next action; Branch → Path → Chapter → Activity. No pedagogical locks. */
export const NAVIGATION_RULES = Object.freeze({
  reviewAfterMs: 24 * 60 * 60 * 1000,
  branches: Object.freeze(["beginner", "guided", "targeted"]),
});
export const branchForRoute = (route) =>
  route === "beginner"
    ? "beginner"
    : route === "guided"
      ? "guided"
      : "targeted";
export function reviewRecommendation(catalog, data, route, now = Date.now()) {
  const scopes = route === "guided" ? ["z1", "cs1", "cs2"] : [route];
  const attempts = (data.attempts || []).filter(
    (a) =>
      a.finished &&
      catalog.activities.some(
        (m) => m.id === a.activity && scopes.includes(m.scopeId),
      ),
  );
  const last = attempts.at(-1);
  if (!last) return null;
  const resolved =
    last &&
    data.attempts.some(
      (a) =>
        a.at > last.at &&
        a.passed &&
        a.activity.startsWith("review") &&
        a.comparisonKey?.includes(":" + last.activity + ":"),
    );
  if (last.passed === false && !resolved && last.events.some((e) => !e.correct))
    return {
      activity: last.activity,
      kind: "errors",
      text: "Reprenons les notes qui vous ont posé problème.",
      source: last,
    };
  const valid = attempts.filter((a) => a.passed).at(-1);
  if (valid && now - last.at >= NAVIGATION_RULES.reviewAfterMs)
    return {
      activity: valid.activity,
      kind: "return",
      text: "Après cette pause, retrouvons vos repères.",
    };
  return null;
}
