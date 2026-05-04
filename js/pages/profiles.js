/* ══ PROFILES PAGE ══
 * Depende de: Storage, TMDB
 */

/* ── Mapa de gêneros TMDB ── */
const GENRE_MAP = {
  28:'Ação', 12:'Aventura', 16:'Animação', 35:'Comédia',
  80:'Crime', 18:'Drama', 10751:'Família', 14:'Fantasia',
  36:'História', 27:'Terror', 10749:'Romance', 878:'Ficção Científica',
  53:'Thriller', 9648:'Mistério', 10759:'Ação & Aventura',
  10765:'Ficção Científica', 10762:'Infantil',
};

function mapGenres(ids = []) {
  return ids.slice(0, 2).map(id => GENRE_MAP[id]).filter(Boolean).join(' · ');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Detecta logo predominantemente preta ── */
function isLogoDark(img) {
  try {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    const w = Math.min(img.naturalWidth  || 200, 200);
    const h = Math.min(img.naturalHeight || 100, 100);
    canvas.width = w; canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let dark = 0, total = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 20) continue;
      total++;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if ((r + g + b) / 3 < 60 && Math.max(r, g, b) - Math.min(r, g, b) < 30) dark++;
    }
    return total > 0 && dark / total > 0.75;
  } catch { return false; }
}

/* ── Busca e aplica logos PT-BR nos slides ── */
async function fetchSlideLogos(movies) {
  for (const m of movies) {
    if (!m.id) continue;
    try {
      const type = m.type || 'movie';
      const data = await TMDB.get(`${type}/${m.id}/images?include_image_language=pt-BR,pt,en,null`);
      const logos = data.logos || [];
      const best  = logos.find(l => l.iso_639_1 === 'pt' && l.iso_3166_1 === 'BR')
                 || logos.find(l => l.iso_639_1 === 'pt')
                 || logos.find(l => l.iso_639_1 === 'en')
                 || logos[0];
      if (!best) continue;
      const logoUrl = TMDB.img(best.file_path, 'w500');
      const slide   = mainArea.querySelector(`.slide[data-id="${m.id}"]`);
      if (!slide) continue;
      const titleEl = slide.querySelector('.slide-title');
      if (!titleEl) continue;

      const img     = document.createElement('img');
      img.className = 'slide-logo';
      img.alt       = m.title || '';
      img.onerror   = () => img.replaceWith(titleEl);
      img.onload    = () => {
        titleEl.replaceWith(img);
        const probe = new Image();
        probe.crossOrigin = 'anonymous';
        probe.onload  = () => { if (isLogoDark(probe)) img.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(0,0,0,0.5))'; };
        probe.onerror = () => {};
        probe.src = logoUrl + '?_=1';
      };
      img.src = logoUrl;
    } catch { /* mantém título texto */ }
  }
}

/* ── Filmes kids (fallback) ── */
const KIDS_FALLBACK = [
  {
    id: 1241982, type: 'movie',
    title: 'MOANA 2', year: '2024', genres: 'Animação · Aventura',
    desc: 'Moana embarca em uma nova e ousada missão pelos mares distantes da Oceania.',
    bg: 'https://image.tmdb.org/t/p/original/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg',
    accent: '#1E8A6E',
  },
  {
    id: 1022789, type: 'movie',
    title: 'DIVERTIDA MENTE 2', year: '2024', genres: 'Animação · Comédia',
    desc: 'Riley está crescendo e novas emoções chegam, colocando tudo em desequilíbrio.',
    bg: 'https://image.tmdb.org/t/p/original/b3DNDJHFnkPOjXKGwTp3JUetzpW.jpg',
    accent: '#D4A017',
  },
  {
    id: 354912, type: 'movie',
    title: 'COCO', year: '2017', genres: 'Animação · Família',
    desc: 'Miguel sonha em se tornar um músico famoso, mas sua família proibiu a música por gerações.',
    bg: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg',
    accent: '#E05A1C',
  },
  {
    id: 508947, type: 'movie',
    title: 'LUCA', year: '2021', genres: 'Animação · Família',
    desc: 'Um jovem monstro marinho descobre a terra firme e vive um verão inesquecível na Itália.',
    bg: 'https://image.tmdb.org/t/p/original/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
    accent: '#3A8FC4',
  },
];

/* ── Busca conteúdo infantil da TMDB ── */
async function fetchKidsMovies() {
  try {
    const [animRes, famRes, tvRes] = await Promise.all([
      TMDB.get('discover/movie?with_genres=16&sort_by=popularity.desc&page=1'),
      TMDB.get('discover/movie?with_genres=10751&sort_by=popularity.desc&page=1'),
      TMDB.get('discover/tv?with_genres=16&sort_by=popularity.desc&page=1'),
    ]);

    const seen = new Set();
    const all  = [];

    for (const m of [...(animRes.results || []), ...(famRes.results || [])]) {
      if (!seen.has(m.id) && m.backdrop_path && m.overview) {
        seen.add(m.id);
        all.push({ ...m, _t: 'movie' });
      }
    }
    for (const m of (tvRes.results || [])) {
      if (!seen.has(m.id) && m.backdrop_path && m.overview) {
        seen.add(m.id);
        all.push({ ...m, _t: 'tv' });
      }
    }

    shuffle(all);
    return all.slice(0, 6).map(m => ({
      id:     m.id,
      type:   m._t,
      title:  (m.title || m.name || '').toUpperCase(),
      year:   (m.release_date || m.first_air_date || '').slice(0, 4),
      genres: mapGenres(m.genre_ids || []),
      desc:   m.overview || '',
      bg:     TMDB.img(m.backdrop_path, 'original'),
      accent: '#1E8A6E',
    }));
  } catch {
    return KIDS_FALLBACK;
  }
}

/* ── Filmes adultos (fallback) ── */
const ADULT_FALLBACK = [
  {
    id: 693134, type: 'movie',
    title: 'DUNA: PARTE DOIS', year: '2024', genres: 'Aventura · Ficção Científica',
    desc: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores.',
    bg: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    accent: '#C4A35A',
  },
  {
    id: 872585, type: 'movie',
    title: 'OPPENHEIMER', year: '2023', genres: 'Drama · História',
    desc: 'A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.',
    bg: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    accent: '#E06C1A',
  },
  {
    id: 157336, type: 'movie',
    title: 'INTERESTELAR', year: '2014', genres: 'Ficção Científica · Drama',
    desc: 'Um grupo de exploradores usa uma passagem de minhoca numa tentativa de garantir a sobrevivência da humanidade.',
    bg: 'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    accent: '#4A8FA8',
  },
  {
    id: 76600, type: 'movie',
    title: 'AVATAR: O CAMINHO DA ÁGUA', year: '2022', genres: 'Ação · Aventura',
    desc: "Jake Sully e Ney'tiri formaram uma família e devem explorar as novas regiões de Pandora.",
    bg: 'https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    accent: '#1A7A8A',
  },
];

/* ── Busca filmes reais da TMDB ── */
async function fetchAdultMovies() {
  try {
    const [moviesRes, tvRes] = await Promise.all([
      TMDB.get('trending/movie/week?page=1'),
      TMDB.get('trending/tv/week?page=1'),
    ]);
    const all = [
      ...(moviesRes.results || []),
      ...(tvRes.results    || []),
    ].filter(m => m.backdrop_path && m.overview);
    shuffle(all);
    return all.slice(0, 6).map(m => ({
      id:     m.id,
      type:   m.media_type || 'movie',
      title:  (m.title || m.name || '').toUpperCase(),
      year:   (m.release_date || m.first_air_date || '').slice(0, 4),
      genres: mapGenres(m.genre_ids || []),
      desc:   m.overview || '',
      bg:     TMDB.img(m.backdrop_path, 'original'),
      accent: '#F5C518',
    }));
  } catch {
    return ADULT_FALLBACK;
  }
}

/* ── Estado ── */
let adultMoviesData = [...ADULT_FALLBACK];
let kidsMoviesData  = [...KIDS_FALLBACK];
let currentMovies   = [...ADULT_FALLBACK];
let currentIndex    = 0;
let isKidsMode      = false;
let progressTimer   = null;
const DURATION      = 12000;

const mainArea = document.getElementById('mainArea');

/* ── Cria slide ── */
function createSlide(movie) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  if (movie.id) slide.dataset.id = movie.id;
  slide.innerHTML = `
    <div class="slide-bg" style="background-image:url('${movie.bg}')"></div>
    <div class="slide-overlay"></div>
    <div class="slide-content">
      <div class="slide-meta">
        <span class="slide-year">${movie.year}</span>
        ${movie.genres ? `<div class="slide-dot"></div><span class="slide-genre">${movie.genres}</span>` : ''}
      </div>
      <h1 class="slide-title">${movie.title}</h1>
      <p class="slide-desc">${movie.desc}</p>
    </div>
  `;
  return slide;
}

/* ── Monta slides ── */
function initSlides(movies) {
  if (movies) currentMovies = movies;
  mainArea.querySelectorAll('.slide').forEach(s => s.remove());
  const particles = document.getElementById('particles');
  currentMovies.forEach(movie => {
    const slide = createSlide(movie);
    if (particles) mainArea.insertBefore(slide, particles.nextSibling);
    else           mainArea.appendChild(slide);
  });
  currentIndex = 0;
  showSlide(0);
  /* Logos em background — não bloqueia a UI */
  fetchSlideLogos(currentMovies);
}

/* ── Mostra slide ── */
function showSlide(index) {
  mainArea.querySelectorAll('.slide').forEach((s, i) => {
    s.classList.remove('active', 'leaving');
    if (i === index) s.classList.add('active');
  });
  setAccent(currentMovies[index]?.accent || '#F5C518');
  startProgress();
}

/* ── Próximo slide ── */
function nextSlide() {
  const current = mainArea.querySelector('.slide.active');
  if (current) current.classList.add('leaving');
  currentIndex = (currentIndex + 1) % currentMovies.length;
  showSlide(currentIndex);
  setTimeout(() => {
    mainArea.querySelectorAll('.slide.leaving').forEach(s => s.classList.remove('leaving'));
  }, 1000);
}

/* ── Barra de progresso ── */
function startProgress() {
  const fill = document.getElementById('progressFill');
  if (!fill) return;
  clearTimeout(progressTimer);
  fill.style.transition = 'none';
  fill.style.width = '0%';
  void fill.offsetWidth;
  fill.style.transition = `width ${DURATION}ms linear`;
  fill.style.width = '100%';
  progressTimer = setTimeout(nextSlide, DURATION);
}

/* ── Cor de destaque ── */
function setAccent(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.4)`);
  const fill = document.getElementById('progressFill');
  if (fill) {
    fill.style.background  = color;
    fill.style.boxShadow   = `0 0 8px rgba(${r},${g},${b},0.6)`;
  }
}

/* ── Stagger de entrada dos perfis ── */
function animateProfiles() {
  document.querySelectorAll('.profile-item').forEach((item, i) => {
    item.style.cssText = 'opacity:0;transform:translateX(-14px);';
    setTimeout(() => {
      item.style.cssText = 'opacity:1;transform:translateX(0);transition:opacity 0.38s ease,transform 0.38s ease;';
      setTimeout(() => { item.style.cssText = ''; }, 400);
    }, i * 85 + 160);
  });
}

/* ── Perfil escolhido (aguardando confirmação) ── */
let chosenProfile = null;

/* ── 1º toque: seleciona; 2º toque no mesmo: entra ── */
function selectProfile(el) {
  if (el.classList.contains('add-profile')) return;

  /* Segundo toque no mesmo perfil → entra direto */
  if (chosenProfile === el) {
    doEnter(el);
    return;
  }

  /* Primeiro toque → destaca e mostra botão "Entrar" */
  document.querySelectorAll('.profile-item').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  chosenProfile = el;

  const name = el.querySelector('.profile-name')?.textContent || '';
  const lbl  = document.getElementById('enterLabel');
  if (lbl) lbl.textContent = `Entrar como ${name}`;
  document.getElementById('sidebarEnter')?.classList.add('visible');

  const ripple = el.querySelector('.sound-ripple');
  if (ripple) { ripple.classList.remove('animate'); void ripple.offsetWidth; ripple.classList.add('animate'); }

  const isKids = el.classList.contains('kids');
  if (isKids !== isKidsMode) {
    isKidsMode = isKids;
    document.body.classList.toggle('kids-mode', isKids);
    initSlides(isKids ? [...kidsMoviesData] : [...adultMoviesData]);
  }
}

/* ── Botão "Entrar como…" ── */
function enterSelected() {
  if (chosenProfile) doEnter(chosenProfile);
}

/* ── Navega para profile-intro com transição ── */
function doEnter(el) {
  const name   = el.querySelector('.profile-name')?.textContent || '';
  const avatar = el.querySelector('.profile-avatar')?.src || '';
  const isKids = el.classList.contains('kids');
  Storage.setProfile({ name, avatar, isKids });

  const overlay = document.getElementById('transitionOverlay');
  if (overlay) overlay.classList.add('active');
  setTimeout(() => { window.location.href = 'profile-intro.html'; }, 460);
}

/* ══ AVATARES — DiceBear ══ */
const AVATARS = [
  /* Adventurer (cartoon) */
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4&radius=10',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=ffdfbf&radius=10',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=c0aede&radius=10',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia&backgroundColor=ffd5dc&radius=10',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Noah&backgroundColor=d1d4f9&radius=10',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma&backgroundColor=b6e3f4&radius=10',
  /* Pixel Art */
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex&backgroundColor=1a1a2e&radius=10',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jamie&backgroundColor=16213e&radius=10',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Morgan&backgroundColor=0f3460&radius=10',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Casey&backgroundColor=1a1a2e&radius=10',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Riley&backgroundColor=16213e&radius=10',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jordan&backgroundColor=0f3460&radius=10',
  /* Bottts (robôs) */
  'https://api.dicebear.com/7.x/bottts/svg?seed=cyber&backgroundColor=b6e3f4&radius=10',
  'https://api.dicebear.com/7.x/bottts/svg?seed=astro&backgroundColor=c0aede&radius=10',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nova&backgroundColor=ffd5dc&radius=10',
  'https://api.dicebear.com/7.x/bottts/svg?seed=orbit&backgroundColor=ffdfbf&radius=10',
  /* Lorelei (ilustrado) */
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Ana&backgroundColor=b6e3f4&radius=10',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sara&backgroundColor=ffdfbf&radius=10',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Kate&backgroundColor=c0aede&radius=10',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Mia&backgroundColor=ffd5dc&radius=10',
  /* Fun Emoji */
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=smile&backgroundColor=b6e3f4&radius=10',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=cool&backgroundColor=ffdfbf&radius=10',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=happy&backgroundColor=c0aede&radius=10',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=wink&backgroundColor=ffd5dc&radius=10',
];

let selectedAvatar  = AVATARS[0];
let isKidsModeModal = false;
let editingProfile  = null;

function populateAvatarGrid() {
  const grid = document.getElementById('avatarGrid');
  if (!grid) return;
  grid.innerHTML = '';
  AVATARS.forEach(src => {
    const img     = document.createElement('img');
    img.src       = src;
    img.className = 'avatar-option' + (src === selectedAvatar ? ' selected' : '');
    img.onclick   = () => selectAvatar(src);
    grid.appendChild(img);
  });
}

function selectAvatar(src) {
  selectedAvatar = src;
  const preview = document.getElementById('avatarPreview');
  if (preview) preview.src = src;
  document.querySelectorAll('.avatar-option').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('src') === src);
  });
}

function toggleKidsMode() {
  isKidsModeModal = !isKidsModeModal;
  document.getElementById('kidsPill')?.classList.toggle('on', isKidsModeModal);
}

/* Abre modal para ADICIONAR */
function addProfile() {
  editingProfile  = null;
  selectedAvatar  = AVATARS[0];
  isKidsModeModal = false;
  document.getElementById('modalTitle').textContent  = 'Adicionar perfil';
  document.getElementById('profileNameInput').value  = '';
  document.getElementById('avatarPreview').src       = selectedAvatar;
  document.getElementById('kidsPill').classList.remove('on');
  document.getElementById('deleteBtn').style.display = 'none';
  populateAvatarGrid();
  document.getElementById('profileModal')?.classList.add('open');
}

/* Abre modal para EDITAR */
function editProfile(event, btn) {
  event.stopPropagation();
  const item      = btn.closest('.profile-item');
  editingProfile  = item;
  const name      = item.querySelector('.profile-name')?.textContent || '';
  const avatarSrc = item.querySelector('.profile-avatar')?.src || AVATARS[0];
  const isKids    = item.classList.contains('kids');

  selectedAvatar  = avatarSrc;
  isKidsModeModal = isKids;

  document.getElementById('modalTitle').textContent  = 'Editar perfil';
  document.getElementById('profileNameInput').value  = name;
  document.getElementById('avatarPreview').src       = avatarSrc;
  document.getElementById('kidsPill').classList.toggle('on', isKids);
  document.getElementById('deleteBtn').style.display = 'flex';
  populateAvatarGrid();
  document.getElementById('profileModal')?.classList.add('open');
}

/* Salva perfil */
function saveProfile() {
  const nameInput = document.getElementById('profileNameInput');
  const name = nameInput?.value.trim() || '';
  if (!name) {
    if (nameInput) {
      nameInput.focus();
      nameInput.style.borderColor = '#ef4444';
      setTimeout(() => { nameInput.style.borderColor = ''; }, 1500);
    }
    return;
  }

  const list   = document.querySelector('.profiles-list');
  const addBtn = list?.querySelector('.add-profile');

  if (editingProfile) {
    const avatarEl = editingProfile.querySelector('.profile-avatar');
    const nameEl   = editingProfile.querySelector('.profile-name');
    if (avatarEl) avatarEl.src       = selectedAvatar;
    if (nameEl)   nameEl.textContent = name;
    editingProfile.classList.toggle('kids', isKidsModeModal);
  } else {
    const existing = list?.querySelectorAll('.profile-item:not(.add-profile)').length || 0;
    if (existing >= 5) { closeModal(); return; }

    const newItem = document.createElement('div');
    newItem.className       = 'profile-item' + (isKidsModeModal ? ' kids' : '');
    newItem.dataset.profile = name.toLowerCase();
    newItem.onclick         = function() { selectProfile(this); };
    newItem.innerHTML = `
      <div class="sound-ripple"></div>
      <img class="profile-avatar" src="${selectedAvatar}" alt="${name}">
      <span class="profile-name">${name}</span>
      <button class="profile-edit-btn" onclick="editProfile(event, this)" title="Editar">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>
      </button>
    `;
    if (addBtn) list.insertBefore(newItem, addBtn);
    else        list?.appendChild(newItem);
  }

  closeModal();
}

/* Exclui perfil */
function deleteProfile() {
  if (!editingProfile) return;
  if (confirm('Tem certeza que deseja excluir este perfil?')) {
    editingProfile.remove();
    closeModal();
  }
}

/* Fecha modal */
function closeModal() {
  document.getElementById('profileModal')?.classList.remove('open');
  editingProfile = null;
}

/* ── Partículas ── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p     = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 2.5 + 0.5;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*10}s;opacity:${(Math.random()*0.4+0.1).toFixed(2)};`;
    container.appendChild(p);
  }
}

/* ── Fecha modal ao clicar no backdrop ── */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('profileModal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
});

/* ── Init ── */
createParticles();
initSlides(ADULT_FALLBACK);
animateProfiles();

/* Busca conteúdo real da TMDB para adultos e kids em paralelo */
(async () => {
  const [adult, kids] = await Promise.all([
    fetchAdultMovies(),
    fetchKidsMovies(),
  ]);
  adultMoviesData = adult;
  kidsMoviesData  = kids;
  /* Atualiza slides apenas se o modo atual corresponder */
  if (!isKidsMode) initSlides(adult);
})();
