/* ══ DETAILS PAGE ══
 * Depende de: TMDB, Storage, Helpers, Router
 * Fix: usa proxy (TMDB.get / TMDB.img) em vez de chamadas diretas
 */

/* ── Banco de dados local para fallback ── */
const LOCAL_MOVIES = {
  inter: {
    title: 'Interestelar', year: '2014', dur: '2h 49m', rating: 'L',
    desc: 'As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial. Cooper aceita a missão sabendo que pode nunca mais ver os filhos.',
    bg:     'assets/images/backdrops/inter-bg.webp',
    poster: 'assets/images/posters/inter.webp',
    accent: '#4A8FA8',
    genres: ['Ficção Científica', 'Drama', 'Aventura'],
    director: 'Christopher Nolan',
    score: 8.7,
    cast: [
      { name: 'Matthew McConaughey', char: 'Cooper',     img: 'https://i.pravatar.cc/150?img=11' },
      { name: 'Anne Hathaway',       char: 'Brand',      img: 'https://i.pravatar.cc/150?img=47' },
      { name: 'Jessica Chastain',    char: 'Murph',      img: 'https://i.pravatar.cc/150?img=45' },
      { name: 'Michael Caine',       char: 'Prof. Brand', img: 'https://i.pravatar.cc/150?img=12' },
      { name: 'Matt Damon',          char: 'Mann',       img: 'https://i.pravatar.cc/150?img=15' },
      { name: 'Casey Affleck',       char: 'Tom',        img: 'https://i.pravatar.cc/150?img=14' },
    ],
  },
};

/* ── Estado do filme atual (usado pelo player) ── */
let _playerBackdrop = 'assets/images/backdrops/inter-bg.webp';

/* ── Cor de destaque dinâmica ── */
function setAccentColor(hex) {
  if (!hex || hex.length < 7) hex = '#F5C518';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-rgb', `${r},${g},${b}`);
  document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.28)`);
}

/* ── Renderiza dados locais (fallback imediato) ── */
function renderLocal(m) {
  _playerBackdrop = m.bg;
  setAccentColor(m.accent);
  document.getElementById('heroBg').style.backgroundImage = `url('${m.bg}')`;
  document.getElementById('posterImg').src = m.poster;
  document.getElementById('movieTitle').textContent = m.title;
  document.title = `Cygnus — ${m.title}`;

  document.getElementById('movieBadges').innerHTML =
    `<span class="badge badge-genre">${m.genres[0]}</span>
     <span class="badge badge-rating">${m.rating}</span>
     <span class="badge badge-year">${m.year}</span>`;

  document.getElementById('movieMeta').innerHTML =
    `<div class="meta-rating">${Helpers.stars(m.score)}<span>${m.score}</span></div>
     <div class="meta-dot"></div>
     <div class="meta-item">
       <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/></svg>
       ${m.dur}
     </div>
     <div class="meta-dot"></div>
     <div class="meta-item">${m.year}</div>`;

  document.getElementById('movieDesc').textContent = m.desc;

  const cg = document.getElementById('castGrid');
  cg.innerHTML = '';
  m.cast.forEach(c => {
    const el = document.createElement('div');
    el.className = 'cast-card';
    el.innerHTML = `<img class="cast-avatar" src="${c.img}" alt="${c.name}"><span class="cast-name">${c.name}</span>`;
    cg.appendChild(el);
  });

  document.getElementById('infoPanel').innerHTML = `
    <div><p class="info-label">Diretor</p><p class="info-value accent">${m.director}</p></div>
    <div><p class="info-label">Gêneros</p><div class="genre-tags">${m.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}</div></div>
    <div><p class="info-label">Duração</p><p class="info-value">${m.dur}</p></div>
    <div><p class="info-label">Lançamento</p><p class="info-value">${m.year}</p></div>
    <div><p class="info-label">Classificação</p><p class="info-value">${m.rating}</p></div>
    <div><p class="info-label">Avaliação</p><p class="info-value">${m.score} / 10</p></div>
  `;

  const car = document.getElementById('simCarousel');
  car.innerHTML = '';
  ['Gravidade', 'A Chegada', 'Marte', 'Ad Astra', '2001: Uma Odisseia', 'Contato', 'Arrival', 'Europa Report'].forEach((t, i) => {
    const c = document.createElement('div');
    c.className = 'sim-card';
    c.innerHTML = `
      <img class="sim-poster" src="${m.poster}" alt="${t}">
      <div class="sim-overlay">
        <div class="sim-play">▶</div>
        <div class="sim-name">${t}</div>
        <div class="sim-meta">${2010 + i}</div>
      </div>`;
    car.appendChild(c);
  });
  Helpers.dragScroll(car);
}

/* ── Renderiza dados da API ── */
function renderAPI(movie, credits, similar) {
  setAccentColor('#F5C518');

  const heroBg = document.getElementById('heroBg');
  const heroEl = document.querySelector('.movie-hero');
  if (movie.backdrop_path) {
    _playerBackdrop = TMDB.img(movie.backdrop_path, 'original');
    heroBg.style.backgroundImage = `url('${_playerBackdrop}')`;
    heroEl?.classList.remove('poster-bg');
  } else if (movie.poster_path) {
    /* Sem backdrop: usa poster borrado como fundo */
    heroBg.style.backgroundImage = `url('${TMDB.img(movie.poster_path, 'w780')}')`;
    heroEl?.classList.add('poster-bg');
  }

  if (movie.poster_path)
    document.getElementById('posterImg').src = TMDB.img(movie.poster_path, 'w500');

  const title = movie.title || movie.name || '';
  document.getElementById('movieTitle').textContent = title;
  document.title = `Cygnus — ${title}`;

  const year = Helpers.getYear(movie.release_date);
  const dur  = Helpers.formatDuration(movie.runtime);

  document.getElementById('movieBadges').innerHTML =
    (movie.genres || []).slice(0, 2).map(g => `<span class="badge badge-genre">${g.name}</span>`).join('') +
    `<span class="badge badge-year">${year}</span>`;

  document.getElementById('movieMeta').innerHTML =
    `<div class="meta-rating">${Helpers.stars(movie.vote_average || 0)}<span>${(movie.vote_average || 0).toFixed(1)}</span></div>
     <div class="meta-dot"></div>
     <div class="meta-item">${dur}</div>
     <div class="meta-dot"></div>
     <div class="meta-item">${year}</div>`;

  document.getElementById('movieDesc').textContent = movie.overview || '';

  if (credits && credits.cast) {
    const cg = document.getElementById('castGrid');
    cg.innerHTML = '';
    credits.cast.slice(0, 8).forEach(c => {
      const img = c.profile_path ? TMDB.img(c.profile_path, 'w185') : `https://i.pravatar.cc/150?img=${c.id % 70}`;
      const el  = document.createElement('div');
      el.className = 'cast-card';
      /* aggregate_credits (TV) usa roles[0].character; credits (movie) usa .character */
      el.innerHTML = `<img class="cast-avatar" src="${img}" alt="${c.name}" onerror="this.src='https://i.pravatar.cc/150?img=${c.id % 70}'"><span class="cast-name">${c.name}</span>`;
      cg.appendChild(el);
    });
  }

  const dir = credits && credits.crew ? credits.crew.find(c => c.job === 'Director') : null;
  document.getElementById('infoPanel').innerHTML = `
    ${dir ? `<div><p class="info-label">Diretor</p><p class="info-value accent">${dir.name}</p></div>` : ''}
    <div><p class="info-label">Gêneros</p><div class="genre-tags">${(movie.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('')}</div></div>
    <div><p class="info-label">Duração</p><p class="info-value">${dur}</p></div>
    <div><p class="info-label">Lançamento</p><p class="info-value">${year}</p></div>
    <div><p class="info-label">Avaliação</p><p class="info-value">${(movie.vote_average || 0).toFixed(1)} / 10</p></div>
  `;

  if (similar && similar.results && similar.results.length) {
    const car = document.getElementById('simCarousel');
    car.innerHTML = '';
    similar.results.slice(0, 12).forEach(m => {
      const poster = m.poster_path ? TMDB.img(m.poster_path, 'w342') : '';
      const y      = Helpers.getYear(m.release_date);
      const c      = document.createElement('div');
      c.className  = 'sim-card';
      c.onclick    = () => Router.navigate(`details.html?id=${m.id}`);
      c.innerHTML  = `
        <img class="sim-poster" src="${poster}" alt="${m.title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
        <div class="sim-overlay">
          <div class="sim-play">▶</div>
          <div class="sim-name">${m.title}</div>
          <div class="sim-meta">${y} · ⭐ ${(m.vote_average || 0).toFixed(1)}</div>
        </div>`;
      car.appendChild(c);
    });
    Helpers.dragScroll(car);
  }
}

/* ── Botão Assistir ── */
function playMovie() {
  const id    = Router.getParam('id');
  const type  = Router.getParam('type') || 'movie';
  const title = document.getElementById('movieTitle')?.textContent || '';
  const params = new URLSearchParams();
  if (id)             params.set('id', id);
  if (type)           params.set('type', type);
  if (title)          params.set('title', encodeURIComponent(title));
  if (_playerBackdrop) params.set('backdrop', encodeURIComponent(_playerBackdrop));
  Router.navigate(`player.html?${params.toString()}`);
}

/* ── Botão Minha Lista ── */
document.getElementById('btnList')?.addEventListener('click', function() {
  const on = this.dataset.on === '1';
  this.dataset.on = on ? '0' : '1';
  this.innerHTML  = on
    ? '<svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg> Minha lista'
    : '<svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Adicionado';
  this.style.borderColor = on ? '' : 'var(--accent)';
  this.style.color       = on ? '' : 'var(--accent)';
});

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
      if (data[i + 3] < 20) continue;
      total++;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);
      if (brightness < 60 && saturation < 30) dark++;
    }
    return total > 0 && dark / total > 0.75;
  } catch { return false; }
}

/* ── Aplica logo oficial no título ── */
async function applyMovieLogo(id, type) {
  try {
    const data  = await TMDB.get(`${type}/${id}/images?include_image_language=pt-BR,pt,en,null`);
    const logos = data.logos || [];
    const best  = logos.find(l => l.iso_639_1 === 'pt' && l.iso_3166_1 === 'BR')
               || logos.find(l => l.iso_639_1 === 'pt')
               || logos.find(l => l.iso_639_1 === 'en')
               || logos[0];
    if (!best) return;
    const logoUrl = TMDB.img(best.file_path, 'w500');
    const titleEl = document.getElementById('movieTitle');
    if (!titleEl) return;

    /* Imagem de exibição — sem crossOrigin, sempre carrega */
    const img = document.createElement('img');
    img.className = 'movie-logo';
    img.alt       = titleEl.textContent;
    img.onerror   = () => img.replaceWith(titleEl);
    img.onload    = () => {
      titleEl.replaceWith(img);
      /* Sonda separada com cache-bust para análise de cor (CORS) */
      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload  = () => { if (isLogoDark(probe)) img.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(0,0,0,0.5))'; };
      probe.onerror = () => {};
      probe.src = logoUrl + '?_=1';
    };
    img.src = logoUrl;
  } catch { /* mantém texto */ }
}

/* ── Inicialização ── */
async function detailsInit() {
  const id    = Router.getParam('id');
  const local = Router.getParam('local') || 'inter';

  if (LOCAL_MOVIES[local]) renderLocal(LOCAL_MOVIES[local]);

  if (id) {
    try {
      const type        = Router.getParam('type') || 'movie';
      const creditsPath = type === 'tv' ? `tv/${id}/aggregate_credits?` : `movie/${id}/credits?`;
      const [movie, credits, similar] = await Promise.all([
        TMDB.get(`${type}/${id}?`),
        TMDB.get(creditsPath),
        TMDB.get(`${type}/${id}/similar?`),
      ]);
      renderAPI(movie, credits, similar);
      applyMovieLogo(id, type); // logo em background, sem bloquear
    } catch(e) {
      console.log('API indisponível, usando dados locais.');
    }
  }
}

detailsInit();
