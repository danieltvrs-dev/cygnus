/* ══ TMDB API CLIENT ══
 * Chama a API da TMDB diretamente do browser — sem depender do proxy.
 * O proxy (proxy.js) continua disponível para ocultar a chave em
 * produção, mas não é obrigatório para rodar o projeto localmente.
 *
 * Uso:
 *   TMDB.get('trending/movie/week') → Promise<Object>
 *   TMDB.img('/abc.jpg', 'w500')   → URL string da imagem
 */
const TMDB = (() => {
  const API_KEY = '9eea5f5004e33e5c7aa7eaf9eb8197c3';
  const BASE    = 'https://api.themoviedb.org/3';
  const IMG     = 'https://image.tmdb.org/t/p'; // URL oficial conforme /3/configuration

  async function get(endpoint) {
    // Remove "?" isolado no final (legado de chamadas antigas)
    const clean = endpoint.replace(/\?+$/, '');
    const sep   = clean.includes('?') ? '&' : '?';
    const url   = `${BASE}/${clean}${sep}api_key=${API_KEY}&language=pt-BR`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return res.json();
  }

  function img(path, size = 'w500') {
    if (!path) return '';
    return `${IMG}/${size}${path}`;
  }

  return { get, img };
})();
