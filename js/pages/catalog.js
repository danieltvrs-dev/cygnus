/* ══ CATALOG PAGE ══
 * Depende de: TMDB, Storage, Helpers, Router, CardBuilder
 * Fix: chamadas agora usam o proxy (TMDB.get) em vez de TMDB direto
 */

const GENRES_CATALOG = [
  { id: 28,    name: 'Ação'            },
  { id: 12,    name: 'Aventura'        },
  { id: 16,    name: 'Animação'        },
  { id: 35,    name: 'Comédia'         },
  { id: 18,    name: 'Drama'           },
  { id: 10751, name: 'Família'         },
  { id: 14,    name: 'Fantasia'        },
  { id: 36,    name: 'História'        },
  { id: 27,    name: 'Terror'          },
  { id: 9648,  name: 'Mistério'        },
  { id: 10749, name: 'Romance'         },
  { id: 878,   name: 'Sci-Fi'          },
  { id: 53,    name: 'Suspense'        },
  { id: 10752, name: 'Guerra'          },
  { id: 37,    name: 'Faroeste'        },
  { id: 80,    name: 'Crime'           },
];

/* ── Estado da página ── */
let catalogState = {
  type: 'all', genre: null, year: 'all', sort: 'popularity.desc',
  view: 'grid', page: 1, total: 0, loading: false,
};

/* ── Constrói chips de gênero ── */
function buildGenreChips() {
  const wrap = document.getElementById('genreChips');
  if (!wrap) return;

  const all = document.createElement('button');
  all.className = 'genre-chip active';
  all.textContent = 'Todos os gêneros';
  all.onclick = () => setGenre(null, all);
  wrap.appendChild(all);

  GENRES_CATALOG.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'genre-chip';
    btn.textContent = g.name;
    btn.onclick = () => setGenre(g.id, btn);
    wrap.appendChild(btn);
  });
}

/* ── Filtros ── */
function setType(type, el) {
  catalogState.type = type;
  catalogState.page = 1;
  document.querySelectorAll('#filtersBar .filter-group:first-child .filter-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  catalogLoad(true);
}

function setYear(year, el) {
  catalogState.year = year;
  catalogState.page = 1;
  document.querySelectorAll('#filtersBar .filter-group:last-child .filter-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  catalogLoad(true);
}

function setGenre(id, el) {
  catalogState.genre = id;
  catalogState.page  = 1;
  document.querySelectorAll('.genre-chip').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  catalogLoad(true);
}

function applySort() {
  catalogState.sort = document.getElementById('sortSelect').value;
  catalogState.page = 1;
  catalogLoad(true);
}

function setView(view) {
  catalogState.view = view;
  document.getElementById('catalogGrid').classList.toggle('list-view', view === 'list');
  document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
}

/* ── Monta endpoint ── */
function buildCatalogURL() {
  const isTV     = catalogState.type === 'tv';
  const endpoint = isTV ? 'discover/tv' : 'discover/movie';
  let params     = `sort_by=${catalogState.sort}&page=${catalogState.page}`;

  if (catalogState.genre) params += `&with_genres=${catalogState.genre}`;

  if (catalogState.year !== 'all') {
    const key = isTV ? 'first_air_date' : 'release_date';
    if      (catalogState.year === '2024')    params += `&${key}.gte=2024-01-01&${key}.lte=2024-12-31`;
    else if (catalogState.year === '2023')    params += `&${key}.gte=2023-01-01&${key}.lte=2023-12-31`;
    else if (catalogState.year === '2020')    params += `&${key}.gte=2020-01-01&${key}.lte=2029-12-31`;
    else if (catalogState.year === '2010')    params += `&${key}.gte=2010-01-01&${key}.lte=2019-12-31`;
    else if (catalogState.year === '2000')    params += `&${key}.gte=2000-01-01&${key}.lte=2009-12-31`;
    else if (catalogState.year === 'classic') params += `&${key}.lte=1999-12-31`;
  }

  if (catalogState.type === 'all') return `discover/movie?${params}`;
  return `${endpoint}?${params}`;
}

/* ── Carrega resultados ── */
async function catalogLoad(reset = false) {
  if (catalogState.loading) return;
  catalogState.loading = true;

  if (reset) {
    catalogState.page = 1;
    document.getElementById('catalogGrid').innerHTML = '';
    document.getElementById('loadingGrid').style.display = 'grid';
    document.getElementById('catalogWrap').style.display = 'none';
    document.getElementById('loadMoreWrap').style.display = 'none';
    document.getElementById('emptyWrap').style.display = 'none';
  }

  try {
    let results = [], total = 0;

    if (catalogState.type === 'all') {
      const url = buildCatalogURL();
      const [movies, shows] = await Promise.all([
        TMDB.get(url),
        TMDB.get(url.replace('discover/movie', 'discover/tv')),
      ]);
      const m = (movies.results || []).map(r => ({ ...r, media_type: 'movie' }));
      const s = (shows.results  || []).map(r => ({ ...r, media_type: 'tv'    }));
      results = [...m, ...s].sort((a, b) => b.popularity - a.popularity);
      total   = Math.max(movies.total_results || 0, shows.total_results || 0);
    } else {
      const data = await TMDB.get(buildCatalogURL());
      results = (data.results || []).map(r => ({ ...r, media_type: catalogState.type }));
      total   = data.total_results || 0;
    }

    catalogState.total = total;
    renderCatalogCards(results, reset);
  } catch(e) {
    console.error(e);
    renderCatalogCards([], reset);
  }

  catalogState.loading = false;
}

/* ── Renderiza cards no grid ── */
function renderCatalogCards(results, reset) {
  const grid   = document.getElementById('catalogGrid');
  const loader = document.getElementById('loadingGrid');
  const wrap   = document.getElementById('catalogWrap');
  const empty  = document.getElementById('emptyWrap');
  const lmWrap = document.getElementById('loadMoreWrap');
  const label  = document.getElementById('resultsLabel');
  const sub    = document.getElementById('catalogSubtitle');

  loader.style.display = 'none';
  wrap.style.display   = results.length ? 'block' : 'none';
  empty.style.display  = !results.length ? 'flex' : 'none';

  const total = catalogState.total.toLocaleString('pt-BR');
  if (label) label.innerHTML = `<strong>${total}</strong> títulos encontrados`;
  if (sub)   sub.textContent  = `${total} títulos no catálogo Cygnus`;

  results.forEach((m, i) => {
    const title  = m.title || m.name || '';
    const year   = Helpers.getYear(m.release_date || m.first_air_date);
    const rating = m.vote_average ? m.vote_average.toFixed(1) : '';
    const poster = m.poster_path  ? TMDB.img(m.poster_path, 'w342') : '';
    const backdrop = m.backdrop_path ? TMDB.img(m.backdrop_path, 'original') : poster;
    const type   = m.media_type === 'tv' ? 'SÉRIE' : 'FILME';
    const delay  = reset ? (i * 30) : 0;

    const _pp = new URLSearchParams();
    if (m.id)         _pp.set('id', m.id);
    if (m.media_type) _pp.set('type', m.media_type);
    if (title)        _pp.set('title', encodeURIComponent(title));
    if (backdrop)     _pp.set('backdrop', encodeURIComponent(backdrop));
    const playerUrl = `player.html?${_pp.toString()}`;

    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.animationDelay = `${Math.min(delay, 600)}ms`;
    card.onclick = () => Router.navigate(`details.html?id=${m.id}&type=${m.media_type}`);

    card.innerHTML = `
      <span class="movie-type-badge">${type}</span>
      <img class="movie-poster" src="${poster}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
      <div class="movie-hover">
        <div class="movie-play">▶</div>
        <div class="movie-info">
          <div class="movie-title">${title}</div>
          <div class="movie-meta">
            <span>${year}</span>
            ${rating ? `<span>·</span><span class="movie-rating">⭐ ${rating}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="list-card-inner">
        <img class="list-thumb" src="${poster}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
        <div class="list-info">
          <div class="list-title">${title}</div>
          <div class="list-meta">
            <span>${year}</span>
            ${rating ? `<span class="list-rating">⭐ ${rating}</span>` : ''}
            <span>${type}</span>
          </div>
          <div class="list-desc">${m.overview || ''}</div>
        </div>
        <button class="list-play" onclick="event.stopPropagation();Router.navigate('${playerUrl}')">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  lmWrap.style.display = results.length >= 20 ? 'flex' : 'none';
  if (catalogState.view === 'list') grid.classList.add('list-view');
}

/* ── Carregar mais ── */
async function loadMore() {
  catalogState.page++;
  const btn = document.getElementById('loadMoreBtn');
  btn.classList.add('loading');
  btn.innerHTML = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
    style="animation:spin 0.8s linear infinite">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
  </svg> Carregando...`;
  await catalogLoad(false);
  btn.classList.remove('loading');
  btn.innerHTML = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
  </svg> Carregar mais`;
}

/* ── Init — lê parâmetros da URL ── */
(function initCatalogFromURL() {
  const params = new URLSearchParams(window.location.search);
  const type   = params.get('type');   // 'movie' | 'tv'
  const sort   = params.get('sort');   // ex: 'vote_average.desc'
  const year   = params.get('year');   // ex: '2024'

  if (type === 'movie' || type === 'tv') {
    catalogState.type = type;
    document.querySelectorAll('#filtersBar .filter-group:first-child .filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.type === type);
    });
  }

  if (sort) {
    catalogState.sort = sort;
    const sel = document.getElementById('sortSelect');
    if (sel) sel.value = sort;
  }

  if (year) {
    catalogState.year = year;
    document.querySelectorAll('#filtersBar .filter-group:last-child .filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.year === year);
    });
  }
})();

buildGenreChips();
catalogLoad(true);
