/* ══ LOGIN PAGE ══
 * Grid de cards com scroll infinito + posters via TMDB
 */

const grid   = document.getElementById('cardGrid');
const COLS   = 7;
const SPEEDS = [0.12, -0.09, 0.11, -0.13, 0.08, -0.10, 0.09];
const columns = [];

/* ── Fallback: picsum caso a API falhe ── */
const FALLBACK_SEEDS = [
  10,20,30,40,50,60,70,80,90,100,
  11,21,31,41,51,61,71,81,91,101,
  12,22,32,42,52,62,72,82,92,102,
  13,23,33,43,53,63,73,83,93,103,
];
const fallbackUrls = FALLBACK_SEEDS.map(s => `https://picsum.photos/seed/${s}/300/450`);

/* ── Busca posters reais da TMDB ── */
async function fetchPosters() {
  try {
    const [trending, tvTrending, popular, tvPopular] = await Promise.all([
      TMDB.get('trending/movie/week?page=1'),
      TMDB.get('trending/tv/week?page=1'),
      TMDB.get('movie/popular?page=2'),
      TMDB.get('tv/popular?page=1'),
    ]);

    const all = [
      ...(trending.results   || []),
      ...(tvTrending.results || []),
      ...(popular.results    || []),
      ...(tvPopular.results  || []),
    ].filter(m => m.poster_path);

    /* Embaralha para variar entre colunas */
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    return all.map(m => TMDB.img(m.poster_path, 'w342'));
  } catch {
    return fallbackUrls;
  }
}

/* ── Constrói o grid com as URLs fornecidas ── */
function buildGrid(urls) {
  if (!urls.length) urls = fallbackUrls;

  /* Garante URLs suficientes para preencher todas as colunas */
  while (urls.length < COLS * 14) urls = [...urls, ...urls];

  grid.innerHTML = '';
  columns.length = 0;

  for (let c = 0; c < COLS; c++) {
    const col = document.createElement('div');
    col.className = 'card-col';
    col.style.willChange = 'transform';

    [0, 1].forEach(() => {
      const block = document.createElement('div');
      block.style.cssText = 'display:flex;flex-direction:column;gap:14px;padding-bottom:14px;';

      for (let r = 0; r < 14; r++) {
        const idx  = (c * 14 + r) % urls.length;
        const item = document.createElement('div');
        item.className = 'card-item';
        const img = document.createElement('img');
        img.src     = urls[idx];
        img.alt     = '';
        img.loading = 'lazy';
        img.onerror = () => { img.src = fallbackUrls[idx % fallbackUrls.length]; };
        item.appendChild(img);
        block.appendChild(item);
      }
      col.appendChild(block);
    });

    grid.appendChild(col);
    columns.push({ el: col, y: 0, speed: SPEEDS[c], loopH: 0 });
  }
}

/* ── Animação ── */
function startAnimation() {
  columns.forEach(col => {
    col.loopH = col.el.firstChild.offsetHeight;
    if (col.speed > 0) col.y = -col.loopH;
  });
  animate();
}

function animate() {
  columns.forEach(col => {
    col.y += col.speed;
    if (col.speed < 0) {
      if (col.y <= -col.loopH) col.y += col.loopH;
    } else {
      if (col.y >= 0) col.y -= col.loopH;
    }
    col.el.style.transform = `translateY(${col.y}px)`;
  });
  requestAnimationFrame(animate);
}

/* ── Init ── */
(async () => {
  /* Constrói imediatamente com fallback para não travar a UI */
  buildGrid([...fallbackUrls]);
  window.addEventListener('load', startAnimation);
  setTimeout(startAnimation, 800);

  /* Substitui com posters reais assim que chegarem */
  const posters = await fetchPosters();
  if (posters.length && posters[0] !== fallbackUrls[0]) {
    buildGrid(posters);
    startAnimation();
  }
})();

/* ── Toggle senha ── */
function togglePwd() {
  const input = document.getElementById('pwd');
  const icon  = document.getElementById('eyeIcon');
  if (!input || !icon) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  icon.innerHTML = show
    ? `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`
    : `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
}

/* ── Troca de painel (login ↔ cadastro) ── */
function switchPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + name);
  if (target) target.classList.add('active');
}
