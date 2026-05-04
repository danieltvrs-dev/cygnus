/* ══ SEARCH PAGE ══
 * Depende de: TMDB, Storage, Helpers, Router
 * Fix: chamadas usam o proxy (TMDB.get)
 */

const GENRES_SEARCH = [
  { id: 28,    name: 'Ação',             color: '#C4202A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>' },
  { id: 12,    name: 'Aventura',         color: '#1E8A6E', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>' },
  { id: 16,    name: 'Animação',         color: '#D4A017', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>' },
  { id: 35,    name: 'Comédia',          color: '#E8A000', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z"/></svg>' },
  { id: 18,    name: 'Drama',            color: '#5A3A8A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>' },
  { id: 10751, name: 'Família',          color: '#4FC3F7', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>' },
  { id: 14,    name: 'Fantasia',         color: '#7A3A8A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>' },
  { id: 36,    name: 'História',         color: '#8A6A1A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>' },
  { id: 27,    name: 'Terror',           color: '#3A6A3A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>' },
  { id: 9648,  name: 'Mistério',         color: '#2A4A6A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>' },
  { id: 10749, name: 'Romance',          color: '#C42A6A', svg: '<svg width="26" height="26" fill="white" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>' },
  { id: 878,   name: 'Ficção Científica', color: '#4A8FA8', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>' },
  { id: 53,    name: 'Suspense',         color: '#8A5A2A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
  { id: 10752, name: 'Guerra',           color: '#6A3A3A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>' },
  { id: 37,    name: 'Faroeste',         color: '#8A6A1A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>' },
  { id: 80,    name: 'Crime',            color: '#4A2A6A', svg: '<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286zm0 13.036h.008v.008H12v-.008z"/></svg>' },
];

/* ── Estado ── */
let searchCurrentFilter  = 'all';
let searchCurrentResults = [];
let searchTimer          = null;

/* ── Constrói cards de gênero ── */
async function buildGenres() {
  const grid = document.getElementById('genreGrid');
  if (!grid) return;

  async function getGenreBackdrop(genreId) {
    try {
      const data = await TMDB.get(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`);
      const movie = (data.results || []).find(m => m.backdrop_path);
      return movie ? TMDB.img(movie.backdrop_path, 'w780') : null;
    } catch(e) { return null; }
  }

  GENRES_SEARCH.forEach(g => {
    const card = document.createElement('div');
    card.className = 'genre-card';
    card.id = `genre-${g.id}`;
    card.onclick = () => searchByGenre(g.id, g.name);
    card.innerHTML = `
      <div class="genre-card-bg" id="genre-bg-${g.id}" style="background:linear-gradient(135deg,${g.color}88,${g.color}44);"></div>
      <div class="genre-card-overlay" style="background:linear-gradient(to top, rgba(7,7,13,0.85) 0%, ${g.color}55 100%);">
        <div>
          <div style="margin-bottom:8px;opacity:0.85;">${g.svg}</div>
          <div class="genre-card-name">${g.name}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);

    getGenreBackdrop(g.id).then(url => {
      if (!url) return;
      const bg = document.getElementById(`genre-bg-${g.id}`);
      if (!bg) return;
      const img = new Image();
      img.onload = () => {
        bg.style.backgroundImage    = `url('${url}')`;
        bg.style.backgroundSize     = 'cover';
        bg.style.backgroundPosition = 'center';
        bg.style.filter             = 'brightness(0.55)';
      };
      img.src = url;
    });
  });
}

/* ── Pesquisas recentes ── */
function buildRecent() {
  const searches = Storage.getRecent();
  const list = document.getElementById('recentList');
  const sec  = document.getElementById('recentSection');
  if (!list || !sec) return;
  if (!searches.length) { sec.style.display = 'none'; return; }
  sec.style.display = '';
  list.innerHTML = '';
  searches.slice(0, 6).forEach(q => {
    const el = document.createElement('div');
    el.className = 'recent-item';
    el.innerHTML = `
      <span class="recent-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
      <span>${q}</span>
      <span class="recent-remove" onclick="removeRecentItem(event,'${q.replace(/'/g, "\\'")}')">✕</span>
    `;
    el.onclick = () => {
      document.getElementById('searchInput').value = q;
      performSearch(q);
    };
    list.appendChild(el);
  });
}

function removeRecentItem(e, q) {
  e.stopPropagation();
  Storage.removeRecent(q);
  buildRecent();
}

/* ── Evento de input na busca ── */
document.getElementById('searchInput').addEventListener('input', function() {
  const val = this.value.trim();
  document.getElementById('clearBtn').classList.toggle('show', val.length > 0);
  clearTimeout(searchTimer);
  if (!val) { showBrowse(); return; }
  searchTimer = setTimeout(() => performSearch(val, false), 400);
});

/* ── Salva pesquisa só no Enter ── */
document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const val = this.value.trim();
  if (!val) return;
  clearTimeout(searchTimer);
  performSearch(val, true);
});

/* ── Busca principal ── */
async function performSearch(query, saveRecent = false) {
  if (!query.trim()) { showBrowse(); return; }
  if (saveRecent) { Storage.addRecent(query); buildRecent(); }
  showLoading();

  try {
    let results = [];

    if (searchCurrentFilter === 'all') {
      const [movies, shows] = await Promise.all([
        TMDB.get(`search/movie?query=${encodeURIComponent(query)}`),
        TMDB.get(`search/tv?query=${encodeURIComponent(query)}`),
      ]);
      const m = (movies.results || []).map(r => ({ ...r, media_type: 'movie' }));
      const s = (shows.results  || []).map(r => ({ ...r, media_type: 'tv'    }));
      results = [...m, ...s].sort((a, b) => b.popularity - a.popularity);
    } else if (searchCurrentFilter === 'movie') {
      const d = await TMDB.get(`search/movie?query=${encodeURIComponent(query)}`);
      results = (d.results || []).map(r => ({ ...r, media_type: 'movie' }));
    } else if (searchCurrentFilter === 'tv') {
      const d = await TMDB.get(`search/tv?query=${encodeURIComponent(query)}`);
      results = (d.results || []).map(r => ({ ...r, media_type: 'tv' }));
    } else {
      const d = await TMDB.get(`search/movie?query=${encodeURIComponent(query)}&with_genres=${searchCurrentFilter}`);
      results = (d.results || []).map(r => ({ ...r, media_type: 'movie' }));
    }

    searchCurrentResults = results;
    renderResults(results, query);
  } catch(e) {
    renderResults([], query);
  }
}

/* ── Busca por gênero ── */
async function searchByGenre(genreId, genreName) {
  document.getElementById('searchInput').value = genreName;
  document.getElementById('clearBtn').classList.add('show');
  showLoading();

  try {
    const [movies, shows] = await Promise.all([
      TMDB.get(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc`),
      TMDB.get(`discover/tv?with_genres=${genreId}&sort_by=popularity.desc`),
    ]);
    const m = (movies.results || []).map(r => ({ ...r, media_type: 'movie' }));
    const s = (shows.results  || []).map(r => ({ ...r, media_type: 'tv'    }));
    const results = [...m, ...s].sort((a, b) => b.popularity - a.popularity);
    searchCurrentResults = results;
    renderResults(results, genreName);
  } catch(e) {
    renderResults([], genreName);
  }
}

/* ── Renderiza resultados ── */
function renderResults(results, query) {
  if (!results.length) { showEmpty(); return; }

  const grid  = document.getElementById('resultsGrid');
  const count = document.getElementById('resultsCount');
  count.innerHTML = `<strong>${results.length}</strong> resultado${results.length !== 1 ? 's' : ''} para "<strong>${query}</strong>"`;

  grid.innerHTML = '';
  results.slice(0, 40).forEach(m => {
    const title  = m.title || m.name || '';
    const year   = Helpers.getYear(m.release_date || m.first_air_date);
    const rating = m.vote_average ? m.vote_average.toFixed(1) : '';
    const poster = m.poster_path  ? TMDB.img(m.poster_path, 'w342') : '';
    const type   = m.media_type === 'tv' ? 'Série' : 'Filme';

    const card = document.createElement('div');
    card.className = 'result-card';
    card.onclick = () => {
      const q = document.getElementById('searchInput').value.trim();
      if (q) { Storage.addRecent(q); buildRecent(); }
      Router.navigate(`details.html?id=${m.id}&type=${m.media_type}`);
    };
    card.innerHTML = `
      <img class="result-poster" src="${poster}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
      <div class="result-hover">
        <div class="result-play">▶</div>
        <div class="result-title">${title}</div>
        <div class="result-meta">${year}${rating ? ` · <span class="result-rating">⭐ ${rating}</span>` : ''} · ${type}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  showResults();
}

/* ── Ordenação ── */
function sortResults() {
  const sort = document.getElementById('sortSelect').value;
  let sorted = [...searchCurrentResults];
  if      (sort === 'rating') sorted.sort((a, b) => b.vote_average - a.vote_average);
  else if (sort === 'date')   sorted.sort((a, b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
  else if (sort === 'title')  sorted.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
  else                        sorted.sort((a, b) => b.popularity - a.popularity);
  renderResults(sorted, document.getElementById('searchInput').value);
}

/* ── Filtros de tipo ── */
function setFilter(filter, btn) {
  searchCurrentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const q = document.getElementById('searchInput').value.trim();
  if (q) performSearch(q);
}

/* ── Estados de UI ── */
function showBrowse() {
  document.getElementById('browseState').style.display = 'block';
  document.getElementById('loadingState').classList.remove('show');
  document.getElementById('resultsState').classList.remove('show');
  document.getElementById('emptyState').classList.remove('show');
}

function showLoading() {
  document.getElementById('browseState').style.display = 'none';
  document.getElementById('loadingState').classList.add('show');
  document.getElementById('resultsState').classList.remove('show');
  document.getElementById('emptyState').classList.remove('show');
}

function showResults() {
  document.getElementById('browseState').style.display = 'none';
  document.getElementById('loadingState').classList.remove('show');
  document.getElementById('resultsState').classList.add('show');
  document.getElementById('emptyState').classList.remove('show');
}

function showEmpty() {
  document.getElementById('browseState').style.display = 'none';
  document.getElementById('loadingState').classList.remove('show');
  document.getElementById('resultsState').classList.remove('show');
  document.getElementById('emptyState').classList.add('show');
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('clearBtn').classList.remove('show');
  searchCurrentResults = [];
  showBrowse();
  buildRecent();
  document.getElementById('searchInput').focus();
}

/* ── Init ── */
buildGenres();
buildRecent();
