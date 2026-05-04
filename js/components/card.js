/* ══ CARD BUILDER ══
 * Construtores de cards e carrosséis reutilizados em home, catalog e search.
 * Depende de: TMDB, Helpers, Router
 */
const CardBuilder = (() => {

  function buildCard(m, wide = false) {
    const poster   = m.localPoster || (m.poster_path   ? TMDB.img(m.poster_path,   'w500') : '');
    const backdrop = m.localBg     || (m.backdrop_path ? TMDB.img(m.backdrop_path, 'w780') : poster);
    const year     = Helpers.getYear(m.release_date || m.first_air_date);
    const title    = m.title || m.name || '';
    const imgSrc   = wide ? backdrop : poster;
    const progress = wide ? Math.floor(Math.random() * 70 + 20) : null;
    const type     = m.media_type || (m.first_air_date !== undefined && !m.release_date ? 'tv' : 'movie');

    const card = document.createElement('div');
    card.className = 'card' + (wide ? ' wide' : '');
    if (m.id) card.onclick = () => Router.navigate(`details.html?id=${m.id}&type=${type}`);

    card.innerHTML = `
      <img class="card-poster" src="${imgSrc}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
      <div class="card-hover">
        <div class="card-play">▶</div>
        <div class="card-title">${title}</div>
        <div class="card-meta">${year}${m.vote_average ? ' · ⭐ ' + m.vote_average.toFixed(1) : ''}</div>
      </div>
      ${wide ? `<div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>` : ''}
    `;
    return card;
  }

  function buildCarousel(title, movies, wide, contentEl) {
    if (!movies || !movies.length) return null;
    const sec = document.createElement('div');
    sec.className = 'row';
    sec.innerHTML = `
      <div class="row-header">
        <span class="row-title">${title}</span>
        <span class="row-see">Ver tudo →</span>
      </div>
      <div class="carousel"></div>
    `;
    const car = sec.querySelector('.carousel');
    movies.forEach(m => car.appendChild(buildCard(m, wide)));
    Helpers.dragScroll(car);
    if (contentEl) contentEl.appendChild(sec);
    return sec;
  }

  function buildTop10Card(m, index) {
    const poster = m.localPoster || (m.poster_path ? TMDB.img(m.poster_path, 'w500') : '');
    const title  = m.title || m.name || '';
    const year   = Helpers.getYear(m.release_date || m.first_air_date || m.year || '');
    const type   = m.media_type || (m.first_air_date !== undefined && !m.release_date ? 'tv' : 'movie');

    const wrap = document.createElement('div');
    wrap.className = 'top10-card-wrap';
    if (m.id) wrap.onclick = () => Router.navigate(`details.html?id=${m.id}&type=${type}`);

    wrap.innerHTML = `
      <div class="top10-number">${index + 1}</div>
      <img class="top10-poster" src="${poster}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%230e0e18%22/%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22140%22%20r%3D%2228%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff20%22%20stroke-width%3D%222%22/%3E%3Cpath%20d%3D%22M88%20134%20l12-8%20l12%208%22%20fill%3D%22%23ffffff20%22/%3E%3C/svg%3E'">
      <div class="top10-hover">
        <div class="top10-play">▶</div>
        <div class="top10-title">${title}</div>
        <div class="top10-meta">${year}${m.vote_average ? ' · ⭐ ' + m.vote_average.toFixed(1) : ''}</div>
      </div>
    `;
    return wrap;
  }

  function buildTop10Carousel(title, movies, contentEl) {
    const sec = document.createElement('div');
    sec.className = 'row top10-row';
    sec.innerHTML = `
      <div class="row-header"><span class="row-title">${title}</span></div>
      <div class="top10-carousel"></div>
    `;
    const car = sec.querySelector('.top10-carousel');
    movies.slice(0, 10).forEach((m, i) => car.appendChild(buildTop10Card(m, i)));
    Helpers.dragScroll(car);
    if (contentEl) contentEl.appendChild(sec);
    return sec;
  }

  return { buildCard, buildCarousel, buildTop10Card, buildTop10Carousel };
})();
