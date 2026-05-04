/* ══ STORAGE ══
 * Centraliza leitura/escrita no localStorage.
 * Chaves: cygnus_profile, cygnus_recent
 */
const Storage = (() => {
  const PROFILE_KEY = 'cygnus_profile';
  const RECENT_KEY  = 'cygnus_recent';

  function getProfile() {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  function setProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
    catch(e) { return []; }
  }

  function addRecent(query) {
    const updated = [query, ...getRecent().filter(r => r !== query)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  }

  function removeRecent(query) {
    const updated = getRecent().filter(r => r !== query);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  }

  return { getProfile, setProfile, getRecent, addRecent, removeRecent };
})();
