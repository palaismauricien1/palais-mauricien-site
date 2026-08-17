/* ============================================================
   PALAIS MAURICIEN - Données par défaut + helpers localStorage
   ============================================================ */

const MENU_CATS = [
  { key: 'plats',     label: 'Plats principaux' },
  { key: 'street',    label: 'Street food' },
  { key: 'grillades', label: 'Grillades' },
  { key: 'desserts',  label: 'Desserts' },
  { key: 'boissons',  label: 'Boissons' }
];
const CAT_KEYS = MENU_CATS.map(c => c.key);

const DEFAULT_DATA = {
  menu: {
    plats: [
      { id: 1, name: "Riz frit",
        desc: "Riz sauté à l'œuf, légumes et sauce soja, façon mauricienne.",
        img: "images/riz frit v3.webp", visible: true, dispoToday: false,
        variants: [
          { name: "Poulet",     price: "8 €" },
          { name: "Végétarien", price: "7 €" }
        ] },
      { id: 2, name: "Sauté poulet fumé",
        desc: "Poulet fumé sauté à la créole - goût intense et authentique.",
        price: "8 €", img: "images/sauté poulet fumé v2.webp", visible: true, dispoToday: false },
      { id: 3, name: "Sauté poulet au Bred",
        desc: "Poulet aux breds frais, parfumé aux épices locales.",
        price: "8 €", img: "images/sauté poulet au bred v3.webp", visible: true, dispoToday: false },
      { id: 4, name: "Masalé cabri",
        desc: "Cabri mijoté lentement au massalé - la recette emblématique de l'Île Maurice.",
        price: "9 €", img: "images/massalé cabri v2.webp", visible: true, dispoToday: false },
      { id: 5, name: "Vinday poisson",
        desc: "Poisson mariné au vinaigre, curcuma et moutarde - un classique mauricien.",
        price: "9 €", img: "images/vinday poisson v2.webp", visible: true, dispoToday: false },
      { id: 6, name: "Daube poulet pomme de terre",
        desc: "Daube créole au poulet et pommes de terre, mijotée aux épices douces.",
        price: "8 €", img: "images/daube pomme de terre poulet v2.webp", visible: true, dispoToday: false },
      { id: 7, name: "Halim",
        desc: "Ragoût épicé de viande et lentilles, doux et savoureux.",
        price: "9 €", img: "images/halim v2.webp", visible: true, dispoToday: false },
      { id: 8, name: "Mine bouille",
        desc: "Nouilles en bouillon parfumé, garniture créole traditionnelle.",
        img: "images/mine bouille v3.webp", visible: true, dispoToday: false,
        variants: [
          { name: "Poulet",     price: "9 €" },
          { name: "Poulet œuf", price: "10 €" }
        ] }
    ],
    street: [
      { id: 9, name: "Kebab mauricien",
        desc: "Kebab façon mauricienne, garni de chutneys frais et d'épices parfumées.",
        price: "6 €", img: "images/kebab mauricien v2.webp", visible: true, dispoToday: false },
      { id: 10, name: "Brochette mauricienne",
        desc: "Tendre brochette marinée aux épices créoles, grillée sur braise.",
        price: "3,50 €", img: "images/brochette de mauricien v2.webp", visible: true, dispoToday: false },
      { id: 11, name: "Roti",
        desc: "Pain plat moelleux fait maison, garni à votre choix.",
        img: "images/roti v3.webp", visible: true, dispoToday: false,
        variants: [
          { name: "Veg",     price: "3 €"    },
          { name: "Poulet",  price: "3,50 €" },
          { name: "Poisson", price: "4,50 €" }
        ] }
    ],
    grillades: [
      { id: 12, name: "Grillade mauricienne",
        desc: "Viande grillée marinée aux aromates, servie avec salade et frites.",
        price: "10 €", img: "images/Grillade mauricien v2.webp", visible: true, dispoToday: false },
      { id: 13, name: "Cuisses",
        desc: "Cuisses de poulet grillées, marinées aux épices créoles.",
        price: "6 €", img: "images/Grillade mauricien v2.webp", visible: true, dispoToday: false },
      { id: 14, name: "Foie de bœuf",
        desc: "Foie de bœuf grillé, parfumé aux épices et aux herbes fraîches.",
        price: "9 €", img: "images/foie-de-boeuf.png", visible: true, dispoToday: false }
    ],
    desserts: [
      { id: 15, name: "Gulab jamun",
        desc: "Boulettes de lait concentré frites, imbibées de sirop à la rose.",
        price: "2 €", img: "images/Gulab jamun (dessert).webp", visible: true, dispoToday: false },
      { id: 16, name: "Rasgullah",
        desc: "Boules de fromage frais dans un sirop sucré à la cardamome.",
        price: "2 €", img: "images/Rasgullah (dessert).webp", visible: true, dispoToday: false },
      { id: 17, name: "Napolitaine",
        desc: "Biscuit sablé fourré à la confiture, enrobé de glaçage rose.",
        price: "2 €", img: "images/Napolitaine (dessert).webp", visible: true, dispoToday: false }
    ],
    boissons: [
      { id: 18, name: "Alouda",
        desc: "Boisson emblématique mauricienne, lait, graines de basilique, sirop coloré.",
        price: "3,50 €", img: "images/alouda v2.webp", visible: true, dispoToday: false }
    ]
  },
  dispoDate: null,
  hours: {
    lundi:    { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    mardi:    { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    mercredi: { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    jeudi:    { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    vendredi: { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    samedi:   { closed: false, midi: { actif: true,  open: "10:30", close: "14:30" }, soir: { actif: true,  open: "18:30", close: "21:30" } },
    dimanche: { closed: true,  midi: { actif: false, open: "10:30", close: "14:30" }, soir: { actif: false, open: "18:30", close: "21:30" } }
  },
  // Réseaux sociaux - modifiables depuis l'admin (Paramètres)
  socials: {
    tiktok: "https://www.tiktok.com/@palaismauricien97420?_r=1&_t=ZN-96DznweiNwE"
  },
  // Fermetures exceptionnelles (jours ponctuels) - gérées depuis l'admin
  // Format : tableau de chaînes "YYYY-MM-DD"
  exceptionalClosures: []
  // L'authentification admin est gérée par Supabase Auth (cf. supabase-client.js).
  // Aucun mot de passe ne doit figurer dans ce fichier - il est servi en clair.
};

/* ---- Helper anti-XSS ---- */
function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escAttr(s) { return escHtml(s); }
function escUrl(s) {
  // Autorise http(s), data:image (uploads), et chemins relatifs
  let v = String(s == null ? '' : s).trim();
  // Les fichiers de /images sont nommés en ASCII (les accents ne survivent pas
  // à l'upload Vercel) : on translittère les chemins relatifs avant affichage.
  if (!/^(https?:|data:)/i.test(v)) v = v.normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/^(https?:|data:image\/|\/|images\/|\.\.?\/)/i.test(v)) return escAttr(v);
  return 'images/logo.png';
}

/* ---- helpers ---- */
function getData() {
  try {
    const saved = localStorage.getItem('pm_data');
    if (saved) {
      const d = JSON.parse(saved);

      // Migration horaires : ancien format { open, close, closed } → { midi, soir }
      if (d.hours) {
        const keys = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
        let migrated = false;
        keys.forEach(k => {
          if (d.hours[k] && typeof d.hours[k].open === 'string') {
            d.hours[k] = {
              closed: d.hours[k].closed || false,
              midi: { actif: true, open: d.hours[k].open, close: d.hours[k].close },
              soir: { actif: true, open: '18:30', close: '21:30' }
            };
            migrated = true;
          }
        });
        if (migrated) localStorage.setItem('pm_data', JSON.stringify(d));
      }

      // Migration menu : si la nouvelle structure (street/grillades) n'existe pas,
      // on remplace le menu par le nouveau menu par défaut.
      if (!d.menu || !d.menu.street || !d.menu.grillades) {
        d.menu = JSON.parse(JSON.stringify(DEFAULT_DATA.menu));
        d.dispoDate = null;
        localStorage.setItem('pm_data', JSON.stringify(d));
      }

      // S'assure que dispoToday + remaining existent sur chaque item
      let dispoMigrated = false;
      if (typeof d.dispoDate === 'undefined') { d.dispoDate = null; dispoMigrated = true; }
      CAT_KEYS.forEach(cat => {
        (d.menu[cat] || []).forEach(item => {
          if (typeof item.dispoToday === 'undefined') { item.dispoToday = false; dispoMigrated = true; }
          // null = quantité non configurée (pas affichée), 0 = rupture, >0 = restants
          if (typeof item.remaining === 'undefined') { item.remaining = null; dispoMigrated = true; }
        });
      });

      // Migration : socials + exceptionalClosures
      if (!d.socials || typeof d.socials !== 'object') {
        d.socials = { ...DEFAULT_DATA.socials };
        dispoMigrated = true;
      } else if (typeof d.socials.tiktok === 'undefined') {
        d.socials.tiktok = DEFAULT_DATA.socials.tiktok;
        dispoMigrated = true;
      }
      if (!Array.isArray(d.exceptionalClosures)) {
        d.exceptionalClosures = [];
        dispoMigrated = true;
      }

      if (dispoMigrated) localStorage.setItem('pm_data', JSON.stringify(d));

      return d;
    }
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/* Sauvegarde locale + cloud. Retourne true si OK, false sinon.
   Échec possible : QuotaExceededError (mode privé, stockage plein,
   image base64 trop grosse). On notifie l'appelant pour qu'il affiche un toast. */
async function saveData(data) {
  let localOk = false;
  try {
    localStorage.setItem('pm_data', JSON.stringify(data));
    localOk = true;
  } catch (e) {
    console.error('[saveData] localStorage failed:', e?.name, e?.message);
  }
  let cloudOk = false;
  if (typeof window.cloudSaveConfig === 'function') {
    try {
      cloudOk = await window.cloudSaveConfig(data);
    } catch (e) {
      console.error('[saveData] cloudSaveConfig failed:', e?.message);
    }
  }
  // OK si au moins une des deux a marché : le cloud rattrape le local plein
  return localOk || cloudOk;
}

function getNextId(data) {
  const all = CAT_KEYS.flatMap(cat => data.menu[cat] || []);
  return all.length ? Math.max(...all.map(i => i.id)) + 1 : 1;
}

/* ---- Affichage prix (gère les variantes) ---- */
function getDisplayPrice(item) {
  if (item.price) return item.price;
  if (item.variants && item.variants.length) {
    return 'à partir de ' + item.variants[0].price;
  }
  return '';
}

/* ---- Quantité restante : validation stricte ----
   Retourne un entier >= 0, ou null si la valeur est vide / non configurée.
   Refuse négatifs, NaN, décimales, texte. */
function normalizeRemaining(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null;
  return n;
}

/* ---- Plats du jour ---- */
function getTodayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function getDispoToday(data) {
  const d = data || getData();
  const out = {};
  CAT_KEYS.forEach(cat => {
    out[cat] = (d.menu[cat] || []).filter(i => i.visible && i.dispoToday);
  });
  return out;
}

function countDispoToday(data) {
  const all = getDispoToday(data);
  return CAT_KEYS.reduce((acc, cat) => acc + all[cat].length, 0);
}

/* ---- Visit tracking ---- */
function trackVisit() {
  // Cloud (vrai compteur multi-device)
  if (typeof window.cloudTrackVisit === 'function') {
    window.cloudTrackVisit();
  }
  // Cache local (fallback offline)
  const key = 'pm_visits';
  let visits = [];
  try { visits = JSON.parse(localStorage.getItem(key)) || []; } catch(e) {}
  visits.push(Date.now());
  if (visits.length > 10000) visits = visits.slice(-10000);
  localStorage.setItem(key, JSON.stringify(visits));
}

function getVisitStats() {
  let visits = [];
  try { visits = JSON.parse(localStorage.getItem('pm_visits')) || []; } catch(e) {}
  const now = Date.now();
  const day   = 86400000;
  const today     = visits.filter(t => now - t < day).length;
  const week      = visits.filter(t => now - t < 7 * day).length;
  const month     = visits.filter(t => now - t < 30 * day).length;
  const total     = visits.length;
  const chart = [];
  for (let i = 6; i >= 0; i--) {
    const label = new Date(now - i * day).toLocaleDateString('fr-FR', { weekday: 'short' });
    const count = visits.filter(t => {
      const d = now - t;
      return d >= i * day && d < (i + 1) * day;
    }).length;
    chart.push({ label, count });
  }
  return { today, week, month, total, chart };
}
