/* ══ HOME PAGE ══
 * Depende de: TMDB, Storage, Helpers, Router, CardBuilder
 */

/* ── Mapa de cores por gênero ── */
const ACCENT_MAP = {
  28: '#C4202A', 12: '#1E8A6E', 16: '#D4A017', 35: '#E8A000',
  99: '#2A6A9A', 18: '#5A3A8A', 10751: '#4FC3F7', 14: '#7A3A8A',
  27: '#3A6A3A', 9648: '#8A5A2A', 878: '#4A8FA8', 53: '#8A6A3A',
  10752: '#6A3A3A', 37: '#8A6A1A',
};

/* ── Dados offline para modo sem API ── */
const FALLBACK_DATA = [
  { id: null, title: 'Interestelar',            year: '2014', genre_ids: [878], vote_average: 8.7, backdrop_path: null, poster_path: null, localPoster: 'assets/images/posters/inter.webp', localBg: 'assets/images/backdrops/inter-bg.webp', overview: 'As reservas naturais da Terra estão chegando ao fim. Cooper lidera uma missão espacial em busca de um novo lar para a humanidade.' },
  { id: null, title: 'Duna: Parte 2',           year: '2024', genre_ids: [878], vote_average: 8.5, backdrop_path: null, poster_path: null, overview: 'Paul Atreides une-se aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.' },
  { id: null, title: 'Oppenheimer',             year: '2023', genre_ids: [18],  vote_average: 8.3, backdrop_path: null, poster_path: null, overview: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.' },
  { id: null, title: 'Avatar: Caminho da Água', year: '2022', genre_ids: [28],  vote_average: 7.6, backdrop_path: null, poster_path: null, overview: 'Jake Sully e Neyti formaram uma família e devem explorar as regiões de Pandora para proteger os seus.' },
  { id: null, title: 'Deadpool & Wolverine',    year: '2024', genre_ids: [28],  vote_average: 7.9, backdrop_path: null, poster_path: null, overview: 'Deadpool recruta Wolverine para uma missão caótica que coloca em risco todo o multiverso Marvel.' },
  { id: null, title: 'Barbie',                  year: '2023', genre_ids: [35],  vote_average: 7.0, backdrop_path: null, poster_path: null, overview: 'Barbie e Ken saem de Barbieland para descobrir que o mundo real não é tão perfeito.' },
  { id: null, title: 'Alien: Romulus',          year: '2024', genre_ids: [27],  vote_average: 7.3, backdrop_path: null, poster_path: null, overview: 'Um grupo de jovens colonizadores enfrenta a forma de vida mais aterrorizante do universo.' },
  { id: null, title: 'Civil War',               year: '2024', genre_ids: [28],  vote_average: 7.2, backdrop_path: null, poster_path: null, overview: 'Jornalistas atravessam os Estados Unidos à beira de colapso em busca da última grande reportagem.' },
  { id: null, title: 'Divertida Mente 2',       year: '2024', genre_ids: [16],  vote_average: 7.9, backdrop_path: null, poster_path: null, overview: 'Riley está crescendo e novas emoções chegam à sede do comando, colocando tudo em desequilíbrio.' },
  { id: null, title: 'Moana 2',                 year: '2024', genre_ids: [16],  vote_average: 7.1, backdrop_path: null, poster_path: null, overview: 'Moana embarca em uma nova missão pelos mares distantes da Oceania com uma nova tripulação.' },
  { id: null, title: 'Kung Fu Panda 4',         year: '2024', genre_ids: [16],  vote_average: 7.2, backdrop_path: null, poster_path: null, overview: 'Po deve treinar um novo guerreiro dragão enquanto enfrenta uma poderosa vilã.' },
  { id: null, title: 'Twisters',                year: '2024', genre_ids: [28],  vote_average: 7.1, backdrop_path: null, poster_path: null, overview: 'Uma meteorologista retorna ao Oklahoma para enfrentar tornados mais poderosos do que nunca.' },
  { id: null, title: 'A Substância',            year: '2024', genre_ids: [27],  vote_average: 7.3, backdrop_path: null, poster_path: null, overview: 'Uma mulher descobre uma substância que cria uma versão melhorada e mais jovem de si mesma.' },
  { id: null, title: 'Um Sonho de Liberdade',   year: '1994', genre_ids: [18],  vote_average: 9.3, backdrop_path: null, poster_path: null, overview: 'Dois homens presos criam laços ao longo de anos, encontrando consolo e redenção.' },
  { id: null, title: 'O Poderoso Chefão',       year: '1972', genre_ids: [80],  vote_average: 9.2, backdrop_path: null, poster_path: null, overview: 'O patriarca de uma dinastia do crime transfere o controle de seu império ao filho relutante.' },
];

/* ── Referências DOM ── */
const heroEl     = document.getElementById('hero');
const heroLoader = document.getElementById('heroLoader');
const contentEl  = document.getElementById('content');

/* ── Estado do hero ── */
let heroMovies = [], hIdx = 0, hTimer = null;

/* ── Constrói slide do hero ── */
function buildHeroSlide(m) {
  const slide   = document.createElement('div');
  slide.className = 'hero-slide';
  if (m.id) slide.dataset.id = m.id;
  const year    = Helpers.getYear(m.release_date || m.first_air_date || m.year || '');
  const title   = m.title || m.name || '';
  const desc    = m.overview || m.desc || '';
  const bg      = m.localBg ? m.localBg : (m.backdrop_path ? TMDB.img(m.backdrop_path, 'original') : '');
  const rating  = m.adult ? 'A18' : 'L';
  const detailsUrl = m.id ? `details.html?id=${m.id}` : 'details.html';

  const _pp = new URLSearchParams();
  if (m.id)  _pp.set('id', m.id);
  if (title) _pp.set('title', encodeURIComponent(title));
  if (bg)    _pp.set('backdrop', encodeURIComponent(bg));
  const playerUrl = `player.html?${_pp.toString()}`;

  slide.innerHTML = `
    <div class="hero-bg" style="background-image:url('${bg}')"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-tag">Em Destaque</div>
      <h1 class="hero-title">${title}</h1>
      <div class="hero-meta">
        <span class="hero-year">${year}</span>
        <div class="hero-dot"></div>
        <span class="hero-rating">${rating}</span>
        <div class="hero-dot"></div>
        <span class="hero-dur">${m.vote_average ? '⭐ ' + m.vote_average.toFixed(1) : ''}</span>
      </div>
      <p class="hero-desc">${desc.length > 180 ? desc.slice(0, 180) + '...' : desc}</p>
      <div class="hero-actions">
        <button class="btn-play" onclick="Router.navigate('${playerUrl}')">▶ Assistir</button>
        <button class="btn-info" onclick="Router.navigate('${detailsUrl}')">ⓘ Mais informações</button>
      </div>
    </div>
  `;
  return slide;
}

/* ── Exibe slide pelo índice ── */
function showHero(idx) {
  heroEl.querySelectorAll('.hero-slide').forEach((s, i) => {
    s.classList.remove('active', 'leaving');
    if (i === idx) s.classList.add('active');
  });
  startHeroProgress();
}

/* ── Avança para o próximo slide ── */
function nextHero() {
  heroEl.querySelector('.hero-slide.active')?.classList.add('leaving');
  hIdx = (hIdx + 1) % heroMovies.length;
  showHero(hIdx);
  setTimeout(() => heroEl.querySelectorAll('.hero-slide.leaving').forEach(s => s.classList.remove('leaving')), 1600);
}

/* ── Barra de progresso do hero ── */
function startHeroProgress() {
  clearTimeout(hTimer);
  const pf = document.getElementById('heroPf');
  if (!pf) return;
  pf.style.transition = 'none';
  pf.style.width = '0%';
  void pf.offsetWidth;
  pf.style.transition = 'width 12s linear';
  pf.style.width = '100%';
  hTimer = setTimeout(nextHero, 12000);
}

/* ── Detecta se um logo é predominantemente preto (sem cor) ── */
function isLogoDark(img) {
  try {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    const w = Math.min(img.naturalWidth  || 200, 200);
    const h = Math.min(img.naturalHeight || 100, 100);
    canvas.width = w; canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let dark = 0, total = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 20) continue; // ignora transparente
      total++;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness  = (r + g + b) / 3;
      const saturation  = Math.max(r, g, b) - Math.min(r, g, b);
      if (brightness < 60 && saturation < 30) dark++; // escuro e sem cor
    }
    return total > 0 && dark / total > 0.75; // >75% dos pixels são pretos
  } catch { return false; } // CORS ou outro erro → mantém original
}

/* ── Busca e aplica logos oficiais nos slides do hero ── */
async function fetchHeroLogos(movies) {
  for (const m of movies) {
    if (!m.id) continue;
    try {
      const type = m.media_type || 'movie';
      const data = await TMDB.get(`${type}/${m.id}/images?include_image_language=pt-BR,pt,en,null`);
      const logos = data.logos || [];
      const best  = logos.find(l => l.iso_639_1 === 'pt' && l.iso_3166_1 === 'BR')
                 || logos.find(l => l.iso_639_1 === 'pt')
                 || logos.find(l => l.iso_639_1 === 'en')
                 || logos[0];
      if (!best) continue;
      const logoUrl = TMDB.img(best.file_path, 'w500');
      const slide   = heroEl.querySelector(`.hero-slide[data-id="${m.id}"]`);
      if (!slide) continue;
      const titleEl = slide.querySelector('.hero-title');
      if (!titleEl) continue;

      /* Imagem de exibição — sem crossOrigin, sempre carrega */
      const img = document.createElement('img');
      img.className = 'hero-logo';
      img.alt       = m.title || m.name || '';
      img.onerror   = () => img.replaceWith(titleEl);
      img.onload    = () => {
        titleEl.replaceWith(img);
        /* Sonda separada com cache-bust para análise de cor (CORS) */
        const probe = new Image();
        probe.crossOrigin = 'anonymous';
        probe.onload  = () => { if (isLogoDark(probe)) img.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(0,0,0,0.5))'; };
        probe.onerror = () => {}; // CORS falhou — mantém logo original
        probe.src = logoUrl + '?_=1';
      };
      img.src = logoUrl;
    } catch { /* mantém texto */ }
  }
}

/* ── Insere slides no DOM ── */
function insertHeroSlides(movies) {
  const particles = document.getElementById('particles');
  movies.forEach(m => {
    const slide = buildHeroSlide(m);
    if (particles) heroEl.insertBefore(slide, particles.nextSibling);
    else heroEl.appendChild(slide);
  });
}

/* ══ BUSCA NO HEADER ══ */
let searchTimer = null;

function toggleSearch() {
  const w   = document.getElementById('searchExpand');
  const inp = document.getElementById('searchInput');
  if (!w) return;
  w.classList.toggle('open');
  if (w.classList.contains('open')) setTimeout(() => inp && inp.focus(), 350);
  else {
    if (inp) inp.value = '';
    document.getElementById('searchDrop')?.classList.remove('show');
  }
}

async function onSearch(val) {
  clearTimeout(searchTimer);
  const drop = document.getElementById('searchDrop');
  if (!drop) return;
  if (!val.trim()) { drop.classList.remove('show'); drop.innerHTML = ''; return; }
  searchTimer = setTimeout(async () => {
    try {
      const data = await TMDB.get(`search/movie?query=${encodeURIComponent(val)}`);
      const res  = data.results || [];
      if (!res.length) { drop.classList.remove('show'); return; }
      drop.innerHTML = res.slice(0, 5).map(m => `
        <div class="search-result" onclick="Router.navigate('details.html?id=${m.id}')">
          <img src="${TMDB.img(m.poster_path, 'w92')}" alt="${m.title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
          <div>
            <div class="search-result-title">${m.title}</div>
            <div class="search-result-meta">${Helpers.getYear(m.release_date)} · ⭐ ${(m.vote_average || 0).toFixed(1)}</div>
          </div>
        </div>
      `).join('');
      drop.classList.add('show');
    } catch(e) {}
  }, 400);
}

document.addEventListener('click', e => {
  const wrap = document.getElementById('searchWrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('searchExpand')?.classList.remove('open');
    document.getElementById('searchDrop')?.classList.remove('show');
  }
});

/* ══ FALLBACK OFFLINE ══ */
function loadFallback() {
  heroMovies = FALLBACK_DATA.slice(0, 3);
  insertHeroSlides(heroMovies);
  heroLoader?.classList.add('hidden');
  showHero(0);

  CardBuilder.buildCarousel('🔥 Em Alta',             FALLBACK_DATA.slice(0, 10),                                          false, contentEl);
  CardBuilder.buildCarousel('▶ Continuar Assistindo', FALLBACK_DATA.slice(0, 4),                                           true,  contentEl);
  CardBuilder.buildCarousel('⭐ Mais Avaliados',       [FALLBACK_DATA[13], FALLBACK_DATA[12], FALLBACK_DATA[0], FALLBACK_DATA[2], FALLBACK_DATA[1]], false, contentEl);
  CardBuilder.buildCarousel('💥 Ação',                FALLBACK_DATA.filter(m => m.genre_ids[0] === 28),                    false, contentEl);
  CardBuilder.buildCarousel('🚀 Ficção Científica',   FALLBACK_DATA.filter(m => m.genre_ids[0] === 878),                   false, contentEl);
  CardBuilder.buildCarousel('🎭 Drama',               FALLBACK_DATA.filter(m => m.genre_ids[0] === 18),                    false, contentEl);
  CardBuilder.buildCarousel('😂 Comédia',             FALLBACK_DATA.filter(m => m.genre_ids[0] === 35),                    false, contentEl);
  CardBuilder.buildCarousel('😱 Terror & Suspense',   FALLBACK_DATA.filter(m => m.genre_ids[0] === 27),                    false, contentEl);
  CardBuilder.buildCarousel('🎨 Animações',           FALLBACK_DATA.filter(m => m.genre_ids[0] === 16),                    false, contentEl);
  CardBuilder.buildTop10Carousel('🏆 Top 10 Filmes no Brasil', FALLBACK_DATA.slice(0, 10),                  contentEl);
  CardBuilder.buildTop10Carousel('🏆 Top 10 Séries no Brasil', [...FALLBACK_DATA].reverse().slice(0, 10),   contentEl);
}

/* ══ INICIALIZAÇÃO ══ */
async function init() {
  try {
    const trendingData = await TMDB.get('trending/movie/week?');
    heroMovies = (trendingData.results || []).slice(0, 6);
    insertHeroSlides(heroMovies);
    heroLoader?.classList.add('hidden');
    showHero(0);
    fetchHeroLogos(heroMovies); // logos em background, sem bloquear

    const [popular, topRated, action, scifi, drama, comedy, horror, animation, nowPlaying] = await Promise.all([
      TMDB.get('movie/popular?'),
      TMDB.get('movie/top_rated?'),
      TMDB.get('discover/movie?with_genres=28&sort_by=popularity.desc'),
      TMDB.get('discover/movie?with_genres=878&sort_by=popularity.desc'),
      TMDB.get('discover/movie?with_genres=18&sort_by=popularity.desc'),
      TMDB.get('discover/movie?with_genres=35&sort_by=popularity.desc'),
      TMDB.get('discover/movie?with_genres=27&sort_by=popularity.desc'),
      TMDB.get('discover/movie?with_genres=16&sort_by=popularity.desc'),
      TMDB.get('movie/now_playing?'),
    ]);

    CardBuilder.buildCarousel('🔥 Em Alta',             (popular.results     || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('▶ Continuar Assistindo', (trendingData.results|| []).slice(0,  4), true,  contentEl);
    CardBuilder.buildCarousel('⭐ Mais Avaliados',       (topRated.results    || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('🎬 Nos Cinemas Agora',   (nowPlaying.results  || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('💥 Ação',                (action.results      || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('🚀 Ficção Científica',   (scifi.results       || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('🎭 Drama',               (drama.results       || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('😂 Comédia',             (comedy.results      || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('😱 Terror & Suspense',   (horror.results      || []).slice(0, 15), false, contentEl);
    CardBuilder.buildCarousel('🎨 Animações',           (animation.results   || []).slice(0, 15), false, contentEl);

    const [top10Filmes, top10Series] = await Promise.all([
      TMDB.get('movie/popular?region=BR'),
      TMDB.get('tv/popular?region=BR'),
    ]);
    CardBuilder.buildTop10Carousel('🏆 Top 10 Filmes no Brasil', (top10Filmes.results || []).slice(0, 10), contentEl);
    CardBuilder.buildTop10Carousel('🏆 Top 10 Séries no Brasil', (top10Series.results || []).slice(0, 10), contentEl);

  } catch(err) {
    console.error('Erro TMDB:', err);
    heroLoader?.classList.add('hidden');
    loadFallback();
  }
}

/* ── Partículas ── */
Helpers.createParticles(document.getElementById('particles'));

/* ── Start ── */
init();
