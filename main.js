/* ============================================================
   PALAIS MAURICIEN - main.js
   ============================================================ */

const PAGE = document.body.dataset.page || 'home';

// ===== IMAGE FALLBACK GLOBAL (remplace les `onerror=` inline bloqués par la CSP) =====
// data-fb="hide"  → cache l'image en cas d'erreur
// (par défaut)    → bascule sur le logo
document.addEventListener('error', e => {
  const t = e.target;
  if (!t || t.tagName !== 'IMG' || t.dataset.fbDone) return;
  t.dataset.fbDone = '1';
  console.warn('[main] image fallback applied for:', t.getAttribute('src'));
  if (t.dataset.fb === 'hide') t.style.display = 'none';
  else t.src = 'images/logo.png';
}, true);
const UBER_URL = 'https://www.ubereats.com/fr/store/palais-mauricien-le-port/_7jTtP06W32kgaXW9Nzmzw?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas&rwg_token=AFd1xnFa5X6LT87TanoBYmyR6c7A63QJJMPi883LKkvaUh7ohlv6qHbwHD7rUtzNdobl-A3J03lFWaZ17GuRpX5RC1j4pOs7xg%3D%3D';

// Centralisation Uber Eats : on remplace tous les <a href="https://www.ubereats.com/..."> par UBER_URL
// pour éviter d'avoir à éditer chaque fichier .html quand le lien change.
function normalizeUberLinks() {
  document.querySelectorAll('a[href*="ubereats.com"]').forEach(a => {
    a.setAttribute('href', UBER_URL);
  });
}
document.addEventListener('DOMContentLoaded', normalizeUberLinks);

// Transitions de page désactivées - navigation native

// Sync depuis Supabase au chargement (background)
// Si les données du cloud diffèrent du cache local (ou cache vide), on recharge.
(async () => {
  if (typeof window.syncFromCloud !== 'function') return;
  const before = localStorage.getItem('pm_data');
  try {
    const cloud = await window.syncFromCloud();
    if (!cloud) return;

    // Migration silencieuse : ancien handle TikTok → nouveau (push vers Supabase une fois)
    try {
      const NEW_TIKTOK = "https://www.tiktok.com/@palaismauricien97420?_r=1&_t=ZN-96DznweiNwE";
      const dd = getData();
      if (dd.socials && typeof dd.socials.tiktok === 'string'
          && dd.socials.tiktok.includes('@palais.mauricien')) {
        dd.socials.tiktok = NEW_TIKTOK;
        saveData(dd); // écrit localStorage + push cloud (fire-and-forget)
      }
    } catch (_) {}

    const after = localStorage.getItem('pm_data');
    if (before !== after) {
      // Cache différent du cloud (ou cache vide à la 1re visite) → reload
      // pour que le rendu utilise les données fraîches plutôt que les défauts.
      location.reload();
    }
  } catch (_) {}
})();

// Track visit - uniquement si l'utilisateur a accepté les statistiques
// (consentement RGPD via le bandeau cookies en bas de page).
if (localStorage.getItem('pm_cookies_ok') === '1') {
  trackVisit();
}

// ===== LOADER - uniquement au premier chargement de la page d'accueil =====
(function() {
  const loader = document.getElementById('loader');
  if (!loader) { window.addEventListener('load', () => initReveal()); return; }

  // N'afficher le loader que si on est sur home ET que la session vient de démarrer
  const alreadySeen = sessionStorage.getItem('pm_loaded');
  if (PAGE !== 'home' || alreadySeen) {
    loader.style.display = 'none';
    window.addEventListener('load', () => initReveal());
    return;
  }
  sessionStorage.setItem('pm_loaded', '1');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      initReveal();
    }, 1100);
  });
})();

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});
(function loop() {
  fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
  if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; }
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.menu-card,.masonry-item,.discover-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower?.classList.add('hovered'));
  el.addEventListener('mouseleave', () => follower?.classList.remove('hovered'));
});

// ===== PARTICLES (accueil uniquement) =====
if (PAGE === 'home') {
  (function() {
    const c = document.getElementById('particles'); if (!c) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div'); p.className = 'particle';
      const sz = Math.random() * 2.5 + 1;
      p.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${Math.random()*14+9}s;animation-delay:${Math.random()*12}s;`;
      c.appendChild(p);
    }
  })();

  // HERO TITLE WRAP
  document.querySelectorAll('.hero-title-line').forEach(line => {
    const t = line.textContent.trim();
    line.innerHTML = `<span class="hero-title-inner">${t}</span>`;
  });
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 60));
navBurger?.addEventListener('click', () => { navBurger.classList.toggle('open'); navLinks?.classList.toggle('open'); });
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navBurger?.classList.remove('open'); navLinks.classList.remove('open'); }));

// ===== RENDER MENU (cards - actuellement non utilisé sur menu.html) =====
function renderMenu() {
  const data = getData();
  CAT_KEYS.forEach(cat => {
    const panel = document.getElementById('tab-' + cat);
    if (!panel) return;
    const items = data.menu[cat].filter(i => i.visible);
    panel.innerHTML = items.map(item => `
      <div class="menu-card">
        <div class="card-img-wrap">
          <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
          <div class="card-overlay"></div>
        </div>
        <div class="card-body">
          <h3>${escHtml(item.name)}</h3>
          <p>${escHtml(item.desc)}</p>
          <div class="card-body-footer">
            <span class="price-tag">${escHtml(getDisplayPrice(item))}</span>
          </div>
        </div>
      </div>
    `).join('');
    initCardEffects(panel);
  });
  initRevealCards();
}

// ===== RENDER SPÉCIALITÉS (3 premiers plats visibles) =====
function renderSpec() {
  const data = getData();
  const specs = data.menu.plats.filter(i => i.visible).slice(0, 3);
  const list = document.getElementById('specList');
  if (!list) return;
  list.innerHTML = specs.map((item, idx) => `
    <div class="spec-item ${idx % 2 === 1 ? 'spec-item-reverse' : ''} reveal-up">
      <div class="spec-img">
        <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
      </div>
      <div class="spec-content">
        <span class="spec-num">0${idx + 1}</span>
        <h3>${escHtml(item.name)}</h3>
        <p>${escHtml(item.desc)}</p>
        <span class="spec-price">${escHtml(getDisplayPrice(item))}</span>
        <a href="${UBER_URL}" target="_blank" rel="noopener" class="btn-gold-sm">Commander sur Uber Eats</a>
      </div>
    </div>
  `).join('');
}

// ===== RENDER GALERIE =====
function renderGalerie() {
  const data = getData();
  const all = CAT_KEYS.flatMap(cat => data.menu[cat].filter(i => i.visible).map(i => ({ ...i, cat })));
  const grid = document.getElementById('masonryGrid');
  if (!grid) return;
  // Séquence de formes en vrac - jamais deux identiques consécutives
  const sizeSeq = [
    'masonry-portrait',  // 3/4
    '',                  // 1/1 carré
    'masonry-tall',      // 2/3 haut
    'masonry-squat',     // 4/3 large
    '',                  // 1/1 carré
    'masonry-portrait',  // 3/4
    'masonry-wide',      // 16/9
    '',                  // 1/1 carré
    'masonry-squat',     // 4/3
    'masonry-tall',      // 2/3 haut
    '',                  // 1/1 carré
    'masonry-portrait',  // 3/4
    'masonry-squat',     // 4/3
    '',                  // 1/1 carré
  ];
  const heightClass = (i) => sizeSeq[i % sizeSeq.length];
  grid.innerHTML = all.map((item, idx) => `
    <div class="masonry-item ${heightClass(idx)}" data-src="${escUrl(item.img)}" data-caption="${escAttr(item.name)}" data-cat="${escAttr(item.cat)}">
      <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
      <div class="masonry-overlay"><span>${escHtml(item.name)}</span></div>
    </div>
  `).join('');
  initLightbox();
  initGalleryFilters();
  initRevealCards();
}

// ===== FOOD CAROUSEL - marquee continu, slow auto-scroll =====
function initFoodCarousel() {
  const viewport = document.getElementById('foodCarousel');
  const track = document.getElementById('foodCarouselTrack');
  if (!track || !viewport) return;

  const data = getData();
  const all = CAT_KEYS.flatMap(cat => data.menu[cat].filter(i => i.visible));

  const slideHTML = item => `
    <div class="food-carousel-slide">
      <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
      <div class="food-carousel-caption">
        <div class="food-carousel-name">${escHtml(item.name)}</div>
        <div class="food-carousel-price">${escHtml(getDisplayPrice(item))}</div>
      </div>
    </div>
  `;
  // Duplication pour boucle infinie (50% / 50%)
  track.innerHTML = all.map(slideHTML).join('') + all.map(slideHTML).join('');

  const prevBtn = document.getElementById('foodCarouselPrev');
  const nextBtn = document.getElementById('foodCarouselNext');
  const dotsContainer = document.getElementById('foodCarouselDots');
  if (dotsContainer) dotsContainer.style.display = 'none';

  // Active marquee
  track.classList.add('is-marquee');

  // Pause au survol
  viewport.addEventListener('mouseenter', () => track.classList.add('paused'));
  viewport.addEventListener('mouseleave', () => track.classList.remove('paused'));

  // Décalage manuel via boutons : translation cumulée appliquée via marginLeft
  // Pour ne pas casser l'animation, on joue avec animation-delay négatif.
  const totalDuration = 60; // doit matcher CSS (60s)
  let manualOffsetSec = 0;
  function bumpAnimation(deltaSec) {
    manualOffsetSec = (manualOffsetSec + deltaSec) % totalDuration;
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animation = '';
    track.style.animationDelay = `-${(manualOffsetSec + totalDuration) % totalDuration}s`;
  }
  prevBtn?.addEventListener('click', () => bumpAnimation(-3));
  nextBtn?.addEventListener('click', () => bumpAnimation(3));

  // Scroll molette = défilement horizontal manuel
  viewport.addEventListener('wheel', e => {
    const dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(dy) < 1) return;
    e.preventDefault();
    bumpAnimation(dy * 0.012);
  }, { passive: false });

  // Swipe tactile
  let tx = 0;
  viewport.addEventListener('touchstart', e => { tx = e.touches[0].clientX; track.classList.add('paused'); }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 30) bumpAnimation(-dx * 0.04);
    setTimeout(() => track.classList.remove('paused'), 1200);
  });
}

// ===== LIGHTBOX PLAT (menu page) =====
function initMenuLightbox() {
  const overlay = document.getElementById('menuLbOverlay');
  if (!overlay) return;
  const closeBtn = document.getElementById('menuLbClose');
  const lbImg   = document.getElementById('menuLbImg');
  const lbName  = document.getElementById('menuLbName');
  const lbDesc  = document.getElementById('menuLbDesc');
  const lbPrice = document.getElementById('menuLbPrice');

  function openLb(img, name, desc, price) {
    lbImg.src = img;
    lbImg.alt = name;
    lbName.textContent = name;
    lbDesc.textContent = desc;
    lbPrice.textContent = price;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLb);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  // Expose pour renderMenuListe
  window._openMenuLb = openLb;
}

// ===== RENDER MENU LISTE (texte + lightbox photo) =====
function renderMenuListe() {
  const data = getData();
  CAT_KEYS.forEach(cat => {
    const panel = document.getElementById('tab-' + cat);
    if (!panel) return;
    const items = data.menu[cat].filter(i => i.visible);
    panel.innerHTML = items.map((item, idx) => {
      const hasVariants = Array.isArray(item.variants) && item.variants.length;
      const rightSide = hasVariants
        ? `<div class="menu-ligne-droite menu-ligne-droite-variants">
             ${item.variants.map(v => `<span class="menu-ligne-variant"><em>${escHtml(v.name)}</em><span class="menu-ligne-variant-prix">${escHtml(v.price)}</span></span>`).join('')}
           </div>`
        : `<div class="menu-ligne-droite">
             <span class="menu-ligne-prix">${escHtml(item.price)}</span>
           </div>`;
      const photoBtn = `
        <button class="menu-photo-btn"
          data-img="${escAttr(item.img)}"
          data-name="${escAttr(item.name)}"
          data-desc="${escAttr(item.desc)}"
          data-price="${escAttr(getDisplayPrice(item))}"
          aria-label="Voir la photo">
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>`;
      return `
      <div class="menu-ligne ${hasVariants ? 'menu-ligne--variants' : ''}">
        <div class="menu-ligne-gauche">
          <span class="menu-ligne-num">${String(idx+1).padStart(2,'0')}</span>
          <div>
            <div class="menu-ligne-nom">${escHtml(item.name)}</div>
            <div class="menu-ligne-desc">${escHtml(item.desc)}</div>
          </div>
        </div>
        ${rightSide}
        <div class="menu-ligne-photo">${photoBtn}</div>
      </div>`;
    }).join('');

    panel.querySelectorAll('.menu-photo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window._openMenuLb) {
          window._openMenuLb(btn.dataset.img, btn.dataset.name, btn.dataset.desc, btn.dataset.price);
        }
      });
    });
  });
}

// ===== TABS LISTE (display:flex au lieu de grid) =====
function initListTabs() {
  const platsPanel = document.getElementById('tab-plats');
  if (!platsPanel) return;
  platsPanel.style.display = 'flex';
  platsPanel.style.flexDirection = 'column';

  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.querySelectorAll('.menu-ligne').forEach((l, i) => {
          l.style.opacity = '0'; l.style.transform = 'translateY(12px)';
          setTimeout(() => { l.style.transition = 'opacity .4s ease,transform .4s ease'; l.style.opacity = '1'; l.style.transform = 'translateY(0)'; }, i * 50);
        });
      }
    });
  });
}

// ===== GALLERY FILTERS =====
function initGalleryFilters() {
  const btns = document.querySelectorAll('.gal-filter');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.masonry-item').forEach((item, idx) => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('gal-hidden', !show);
        if (show) {
          item.style.animationDelay = (idx * 40) + 'ms';
          item.classList.remove('revealed');
          requestAnimationFrame(() => item.classList.add('revealed'));
        }
      });
    });
  });
}

// ===== Fermetures exceptionnelles =====
function getExceptionalClosure(data, dateKey) {
  const list = (data && Array.isArray(data.exceptionalClosures)) ? data.exceptionalClosures : [];
  return list.find(c => c.date === dateKey) || null;
}

function getUpcomingClosures(data, limit) {
  const list = (data && Array.isArray(data.exceptionalClosures)) ? data.exceptionalClosures : [];
  const today = getTodayKey();
  return list
    .filter(c => c.date && c.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit || 10);
}

function formatDateFR(dateKey) {
  if (!dateKey) return '';
  const fmt = new Date(dateKey + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return fmt.charAt(0).toUpperCase() + fmt.slice(1);
}

// ===== RENDER HORAIRES =====
function _isOpenNow(h) {
  if (h.closed) return { open: false, next: null };
  const cur = new Date().getHours() * 60 + new Date().getMinutes();
  const midi = h.midi || { actif: false };
  const soir = h.soir || { actif: false };
  let next = null;
  if (midi.actif) {
    const [oh, om] = midi.open.split(':').map(Number);
    const [ch, cm] = midi.close.split(':').map(Number);
    if (cur >= oh*60+om && cur < ch*60+cm) return { open: true, next: null };
    if (cur < oh*60+om) next = midi.open;
  }
  if (soir.actif) {
    const [oh, om] = soir.open.split(':').map(Number);
    const [ch, cm] = soir.close.split(':').map(Number);
    if (cur >= oh*60+om && cur < ch*60+cm) return { open: true, next: null };
    if (cur < oh*60+om && !next) next = soir.open;
  }
  return { open: false, next };
}

function renderHoraires() {
  const data = getData();
  const days = { lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche' };
  const jsMapped = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const todayKey = jsMapped[new Date().getDay()];
  const todayDateKey = getTodayKey();
  const list = document.getElementById('horairesList');
  if (!list) return;

  list.innerHTML = Object.entries(days).map(([key, label]) => {
    const h = data.hours[key];
    const isToday = key === todayKey;
    const midi = h.midi || { actif: false, open: '10:30', close: '14:30' };
    const soir = h.soir || { actif: false, open: '18:30', close: '21:30' };
    const closureToday = isToday ? getExceptionalClosure(data, todayDateKey) : null;
    let hoursHtml;
    if (closureToday) {
      hoursHtml = `<span class="horaire-ferme horaire-exceptionnel">Fermeture exceptionnelle${closureToday.reason ? ' · ' + escHtml(closureToday.reason) : ''}</span>`;
    } else if (h.closed || (!midi.actif && !soir.actif)) {
      hoursHtml = `<span class="horaire-ferme">Fermé</span>`;
    } else {
      const parts = [];
      if (midi.actif) parts.push(`<span class="horaire-service"><em>Midi</em>${midi.open}–${midi.close}</span>`);
      if (soir.actif) parts.push(`<span class="horaire-service"><em>Soir</em>${soir.open}–${soir.close}</span>`);
      hoursHtml = `<div class="horaire-times">${parts.join('')}</div>`;
    }
    return `<div class="horaire-row${isToday ? ' today' : ''}">
      <span class="horaire-day">${label}${isToday ? ' <em style="font-size:.6rem;font-family:var(--font-mono);opacity:.6">- aujourd\'hui</em>' : ''}</span>
      ${hoursHtml}
    </div>`;
  }).join('');

  // Liste des prochaines fermetures exceptionnelles (hors aujourd'hui)
  const upcoming = getUpcomingClosures(data, 6).filter(c => c.date !== todayDateKey);
  const upcomingWrap = document.getElementById('horairesClosures');
  if (upcomingWrap) {
    if (!upcoming.length) {
      upcomingWrap.innerHTML = '';
    } else {
      upcomingWrap.innerHTML = `
        <div class="closures-public">
          <h4>Fermetures exceptionnelles à venir</h4>
          <ul>
            ${upcoming.map(c => `<li><strong>${escHtml(formatDateFR(c.date))}</strong>${c.reason ? ' - ' + escHtml(c.reason) : ''}</li>`).join('')}
          </ul>
        </div>`;
    }
  }

  const badge = document.getElementById('openBadge');
  const text = document.getElementById('openText');
  if (!badge || !text) return;
  const todayHours = data.hours[todayKey];
  const closureToday = getExceptionalClosure(data, todayDateKey);
  const { open: isOpen, next } = _isOpenNow(todayHours);
  const reallyOpen = isOpen && !closureToday;
  badge.classList.toggle('closed', !reallyOpen);
  if (closureToday) text.textContent = 'Fermeture exceptionnelle aujourd\'hui';
  else if (reallyOpen) text.textContent = 'Ouvert maintenant';
  else if (todayHours.closed) text.textContent = 'Fermé aujourd\'hui';
  else if (next) text.textContent = `Fermé - Ouvre à ${next}`;
  else text.textContent = 'Fermé pour aujourd\'hui';
}

// ===== TABS =====
function initTabs() {
  const platsPanel = document.getElementById('tab-plats');
  if (!platsPanel) return;
  platsPanel.style.display = 'grid';

  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) {
        panel.classList.add('active'); panel.style.display = 'grid';
        panel.querySelectorAll('.menu-card').forEach((c, i) => {
          c.style.opacity = '0'; c.style.transform = 'translateY(20px)';
          setTimeout(() => { c.style.transition = 'opacity .5s ease,transform .5s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 70);
        });
      }
    });
  });
}

// ===== CARD EFFECTS =====
function initCardEffects(parent = document) {
  parent.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      card.style.setProperty('--glow', '1');
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glow', '0');
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1),opacity .5s ease,border-color .3s,box-shadow .3s';
    });
  });
}

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-gold').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.3;
    const y = (e.clientY - r.top - r.height/2) * 0.3;
    btn.style.transform = `translate(${x}px,${y}px)`;
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1),background .3s,box-shadow .3s';
  });
});

// ===== LIGHTBOX =====
function initLightbox() {
  const items = document.querySelectorAll('.masonry-item');
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  let idx = 0;
  const data = Array.from(items).map(i => ({ src: i.dataset.src, caption: i.dataset.caption }));

  const open = i => { idx = i; img.src = data[i].src; cap.textContent = data[i].caption; lb?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb?.classList.remove('open'); document.body.style.overflow = ''; };
  const prev = () => { idx = (idx - 1 + data.length) % data.length; img.src = data[idx].src; cap.textContent = data[idx].caption; };
  const next = () => { idx = (idx + 1) % data.length; img.src = data[idx].src; cap.textContent = data[idx].caption; };

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  document.getElementById('lightboxClose')?.addEventListener('click', close);
  document.getElementById('lightboxPrev')?.addEventListener('click', prev);
  document.getElementById('lightboxNext')?.addEventListener('click', next);
  lb?.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Swipe tactile mobile
  let touchStartX = 0;
  lb?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
  });
}

// ===== COUNTER =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / 1800, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target;
  })(performance.now());
}

// ===== REVEAL =====
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('reveal-up') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right') || el.classList.contains('reveal-scale')) {
        setTimeout(() => el.classList.add('revealed'), (parseFloat(el.dataset.delay) || 0) * 1000);
      }
      if (el.classList.contains('stat-num')) animateCounter(el);
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale,.stat-num').forEach(el => io.observe(el));
  initParallax();
}

// ===== PARALLAX background - fonctionne sur iOS (contournement de background-attachment:fixed) =====
function initParallax() {
  const bgs = document.querySelectorAll('[data-parallax]');
  if (!bgs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    bgs.forEach(bg => {
      const section = bg.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -50 || rect.top > vh + 50) return;
      // -1 (entrée bas écran) → +1 (sortie haut écran)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height / 2);
      const offset = -progress * 80; // amplitude 80px
      bg.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initRevealCards() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('menu-card')) {
        const idx = Array.from(el.parentElement.querySelectorAll('.menu-card')).indexOf(el);
        setTimeout(() => el.classList.add('revealed'), idx * 75);
      }
      if (el.classList.contains('masonry-item')) {
        const idx = Array.from(el.parentElement.querySelectorAll('.masonry-item')).indexOf(el);
        setTimeout(() => el.classList.add('revealed'), idx * 60);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-card,.masonry-item').forEach(el => io.observe(el));
}

// ===== BLUR TEXT =====
function initBlurText() {
  document.querySelectorAll('.blur-text[data-animate="words"]').forEach(el => {
    el.innerHTML = el.textContent.split(' ')
      .map(w => `<span>${w}&nbsp;</span>`).join('');
    const spans = el.querySelectorAll('span');
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        spans.forEach((s, i) => setTimeout(() => s.classList.add('visible'), i * 90));
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

// ===== FOOTER OPEN STATUS =====
function renderFooterStatus() {
  const el = document.getElementById('footerOpenStatus');
  if (!el) return;
  const data = getData();
  const jsMapped = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const todayKey = jsMapped[new Date().getDay()];
  const todayHours = data.hours[todayKey];
  const closureToday = getExceptionalClosure(data, getTodayKey());
  const { open: isOpen, next } = _isOpenNow(todayHours);
  const reallyOpen = isOpen && !closureToday;
  el.className = 'footer-open-status' + (reallyOpen ? '' : ' closed');
  if (closureToday) el.textContent = 'Fermeture exceptionnelle';
  else if (reallyOpen) el.textContent = 'Ouvert maintenant';
  else if (todayHours.closed) el.textContent = 'Fermé aujourd\'hui';
  else if (next) el.textContent = `Fermé · ouvre à ${next}`;
  else el.textContent = 'Fermé pour aujourd\'hui';

  // Résumé horaires dans le footer (si l'élément existe)
  const desc = document.getElementById('footerHoursDesc');
  if (!desc) return;
  if (closureToday) {
    desc.textContent = closureToday.reason ? ('Fermeture exceptionnelle · ' + closureToday.reason) : 'Fermeture exceptionnelle';
    return;
  }
  const midi = todayHours.midi || { actif: false };
  const soir = todayHours.soir || { actif: false };
  const parts = [];
  if (!todayHours.closed) {
    if (midi.actif) parts.push(`Midi ${midi.open}–${midi.close}`);
    if (soir.actif) parts.push(`Soir ${soir.open}–${soir.close}`);
  }
  desc.textContent = parts.length ? parts.join(' · ') : 'Fermé aujourd\'hui';
}

// ===== Bannière fermeture exceptionnelle (toutes pages, en haut sous navbar) =====
function renderClosureBanner() {
  const data = getData();
  const todayDateKey = getTodayKey();
  const closureToday = getExceptionalClosure(data, todayDateKey);
  if (!closureToday) return;
  if (document.getElementById('pmClosureBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'pmClosureBanner';
  banner.className = 'pm-closure-banner';
  banner.innerHTML = `
    <span class="pm-closure-banner-icon" aria-hidden="true">⚠</span>
    <span class="pm-closure-banner-text"><strong>Fermeture exceptionnelle aujourd'hui</strong>${closureToday.reason ? ' - ' + escHtml(closureToday.reason) : ''}</span>
  `;
  document.body.prepend(banner);
}

// ===== COOKIE BANNER =====
(function() {
  if (localStorage.getItem('pm_cookies_ok')) return;
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.classList.remove('hidden');
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('pm_cookies_ok', '1');
    banner.classList.add('hidden');
    // Consentement reçu → on enregistre la visite courante
    if (typeof trackVisit === 'function') trackVisit();
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('pm_cookies_ok', '0');
    banner.classList.add('hidden');
  });
})();

// ===== RENDER DISPONIBLE AUJOURD'HUI (page dédiée) =====
function renderDispoPage() {
  const container = document.getElementById('dispoContent');
  if (!container) return;

  // Date FR dans le hero
  const dateLbl = document.getElementById('dispoTodayDate');
  if (dateLbl) {
    const fmt = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    dateLbl.textContent = '- ' + (fmt.charAt(0).toUpperCase() + fmt.slice(1)) + ' -';
  }

  const dispo = getDispoToday();
  const cats = [
    { key: 'plats',     label: 'Plats',         em: 'du jour' },
    { key: 'street',    label: 'Street food',   em: 'à grignoter' },
    { key: 'grillades', label: 'Grillades',     em: 'à la braise' },
    { key: 'desserts',  label: 'Desserts',      em: 'gourmands' },
    { key: 'boissons',  label: 'Boissons',      em: 'fraîches' }
  ];
  const total = cats.reduce((acc, c) => acc + (dispo[c.key] ? dispo[c.key].length : 0), 0);

  if (total === 0) {
    container.innerHTML = `
      <div class="dispo-empty-state reveal-up">
        <h3>Aucune sélection pour le moment</h3>
        <p>La carte du jour n'a pas encore été publiée. Découvrez l'ensemble de nos plats sur Uber Eats - les disponibilités y sont à jour.</p>
        <a href="${UBER_URL}" target="_blank" rel="noopener" class="btn-gold">Commander sur Uber Eats</a>
      </div>`;
    return;
  }

  container.innerHTML = cats.map(c => {
    const items = dispo[c.key];
    if (!items.length) return '';
    return `
      <div class="dispo-cat-block reveal-up">
        <h2 class="dispo-cat-title">
          ${c.label} <em>${c.em}</em>
          <span class="dispo-cat-count">${items.length} ${items.length > 1 ? 'sélections' : 'sélection'}</span>
        </h2>
        <div class="dispo-grid">
          ${items.map(item => `
            <article class="dispo-card"
              data-img="${escAttr(item.img)}" data-name="${escAttr(item.name)}"
              data-desc="${escAttr(item.desc)}" data-price="${escAttr(getDisplayPrice(item))}">
              <div class="dispo-card-img">
                <span class="dispo-card-badge">Aujourd'hui</span>
                ${renderRemainingBadge(item)}
                <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
              </div>
              <div class="dispo-card-body">
                <h3 class="dispo-card-name">${escHtml(item.name)}</h3>
                <p class="dispo-card-desc">${escHtml(item.desc)}</p>
                <div class="dispo-card-footer">
                  <span class="dispo-card-price">${escHtml(getDisplayPrice(item))}</span>
                  <a href="${UBER_URL}" target="_blank" rel="noopener" class="dispo-card-call" onclick="event.stopPropagation()">
                    Commander
                    <svg viewBox="0 0 20 20" fill="currentColor" width="11"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/></svg>
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Click sur la carte → lightbox
  container.querySelectorAll('.dispo-card').forEach(card => {
    card.addEventListener('click', () => {
      if (window._openMenuLb) {
        window._openMenuLb(card.dataset.img, card.dataset.name, card.dataset.desc, card.dataset.price);
      }
    });
  });

  initReveal();
}

// ===== RENDER HOMEPAGE - section "Aujourd'hui à la carte" =====
function renderHomeToday() {
  const section = document.getElementById('todaySection');
  const grid = document.getElementById('todayGrid');
  if (!section || !grid) return;

  const dispo = getDispoToday();
  const all = CAT_KEYS.flatMap(cat => dispo[cat] || []).slice(0, 8);

  if (!all.length) { section.style.display = 'none'; return; }

  grid.innerHTML = all.map(item => `
    <a href="disponible-aujourdhui.html" class="today-card">
      <div class="today-card-img">
        ${renderRemainingBadge(item)}
        <img src="${escUrl(item.img)}" alt="${escAttr(item.name)}" loading="lazy"/>
      </div>
      <div class="today-card-body">
        <span class="today-card-name">${escHtml(item.name)}</span>
        <span class="today-card-price">${escHtml(getDisplayPrice(item))}</span>
      </div>
    </a>
  `).join('');
}

// Badge "X restants" / "Rupture de stock" - null = ne rien afficher
function renderRemainingBadge(item) {
  const r = item && item.remaining;
  if (r === null || r === undefined) return '';
  if (r === 0) return `<span class="remaining-badge remaining-out">❌ Rupture de stock</span>`;
  if (typeof r === 'number' && r > 0) {
    return `<span class="remaining-badge remaining-ok">🔥 ${r} restant${r > 1 ? 's' : ''}</span>`;
  }
  return '';
}

// ===== CARROUSEL AVIS - un seul avis à la fois, flèches + dots + swipe =====
function initAvisCarousel() {
  const track = document.getElementById('avisTrack');
  const prev = document.getElementById('avisPrev');
  const next = document.getElementById('avisNext');
  const dotsWrap = document.getElementById('avisDots');
  if (!track) return;
  const slides = track.children;
  const total = slides.length;
  if (!total) return;

  let idx = 0;
  // Construit les dots
  dotsWrap.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const b = document.createElement('button');
    b.className = 'avis-dot' + (i === 0 ? ' active' : '');
    b.setAttribute('aria-label', 'Avis ' + (i + 1));
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  }
  function go(n) {
    idx = (n + total) % total;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  prev?.addEventListener('click', () => go(idx - 1));
  next?.addEventListener('click', () => go(idx + 1));

  // Clavier (gauche/droite quand le carrousel est focus)
  document.addEventListener('keydown', e => {
    const inView = track.getBoundingClientRect();
    if (inView.top < window.innerHeight && inView.bottom > 0) {
      if (e.key === 'ArrowLeft' && document.activeElement?.closest?.('.avis-carousel')) go(idx - 1);
      if (e.key === 'ArrowRight' && document.activeElement?.closest?.('.avis-carousel')) go(idx + 1);
    }
  });

  // Swipe tactile
  let sx = 0, dx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - sx; }, { passive: true });
  track.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
  });

  // Auto-play discret (pause au hover)
  let timer = setInterval(() => go(idx + 1), 6500);
  const root = track.closest('.avis-carousel');
  root?.addEventListener('mouseenter', () => clearInterval(timer));
  root?.addEventListener('mouseleave', () => { timer = setInterval(() => go(idx + 1), 6500); });
}

// ===== INIT PAR PAGE =====
if (PAGE === 'menu') {
  initMenuLightbox();
  renderMenuListe();
  renderSpec();
  initListTabs();
}
if (PAGE === 'galerie') {
  renderGalerie();
}
if (PAGE === 'contact') {
  renderHoraires();
}
if (PAGE === 'home') {
  initFoodCarousel();
  renderHomeToday();
  initAvisCarousel();
}
if (PAGE === 'dispo') {
  initMenuLightbox();
  renderDispoPage();
}

// ===== Lien TikTok dynamique (footer) =====
function renderSocialLinks() {
  try {
    const data = getData();
    const url = data?.socials?.tiktok;
    if (!url) return;
    document.querySelectorAll('a[data-pm-tiktok]').forEach(a => {
      a.href = url;
    });
  } catch (_) {}
}

// Toujours
initBlurText();
renderFooterStatus();
renderSocialLinks();
renderClosureBanner();
