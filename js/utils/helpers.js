/* ══ HELPERS ══
 * Utilitários compartilhados entre todas as páginas.
 */
const Helpers = (() => {

  function dragScroll(el) {
    let down = false, sx = 0, sl = 0;
    el.addEventListener('mousedown', e => {
      down = true;
      el.classList.add('grabbing');
      sx = e.pageX - el.offsetLeft;
      sl = el.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(ev =>
      el.addEventListener(ev, () => { down = false; el.classList.remove('grabbing'); })
    );
    el.addEventListener('mousemove', e => {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.5;
    });
  }

  function createParticles(container, count = 14, className = 'pt') {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = className;
      const sz = Math.random() * 2 + 0.4;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;` +
        `animation-duration:${Math.random()*16+12}s;animation-delay:${Math.random()*10}s;`;
      container.appendChild(p);
    }
  }

  function stars(score) {
    const s = Math.round(score / 2);
    return '<div class="stars">' +
      [1,2,3,4,5].map(i => `<span class="star ${i <= s ? 'full' : 'empty'}">★</span>`).join('') +
      '</div>';
  }

  function formatDuration(minutes) {
    if (!minutes) return '';
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }

  function getYear(dateStr) {
    return (dateStr || '').slice(0, 4);
  }

  return { dragScroll, createParticles, stars, formatDuration, getYear };
})();
