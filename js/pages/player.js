/* ══ PLAYER PAGE ══
 * Player de vídeo fictício — controles de UI sem vídeo real.
 * Depende de: Router
 */

/* ── Estado ── */
let playerState = {
  playing: true,
  muted:   false,
  volume:  1,
  progress: 0,
  duration: 7080, // 1h 58m em segundos (fictício)
  elapsed:  0,
  fullscreen: false,
  controlsVisible: true,
  controlsTimer: null,
};

/* ── Referências DOM ── */
const playerWrap      = document.getElementById('playerWrap');
const playPauseBtn    = document.getElementById('playPauseBtn');
const muteBtn         = document.getElementById('muteBtn');
const volumeSlider    = document.getElementById('volumeSlider');
const progressBar     = document.getElementById('progressBar');
const progressFill    = document.getElementById('progressFill');
const progressThumb   = document.getElementById('progressThumb');
const timeElapsed     = document.getElementById('timeElapsed');
const timeDuration    = document.getElementById('timeDuration');
const fullscreenBtn   = document.getElementById('fullscreenBtn');
const backBtn         = document.getElementById('backBtn');
const controlsEl      = document.getElementById('playerControls');

/* ── Formata segundos em mm:ss ou hh:mm:ss ── */
function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm  = String(m).padStart(2, '0');
  const ss  = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/* ── Atualiza barra de progresso ── */
function updateProgress() {
  const pct = playerState.duration > 0
    ? (playerState.elapsed / playerState.duration) * 100
    : 0;
  if (progressFill)  progressFill.style.width  = `${pct}%`;
  if (progressThumb) progressThumb.style.left   = `${pct}%`;
  if (timeElapsed)   timeElapsed.textContent    = formatTime(playerState.elapsed);
  if (timeDuration)  timeDuration.textContent   = formatTime(playerState.duration);
}

/* ── Tick fictício (avança 1s a cada segundo) ── */
let ticker = null;
function startTicker() {
  clearInterval(ticker);
  ticker = setInterval(() => {
    if (!playerState.playing) return;
    playerState.elapsed = Math.min(playerState.elapsed + 1, playerState.duration);
    updateProgress();
    if (playerState.elapsed >= playerState.duration) {
      playerState.playing = false;
      updatePlayPauseIcon();
      clearInterval(ticker);
    }
  }, 1000);
}

/* ── Play / Pause ── */
function togglePlay() {
  playerState.playing = !playerState.playing;
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  if (!playPauseBtn) return;
  playPauseBtn.innerHTML = playerState.playing
    ? `<svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
    : `<svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
}

/* ── Mudo ── */
function toggleMute() {
  playerState.muted = !playerState.muted;
  if (volumeSlider) volumeSlider.value = playerState.muted ? 0 : playerState.volume * 100;
  updateMuteIcon();
}

function updateMuteIcon() {
  if (!muteBtn) return;
  muteBtn.innerHTML = playerState.muted
    ? `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>`
    : `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12L7.757 9.757A1 1 0 017 10H4a1 1 0 00-1 1v2a1 1 0 001 1h3a1 1 0 01.757.343L12 18"/><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728"/></svg>`;
}

/* ── Volume ── */
function onVolumeChange(val) {
  playerState.volume = val / 100;
  playerState.muted  = val == 0;
  updateMuteIcon();
}

/* ── Seek pela barra de progresso ── */
function onProgressClick(e) {
  if (!progressBar) return;
  const rect = progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  playerState.elapsed = Math.floor(pct * playerState.duration);
  updateProgress();
}

/* ── Fullscreen ── */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    (playerWrap || document.documentElement).requestFullscreen?.();
    playerState.fullscreen = true;
  } else {
    document.exitFullscreen?.();
    playerState.fullscreen = false;
  }
  updateFullscreenIcon();
}

function updateFullscreenIcon() {
  if (!fullscreenBtn) return;
  fullscreenBtn.innerHTML = playerState.fullscreen
    ? `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/></svg>`
    : `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>`;
}

/* ── Mostrar / ocultar controles ── */
function showControls() {
  clearTimeout(playerState.controlsTimer);
  playerState.controlsVisible = true;
  if (controlsEl)  controlsEl.classList.remove('hidden');
  if (playerWrap)  playerWrap.style.cursor = 'default';
  playerState.controlsTimer = setTimeout(hideControls, 3500);
}

function hideControls() {
  if (!playerState.playing) return;
  playerState.controlsVisible = false;
  if (controlsEl) controlsEl.classList.add('hidden');
  if (playerWrap) playerWrap.style.cursor = 'none';
}

/* ── Voltar ── */
function goBack() {
  clearInterval(ticker);
  history.length > 1 ? history.back() : (window.location.href = 'home.html');
}

/* ── Eventos ── */
if (playPauseBtn)  playPauseBtn.addEventListener('click', togglePlay);
if (muteBtn)       muteBtn.addEventListener('click', toggleMute);
if (volumeSlider)  volumeSlider.addEventListener('input', e => onVolumeChange(e.target.value));
if (progressBar)   progressBar.addEventListener('click', onProgressClick);
if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
if (backBtn)       backBtn.addEventListener('click', goBack);

if (playerWrap) {
  playerWrap.addEventListener('mousemove', showControls);
  playerWrap.addEventListener('click',     showControls);
  playerWrap.addEventListener('touchstart', showControls);
}

/* ── Teclas de atalho ── */
document.addEventListener('keydown', e => {
  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault();
      togglePlay();
      showControls();
      break;
    case 'ArrowRight':
      playerState.elapsed = Math.min(playerState.elapsed + 10, playerState.duration);
      updateProgress();
      showControls();
      break;
    case 'ArrowLeft':
      playerState.elapsed = Math.max(playerState.elapsed - 10, 0);
      updateProgress();
      showControls();
      break;
    case 'm':
      toggleMute();
      break;
    case 'f':
      toggleFullscreen();
      break;
    case 'Escape':
      if (!document.fullscreenElement) goBack();
      break;
  }
});

/* ── Init ── */
updateProgress();
updatePlayPauseIcon();
updateMuteIcon();
updateFullscreenIcon();
showControls();
startTicker();
