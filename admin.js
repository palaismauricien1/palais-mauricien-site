/* ============================================================
   PALAIS MAURICIEN - admin.js
   ============================================================ */

// ===== IMAGE FALLBACK GLOBAL (remplace `onerror=` inline bloqués par la CSP) =====
document.addEventListener('error', e => {
  const t = e.target;
  if (!t || t.tagName !== 'IMG' || t.dataset.fbDone) return;
  t.dataset.fbDone = '1';
  console.warn('[admin] image fallback applied for:', t.getAttribute('src'));
  t.src = 'images/logo.png';
}, true);

// ===== TOAST UTILITY =====
function showToast(message, type = 'info') {
  let host = document.getElementById('admToastHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'admToastHost';
    host.style.cssText = 'position:fixed;top:18px;right:18px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  const bg = type === 'error' ? '#7c1f1f' : type === 'success' ? '#1f5f3c' : '#2a2118';
  const fg = '#f3e9d5';
  el.style.cssText = `background:${bg};color:${fg};padding:12px 18px;border-radius:6px;font-family:system-ui,sans-serif;font-size:.9rem;box-shadow:0 6px 20px rgba(0,0,0,.45);max-width:340px;line-height:1.4;pointer-events:auto;animation:fadeInToast .25s ease`;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; }, 3500);
  setTimeout(() => el.remove(), 3800);
}

// Wrapper : sauvegarde + feedback en cas d'échec. À utiliser à la place de saveData() direct.
async function safeSave(d) {
  const ok = await saveData(d);
  if (!ok) showToast('Sauvegarde impossible - espace de stockage saturé. Réduisez la taille des images ou videz le cache.', 'error');
  return ok;
}

// ===== LOGIN (Supabase Auth) =====
let currentCat = 'plats';

const ADMIN_EMAIL = 'palaismauricien@gmail.com';

// Auto-login si déjà authentifié
(async () => {
  if (typeof window.adminIsLoggedIn === 'function' && await window.adminIsLoggedIn()) {
    await window.syncFromCloud?.();
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('adminApp')?.classList.remove('hidden');
    initAdmin();
  }
})();

document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const pwd = document.getElementById('loginPwd').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const errEl = document.getElementById('loginError');
  errEl.classList.remove('visible');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Connexion…'; }

  const result = await window.adminSignIn(ADMIN_EMAIL, pwd);

  if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Connexion'; }

  if (result.ok) {
    await window.syncFromCloud?.();
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminApp').classList.remove('hidden');
    initAdmin();
  } else {
    errEl.classList.add('visible');
    errEl.textContent = result.error?.includes('Invalid') ? 'Mot de passe incorrect' : 'Erreur : ' + result.error;
    document.getElementById('loginPwd').value = '';
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await window.adminSignOut?.();
  location.reload();
});

// Toggle password visibility on login screen
document.getElementById('loginEye')?.addEventListener('click', () => {
  const pwd = document.getElementById('loginPwd');
  const eye = document.getElementById('loginEye');
  const isPwd = pwd.type === 'password';
  pwd.type = isPwd ? 'text' : 'password';
  eye.classList.toggle('active', isPwd);
  eye.setAttribute('aria-label', isPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
});

// ===== NAVIGATION =====
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-' + page)?.classList.add('active');
    document.getElementById('pageTitle').textContent = btn.textContent.trim();
    if (page === 'dashboard') renderDashboard();
    if (page === 'menu') renderMenuPage();
    if (page === 'dispo') renderDispoPage();
    if (page === 'hours') renderHoursPage();
    if (page === 'closures') renderClosuresPage();
    if (page === 'settings') renderSettingsPage();
  });
});

// ===== INIT =====
async function initAdmin() {
  // Si Supabase est vide (1ère fois), on pousse les données locales (data.js par défaut OU localStorage)
  try {
    const cloud = await window.cloudLoadConfig?.();
    if (!cloud || Object.keys(cloud).length === 0) {
      const local = getData();
      await window.cloudSaveConfig?.(local);
    }
  } catch (_) {}
  renderDashboard();
}

// ===== DASHBOARD =====
async function renderDashboard() {
  // Stats depuis Supabase (multi-device) si dispo, sinon fallback localStorage
  const stats = (typeof window.cloudGetVisitStats === 'function')
    ? await window.cloudGetVisitStats()
    : getVisitStats();
  document.getElementById('statToday').textContent = stats.today;
  document.getElementById('statWeek').textContent = stats.week;
  document.getElementById('statMonth').textContent = stats.month;
  document.getElementById('statTotal').textContent = stats.total;

  // Bar chart
  const chart = document.getElementById('barChart');
  if (chart) {
    const max = Math.max(...stats.chart.map(d => d.count), 1);
    chart.innerHTML = stats.chart.map(d => {
      const pct = Math.round((d.count / max) * 100);
      return `<div class="bar-col">
        <span class="bar-count">${d.count}</span>
        <div class="bar" style="height:${Math.max(pct, 3)}%"></div>
        <span class="bar-label">${d.label}</span>
      </div>`;
    }).join('');
  }

  // Menu counts
  const data = getData();
  const idMap = { plats: 'countPlats', street: 'countStreet', grillades: 'countGrillades', desserts: 'countDesserts', boissons: 'countBoissons' };
  CAT_KEYS.forEach(cat => {
    const el = document.getElementById(idMap[cat]);
    if (el) el.textContent = `${data.menu[cat].filter(i=>i.visible).length} / ${data.menu[cat].length}`;
  });
  const dispoEl = document.getElementById('countDispo');
  if (dispoEl) {
    const n = countDispoToday(data);
    const isToday = data.dispoDate === getTodayKey();
    dispoEl.textContent = n + (isToday ? '' : ' · sélection à mettre à jour');
    dispoEl.style.color = !isToday && n > 0 ? '#e0a052' : '';
  }
}

// ===== PLATS DU JOUR =====
function renderDispoPage() {
  const data = getData();
  const today = getTodayKey();

  // Date du jour formatée FR
  const fmt = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('dispoDate').textContent = fmt.charAt(0).toUpperCase() + fmt.slice(1);

  // Status
  const status = document.getElementById('dispoStatus');
  if (!data.dispoDate) {
    status.textContent = "Aucune sélection enregistrée pour le moment.";
  } else if (data.dispoDate === today) {
    status.textContent = "Sélection à jour pour aujourd'hui.";
  } else {
    const last = new Date(data.dispoDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    status.textContent = `Dernière mise à jour : ${last}.`;
  }

  // Warning si la date n'est pas aujourd'hui
  document.getElementById('dispoWarn').classList.toggle('hidden', !data.dispoDate || data.dispoDate === today);

  // Sections par catégorie (toutes les catégories)
  const wrap = document.getElementById('dispoCats');
  wrap.innerHTML = MENU_CATS.map(c => {
    const items = data.menu[c.key].filter(i => i.visible);
    if (!items.length) return `<div class="dispo-cat"><h3>${escHtml(c.label)}</h3><p class="dispo-empty">Aucun plat visible dans cette catégorie.</p></div>`;
    return `
      <div class="dispo-cat">
        <h3>${escHtml(c.label)}</h3>
        <div class="dispo-list">
          ${items.map(item => {
            const remVal = (item.remaining === 0 || item.remaining > 0) ? item.remaining : '';
            return `
            <label class="dispo-row" data-id="${item.id}" data-cat="${escAttr(c.key)}">
              <input type="checkbox" class="dispo-check" data-id="${item.id}" data-cat="${escAttr(c.key)}" ${item.dispoToday ? 'checked' : ''}/>
              <img class="dispo-img" src="${escUrl(item.img)}" alt="${escAttr(item.name)}"/>
              <div class="dispo-info">
                <div class="dispo-name">${escHtml(item.name)}</div>
                <div class="dispo-desc">${escHtml(item.desc)}</div>
              </div>
              <span class="dispo-price">${escHtml(getDisplayPrice(item))}</span>
              <span class="dispo-remaining-wrap" title="Nombre de portions restantes (laisser vide pour ne pas afficher)">
                <input type="number" min="0" step="1" inputmode="numeric"
                  class="dispo-remaining" data-id="${item.id}" data-cat="${escAttr(c.key)}"
                  placeholder="-" value="${escAttr(remVal)}"
                  ${item.dispoToday ? '' : 'disabled'}/>
                <span class="dispo-remaining-label">restants</span>
              </span>
              <span class="dispo-toggle"></span>
            </label>
          `;}).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Compteur dynamique + activation/désactivation de l'input quantité selon la case
  const updateCount = () => {
    const n = wrap.querySelectorAll('.dispo-check:checked').length;
    document.getElementById('dispoCount').textContent = n + (n > 1 ? ' plats sélectionnés' : ' plat sélectionné');
  };
  wrap.querySelectorAll('.dispo-check').forEach(c => {
    c.addEventListener('change', () => {
      const row = c.closest('.dispo-row');
      const qtyInput = row?.querySelector('.dispo-remaining');
      if (qtyInput) {
        qtyInput.disabled = !c.checked;
        if (!c.checked) qtyInput.value = '';
      }
      updateCount();
    });
  });
  // Empêche le clic sur l'input quantité de cocher/décocher la ligne
  wrap.querySelectorAll('.dispo-remaining-wrap').forEach(el => {
    el.addEventListener('click', e => e.preventDefault());
  });
  wrap.querySelectorAll('.dispo-remaining').forEach(input => {
    input.addEventListener('click', e => e.stopPropagation());
    // Validation live : refuse négatifs / décimales / texte
    input.addEventListener('input', () => {
      let v = input.value.replace(/[^\d]/g, '');
      if (v.length > 1) v = v.replace(/^0+/, '') || '0';
      input.value = v;
    });
  });
  updateCount();
}

document.getElementById('dispoCheckAllBtn')?.addEventListener('click', () => {
  document.querySelectorAll('#dispoCats .dispo-check').forEach(c => {
    c.checked = true;
    c.dispatchEvent(new Event('change'));
  });
});
document.getElementById('dispoUncheckAllBtn')?.addEventListener('click', () => {
  document.querySelectorAll('#dispoCats .dispo-check').forEach(c => {
    c.checked = false;
    c.dispatchEvent(new Event('change'));
  });
});

document.getElementById('saveDispoBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('saveDispoBtn');
  const msg = document.getElementById('dispoSaved');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sauvegarde…';

  try {
    const d = getData();
    const checks = document.querySelectorAll('#dispoCats .dispo-check');
    // Reset puis applique
    CAT_KEYS.forEach(cat => (d.menu[cat] || []).forEach(i => { i.dispoToday = false; i.remaining = null; }));
    checks.forEach(c => {
      if (!c.checked) return;
      const cat = c.dataset.cat;
      const id = parseInt(c.dataset.id);
      const item = d.menu[cat].find(i => i.id === id);
      if (!item) return;
      item.dispoToday = true;
      // Récupère la quantité associée à cette ligne (validation stricte)
      const row = c.closest('.dispo-row');
      const qtyInput = row?.querySelector('.dispo-remaining');
      item.remaining = normalizeRemaining(qtyInput ? qtyInput.value : '');
    });
    d.dispoDate = getTodayKey();
    const saved = await saveData(d);
    if (!saved) throw new Error('Sauvegarde refusée (stockage saturé ?)');

    msg.textContent = '✓ Sélection enregistrée';
    msg.classList.remove('hidden', 'error');
    document.getElementById('dispoWarn').classList.add('hidden');
    document.getElementById('dispoStatus').textContent = "Sélection à jour pour aujourd'hui.";
    setTimeout(() => msg.classList.add('hidden'), 2500);
  } catch (err) {
    msg.textContent = '❌ Erreur lors de la sauvegarde';
    msg.classList.remove('hidden');
    msg.classList.add('error');
    setTimeout(() => msg.classList.add('hidden'), 3500);
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// ===== MENU PAGE =====
function renderMenuPage(cat) {
  if (cat) currentCat = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === currentCat));
  const data = getData();
  const items = data.menu[currentCat];
  const list = document.getElementById('itemsList');
  if (!list) return;

  list.innerHTML = items.map(item => {
    const hasVariants = Array.isArray(item.variants) && item.variants.length;
    const priceHtml = hasVariants
      ? `<span class="item-price item-price-variants">${item.variants.map(v => `<em>${escHtml(v.name)}</em>${escHtml(v.price)}`).join(' · ')}</span>`
      : `<span class="item-price">${escHtml(item.price || '')}</span>`;
    const editBtn = hasVariants
      ? `<button class="btn-icon edit-btn disabled" data-id="${item.id}" title="Modification des variantes non supportée - éditer data.js" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>`
      : `<button class="btn-icon edit-btn" data-id="${item.id}" title="Modifier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>`;
    return `
    <div class="item-row" data-id="${item.id}">
      <img class="item-img" src="${escUrl(item.img)}" alt="${escAttr(item.name)}"/>
      <div class="item-info">
        <div class="item-name">${escHtml(item.name)}${hasVariants ? ' <span class="item-variants-tag">variantes</span>' : ''}</div>
        <div class="item-desc">${escHtml(item.desc)}</div>
      </div>
      <div class="item-price-block">
        ${priceHtml}
      </div>
      <div class="item-actions-block">
        <div class="toggle-visible">
          <div class="toggle ${item.visible ? 'on' : ''}" data-id="${item.id}" title="${item.visible ? 'Visible' : 'Masqué'}"></div>
          <span>${item.visible ? 'Visible' : 'Masqué'}</span>
        </div>
        <div class="item-actions">
          ${editBtn}
          <button class="btn-icon danger delete-btn" data-id="${item.id}" title="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Toggle visibility
  list.querySelectorAll('.toggle').forEach(tog => {
    tog.addEventListener('click', async () => {
      const id = parseInt(tog.dataset.id);
      const d = getData();
      const item = d.menu[currentCat].find(i => i.id === id);
      if (!item) return;
      item.visible = !item.visible;
      const ok = await safeSave(d);
      if (ok) renderMenuPage();
    });
  });

  // Edit
  list.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id)));
  });

  // Delete
  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Supprimer ce plat ?')) return;
      const d = getData();
      d.menu[currentCat] = d.menu[currentCat].filter(i => i.id !== parseInt(btn.dataset.id));
      const ok = await safeSave(d);
      if (ok) renderMenuPage();
    });
  });
}

// Category tabs
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => renderMenuPage(tab.dataset.cat));
});

// Add button
document.getElementById('addItemBtn')?.addEventListener('click', () => openModal(null));

// ===== MODAL =====
function openModal(id) {
  const data = getData();
  const item = id !== null ? data.menu[currentCat].find(i => i.id === id) : null;

  document.getElementById('modalTitle').textContent = item ? 'Modifier le plat' : 'Ajouter un plat';
  document.getElementById('itemId').value = item ? item.id : '';
  document.getElementById('itemCat').value = currentCat;
  document.getElementById('itemName').value = item ? item.name : '';
  document.getElementById('itemDesc').value = item ? item.desc : '';
  document.getElementById('itemPrice').value = item ? item.price : '';
  document.getElementById('itemImgUrl').value = item ? item.img : '';
  document.getElementById('itemVisible').checked = item ? item.visible : true;

  const preview = document.getElementById('imgPreview');
  if (item && item.img) { preview.src = item.img; preview.style.display = 'block'; }
  else { preview.src = ''; preview.style.display = 'none'; }

  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  document.getElementById('itemForm').reset();
  document.getElementById('imgPreview').style.display = 'none';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('cancelModal')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', e => { if (e.target === document.getElementById('modalOverlay')) closeModal(); });

// Image preview
document.getElementById('itemImgUrl')?.addEventListener('input', e => {
  const preview = document.getElementById('imgPreview');
  if (e.target.value) { preview.src = e.target.value; preview.style.display = 'block'; }
  else preview.style.display = 'none';
});

// Compresse une image dans un canvas et retourne une Data URL JPEG (~70% qualité, max 1200px côté long).
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width: w, height: h } = img;
        if (w > MAX || h > MAX) {
          if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
          else        { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const isPng = file.type === 'image/png';
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.78));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById('itemImgFile')?.addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;

  // Validation taille (max 5 MB en entrée)
  const MAX_INPUT = 5 * 1024 * 1024;
  if (file.size > MAX_INPUT) {
    showToast('Image trop lourde (max 5 Mo). Réduisez-la avant l\'upload.', 'error');
    e.target.value = '';
    return;
  }
  if (!/^image\//.test(file.type)) {
    showToast('Format non supporté (jpg, png, webp uniquement).', 'error');
    e.target.value = '';
    return;
  }

  try {
    const dataUrl = await compressImage(file);
    // Vérifie que le résultat compressé est raisonnable (~700 KB max après base64)
    if (dataUrl.length > 700_000) {
      showToast('Image encore trop lourde après compression. Essayez une plus petite.', 'error');
      e.target.value = '';
      return;
    }
    const preview = document.getElementById('imgPreview');
    preview.src = dataUrl;
    preview.style.display = 'block';
    document.getElementById('itemImgUrl').value = dataUrl;
  } catch (err) {
    console.error('[upload] compression failed:', err);
    showToast('Impossible de lire cette image.', 'error');
    e.target.value = '';
  }
});

// Submit
document.getElementById('itemForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('itemId').value;
  const cat = document.getElementById('itemCat').value;
  const d = getData();

  const editedFields = {
    name:    document.getElementById('itemName').value.trim(),
    desc:    document.getElementById('itemDesc').value.trim(),
    price:   document.getElementById('itemPrice').value.trim(),
    img:     document.getElementById('itemImgUrl').value.trim() || 'images/logo.png',
    visible: document.getElementById('itemVisible').checked,
  };

  if (id) {
    const idx = d.menu[cat].findIndex(i => i.id === parseInt(id));
    if (idx !== -1) {
      // Merge : on préserve dispoToday, remaining, variants et tout autre champ existant
      d.menu[cat][idx] = { ...d.menu[cat][idx], ...editedFields };
    }
  } else {
    d.menu[cat].push({
      id: getNextId(d),
      ...editedFields,
      dispoToday: false,
      remaining: null,
    });
  }

  const ok = await safeSave(d);
  if (!ok) return;
  closeModal();
  renderMenuPage();
});

// ===== HOURS PAGE =====
function renderHoursPage() {
  const data = getData();
  const days = { lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche' };
  const grid = document.getElementById('hoursGrid');
  if (!grid) return;

  grid.innerHTML = Object.entries(days).map(([key, label]) => {
    const h = data.hours[key];
    const midi = h.midi || { actif: true, open: '10:30', close: '14:30' };
    const soir = h.soir || { actif: true, open: '18:30', close: '21:30' };
    return `
    <div class="hour-card">
      <div class="hour-card-header">
        <span class="hour-day">${label}</span>
        <label class="hour-closed-toggle">
          <div class="toggle ${h.closed ? 'on' : ''}" id="closed-${key}"></div>
          <span>Fermé</span>
        </label>
      </div>
      <div class="hour-body ${h.closed ? 'disabled' : ''}" id="body-${key}">
        <div class="hour-service">
          <div class="hour-service-header">
            <span class="hour-service-label">Midi</span>
            <label class="hour-closed-toggle">
              <div class="toggle ${midi.actif ? 'on' : ''}" id="midi-actif-${key}"></div>
              <span>Actif</span>
            </label>
          </div>
          <div class="hour-inputs ${!midi.actif ? 'disabled' : ''}" id="midi-inputs-${key}">
            <div>
              <label>Ouverture</label>
              <input type="time" id="midi-open-${key}" value="${midi.open}"/>
            </div>
            <div>
              <label>Fermeture</label>
              <input type="time" id="midi-close-${key}" value="${midi.close}"/>
            </div>
          </div>
        </div>
        <div class="hour-service">
          <div class="hour-service-header">
            <span class="hour-service-label">Soir</span>
            <label class="hour-closed-toggle">
              <div class="toggle ${soir.actif ? 'on' : ''}" id="soir-actif-${key}"></div>
              <span>Actif</span>
            </label>
          </div>
          <div class="hour-inputs ${!soir.actif ? 'disabled' : ''}" id="soir-inputs-${key}">
            <div>
              <label>Ouverture</label>
              <input type="time" id="soir-open-${key}" value="${soir.open}"/>
            </div>
            <div>
              <label>Fermeture</label>
              <input type="time" id="soir-close-${key}" value="${soir.close}"/>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Toggles
  Object.keys(days).forEach(key => {
    // Jour entier fermé
    document.getElementById('closed-' + key)?.addEventListener('click', () => {
      const tog = document.getElementById('closed-' + key);
      tog.classList.toggle('on');
      document.getElementById('body-' + key)?.classList.toggle('disabled', tog.classList.contains('on'));
    });
    // Midi actif
    document.getElementById('midi-actif-' + key)?.addEventListener('click', () => {
      const tog = document.getElementById('midi-actif-' + key);
      tog.classList.toggle('on');
      document.getElementById('midi-inputs-' + key)?.classList.toggle('disabled', !tog.classList.contains('on'));
    });
    // Soir actif
    document.getElementById('soir-actif-' + key)?.addEventListener('click', () => {
      const tog = document.getElementById('soir-actif-' + key);
      tog.classList.toggle('on');
      document.getElementById('soir-inputs-' + key)?.classList.toggle('disabled', !tog.classList.contains('on'));
    });
  });
}

document.getElementById('saveHoursBtn')?.addEventListener('click', async () => {
  const days = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
  const d = getData();
  days.forEach(key => {
    d.hours[key] = {
      closed: document.getElementById('closed-' + key)?.classList.contains('on') || false,
      midi: {
        actif: document.getElementById('midi-actif-' + key)?.classList.contains('on') || false,
        open:  document.getElementById('midi-open-' + key)?.value || '10:30',
        close: document.getElementById('midi-close-' + key)?.value || '14:30',
      },
      soir: {
        actif: document.getElementById('soir-actif-' + key)?.classList.contains('on') || false,
        open:  document.getElementById('soir-open-' + key)?.value || '18:30',
        close: document.getElementById('soir-close-' + key)?.value || '21:30',
      }
    };
  });
  const ok = await safeSave(d);
  if (!ok) return;
  const c = document.getElementById('hoursSaved');
  c.classList.remove('hidden'); setTimeout(() => c.classList.add('hidden'), 2500);
});

// ===== FERMETURES EXCEPTIONNELLES =====
function renderClosuresPage() {
  const list = document.getElementById('closuresList');
  if (!list) return;
  const d = getData();
  const closures = Array.isArray(d.exceptionalClosures) ? d.exceptionalClosures : [];

  // Tri chronologique + suppression des dates passées (info-only)
  const sorted = [...closures].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  if (!sorted.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:.85rem">Aucune fermeture programmée.</p>';
    return;
  }

  const todayKey = getTodayKey();
  list.innerHTML = sorted.map((c, i) => {
    const date = c.date || '';
    const isPast = date < todayKey;
    const fmt = date ? new Date(date + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    return `
      <div class="closure-row${isPast ? ' is-past' : ''}">
        <div>
          <div class="closure-date">${escHtml(fmt.charAt(0).toUpperCase() + fmt.slice(1))}</div>
          ${c.reason ? `<div class="closure-reason">${escHtml(c.reason)}</div>` : ''}
          ${isPast ? '<div class="closure-past">Date passée</div>' : ''}
        </div>
        <button class="btn-icon danger closure-del" data-date="${escAttr(date)}" title="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </button>
      </div>`;
  }).join('');

  list.querySelectorAll('.closure-del').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Supprimer cette fermeture exceptionnelle ?')) return;
      const date = btn.dataset.date;
      const d2 = getData();
      d2.exceptionalClosures = (d2.exceptionalClosures || []).filter(c => c.date !== date);
      const ok = await safeSave(d2);
      if (ok) renderClosuresPage();
    });
  });
}

document.getElementById('addClosureBtn')?.addEventListener('click', async () => {
  const dateEl = document.getElementById('closureDate');
  const reasonEl = document.getElementById('closureReason');
  const date = dateEl?.value;
  if (!date) { alert('Sélectionnez une date.'); return; }

  const d = getData();
  if (!Array.isArray(d.exceptionalClosures)) d.exceptionalClosures = [];
  // Évite les doublons : remplace si la date existe déjà
  d.exceptionalClosures = d.exceptionalClosures.filter(c => c.date !== date);
  d.exceptionalClosures.push({ date, reason: (reasonEl?.value || '').trim() });
  const ok = await safeSave(d);
  if (!ok) return;

  if (dateEl) dateEl.value = '';
  if (reasonEl) reasonEl.value = '';
  const msg = document.getElementById('closureSaved');
  msg?.classList.remove('hidden');
  setTimeout(() => msg?.classList.add('hidden'), 2000);
  renderClosuresPage();
});

// ===== SETTINGS =====
function renderSettingsPage() {
  const d = getData();
  const tiktokInput = document.getElementById('tiktokUrl');
  if (tiktokInput) tiktokInput.value = d.socials?.tiktok || '';
}

document.getElementById('saveTiktokBtn')?.addEventListener('click', async () => {
  const url = (document.getElementById('tiktokUrl')?.value || '').trim();
  const d = getData();
  if (!d.socials || typeof d.socials !== 'object') d.socials = {};
  d.socials.tiktok = url;
  const ok = await safeSave(d);
  if (!ok) return;
  const msg = document.getElementById('tiktokSaved');
  msg?.classList.remove('hidden');
  setTimeout(() => msg?.classList.add('hidden'), 2000);
});

document.getElementById('savePwdBtn')?.addEventListener('click', async () => {
  const oldPwd = document.getElementById('oldPwd').value;
  const newPwd = document.getElementById('newPwd').value;
  const confirmPwd = document.getElementById('confirmPwd').value;
  const msg = document.getElementById('pwdSaved');

  const showErr = (txt) => { msg.textContent = '✕ ' + txt; msg.style.color = '#dc2626'; msg.classList.remove('hidden'); };

  if (newPwd.length < 6) return showErr('Mot de passe trop court (6 caractères min)');
  if (newPwd !== confirmPwd) return showErr('Les mots de passe ne correspondent pas');

  // Vérifier l'ancien mdp en re-signant
  const verify = await window.adminSignIn(ADMIN_EMAIL, oldPwd);
  if (!verify.ok) return showErr('Mot de passe actuel incorrect');

  // Mettre à jour le mdp via Supabase Auth
  const { error } = await window.SB.auth.updateUser({ password: newPwd });
  if (error) return showErr(error.message);

  msg.textContent = '✓ Mot de passe mis à jour'; msg.style.color = '#16a34a'; msg.classList.remove('hidden');
  document.getElementById('oldPwd').value = '';
  document.getElementById('newPwd').value = '';
  document.getElementById('confirmPwd').value = '';
  setTimeout(() => msg.classList.add('hidden'), 3000);
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  if (!confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) return;
  localStorage.removeItem('pm_data');
  alert('Données réinitialisées. La page va se recharger.');
  location.reload();
});

// ===== MOBILE SIDEBAR DRAWER =====
(function() {
  const burger = document.getElementById('burgerBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!burger || !sidebar || !backdrop) return;

  const open = () => {
    sidebar.classList.add('open');
    backdrop.classList.add('visible');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('visible');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  };
  const toggle = () => sidebar.classList.contains('open') ? close() : open();

  burger.addEventListener('click', toggle);
  backdrop.addEventListener('click', close);
  // Auto-close drawer when nav item is selected on mobile
  document.querySelectorAll('.sidebar .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.matchMedia('(max-width:900px)').matches) close();
    });
  });
  // Close drawer if window resizes back to desktop
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width:900px)').matches) close();
  });
})();
