/* ══ ROUTER ══
 * Utilitários para leitura de parâmetros de URL e navegação.
 */
const Router = (() => {

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getParam(name) {
    return getParams().get(name);
  }

  function navigate(url) {
    window.location.href = url;
  }

  return { getParams, getParam, navigate };
})();
