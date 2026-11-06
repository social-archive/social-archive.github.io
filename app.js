import { createClient } from "@supabase/supabase-js";
import { validateItems } from "./data.js";

const API = import.meta.env.VITE_API_BASE ?? "https://sarc.uaru-corn.ts.net/api/research";
const el = Object.fromEntries(["categories", "account", "logout", "heading", "metadata", "refresh", "notice", "login", "signin", "dashboard", "search", "list", "detail"].map(id => [id, document.getElementById(id)]));
let supabase, session, items = [], category = "", selected = "", request = 0;
const date = value => new Date(value).toLocaleString("ko-KR", { month:"numeric", day:"numeric", hour:"2-digit", minute:"2-digit" });
const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; };
function notice(message = "") { el.notice.textContent = message; el.notice.hidden = !message; }
function empty(title, body) { const box = node("div", undefined, "empty"); box.append(node("h2", title), node("p", body)); return box; }

function render() {
  if (category && !items.some(item => item.category === category)) category = "";
  const query = el.search.value.trim().toLocaleLowerCase("ko");
  const shown = items.filter(item => (!category || item.category === category) && `${item.title} ${item.summary} ${item.category}`.toLocaleLowerCase("ko").includes(query));
  el.heading.textContent = category || "전체 리서치";
  el.metadata.textContent = items.length ? `리서치 ${items.length}개 · 최신 발행 ${date(items.reduce((latest, row) => Date.parse(row.published_at) > Date.parse(latest) ? row.published_at : latest, items[0].published_at))}` : "아직 발행된 리서치가 없습니다";
  el.categories.replaceChildren();
  for (const label of ["", ...new Set(items.map(item => item.category))]) {
    const button = node("button", label || "전체 리서치", `category${category === label ? " selected" : ""}`);
    button.type = "button"; button.dataset.category = label; button.setAttribute("aria-pressed", String(category === label));
    button.append(node("span", String(items.filter(item => !label || item.category === label).length)));
    button.onclick = () => { category = label; selected = ""; render(); [...el.categories.children].find(button => button.dataset.category === label)?.focus(); };
    el.categories.append(button);
  }
  el.list.replaceChildren();
  for (const item of shown) {
    const button = node("button", undefined, "rank-row"), body = node("span", undefined, "row-body");
    button.type = "button"; button.dataset.id = item.id; button.setAttribute("aria-current", String(selected === item.id));
    body.append(node("strong", item.title), node("p", item.summary), node("span", `${item.category} · ${date(item.published_at)}`, "row-meta"));
    button.append(node("span", String(item.rank), "rank"), body);
    button.onclick = () => { selected = item.id; render(); if (matchMedia("(max-width:850px)").matches) el.detail.querySelector("h2").focus(); else [...el.list.children].find(button => button.dataset.id === item.id)?.focus(); };
    el.list.append(button);
  }
  if (!shown.length) el.list.append(empty(items.length ? "검색 결과가 없습니다" : "첫 브리핑을 기다리고 있습니다", items.length ? "검색어나 주제를 바꿔보세요." : "AI 워크플로우가 리서치를 발행하면 이곳에 순위와 요약이 표시됩니다."));
  const item = shown.find(item => item.id === selected);
  document.querySelector(".columns").classList.toggle("has-detail", Boolean(item));
  el.detail.replaceChildren();
  if (!item) { el.detail.append(empty("리서치를 선택하세요", "순위의 근거와 상세 브리핑, 원문 출처를 볼 수 있습니다.")); return; }
  const back = node("button", "목록으로", "back"); back.type = "button"; back.onclick = () => { selected = ""; render(); el.list.querySelector("button")?.focus(); };
  const title = node("h2", item.title); title.tabIndex = -1;
  el.detail.append(back, title, node("p", `${item.rank}위 · ${item.category} · ${date(item.published_at)}`, "meta"));
  for (const [heading, content] of [["핵심 요약", item.summary], ["브리핑", item.content], ["선정 이유", item.rationale], ["순위 기준", item.ranking_basis]]) {
    if (!content.trim()) continue;
    const section = node("section", undefined, "brief-section"), box = node("div", undefined, "group");
    box.append(node("p", content)); section.append(node("h3", heading), box); el.detail.append(section);
  }
  const section = node("section", undefined, "brief-section"), sources = node("ul", undefined, "sources group");
  for (const source of item.sources) { const li = node("li"), a = node("a", source.title || new URL(source.url).hostname); a.href = source.url; a.target = "_blank"; a.rel = "noopener noreferrer"; li.append(a); sources.append(li); }
  if (!item.sources.length) sources.append(node("li", "등록된 원문 출처가 없습니다."));
  section.append(node("h3", "원문 출처"), sources); el.detail.append(section);
}

async function load() {
  const current = ++request;
  el.refresh.disabled = true;
  notice();
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (current !== request) return;
    session = data.session;
    el.login.hidden = Boolean(session); el.dashboard.hidden = !session; el.logout.hidden = !session;
    el.account.textContent = session?.user.email ?? "로그인 전";
    if (!session) { items = []; selected = ""; render(); return; }
    el.metadata.textContent = "리서치를 불러오는 중…";
    const response = await fetch(`${API}/briefings`, { headers: { Authorization: `Bearer ${session.access_token}` }, cache:"no-store", signal:AbortSignal.timeout(15000) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "리서치를 불러오지 못했습니다.");
    const next = validateItems(body.items);
    if (current !== request) return;
    items = next; render();
  } catch (error) {
    if (current !== request) return;
    items = []; selected = ""; render();
    notice(error instanceof TypeError || error.name === "TimeoutError" ? "브리핑 서버에 연결하지 못했습니다. 네트워크 연결을 확인하고 새로고침해 주세요." : error.message);
  } finally { if (current === request) el.refresh.disabled = false; }
}

el.search.addEventListener("input", render);
el.refresh.onclick = () => supabase ? load() : start();
el.signin.onclick = async () => {
  el.signin.disabled = true;
  const { error } = await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo:window.location.origin + "/" } });
  if (error) { notice("로그인을 시작하지 못했습니다. 다시 시도해 주세요."); el.signin.disabled = false; }
};
el.logout.onclick = async () => { const { error } = await supabase.auth.signOut(); if (error) notice("로그아웃에 실패했습니다. 다시 시도해 주세요."); };
async function start() {
  el.refresh.disabled = true;
  try {
    const response = await fetch(`${API}/config`, { signal:AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("브리핑 서버를 준비하고 있습니다. 잠시 후 새로고침해 주세요.");
    const config = await response.json();
    supabase = createClient(config.supabaseUrl, config.publishableKey, { auth:{ flowType:"pkce" } });
    supabase.auth.onAuthStateChange(() => { setTimeout(load, 0); });
    await load();
  } catch { notice("브리핑 서버에 연결하지 못했습니다. 네트워크 연결을 확인하고 새로고침해 주세요."); }
  finally { el.refresh.disabled = false; }
}
start();
