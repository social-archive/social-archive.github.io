import { test } from "node:test";
import { deepEqual, equal, throws } from "node:assert/strict";
import { validateItems, safeUrl } from "./data.js";

const item = { id: "a", title: "테스트 리서치", category: "테스트", rank: 1, summary: "요약", content: "브리핑", rationale: "근거", ranking_basis: "기준", published_at: "2026-11-06T00:00:00Z", sources: [{ title: "출처", url: "https://example.com" }] };
test("workflow rank is preserved without changing input", () => {
  const input = [{ ...item, id: "b", rank: 2 }, item];
  deepEqual(validateItems(input).map(row => row.id), ["a", "b"]);
  equal(input[0].rank, 2);
  deepEqual(validateItems([]), []);
});
test("reject malformed or unsafe workflow results", () => {
  for (const input of [null, {}, [item, item], [{ ...item, rank: 0 }], [{ ...item, sources: [{ title: "bad", url: "javascript:alert(1)" }] }], [{ ...item, published_at: "bad" }]]) throws(() => validateItems(input));
  for (const url of ["javascript:alert(1)", "data:text/html,test", "https://user:password@example.com", "/relative"]) equal(safeUrl(url), null);
});
