/* ══ SIDEBAR / PROFILE PILL ══
 * Carrega o perfil ativo do localStorage no pill do header.
 * Presente em todas as páginas com header (home, catalog, search, details).
 */
function loadProfilePill() {
  const profile  = Storage.getProfile();
  const nameEl   = document.getElementById('profileName');
  const avatarEl = document.getElementById('profileAvatar');
  if (nameEl   && profile.name)   nameEl.textContent = profile.name;
  if (avatarEl && profile.avatar) { avatarEl.src = profile.avatar; avatarEl.alt = profile.name || ''; }
}

document.addEventListener('DOMContentLoaded', loadProfilePill);
