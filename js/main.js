/* ══ MAIN ══
 * Ponto de entrada compartilhado — carregado em todas as páginas
 * após os utilitários e o script de página específico.
 * Ordem de inclusão obrigatória:
 *   1. js/api/tmdb.js
 *   2. js/utils/storage.js
 *   3. js/utils/helpers.js
 *   4. js/utils/router.js
 *   5. js/components/card.js      (quando necessário)
 *   6. js/components/sidebar.js   (quando necessário)
 *   7. js/components/modal.js     (quando necessário)
 *   8. js/pages/<pagina>.js
 *   9. js/main.js
 */

// Header scroll effect — presente em home, catalog, search, details
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
})();
