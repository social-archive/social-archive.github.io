export function validateItems(items) {
  if (!Array.isArray(items) || items.length > 500) throw new Error("리서치 데이터 형식을 확인해 주세요.");
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id) ||
        typeof item.title !== "string" || !item.title.trim() ||
        typeof item.category !== "string" || !item.category.trim() ||
        !Number.isInteger(item.rank) || item.rank < 1 ||
        !["summary", "content", "rationale", "ranking_basis"].every(key => typeof item[key] === "string") ||
        !Number.isFinite(Date.parse(item.published_at)) ||
        !Array.isArray(item.sources) || !item.sources.every(source => typeof source?.title === "string" && safeUrl(source.url))) {
      throw new Error("리서치 데이터 형식을 확인해 주세요.");
    }
    ids.add(item.id);
  }
  return [...items].sort((a, b) => a.rank - b.rank || Date.parse(b.published_at) - Date.parse(a.published_at));
}

export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
