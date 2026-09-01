const state = { tutorials: [], filtered: [], selected: null, imageTimer: null, imageFrame: 1 };
const ids = ['tutorial-list','empty-state','result-count','search-input','style-filter','level-filter','player-section','player-title','player-meta','player-tags','instagram-link','frame-stage','frame-image','video-player','stage-placeholder','frame-slider','frame-counter','last-frame','first-button','prev-button','play-button','next-button','last-button','speed-select','step-select','loop-select','fullscreen-button'];
const el = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const isVideo = item => Boolean(item?.videoPath);
const frameInterval = item => Number(item?.frameInterval) || 0.1;
const frameUrl = (item, n) => `${item.framePath}${String(n).padStart(item.padding ?? 4, '0')}.${item.extension ?? 'jpg'}`;
const formatTime = seconds => { const safe = Math.max(0, Number(seconds) || 0); return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, '0')}.${Math.floor((safe % 1) * 10)}`; };

function populateFilter(select, values) { [...new Set(values.filter(Boolean))].sort().forEach(value => select.add(new Option(value, value))); }
function filterTutorials() {
  const query = el['search-input'].value.trim().toLocaleLowerCase('ko');
  state.filtered = state.tutorials.filter(item => {
    const text = [item.title,item.style,item.level,...(item.tags ?? [])].join(' ').toLocaleLowerCase('ko');
    return (!query || text.includes(query)) && (!el['style-filter'].value || item.style === el['style-filter'].value) && (!el['level-filter'].value || item.level === el['level-filter'].value);
  }); renderList();
}
function renderList() {
  el['result-count'].textContent = `${state.filtered.length}개`; el['empty-state'].hidden = state.filtered.length !== 0;
  el['tutorial-list'].innerHTML = state.filtered.map(item => `<button class="tutorial-card ${state.selected?.id === item.id ? 'active' : ''}" data-id="${escapeHtml(item.id)}" type="button">${item.thumbnail || item.framePath ? `<img src="${escapeHtml(item.thumbnail || frameUrl(item, 1))}" alt="" loading="lazy">` : '<span class="video-thumb" aria-hidden="true">▶</span>'}<span><span class="card-meta">${escapeHtml(item.style)} · ${escapeHtml(item.level)}</span><strong>${escapeHtml(item.title)}</strong><span class="mini-tags">${(item.tags ?? []).slice(0,3).map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}</span></span></button>`).join('');
  el['tutorial-list'].querySelectorAll('.tutorial-card').forEach(card => card.addEventListener('click', () => selectTutorial(card.dataset.id)));
}
function selectTutorial(id) {
  const item = state.tutorials.find(t => t.id === id); if (!item) return; stop(); state.selected = item; state.imageFrame = 1;
  el['player-title'].textContent = item.title; el['player-meta'].textContent = `${item.style} · ${item.level} · ${isVideo(item) ? 'WebM 비디오' : '추출 프레임'}`;
  el['player-tags'].innerHTML = (item.tags ?? []).map(tag => `<span>#${escapeHtml(tag)}</span>`).join(''); el['instagram-link'].hidden = !item.instagram; el['instagram-link'].href = item.instagram || '#'; el['stage-placeholder'].hidden = true;
  el['video-player'].style.display = isVideo(item) ? 'block' : 'none'; el['frame-image'].style.display = isVideo(item) ? 'none' : 'block';
  if (isVideo(item)) { el['video-player'].src = item.videoPath; el['video-player'].load(); }
  else { el['video-player'].removeAttribute('src'); el['video-player'].load(); setupImageTimeline(); updateImage(); }
  ['first-button','prev-button','play-button','next-button','last-button'].forEach(key => el[key].disabled = false); renderList();
  if (window.innerWidth <= 840) el['player-section'].scrollIntoView({ behavior: 'smooth' });
}
function setupImageTimeline() { const duration = (state.selected.frameCount - 1) * frameInterval(state.selected); el['frame-slider'].max = duration; el['frame-slider'].step = frameInterval(state.selected); el['frame-slider'].disabled = false; el['last-frame'].textContent = formatTime(duration); }
function updateImage() { const item = state.selected; state.imageFrame = Math.max(1, Math.min(item.frameCount, state.imageFrame)); el['frame-image'].src = frameUrl(item, state.imageFrame); const time = (state.imageFrame - 1) * frameInterval(item); el['frame-slider'].value = time; el['frame-counter'].textContent = `${formatTime(time)} · ${state.imageFrame}/${item.frameCount}`; }
function syncVideoTimeline() { const video = el['video-player']; el['frame-slider'].value = video.currentTime; el['frame-counter'].textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`; }
function stop() { clearInterval(state.imageTimer); state.imageTimer = null; el['video-player'].pause(); el['play-button'].textContent = '▶'; el['play-button'].ariaLabel = '재생'; }
function isPlaying() { return state.imageTimer || !el['video-player'].paused; }
function move(direction) { stop(); const seconds = Number(el['step-select'].value); if (isVideo(state.selected)) { const video = el['video-player']; video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + direction * seconds)); } else { state.imageFrame += direction * Math.max(1, Math.round(seconds / frameInterval(state.selected))); updateImage(); } }
function togglePlay() {
  if (!state.selected) return; if (isPlaying()) return stop(); el['play-button'].textContent = 'Ⅱ'; el['play-button'].ariaLabel = '일시정지';
  if (isVideo(state.selected)) { el['video-player'].playbackRate = Number(el['speed-select'].value); el['video-player'].play().catch(stop); return; }
  state.imageTimer = setInterval(() => { if (state.imageFrame >= state.selected.frameCount) { if (el['loop-select'].value === 'once') return stop(); state.imageFrame = 1; } else state.imageFrame++; updateImage(); }, frameInterval(state.selected) * 1000 / Number(el['speed-select'].value));
}

el['video-player'].addEventListener('loadedmetadata', () => { const video = el['video-player']; el['frame-slider'].max = video.duration; el['frame-slider'].step = 0.01; el['frame-slider'].disabled = false; el['last-frame'].textContent = formatTime(video.duration); syncVideoTimeline(); });
el['video-player'].addEventListener('timeupdate', syncVideoTimeline); el['video-player'].addEventListener('ended', () => { if (el['loop-select'].value === 'loop') { el['video-player'].currentTime = 0; el['video-player'].play(); } else stop(); });
el['search-input'].addEventListener('input', filterTutorials); el['style-filter'].addEventListener('change', filterTutorials); el['level-filter'].addEventListener('change', filterTutorials);
el['frame-slider'].addEventListener('input', e => { stop(); if (isVideo(state.selected)) el['video-player'].currentTime = Number(e.target.value); else { state.imageFrame = Math.round(Number(e.target.value) / frameInterval(state.selected)) + 1; updateImage(); } });
el['first-button'].addEventListener('click', () => { stop(); if (isVideo(state.selected)) el['video-player'].currentTime = 0; else { state.imageFrame = 1; updateImage(); } }); el['prev-button'].addEventListener('click', () => move(-1)); el['play-button'].addEventListener('click', togglePlay); el['next-button'].addEventListener('click', () => move(1)); el['last-button'].addEventListener('click', () => { stop(); if (isVideo(state.selected)) el['video-player'].currentTime = el['video-player'].duration; else { state.imageFrame = state.selected.frameCount; updateImage(); } });
el['speed-select'].addEventListener('change', () => { if (isVideo(state.selected)) el['video-player'].playbackRate = Number(el['speed-select'].value); else if (state.imageTimer) { stop(); togglePlay(); } }); el['fullscreen-button'].addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen?.() : el['frame-stage'].requestFullscreen?.());
document.addEventListener('keydown', e => { if (!state.selected || ['INPUT','SELECT'].includes(document.activeElement.tagName)) return; if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.code === 'Space') { e.preventDefault(); togglePlay(); } });
async function init() { try { const response = await fetch('tutorials.json'); if (!response.ok) throw new Error(`HTTP ${response.status}`); state.tutorials = await response.json(); state.filtered = [...state.tutorials]; populateFilter(el['style-filter'], state.tutorials.map(i => i.style)); populateFilter(el['level-filter'], state.tutorials.map(i => i.level)); renderList(); if (state.tutorials[0]) selectTutorial(state.tutorials[0].id); } catch (error) { el['tutorial-list'].innerHTML = '<div class="empty"><strong>목록을 불러오지 못했습니다.</strong><span>로컬 서버 또는 GitHub Pages에서 열어주세요.</span></div>'; console.error(error); } }
init();
