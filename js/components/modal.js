/* ══ MODAL ══
 * Utilitário genérico para abrir/fechar modais.
 * Usado em profiles.html (modal de edição de perfil).
 */
const Modal = (() => {

  function open(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function close(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function bindBackdrop(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { if (e.target === el) close(id); });
  }

  return { open, close, bindBackdrop };
})();
