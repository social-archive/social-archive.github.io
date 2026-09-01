const state = { tutorials: [], filtered: [], selected: null, frame: 1, timer: null };

const el = Object.fromEntries([
  'tutorial-list', 'empty-state', 'result-count', 'search-input', 'style-filter',
  'level-filter', 'player-section', 'player-title', 'player-meta', 'player-tags',
  'instagram-link', 'frame-stage', 'frame-image', 'stage-placeholder', 'frame-slider',
  'frame-counter', 'last-frame', 'first-button', 'prev-button', 'play-button',
  'next-button', 'last-button', 'speed-select', 'fullscreen-button'
].map(id => [id, document.getElementById(id)]));

const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[c]));

function frameUrl(tutorial, number) {
  const padded = String(number).padStart(tutorial.padding ?? 4, '0');
  return `${tutorial.framePath}${padded}.${tutorial.extension ?? 'jpg'}`;
}

function populateFilter(select, values) {
  [...new Set(values.filter(Boolean))].sort().forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function filterTutorials() {
  const query = el['search-input'].value.trim().toLocaleLowerCase('ko');
  const style = el['style-filter'].value;
  const level = el['level-filter'].value;
  state.filtered = state.tutorials.filter(item => {
    const haystack = [item.title, item.style, item.level, ...(item.tags ?? [])].join(' ').toLocaleLowerCase('ko');
    return (!query || haystack.includes(query)) && (!style || item.style === style) && (!level || item.level === level);
  });
  renderList();
}

function renderList() {
  el['result-count'].textContent = `${state.filtered.length}개`;
  el['empty-state'].hidden = state.filtered.length !== 0;
  el['tutorial-list'].innerHTML = state.filtered.map(item => `
    <button class="tutorial-card ${state.selected?.id === item.id ? 'active' : ''}" data-id="${escapeHtml(item.id)}" type="button">
      <img src="${escapeHtml(frameUrl(item, 1))}" alt="" loading="lazy">
      <span>
        <span class="card-meta">${escapeHtml(item.style)} · ${escapeHtml(item.level)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="mini-tags">${(item.tags ?? []).slice(0, 3).map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}</span>
      </span>
    </button>`).join('');
  el['tutorial-list'].querySelectorAll('.tutorial-card').forEach(card => {
    card.addEventListener('click', () => selectTutorial(card.dataset.id));
  });
}

function selectTutorial(id) {
  const item = state.tutorials.find(tutorial => tutorial.id === id);
  if (!item) return;
  stop();
  state.selected = item;
  state.frame = 1;
  el['player-title'].textContent = item.title;
  el['player-meta'].textContent = `${item.style} · ${item.level}`;
  el['player-tags'].innerHTML = (item.tags ?? []).map(tag => `<span>#${escapeHtml(tag)}</span>`).join('');
  el['instagram-link'].hidden = !item.instagram;
  el['instagram-link'].href = item.instagram || '#';
  el['frame-slider'].max = item.frameCount;
  el['frame-slider'].disabled = false;
  el['last-frame'].textContent = item.frameCount;
  ['first-button', 'prev-button', 'play-button', 'next-button', 'last-button'].forEach(key => el[key].disabled = false);
  el['stage-placeholder'].hidden = true;
  el['frame-image'].style.display = 'block';
  updateFrame();
  renderList();
  if (window.innerWidth <= 840) el['player-section'].scrollIntoView({ behavior: 'smooth' });
}

function updateFrame() {
  const item = state.selected;
  if (!item) return;
  state.frame = Math.max(1, Math.min(item.frameCount, state.frame));
  el['frame-image'].src = frameUrl(item, state.frame);
  el['frame-image'].alt = `${item.title} — ${state.frame}번째 프레임`;
  el['frame-slider'].value = state.frame;
  el['frame-counter'].textContent = `${state.frame} / ${item.frameCount}`;
}

function move(delta) { stop(); state.frame += delta; updateFrame(); }
function stop() { clearInterval(state.timer); state.timer = null; el['play-button'].textContent = '▶'; el['play-button'].ariaLabel = '재생'; }
function togglePlay() {
  if (!state.selected) return;
  if (state.timer) return stop();
  el['play-button'].textContent = 'Ⅱ';
  el['play-button'].ariaLabel = '일시정지';
  state.timer = setInterval(() => {
    state.frame = state.frame >= state.selected.frameCount ? 1 : state.frame + 1;
    updateFrame();
  }, Number(el['speed-select'].value));
}

el['search-input'].addEventListener('input', filterTutorials);
el['style-filter'].addEventListener('change', filterTutorials);
el['level-filter'].addEventListener('change', filterTutorials);
el['frame-slider'].addEventListener('input', event => { stop(); state.frame = Number(event.target.value); updateFrame(); });
el['first-button'].addEventListener('click', () => { stop(); state.frame = 1; updateFrame(); });
el['prev-button'].addEventListener('click', () => move(-1));
el['play-button'].addEventListener('click', togglePlay);
el['next-button'].addEventListener('click', () => move(1));
el['last-button'].addEventListener('click', () => { stop(); state.frame = state.selected.frameCount; updateFrame(); });
el['speed-select'].addEventListener('change', () => { if (state.timer) { stop(); togglePlay(); } });
el['fullscreen-button'].addEventListener('click', () => {
  if (!document.fullscreenElement) el['frame-stage'].requestFullscreen?.();
  else document.exitFullscreen?.();
});
el['frame-image'].addEventListener('error', () => {
  el['frame-counter'].textContent = `이미지 없음 · ${state.frame} / ${state.selected?.frameCount ?? '—'}`;
});
document.addEventListener('keydown', event => {
  if (!state.selected || ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
});

async function init() {
  try {
    const response = await fetch('tutorials.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.tutorials = await response.json();
    state.filtered = [...state.tutorials];
    populateFilter(el['style-filter'], state.tutorials.map(item => item.style));
    populateFilter(el['level-filter'], state.tutorials.map(item => item.level));
    renderList();
    if (state.tutorials[0]) selectTutorial(state.tutorials[0].id);
  } catch (error) {
    el['tutorial-list'].innerHTML = `<div class="empty"><strong>목록을 불러오지 못했습니다.</strong><span>로컬 서버나 GitHub Pages에서 열어주세요.</span></div>`;
    console.error(error);
  }
}

init();
